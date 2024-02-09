import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useLogQuery } from "../slices/logSlices";
import CircularProgress from "@mui/material/CircularProgress";
import { blue, green, red } from "@mui/material/colors";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Historiques() {
  const [expanded, setExpanded] = React.useState("panel0");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { data: logLists, isLoading, error } = useLogQuery();
  console.log("logLists", logLists);

  const groupedData = logLists
    ? logLists.reduce((acc, log) => {
        const dateKey = log.date.toString().split("T")[0]; // Extract date part of ISO string
        // const dateKey = log.date.toISOString().split("T")[0]; // Extract date part of ISO string
        acc[dateKey] = acc[dateKey] || [];
        console.log(acc[dateKey]);
        acc[dateKey].push(log);
        return acc;
      }, {})
    : [];

  const groupedArray = groupedData
    ? Object.entries(groupedData).map(([date, logs]) => ({
        date,
        logs,
      }))
    : [];
  console.log(groupedArray);

  return (
    <Box
      sx={{ margin: "1rem", display: "flex", flexDirection: "column", gap: 4 }}
    >
      <Typography
        sx={{ fontWeight: "bold", fontSize: "1.8rem" }}
        color="text.primary"
      >
        Historiques
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <div>
          {groupedArray.map(({ date, logs }, index) => (
            <Accordion
              key={date}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<NavigateNextRoundedIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {new Date(date).getUTCDate()}{" "}
                  {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                    new Date(date)
                  )}{" "}
                  {new Date(date).getUTCFullYear()}
                </Typography>
              </AccordionSummary>
              {logs.map((log) => (
                <AccordionDetails sx={{ display: "flex", gap: 2 }}>
                  <Typography
                    variant="span"
                    sx={{
                      bgcolor:
                        log.action === "update"
                          ? blue[400]
                          : log.action === "create"
                          ? green[400]
                          : red[400],
                      color: "#fff",
                      fontWeight: "bold",
                      width: "130px",
                      textAlign: "center",
                      px: 2,
                      py: 0.5,
                      borderRadius: "22px",
                    }}
                  >
                    {log.action === "update"
                      ? "Modification"
                      : log.action === "create"
                      ? "Création"
                      : "Suppression"}
                  </Typography>
                  <Typography> {"effectuée par "} </Typography>
                  <Typography>{log.userName}</Typography>
                  <Typography> {" pour "} </Typography>
                  <Typography>{log.categorie}</Typography>
                  <Typography>{log.nameId}</Typography>
                </AccordionDetails>
              ))}
            </Accordion>
          ))}
        </div>
      )}
    </Box>
  );
}
