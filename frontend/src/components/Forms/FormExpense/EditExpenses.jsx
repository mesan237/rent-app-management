import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { GridActionsCellItem } from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  useUpdatedepenseMutation,
  useGetDepenseDetailsQuery,
} from "../../../slices/depensesApiSlice.js";
import { Avatar, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";

// const {data: locataire, isLoading: detailsLoading} =useGetLocataireDetailsQuery()

function AddUser({ rowId }) {
  const [designation, setDesignation] = useState("");
  const [categorie, setCategorie] = useState("");
  const [batiment, setBatiment] = useState("");
  const [depenseId, setDepenseId] = useState("");
  const [date, setDate] = useState(dayjs("2022-04-17T15:30"));
  const [montant, setMontant] = useState(0);
  const [comments, setComments] = useState("");

  const {
    data: depense,
    isLoading: loadingDetails,
    error,
    refetch,
  } = useGetDepenseDetailsQuery(rowId);
  const [updateLocataire, { isLoading: loadingUpdate }] =
    useUpdatedepenseMutation();

  useEffect(() => {
    if (depense) {
      setComments(depense.comments);
      setDate(dayjs(depense.date));
      setMontant(depense.montant);
      setCategorie(depense.categorie);
      setDepenseId(depense._id);
      setDesignation(depense.designation);
      setBatiment(depense.batiment);
    }
  }, [depense]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleChangeBatiment = (event) => {
    setBatiment(event.target.value);
  };

  const handleEditExpense = async () => {
    if (depense) {
      const updatedLocataire = {
        designation,
        categorie,
        batiment,
        date,
        _id: depenseId,
        montant,
        comments,
      };
      const result = await updateLocataire(updatedLocataire);
      console.log(result);

      // refetch();

      setOpen(false);
    } else {
      alert("Errorrrrrr!!!!!");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <GridActionsCellItem
        icon={
          <Avatar variant="rounded" sx={{ bgcolor: "#e3effb" }}>
            <EditIcon color="primary" />
          </Avatar>
        }
        label="Edit"
        className="textPrimary"
        onClick={handleClickOpen}
        color="inherit"
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleEditExpense}>
          <DialogTitle>Modifier une Depense</DialogTitle>
          {loadingUpdate && <CircularProgress />}

          {loadingDetails ? (
            <CircularProgress />
          ) : (
            <DialogContent>
              <TextField
                autoFocus
                margin="normal"
                id="designation"
                value={designation}
                label="Designation"
                onChange={(e) => setDesignation(e.target.value)}
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="normal"
                id="montant"
                value={montant}
                label="Montant"
                onChange={(e) => setMontant(e.target.value)}
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                id="categorie"
                margin="normal"
                label="categorie"
                value={categorie}
                type="text"
                onChange={(e) => setCategorie(e.target.value)}
                fullWidth
                variant="standard"
              />

              <TextField
                id="outlined-select-currency"
                margin="normal"
                select
                label="Batiment"
                value={batiment}
                onChange={handleChangeBatiment}

                // helperText="Please select the room"
              >
                {[
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    label="Basic date time picker"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <TextField
                id="outlined-multiline-flexible"
                label="Commentaire"
                margin="normal"
                fullWidth
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                multiline
                maxRows={4}
              />
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit">Modifier</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const EditExpenses = ({ rowId }) => {
  return (
    <>
      <AddUser rowId={rowId} />
    </>
  );
};

export default EditExpenses;
