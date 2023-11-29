import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { BsCash } from "react-icons/bs";
import { GiTakeMyMoney, GiReceiveMoney } from "react-icons/gi";
import { TbDoorEnter } from "react-icons/tb";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  // background: "linear-gradient(1.15turn, #03b99f, #82fcea)",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
  // color: "white",
  height: "150px",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 15,
  // boxShadow: 3,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(0, 0, 0, 0.1)",
  borderRadius: "15px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  alignContent: "space-between",
}));

const iconStyle = {
  fontSize: "2.8rem",
  color: "white",
  width: "fit-content",
  borderRadius: "50%",
  padding: "10px",
};

const nameCardStyle = {
  // display: "flex",
  alignItems: "flex-start",
  // gap: "12px",
  fontSize: "0.85rem",
};

const percentageStyle = {
  color: "#29d0b1",
  padding: "2px 8px",

  backgroundColor: "rgb(210, 212, 210 , 0.4)",
  height: "25px",
  width: "50px",
  borderRadius: "15px",
  border: "1px solid #f2f2f2",
  textAlign: "center",
};

const data = [
  { value: 5, label: "Gain" },
  { value: 10, label: "Depenses" },
  { value: 15, label: "Manque à gagner" },
];

const size = {
  // width: 500,
  height: 370,
};
const valueFormatter = (value) => `${value} FCFA`;
const uData = [
  40000, 30000, 20000, 27080, 180900, 20390, 34090, 38500, 45000, 72780, 100000,
  40000,
];
const xLabels = [
  "Jan",
  "Fev",
  "March",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: ".5rem",
      }}
    >
      <Grid
        container
        spacing={4}
        rowSpacing={3}
        sx={{
          marginTop: "4px",
          marginBottom: "4px",
        }}
      >
        <Grid xs={3}>
          <Item>
            <div style={nameCardStyle}>
              <GiReceiveMoney
                style={{ ...iconStyle, backgroundColor: "#29d0b1" }}
              />
            </div>
            <div style={{ alignSelf: "center" }}>
              <div style={{ fontSize: "0.85rem" }}>Total Entrees</div>
              <div style={{ margin: "5px auto" }}>190.000 FCFA</div>
              <div style={{ fontSize: "0.85rem" }}>
                <span style={percentageStyle}>+12%</span> de plus que le mois
                dernier
              </div>
            </div>
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item>
            <div style={nameCardStyle}>
              <BsCash style={{ ...iconStyle, backgroundColor: "#b800d8" }} />
            </div>
            <div style={{ alignSelf: "center" }}>
              <div style={{ fontSize: "0.85rem" }}>Total Depenses</div>
              <div style={{ margin: "5px auto" }}>100.000 FCFA</div>
              <div style={{ fontSize: "0.85rem" }}>
                <span style={percentageStyle}>-13%</span> de plus que le mois
                dernier
              </div>
            </div>
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item>
            <div style={nameCardStyle}>
              <TbDoorEnter
                style={{ ...iconStyle, backgroundColor: "#2e96ff" }}
              />
            </div>
            <div style={{ alignSelf: "center" }}>
              <div style={{ fontSize: "0.85rem" }}>Total Locataires</div>
              <div style={{ margin: "5px auto" }}>
                Batiment A: <span>13</span> - B: <span>7</span>
              </div>
              <div style={{ fontSize: "0.85rem" }}>
                <span style={percentageStyle}>+12%</span> de plus que le mois
                dernier
              </div>
            </div>
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item>
            <div style={nameCardStyle}>
              <GiTakeMyMoney
                style={{ ...iconStyle, backgroundColor: "#25283b" }}
              />
            </div>
            <div style={{ alignSelf: "center" }}>
              <div>Total impayés</div>
              <div style={{ margin: "5px auto" }}>40.000 FCFA</div>
              <div style={{ fontSize: "0.85rem" }}>
                <span style={percentageStyle}>+1%</span> de reduction des dettes
              </div>
            </div>
          </Item>
        </Grid>
      </Grid>
      <Box
        className="charts"
        sx={{
          display: "flex",
          gap: 4,
        }}
      >
        <Box
          sx={{
            // boxShadow: 3,
            borderRadius: 3,
            p: 2,
            flex: 1,
            backgroundColor: "white",
            alignSelf: "flex-end",
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LineChart
            margin={{
              left: 80,
              right: 70,
              top: 30,
              bottom: 80,
            }}
            // dataset={dataset}
            xAxis={[{ scaleType: "band", data: xLabels }]}
            series={[
              {
                area: true,
                data: uData,
                label: "Versement",
                valueFormatter,
              },
            ]}
            width={550}
            height={370}
          />
        </Box>
        <Box
          sx={{
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(0, 0, 0, 0.1)",
            // boxShadow: 3,
            borderRadius: 3,
            p: 2,
            flex: 1,
            backgroundColor: "white",
            // width: "400",
          }}
        >
          <PieChart
            margin={{ top: 100, bottom: 100, left: -110, right: 100 }}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: 90,
              },
            }}
            series={[
              {
                data: [...data],
                arcLabel: (item) => `${item.value}%`,
                innerRadius: 23,
                outerRadius: 100,
                paddingAngle: 6,
                cornerRadius: 7,
                startAngle: -180,
                endAngle: 180,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 10,
                  additionalRadius: -10,
                  color: "gray",
                },
                // cx: 100,
                // cy: 150,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
              },
            }}
            {...size}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
