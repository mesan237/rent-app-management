import * as React from "react";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { chambres } from "../../utils/constants";
import { DatePicker } from "@mui/x-date-pickers";

import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../slices/snackbar/snackbarSlice.js";

import {
  useCreateLocataireMutation,
  useUpdateLocataireMutation,
} from "../../slices/locatairesApiSlice.js";

const AddTenant = ({
  onHandleClose,
  formType,
  setOpen,
  locataire,
  refetch,
  locataires,
}) => {
  const [
    createLocataire,
    // , { isLoading: createLoading }
  ] = useCreateLocataireMutation();

  const dispatch = useDispatch();

  // console.log(locataire);
  const [
    updateLocataire,
    // , { isLoading: loadingUpdate }
  ] = useUpdateLocataireMutation();

  const handleAddForm = () => {
    const formData = getValues();
    const createTenant = { ...formData };
    console.log(createTenant);
    createLocataireHandler(createTenant);
    setOpen(false);
  };
  const handleEditForm = async () => {
    const formData = getValues();
    const updatedLocataire = { ...formData, _id: locataire._id };
    updateLocataireHandler(updatedLocataire);
    // console.log("form data", { ...formData, _id: locataire._id }, result);

    setOpen(false);
  };

  const updateLocataireHandler = async (locataire) => {
    try {
      const result = await updateLocataire(locataire);
      if (result.error) {
        openSnackbar({
          message: result.error.error,
          severity: "error",
        });
      } else {
        dispatch(
          openSnackbar({
            message: "Le locataire a été modifié avec succes!",
            severity: "success",
          })
        );
        refetch();
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error,
          severity: "error",
        })
      );
      console.log(error, "huge error");
    }
  };

  const createLocataireHandler = async (locataire) => {
    try {
      const result = await createLocataire(locataire);
      console.log(" result ", result);
      if (result.error) {
        dispatch(
          openSnackbar({
            message: result.error.error,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: "Le locataire a été crée avec succes!",
            severity: "success",
          })
        );
        refetch();
        console.log(result.error);
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error,
          severity: "error",
        })
      );
      console.log(error, "huge error");
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    formType === "edit" ? handleEditForm(data) : handleAddForm(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {formType === "edit"
            ? "Modifier un locataire"
            : "Ajouter un locataire"}
        </DialogTitle>
        {/* {loadingUpdate && <CircularProgress />}

          {loadingDetails ? (
            <CircularProgress />
          ) : (
            )} */}
        <DialogContent>
          <Controller
            name="name"
            control={control}
            defaultValue={formType === "edit" ? locataire.name : ""}
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
            defaultValue={formType === "edit" ? locataire.montant : ""}
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
            defaultValue={formType === "edit" ? locataire.tel : ""}
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
            defaultValue={formType === "edit" ? locataire.num : "11A"}
            rules={{ required: "N° chambre is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.num}
                helperText={errors.num && errors.num.message}
                id="outlined-numero-chambre"
                disabled={formType === "edit"}
                select
                label="N° chambre"
                margin="normal"
                defaultValue="1A"
              >
                {formType !== "edit" &&
                  locataires
                    .filter((loc) => !loc.name)
                    .sort((a, b) => {
                      // Extract numeric and alphabetic parts
                      const [numA, alphaA] = a.num
                        .match(/(\d+)([A-Za-z]*)/)
                        .slice(1);
                      const [numB, alphaB] = b.num
                        .match(/(\d+)([A-Za-z]*)/)
                        .slice(1);

                      // Compare numeric parts first
                      const numComparison =
                        parseInt(numA, 10) - parseInt(numB, 10);

                      if (numComparison === 0) {
                        return alphaA.localeCompare(alphaB);
                      }
                      return numComparison;
                    })

                    .map((loc) => (
                      <MenuItem key={loc.num} value={loc.num}>
                        {loc.num}
                      </MenuItem>
                    ))}
                {formType === "edit" &&
                  chambres.map((option) => (
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
            defaultValue={
              formType === "edit" ? dayjs(locataire.date) : dayjs(Date.now())
            }
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
            defaultValue={formType === "edit" ? locataire.comments : ""}
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
          <Button onClick={onHandleClose}>Annuler</Button>
          <Button type="submit">
            {formType === "edit" ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default AddTenant;
