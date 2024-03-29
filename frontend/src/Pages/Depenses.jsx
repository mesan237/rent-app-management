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
import { useGetDepensesQuery } from "../slices/depensesApiSlice.js";
import { pink, teal } from "@mui/material/colors";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddExpenses from "../components/Forms/FormExpense/AddExpenses.jsx";
import EditExpenses from "../components/Forms/FormExpense/EditExpenses.jsx";
import MuiPagination from "@mui/material/Pagination";
import Avatar from "@mui/material/Avatar";

import { GridToolbar } from "@mui/x-data-grid";
import MuiAlert from "@mui/material/Alert";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDeleteDepenseMutation } from "../slices/depensesApiSlice.js";
import DeleteDialog from "../components/Forms/DeleteComponent.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00bfa5",
      contrastText: "#fff",
    },
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

const Depenses = () => {
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
          <EditExpenses rowId={id} refetch={refetch} />,
          <DeleteDialog
            rowId={id}
            onHandleDelete={deleteDepenseHandler}
            handleClickOpenDelete={handleClickOpenDelete}
            handleCloseDelete={handleCloseDelete}
            openDelete={openDelete}
            message="Êtes-vous sûr(e) de vouloir supprimer cette depense ?"
          />,
        ];
      },
    },
  ];

  const [deleteDepense] = useDeleteDepenseMutation();

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleClosBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const deleteDepenseHandler = async (depenseId) => {
    try {
      handleCloseDelete();
      handleOpenBackdrop();
      const result = await deleteDepense(depenseId);
      console.log(result);
      if (result) {
        handleClosBackdrop();
      }
      refetch();
    } catch (error) {
      console.log(error, " error for deletion");
    }
  };

  const {
    data: listDepenses,
    isLoading,
    // error,
    refetch,
  } = useGetDepensesQuery();

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
      {isLoading && <CircularProgress />}
      {/* {isLoading ? (
        <h2 style={{ display: "flex" }}>
          <CircularProgress />
        </h2>
      ) : error ? (
        <div>{error?.data.message || error.error}</div>
      ) : ( */}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleClosBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "1rem",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{ fontWeight: "bold", fontSize: "1.7rem" }}
            color="text.primary"
          >
            Liste des dépenses
          </Typography>
          <AddExpenses refetch={refetch} />
        </Box>
        <Box sx={{ height: "80vh" }}>
          <DataGrid
            rowHeight={55}
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
                boxShadow: 1,
                width: 0.98,
              },
              "& .super-app-theme--header": {
                backgroundColor: teal["A700"],
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
export default Depenses;
