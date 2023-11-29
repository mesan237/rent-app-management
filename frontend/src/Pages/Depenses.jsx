import React from "react";
import {
  DataGrid,
  gridClasses,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  useCreateDepenseMutation,
  useGetDepensesQuery,
} from "../slices/depensesApiSlice.js";
import CircularProgress from "@mui/material/CircularProgress";
import { blue, green, grey, red, pink, teal } from "@mui/material/colors";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddExpenses from "../components/Forms/FormExpense/AddExpenses.jsx";
import EditExpenses from "../components/Forms/FormExpense/EditExpenses.jsx";
import MuiPagination from "@mui/material/Pagination";
import Avatar from "@mui/material/Avatar";

// import EditIcon from "@mui/icons-material/Edit";

import { GridToolbar } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00bfa5",
      contrastText: "#fff",
    },
    // palette: {
    //   teal: {
    //     prem: "#64ffda",
    //     sec: "#1de9b6",
    //     ter: "#00bfa5",
    //     main: "#E3D026",
    //     light: "#E9DB5D",
    //     dark: "#A29415",
    //     contrastText: "#242105",
    //   },
  },
});

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <ThemeProvider theme={theme}>
      <MuiPagination
        color="primary"
        shape="rounded"
        className={className}
        variant="outlined"
        count={pageCount}
        page={page + 1}
        onChange={(event, newPage) => {
          onPageChange(event, newPage - 1);
        }}
        sx={{ color: teal["A700"] }}
      />
    </ThemeProvider>
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const columns = [
  {
    field: "designation",
    headerClassName: "super-app-theme--header",
    headerName: "📝 Designation",
    width: 250,
  },
  {
    field: "date",
    headerName: "📅 Date entrée",
    headerClassName: "super-app-theme--header",
    type: "date",
    valueGetter: ({ value }) => value && new Date(value),
    width: 150,
  },
  {
    field: "batiment",
    headerClassName: "super-app-theme--header",
    headerName: "🏛️ Batiment",
    width: 100,
    align: "center",
  },
  {
    field: "categorie",
    headerClassName: "super-app-theme--header",
    headerName: "Categorie",
    width: 150,
  },
  {
    field: "montant",
    headerClassName: "super-app-theme--header",
    headerName: "💰 Montant",
    type: "number",
    width: 150,
  },
  {
    field: "comments",
    headerClassName: "super-app-theme--header",
    headerName: "♒ Commentaires",
    width: 250,
  },
  {
    field: "actions",
    type: "actions",
    headerClassName: "super-app-theme--header",
    headerName: "Actions",
    width: 150,
    cellClassName: "actions",
    getActions: ({ id }) => {
      return [
        <EditExpenses rowId={id} />,
        <GridActionsCellItem
          icon={
            <Avatar variant="rounded" sx={{ bgcolor: "#fce4e4" }}>
              <DeleteIcon sx={{ color: pink[500] }} />
            </Avatar>
          }
          label="Delete"
          onClick={() => console.log(id, "for delete purpose")}
          color="inherit"
        />,
      ];
    },
  },
];

const Depenses = () => {
  const {
    data: listDepenses,
    isLoading,
    error,
    // refetch,
  } = useGetDepensesQuery();

  const [createDepense, { isLoading: createLoading }] =
    useCreateDepenseMutation();

  const createExpenseHandler = async (depense) => {
    if (window.confirm("Etes vous sure de vouloir ajouter une depense ? ")) {
      try {
        await createDepense(depense);
        // refetch();
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(useGetDepensesQuery());
  // Create a copy of the array with modifications
  const rows = !listDepenses
    ? []
    : listDepenses.map((depense) => {
        // Create a copy of the object using the spread operator
        const newDepense = { ...depense };

        // Add a new 'id' property with a unique value
        newDepense.id = depense._id;

        return newDepense;
      });

  const getRowSpacing = React.useCallback((params) => {
    return {
      top: params.isFirstVisible ? 0 : 9,
      bottom: params.isLastVisible ? 0 : 9,
    };
  }, []);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    // quickFilterExcludeHiddenColumns: true,
    quickFilterValues: ["1"],
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      {createLoading && <CircularProgress />}
      {/* {isLoading ? (
        <h2 style={{ display: "flex" }}>
          <CircularProgress />
        </h2>
      ) : error ? (
        <div>{error?.data.message || error.error}</div>
      ) : ( */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 0.95,
          mx: "auto",
          gap: 1,
        }}
      >
        <AddExpenses
          sx={{ width: "100px" }}
          onhandleSubmit={createExpenseHandler}
        />
        <Box sx={{ height: "80vh" }}>
          <DataGrid
            rowHeight={60}
            loading={isLoading}
            rows={!isLoading ? rows : []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            rowSelection={true}
            disableColumnFilter
            disableDensitySelector
            slots={{ toolbar: GridToolbar, pagination: CustomPagination }}
            filterModel={filterModel}
            onFilterModelChange={(newModel) => setFilterModel(newModel)}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            pagination
            getRowSpacing={getRowSpacing}
            sx={{
              border: 0,
              [`& .${gridClasses.row}`]: {
                // bgcolor: (theme) =>

                // theme.palette.mode === "light" ? blue[200] : blue[900],
                // borderInlineStart: "8px solid hsl(209.09deg 57.89% 88.82%)",
                // borderRadius: "9px",
                // background: "hsl(209.09deg 57.89% 88.82%)",
                // #43e6e5
                boxShadow: 2,
                width: 0.98,
              },
              "& .super-app-theme--header": {
                backgroundColor: teal["A700"],
                // background:
                // "linear-gradient(to right, #002f61, #00507b, #006e8e, #008b98, #00a79c)",
                // background:
                // "linear-gradient(to top, hsl(211.67deg 29.03% 51.37%), hsl(204.23deg 54.17% 81.18%) 200px), linear-gradient(to top, hsl(221.25deg 36.36% 34.51%), hsl(204.23deg 54.17% 81.18%) 30px)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      </Box>
      {/* )} */}
      {/* </ThemeProvider> */}
    </>
  );
};
/*
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};*/

export default Depenses;
