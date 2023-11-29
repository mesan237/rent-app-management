import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { GridActionsCellItem } from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  useUpdateLocataireMutation,
  useGetLocataireDetailsQuery,
} from "../../slices/locatairesApiSlice.js";
import { CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import * as React from "react";

import { useForm, Controller } from "react-hook-form";

// const {data: locataire, isLoading: detailsLoading} =useGetLocataireDetailsQuery()

function AddUser({ rowId }) {
  // Nombre total de chambres
  const nombreDeChambresA = 32;
  const nombreDeChambresB = 14;

  const [num, setNum] = useState(0);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [locataireId, setLocataireId] = useState("");
  const [date, setDate] = useState(dayjs("2022-04-17T15:30"));
  const [montant, setMontant] = useState(0);
  const [comments, setComments] = useState("");

  const {
    data: locataire,
    isLoading: loadingDetails,
    error,
    refetch,
  } = useGetLocataireDetailsQuery(rowId);
  const [updateLocataire, { isLoading: loadingUpdate }] =
    useUpdateLocataireMutation();

  useEffect(() => {
    if (locataire) {
      setComments(locataire.comments);
      setDate(dayjs(locataire.date));
      setMontant(locataire.montant);
      setName(locataire.name);
      setLocataireId(locataire._id);
      setNum(locataire.num);
      setTel(locataire.tel);
    }
  }, [locataire]);

  // Fonction pour générer les valeurs
  function genererValeurChambre_A(index) {
    return `${index + 1}A`;
  }
  function genererValeurChambre_B(index) {
    return `${index + 1}B`;
  }
  // console.log(locataire);

  // Création de la liste de chambres
  const chambres = [];

  // Boucle pour générer les valeurs et les ajouter à la liste
  for (let i = 0; i < nombreDeChambresA; i++) {
    const chambre = {
      value: genererValeurChambre_A(i),
      label: genererValeurChambre_A(i),
    };
    chambres.push(chambre);
  }
  for (let i = 0; i < nombreDeChambresB; i++) {
    const chambre = {
      value: genererValeurChambre_B(i),
      label: genererValeurChambre_B(i),
    };
    chambres.push(chambre);
  }
  chambres.push(
    ...[
      { value: "studio 1B", label: "studio 1B" },
      { value: "studio 2B", label: "studio 2B" },
      { value: "studio 3B", label: "studio 3B" },
    ]
  );

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    handleEditTenant(data);
  };

  const handleEditTenant = async () => {
    const formData = getValues();
    const updatedLocataire = { ...formData, _id: locataireId };
    const result = await updateLocataire(updatedLocataire);
    console.log("form data", { ...formData, _id: locataireId }, result);

    refetch();

    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <GridActionsCellItem
        icon={<EditIcon color="primary" />}
        label="Edit"
        className="textPrimary"
        onClick={handleClickOpen}
        color="inherit"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Modifier le locataire</DialogTitle>
          {loadingUpdate && <CircularProgress />}

          {loadingDetails ? (
            <CircularProgress />
          ) : (
            <DialogContent>
              <Controller
                name="name"
                control={control}
                defaultValue={name}
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
                defaultValue={tel}
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
                defaultValue={num}
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
                defaultValue={dayjs(date)}
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
            <Button type="submit" onClick={handleEditTenant}>
              Modifier
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
}

const EditLocataire = ({ rowId }) => {
  return (
    <>
      <AddUser rowId={rowId} />
    </>
  );
};

export default EditLocataire;
