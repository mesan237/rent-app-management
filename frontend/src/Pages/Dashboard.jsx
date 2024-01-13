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

import { useGetVersementsQuery } from "../slices/versementSlices";
import { useGetLocatairesQuery } from "../slices/locatairesApiSlice";
import { useGetDepensesQuery } from "../slices/depensesApiSlice";
import { useMemo } from "react";

function monthsBetweenDates(startDate, endDate) {
  // If endDate is not provided, use the current date
  endDate = endDate || new Date();

  var startYear = startDate.getFullYear();
  var startMonth = startDate.getMonth();

  var endYear = endDate.getFullYear();
  var endMonth = endDate.getMonth();

  var months = (endYear - startYear) * 12 + (endMonth - startMonth);

  return months;
}

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
  { value: -5, label: "Gain" },
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
  // const monthlySums = [];
  const loyerA = 15000;
  const loyerB = 12000;
  const loyerBS = 25000;
  const startDate = new Date("2023-09-01T00:00:00.000Z");

  // listes des depenses
  const {
    data: listDepenses,
    isLoading: loadingExpense,
    error: expenseError,
    // refetch,
  } = useGetDepensesQuery();

  // listes des versements
  const {
    data: listVersements,
    isLoading: loadingVer,
    error: verError,
    // refetch,
  } = useGetVersementsQuery();

  // nombre de locataires par batiments
  const {
    data: totalLocataire,
    isLoading,
    error,
  } = useGetLocatairesQuery({ total: true });

  // liste des locataires
  const { data: locataires } = useGetLocatairesQuery();

  // Calculate the sum of "montant" values using the reduce function

  const sumMontant = useMemo(() => {
    if (!listDepenses) return 2; // Default value if data is not available

    return listDepenses
      .filter((entry) => new Date(entry.date) >= startDate)
      .reduce((acc, item) => acc + item.montant, 0);
  }, [listDepenses, startDate]);

  // listes des depenses
  const sumAmountDeposit = useMemo(() => {
    if (!listVersements) return 2; // Default value if data is not available

    return listVersements.reduce((acc, item) => {
      const historicalVersements = item.historique.filter(
        (entry) => new Date(entry.date) >= startDate
      );

      const versementSum = historicalVersements.reduce(
        (entryAcc, entryItem) => entryAcc + entryItem.versement,
        0
      );

      return acc + versementSum;
    }, 0);
  }, [listVersements, startDate]);

  // Calculate the sum of debts if they exist and are less than 0
  const sumDebts = useMemo(() => {
    if (!locataires) return 1; // Default value if data is not available

    return locataires.reduce((acc, item) => {
      // Check if "debts" property exists and is less than 0
      if (item.debts && item.debts < 0) {
        return acc + item.debts;
      }
      return acc;
    }, 0);
  }, [locataires]);

  // Iterate over each entry in the data

  const monthlySums = useMemo(() => {
    const result = [];

    if (listVersements) {
      listVersements.forEach((entry) => {
        entry.historique.forEach((historiqueEntry) => {
          const date = new Date(historiqueEntry.date);

          if (date >= new Date("2023-09-01")) {
            const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
            const monthKey = xLabels[date.getMonth()];

            const monthlySumEntry = result.find(
              (entry) => entry.monthYear === monthYearKey
            );

            if (monthlySumEntry) {
              monthlySumEntry.sum += historiqueEntry.versement;
            } else {
              result.push({
                monthYear: monthYearKey,
                sum: historiqueEntry.versement,
                month: monthKey,
              });
            }
          }
        });
      });

      // Sort the result array
      result.sort((a, b) => {
        const [aMonth, aYear] = a.monthYear.split("-");
        const [bMonth, bYear] = b.monthYear.split("-");

        if (aYear !== bYear) {
          return aYear - bYear;
        }

        return aMonth - bMonth;
      });
    }

    return result;
  }, [listVersements, xLabels]);

  console.log(listVersements && monthlySums);

  // manque a gagner

  var amountOfMonth = monthsBetweenDates(new Date("2023-09-01"), new Date());

  const montantAGagner =
    amountOfMonth * loyerB * (totalLocataire?.B - 2) +
    loyerBS * 2 * 4 +
    loyerA * totalLocataire?.A * amountOfMonth;

  const manqueAGagner = (
    ((montantAGagner - sumAmountDeposit) / montantAGagner) *
    100
  ).toFixed(2);
  const gains = (
    ((sumAmountDeposit - sumMontant) / montantAGagner) *
    100
  ).toFixed(2);
  const depenses = ((sumMontant / montantAGagner) * 100).toFixed(2);
  console.log(sumAmountDeposit, sumMontant, manqueAGagner, gains, depenses);

  const pieChartDatas = [
    { value: gains, label: "Gain" },
    { value: depenses, label: "Depenses" },
    { value: manqueAGagner, label: "Manque à gagner" },
  ];

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
              <div style={{ margin: "5px auto" }}>
                {listVersements &&
                  sumAmountDeposit.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}{" "}
                FCFA
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
              <BsCash style={{ ...iconStyle, backgroundColor: "#b800d8" }} />
            </div>
            <div style={{ alignSelf: "center" }}>
              <div style={{ fontSize: "0.85rem" }}>Total Depenses</div>
              <div style={{ margin: "5px auto" }}>
                {listDepenses &&
                  sumMontant.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}{" "}
                FCFA
              </div>
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
                Batiment A:{" "}
                <span>{totalLocataire ? totalLocataire.A : "13"} </span> - B:{" "}
                <span>{totalLocataire ? totalLocataire.B : "7"}</span>
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
              <div style={{ margin: "5px auto" }}>
                {locataires &&
                  sumDebts.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}{" "}
                FCFA
              </div>
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
            xAxis={[
              {
                scaleType: "band",
                // data: monthlySums
                //   ? monthlySums.map((item) => item.month)
                //   : xLabels,
                data: xLabels,
              },
            ]}
            series={[
              {
                area: true,
                // data: monthlySums ? monthlySums.map((item) => item.sum) : uData,
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
                data: pieChartDatas ? [...pieChartDatas] : [...data],
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
                fill: "black",
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
