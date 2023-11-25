import * as React from "react";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { chambres } from "../../utils/constants";
import { DatePicker } from "@mui/x-date-pickers";

function AddUser(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSelectch = (e) => {
    setNum(e.target.value);
  };
  const handleEdit = (e) => {
    e.preventDefault();
    const createTenant = {
      name,
      tel,
      date: selectedDate,
      montant,
      num,
      comments,
    };
    console.log(createTenant);
    props.onhandleSubmit(createTenant);
    setOpen(false);
  };

  const [name, setName] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(
    dayjs("2022-04-17T15:30")
  );
  const [montant, setMontant] = React.useState(0);
  const [num, setNum] = React.useState("");
  const [comments, setComments] = React.useState("");

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ajouter un locataire
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleEdit}>
          <DialogTitle>Ajouter un locataire</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="normal"
              id="nom"
              onChange={(e) => setName(e.target.value)}
              label="nom"
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
              id="Tel"
              onChange={(e) => setTel(e.target.value)}
              label="Tel"
              type="number"
              fullWidth
              variant="standard"
            />

            <TextField
              id="outlined-select-currency"
              select
              label="N° chambre"
              onChange={handleSelectch}
              margin="normal"
              defaultValue="1A"
              // helperText="Please select the room"
            >
              {chambres.map((option) => (
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
                <DatePicker
                  label="Date d'entrée"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
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

export default AddUser;
