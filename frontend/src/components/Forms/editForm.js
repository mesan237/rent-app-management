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

  const handleSelectch = (e) => {
    setNum(e.target.value);
  };

  const handleEditTenant = async () => {
    if (locataire) {
      const updatedLocataire = {
        num,
        name,
        tel,
        date,
        _id: locataireId,
        montant,
      };
      const result = await updateLocataire(updatedLocataire);
      console.log(result);

      refetch();

      setOpen(false);
    } else {
      alert("Errorrrrrr!!!!!");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleFormSubmit = () => {
    console.log("submit");
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
      <form onSubmit={handleFormSubmit}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Modifier le locataire</DialogTitle>
          {loadingUpdate && <CircularProgress />}

          {loadingDetails ? (
            <CircularProgress />
          ) : (
            <DialogContent>
              <TextField
                autoFocus
                id="nom"
                margin="normal"
                label="nom"
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
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
                margin="normal"
                id="Tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                label="Tel"
                type="number"
                fullWidth
                variant="standard"
              />

              <TextField
                id="outlined-select-currency"
                margin="normal"
                select
                label="N° chambre"
                value={num}
                onChange={handleSelectch}

                // helperText="Please select the room"
              >
                {chambres.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DatePicker
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
