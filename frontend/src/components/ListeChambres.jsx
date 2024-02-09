import React from "react";
import {
  DataGrid,
  GridPagination,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useGetLocatairesQuery } from "../slices/locatairesApiSlice";
// import CircularProgress from "@mui/material/CircularProgress";

import AddUser from "./Forms/AddUser";
import EditLocataire from "./Forms/editForm";

import { GridToolbar } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import MuiPagination from "@mui/material/Pagination";

import { closeSnackbar } from "../slices/snackbar/snackbarSlice";
import { Typography } from "@mui/material";
// import { blue } from "@mui/material/colors";

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="secondary"
      shape="rounded"
      className={className}
      variant="contained"
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}
function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}
const ListeChambres = () => {
  const columns = [
    { field: "num", headerName: "N° chambres", width: 100 },
    { field: "name", headerName: "✏️ Noms", width: 150 },
    { field: "tel", headerName: "📞 Telephone", width: 150 },
    {
      field: "date",
      headerName: "📅 Date entrée",
      type: "date",
      valueGetter: ({ value }) => value && new Date(value),
      width: 150,
    },
    {
      field: "months",
      headerName: "⏱️ Mois écoulés",
      align: "center",
      width: 100,
    },
    { field: "debts", headerName: "💳 Dettes", type: "number", width: 150 },
    { field: "comments", headerName: "♒ Commentaires", width: 250 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [<EditLocataire refetch={refetch} rowId={id} />];
      },
    },
  ];

  const {
    data: listLocataires,
    isLoading,
    // error,
    refetch,
  } = useGetLocatairesQuery();

  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);
  // let index = 1;
  // Create a copy of the array with modifications

  const rows = !listLocataires
    ? []
    : listLocataires
        .map((locataire) => {
          const newLocataire = { ...locataire };
          newLocataire.id = locataire._id;
          return newLocataire;
        })
        .sort((a, b) => {
          const [numA, alphaA] = a.num.match(/(\d+)([A-Za-z]*)$/i).slice(1);
          const [numB, alphaB] = b.num.match(/(\d+)([A-Za-z]*)$/i).slice(1);

          const alphaComparison = alphaA.localeCompare(alphaB, "en", {
            sensitivity: "base",
          });

          if (alphaComparison === 0) {
            return parseInt(numA, 10) - parseInt(numB, 10);
          }

          return alphaComparison;
        });

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    // quickFilterExcludeHiddenColumns: true,
    quickFilterValues: ["1"],
  });

  // const [sortModel, setSortModel] = React.useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  // console.log("rows", rows);
  return (
    <Box sx={{ margin: "1rem" }}>
      <div
        className="lists"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{ fontWeight: "bold", fontSize: "1.7rem" }}
            color="text.primary"
          >
            Liste des locataires
          </Typography>
          <AddUser refetch={refetch} locataires={listLocataires} />
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Box sx={{ height: 400 }} color="primary">
          {/* <DataGrid
            rowHeight={55}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            autoHeight
            slotProps={{ toolbar: { showQuickFilter: true } }}
            pageSizeOptions={[8]}
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            filterModel={filterModel}
            onSortModelChange={setSortModel}
            onFilterModelChange={(newModel) => setFilterModel(newModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
          /> */}
          <DataGrid
            // rowHeight={55}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            color="primary.main"
            autoHeight
            pageSizeOptions={[8]}
            columns={columns}
            loading={isLoading}
            rows={rows}
            rowSelection={true}
            disableColumnFilter
            disableDensitySelector
            sortingMode="server"
            filterMode="server"
            slots={{ toolbar: GridToolbar, pagination: CustomPagination }}
            filterModel={filterModel}
            onFilterModelChange={(newModel) => setFilterModel(newModel)}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
          />
        </Box>
      </div>
    </Box>
  );
};

export default ListeChambres;
