import React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  useGetLocatairesQuery,
  useCreateLocataireMutation,
} from "../slices/locatairesApiSlice";
import CircularProgress from "@mui/material/CircularProgress";

// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddUser from "./Forms/AddUser";
import EditLocataire from "./Forms/editForm";
import { pink } from "@mui/material/colors";

import { GridToolbar } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
// import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const ListeChambres = () => {
  // useState({})

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
        return [
          <EditLocataire rowId={id} />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: pink[500] }} />}
            label="Delete"
            onClick={() => console.log(id, "for delete purpose")}
            color="inherit"
          />,
        ];
      },
    },

    // { field: "Modifier", headerName: "Modifier", width: 50 },
    // { field: "Supprimer", headerName: "Supprimer", width: 50 },
  ];

  const {
    data: listLocataires,
    isLoading,
    error,
    refetch,
  } = useGetLocatairesQuery();

  const [createLocataire, { isLoading: createLoading }] =
    useCreateLocataireMutation();

  const createLocataireHandler = async (locataire) => {
    try {
      const result = await createLocataire(locataire);
      console.log(result);
      if (result) {
        // console.log("okay");
        setOpen(true);
        refetch();
      } else {
        setOpen(false);
        // console.log(result.error);
      }
    } catch (error) {
      console.log(error, "huge error");
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // Create a copy of the array with modifications
  const rows = !listLocataires
    ? []
    : listLocataires.map((locataire) => {
        // Create a copy of the object using the spread operator
        const newLocataire = { ...locataire };

        // Add a new 'id' property with a unique value
        newLocataire.id = locataire._id;

        return newLocataire;
      });
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
    <Box sx={{ width: 0.92, mx: "auto" }}>
      {createLoading && <CircularProgress />}
      {/* {isLoading ? (
        <h2 style={{ display: "flex" }}>
          <CircularProgress />
        </h2>
      ) : error ? (
        <div>{error?.data.message || error.error}</div>
      ) : ( */}
      <div className="lists">
        {/* <Button onClick={createLocataireHandler}>Annuler</Button> */}

        <AddUser onhandleSubmit={createLocataireHandler} />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            This is a success message!
          </Alert>
        </Snackbar>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rowHeight={55}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            autoHeight
            pageSizeOptions={[8]}
            columns={columns}
            loading={isLoading}
            rows={!isLoading ? rows : []}
            rowSelection={true}
            disableColumnFilter
            disableDensitySelector
            slots={{ toolbar: GridToolbar }}
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
      {/* )} */}
    </Box>
  );
};

export default ListeChambres;
