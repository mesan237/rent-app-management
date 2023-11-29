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

import { useForm, Controller } from "react-hook-form";

function AddUser(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (e) => {
    // e.preventDefault();
    const formData = getValues();
    // console.log("Form Data:", formData);
    const createTenant = { ...formData };
    console.log(createTenant);

    props.onhandleSubmit(createTenant);
    setOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    handleEdit(data);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ajouter un locataire
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Ajouter un locataire</DialogTitle>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                  autoFocus
                  margin="normal"
                  id="name"
                  label="name"
                  type="text"
                  fullWidth
                  // onChange={(e) => setName(e.target.value)}
                  variant="standard"
                />
              )}
            />
            <Controller
              name="montant"
              control={control}
              defaultValue=""
              rules={{ required: "Le montant est necessaire" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.montant}
                  helperText={errors.montant && errors.montant.message}
                  autoFocus
                  margin="normal"
                  id="montant"
                  // onChange={(e) => setMontant(e.target.value)}
                  label="Montant"
                  type="number"
                  fullWidth
                  variant="standard"
                />
              )}
            />
            <Controller
              name="tel"
              control={control}
              defaultValue=""
              rules={{ required: "Le numero de telephone est nécessaire" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.tel}
                  helperText={errors.tel && errors.tel.message}
                  autoFocus
                  margin="normal"
                  id="tel"
                  // onChange={(e) => setTel(e.target.value)}
                  label="Tel"
                  type="number"
                  fullWidth
                  variant="standard"
                />
              )}
            />

            <Controller
              name="num"
              control={control}
              defaultValue="1A"
              rules={{ required: "N° chambre is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.num}
                  helperText={errors.num && errors.num.message}
                  id="outlined-numero-chambre"
                  select
                  label="N° chambre"
                  margin="normal"
                  defaultValue="1A"
                >
                  {chambres.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="date"
              control={control}
              defaultValue={dayjs(Date.now())}
              rules={{ required: "Date d'entrée est necessaire" }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                    // defaultValue={dayjs("2022-04-17T15:30")}
                  >
                    <DatePicker
                      {...field}
                      label="Date d'entrée"
                      fullWidth
                      // value={selectedDate}
                      // onChange={(newDate) => setSelectedDate(newDate)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              )}
            />
            <Controller
              name="comments"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.comments}
                  helperText={errors.comments && errors.comments.message}
                  id="outlined-multiline-flexible"
                  label="Commentaire"
                  fullWidth
                  multiline
                  margin="normal"
                  maxRows={4}
                />
              )}
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
