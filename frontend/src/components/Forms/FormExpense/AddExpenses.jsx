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
import { useCreateDepenseMutation } from "../../../slices/depensesApiSlice";
import { useForm, Controller } from "react-hook-form";

function AddExpenses({ refetch }) {
  const [open, setOpen] = React.useState(false);
  const [createDepense, { isLoading: createLoading }] =
    useCreateDepenseMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddExpenses = async () => {
    const formData = getValues();
    const createExpense = { ...formData };
    // console.log(createExpense);

    const result = await createDepense(createExpense);
    if (result) {
      refetch();
      setOpen(false);
    }

    console.log("submit");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    handleAddExpenses(data);
  };

  const [designation, setDesignation] = React.useState("");
  const [categorie, setCategorie] = React.useState("");
  const [date, setDate] = React.useState(dayjs(Date.now()));
  const [montant, setMontant] = React.useState(0);
  const [batiment, setBatiment] = React.useState("");
  const [comments, setComments] = React.useState("");

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ width: "fit-content" }}
      >
        Ajouter une depense
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Ajout d'une depense</DialogTitle>
          <DialogContent>
            <Controller
              name="designation"
              control={control}
              defaultValue=""
              rules={{ required: "Le champ designation est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.designation}
                  helperText={errors.designation && errors.designation.message}
                  autoFocus
                  margin="normal"
                  id="designation"
                  type="text"
                  fullWidth
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
                  label="Montant"
                  type="number"
                  fullWidth
                  variant="standard"
                />
              )}
            />
            <Controller
              name="categorie"
              control={control}
              defaultValue=""
              rules={{ required: "La categorie est necessaire" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.categorie}
                  helperText={errors.categorie && errors.categorie.message}
                  autoFocus
                  margin="normal"
                  id="categorie"
                  label="categorie"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              )}
            />

            <Controller
              name="batiment"
              control={control}
              defaultValue="A"
              rules={{ required: "batiment is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.batiment}
                  helperText={errors.batiment && errors.batiment.message}
                  id="outlined-numero-chambre"
                  select
                  label="batiment"
                  margin="normal"
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
              )}
            />

            <Controller
              name="date"
              control={control}
              defaultValue={dayjs(Date.now())}
              rules={{ required: "La date du versement est necessaire" }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      {...field}
                      label="Date du versement"
                      fullWidth
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

export default AddExpenses;
