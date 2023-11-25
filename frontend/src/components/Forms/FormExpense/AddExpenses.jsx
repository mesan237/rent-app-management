import * as React from "react";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function AddExpenses(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeBatiment = (event) => {
    setBatiment(event.target.value);
  };
  const handleEdit = () => {
    const createExpense = {
      designation,
      categorie,
      date,
      montant,
      batiment,
      comments,
    };
    console.log(createExpense);

    props.onhandleSubmit(createExpense);
    console.log("submit");
  };

  const [designation, setDesignation] = React.useState("");
  const [categorie, setCategorie] = React.useState("");
  const [date, setDate] = React.useState(dayjs("2022-04-17T15:30"));
  const [montant, setMontant] = React.useState(0);
  const [batiment, setBatiment] = React.useState("");
  const [comments, setComments] = React.useState("");

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ajouter une depense
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={() => handleEdit()}>
          <DialogTitle>Ajout d'une depense</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="normal"
              id="desigation"
              onChange={(e) => setDesignation(e.target.value)}
              label="desigation"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="normal"
              id="montant"
              onChange={(e) => setMontant(e.target.value)}
              label="Montant"
              type="number"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="normal"
              id="categorie"
              onChange={(e) => setCategorie(e.target.value)}
              label="Categorie"
              type="text"
              fullWidth
              variant="standard"
            />

            <TextField
              id="outlined-select-currency"
              select
              label="Batiment"
              onChange={handleChangeBatiment}
              margin="normal"
              defaultValue="A"
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
              <DemoContainer
                components={["DateTimePicker"]}
                defaultValue={dayjs("2022-04-17T15:30")}
              >
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
              fullWidth
              onChange={(e) => setComments(e.target.value)}
              multiline
              margin="normal"
              maxRows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit">Ajouter</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default AddExpenses;
