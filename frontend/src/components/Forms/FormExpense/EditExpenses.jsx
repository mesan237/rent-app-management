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

import {
  useUpdateDepenseMutation,
  useGetDepenseDetailsQuery,
} from "../../../slices/depensesApiSlice.js";
import { Avatar, CircularProgress } from "@mui/material";

import { useForm, Controller } from "react-hook-form";

// const {data: locataire, isLoading: detailsLoading} =useGetLocataireDetailsQuery()

function EditExpenses({ rowId, refetch }) {
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
    // refetch,
  } = useGetDepenseDetailsQuery(rowId);
  const [updateDepense, { isLoading: loadingUpdate }] =
    useUpdateDepenseMutation();

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

  const handleEditExpense = async () => {
    const formData = getValues();
    const editedFform = { ...formData, _id: depenseId };
    if (depense) {
      // console.log(editedFform);
      const result = await updateDepense(editedFform);
      if (result) {
        setOpen(false);
        refetch();
      }
    } else {
      console.log("Errorrrrrr!!!!!");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    handleEditExpense(data);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Modifier une Depense</DialogTitle>
          {loadingUpdate && <CircularProgress />}

          {loadingDetails ? (
            <CircularProgress />
          ) : (
            <DialogContent>
              <Controller
                name="designation"
                control={control}
                defaultValue={designation}
                rules={{ required: "Le champ designation est requis" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.designation}
                    helperText={
                      errors.designation && errors.designation.message
                    }
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
                defaultValue={montant}
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
                defaultValue={categorie}
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
                defaultValue={batiment}
                rules={{ required: "Batiment is required" }}
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
                defaultValue={dayjs(date)}
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
                defaultValue={comments}
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

export default EditExpenses;
