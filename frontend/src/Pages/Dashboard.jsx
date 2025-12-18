import React from "react";
import { createTheme, styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { BsCash } from "react-icons/bs";
import { GiTakeMyMoney, GiReceiveMoney } from "react-icons/gi";
import { TbDoorEnter } from "react-icons/tb";
import {
  PieChart,
  pieArcLabelClasses,
  pieArcClasses,
} from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";

import { useGetVersementsQuery } from "../slices/versementSlices";
import { useGetLocatairesQuery } from "../slices/locatairesApiSlice";
import { useGetDepensesQuery } from "../slices/depensesApiSlice";

import { useMemo, useState, useEffect } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

function arraysAreEqual(arr1, arr2) {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])
  );
}

const generateMonthArray = (sDate, eDate) => {
  const monthsArray = [];

  const [sMonth, sYear] = sDate.split("-");
  const [eMonth, eYear] = eDate.split("-");
  // console.log("...monthYear", sMonth, sYear, eMonth, eYear);
  let currentYear = sYear;
  let currentMonth = sMonth;

  while (
    currentYear < eYear ||
    (currentYear === eYear && currentMonth <= eMonth)
  ) {
    const monthYear = `${currentMonth}-${currentYear}`;
    const monthName = new Date(
      `${currentYear}-${currentMonth}-01`
    ).toLocaleString("en-US", { month: "short" });

    const monthObject = {
      monthYear,
      sum: 0,
      month: monthName,
    };

    monthsArray.push(monthObject);

    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear += 1;
    } else {
      currentMonth += 1;
    }
  }

  return monthsArray;
};

const mergeArrays = (secondArray, firstArray) => {
  const mergedArray = secondArray.map((secondItem) => {
    const matchingItem = firstArray.find(
      (firstItem) => firstItem.monthYear === secondItem.monthYear
    );
    console.log("matchingItem", matchingItem);
    if (matchingItem) {
      // If a match is found, update the sum and other properties
      return {
        ...secondItem,
        sum: matchingItem.sum,
        month: matchingItem.month,
      };
    }

    return secondItem;
  });

  // Check for any items in the first array that are not present in the second array
  firstArray.forEach((firstItem) => {
    const isMissing = mergedArray.every(
      (mergedItem) => mergedItem.monthYear !== firstItem.monthYear
    );

    if (isMissing) {
      // If not found in the second array, push it to the merged array
      mergedArray.push(firstItem);
    }
  });
  if (mergedArray.length > 12) {
    return mergedArray.slice(0, 12);
  }
  return mergedArray;
};

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
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = () => {
  // const monthlySums = [];
  const loyerA = 15000;
  const loyerB = 12000;
  const loyerBS = 25000;

  const [startDate, setStartDate] = useState(dayjs("2023-09-01"));

  // const startDate = useMemo(() => new Date("2023-09-01T00:00:00.000Z"), []);

  // listes des depenses
  const {
    data: listDepenses,
    // isLoading: loadingExpense,
    // error: expenseError,
    // refetch,
  } = useGetDepensesQuery();

  // listes des versements
  const {
    data: listVersements,
    // isLoading: loadingVer,
    error: versementError,
    // refetch,
  } = useGetVersementsQuery();

  // nombre de locataires par batiments
  const {
    data: totalLocataire,
    // isLoading,
    error: errorLocataire,
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

          if (date >= startDate) {
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
                // mois: date.getMonth(),
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
  }, [listVersements, startDate]);

  // console.log(listVersements && monthlySums);

  // manque a gagner

  var amountOfMonth = monthsBetweenDates(new Date(startDate), new Date());

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
  // console.log(sumAmountDeposit, sumMontant, manqueAGagner, gains, depenses);

  const pieChartDatas = [
    { value: gains, label: "Gain" },
    { value: depenses, label: "Depenses" },
    { value: manqueAGagner, label: "Manque à gagner" },
  ];

  const [columsData, setColumsData] = useState(uData);
  const [rowData, setRowData] = useState(xLabels);

  useEffect(() => {
    if (monthlySums) {
      // const sDate = monthlySums.length && monthlySums[0]?.monthYear;
      // const eDate =
      //   monthlySums.length && monthlySums[monthlySums.length - 1]?.monthYear;
      // const filteredArray = generateMonthArray(eDate, sDate);
      // const newMerge = mergeArrays(filteredArray, monthlySums);
      // console.log(newMerge, filteredArray);

      const newColumnsData = monthlySums.map((item) => item.sum);
      const newRowData = monthlySums.map((item) => item.month);

      if (!arraysAreEqual(columsData, newColumnsData)) {
        setColumsData(newColumnsData);
      }

      if (!arraysAreEqual(rowData, newRowData)) {
        setRowData(newRowData);
      }
    }
  }, [monthlySums, columsData, rowData]);
  // console.log(rowData, columsData);
  return (
    <Grid
      container
      sx={{
        width: "100%",
        padding: "1.5rem 2rem 0",
      }}
      spacing={{ mobile: 1, tablet: 2, laptop: 4 }}
    >
      <Grid mobile={10} tablet={6} laptop={3}>
        <Item>
          <div style={nameCardStyle}>
            <GiReceiveMoney
              style={{ ...iconStyle, backgroundColor: "#29d0b1" }}
            />
          </div>
          <div style={{ alignSelf: "center", gap: "3px" }}>
            <div style={{ fontSize: "0.95rem" }}>Total Entrees</div>
            <div style={{ margin: "4px auto", fontSize: "1.1rem" }}>
              {listVersements?.length > 0 &&
                sumAmountDeposit.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
              FCFA
            </div>
            <div style={{ fontSize: "0.70rem" }}>
              <span style={percentageStyle}>+12%</span> de plus que le mois
              dernier
            </div>
          </div>
        </Item>
      </Grid>
      <Grid mobile={10} tablet={6} laptop={3}>
        <Item>
          <div style={nameCardStyle}>
            <BsCash style={{ ...iconStyle, backgroundColor: "#b800d8" }} />
          </div>
          <div style={{ alignSelf: "center" }}>
            <div style={{ fontSize: "0.95rem" }}>Total Depenses</div>
            <div style={{ margin: "4px auto", fontSize: "1.1rem" }}>
              {listDepenses?.length > 0 &&
                sumMontant.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
              FCFA
            </div>
            <div style={{ fontSize: "0.70rem" }}>
              <span style={percentageStyle}>-13%</span> de plus que le mois
              dernier
            </div>
          </div>
        </Item>
      </Grid>
      <Grid mobile={10} tablet={6} laptop={3}>
        <Item>
          <div style={nameCardStyle}>
            <TbDoorEnter style={{ ...iconStyle, backgroundColor: "#2e96ff" }} />
          </div>
          <div style={{ alignSelf: "center" }}>
            <div style={{ fontSize: "0.95rem" }}>Total Locataires</div>
            <div style={{ margin: "4px auto", fontSize: "1.1rem" }}>
              Batiment A:{" "}
              <span>{totalLocataire ? totalLocataire.A : "13"} </span> - B:{" "}
              <span>{totalLocataire ? totalLocataire.B : "7"}</span>
            </div>
            <div style={{ fontSize: "0.70rem" }}>
              <span style={percentageStyle}>+12%</span> de plus que le mois
              dernier
            </div>
          </div>
        </Item>
      </Grid>
      <Grid mobile={10} tablet={6} laptop={3}>
        <Item>
          <div style={nameCardStyle}>
            <GiTakeMyMoney
              style={{ ...iconStyle, backgroundColor: "#25283b" }}
            />
          </div>
          <div style={{ alignSelf: "center", fontSize: "0.95rem" }}>
            <div>Total impayés</div>
            <div style={{ margin: "4px auto", fontSize: "1.1rem" }}>
              {locataires?.length > 0 &&
                sumDebts.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
              FCFA
            </div>
            <div style={{ fontSize: "0.70rem" }}>
              <span style={percentageStyle}>+1%</span> de reduction des dettes
            </div>
          </div>
        </Item>
      </Grid>
      <Grid
        container
        mobile={24}
        tablet={24}
        laptop={12}
        columns={24}
        justifyContent="space-around"
        sx={{ gap: 2 }}
      >
        <Grid2
          mobile={24}
          tablet={24}
          laptop={14}
          sx={{
            position: "relative",
            borderRadius: 3,
            alignSelf: "flex-end",
          }}
        >
          <LineChart
            margin={{
              left: 80,
              right: 70,
              top: 30,
              bottom: 80,
            }}
            xAxis={[
              {
                scaleType: "point",
                data: rowData.length ? rowData : xLabels,
              },
            ]}
            series={[
              {
                // il y a un soucis d'affichage ici
                showMark: false,
                area: true,
                data: columsData.length ? columsData : uData,
                label: "Versements",
                valueFormatter,
              },
            ]}
            width={650}
            height={370}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]} defaultValue={startDate}>
              <DatePicker
                sx={{
                  position: "absolute",
                  display: "block",
                  top: 15,
                  right: 15,
                  width: "200px",
                  mx: 2,
                }}
                label="Date de compte"
                defaultValue={startDate}
                fullWidth
                onChange={(newDate) => setStartDate(newDate)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid2>
        <Grid2
          mobile={24}
          tablet={24}
          laptop={9}
          sx={{
            borderRadius: 3,
            p: 2,
          }}
        >
          <PieChart
            margin={{ top: 0, bottom: 0, left: -100 }}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "center", horizontal: "right" },
                padding: 10,
              },
            }}
            series={[
              {
                data: pieChartDatas ? [...pieChartDatas] : [...data],
                arcLabel: (item) => `${item.value}%`,
                innerRadius: 25,
                outerRadius: 100,
                paddingAngle: 6,
                cornerRadius: 17,
                startAngle: -180,
                endAngle: 180,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 10,
                  additionalRadius: -10,
                  color: "gray",
                },
                // cx: 90,
                // cy: 100,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                // fill: "black",
                fontWeight: "bold",
              },
              // [`& .${pieArcClasses.root}`]: {
              //   // fill: "black",
              //   height: "20px",
              // },
            }}
            {...size}
          />
        </Grid2>
      </Grid>
    </Grid>
  );
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#222228" : "#fff",
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
  // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  alignContent: "space-between",
}));
const Grid2 = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#222228" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
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

export default Dashboard;
