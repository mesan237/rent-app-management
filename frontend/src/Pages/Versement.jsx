import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditFormVersement from "../components/Forms/versementForm/editFormVersement";

import { useGetVersementsQuery } from "../slices/versementSlices";
import { Avatar, CircularProgress } from "@mui/material";
import { pink } from "@mui/material/colors";
import AjouterVersement from "../components/Forms/versementForm/addForm";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.historique[0].nameLocataire}
        </TableCell>
        <TableCell align="right">{row.nbrVersement}</TableCell>
        <TableCell align="right">{row.totalAmount}</TableCell>
        <TableCell align="right">{row.comments}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Historique
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Date du versement
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Montant</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.historique.map((historyRow, idx) => {
                    const handleClick = () =>
                      console.log(`${historyRow._id}-${props.versementId}`);
                    return (
                      <TableRow key={idx}>
                        <TableCell align="left">
                          {new Date(historyRow.date).getUTCDate()}{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                          }).format(new Date(historyRow.date))}{" "}
                          {new Date(historyRow.date).getUTCFullYear()}
                        </TableCell>
                        <TableCell align="left">
                          {historyRow.versement}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ display: "flex", gap: 1.5 }}
                        >
                          <Avatar
                            onClick={handleClick}
                            variant="rounded"
                            sx={{ bgcolor: "#fce4e4" }}
                          >
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </Avatar>
                          <EditFormVersement
                            refetch={props.refetch}
                            compoundId={`${historyRow._id}-${props.versementId}`}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    user: PropTypes.string.isRequired,
    comments: PropTypes.string.isRequired,
    nbrVersement: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    historique: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        versement: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function Versement() {
  const [open, setOpen] = React.useState(false);

  const {
    data: listVersements,
    isLoading,
    error,
    refetch,
  } = useGetVersementsQuery();

  return (
    <Box
      sx={{
        width: 0.8,
        display: "flex",
        flexDirection: "column",
        mx: "auto",
        gap: 4,
      }}
    >
      {/* Ajouter un versement */}
      <AjouterVersement />
      <Typography sx={{ fontWeight: "bold", fontSize: "1.8rem" }}>
        Versements
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>
                Profile locataire
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Nobre de versements
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Montant total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Commentaire
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!listVersements ? (
              <CircularProgress />
            ) : (
              listVersements.map((row, index) => (
                <Row
                  key={index}
                  row={row}
                  versementId={row._id}
                  refetch={refetch}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
