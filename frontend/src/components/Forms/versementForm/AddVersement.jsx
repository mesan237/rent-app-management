import React from "react";
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
import { DatePicker } from "@mui/x-date-pickers";

import { useForm, Controller } from "react-hook-form";

import {
  useUpdateVersementMutation,
  useCreateVersementMutation,
} from "../../../slices/versementSlices";
import { useGetLocatairesQuery } from "../../../slices/locatairesApiSlice";
import { useEffect } from "react";
import { useState } from "react";

const AddVersement = ({ onHandleClose, formType, compoundId, refetch }) => {
  // console.log(onHandleClose);

  const { data: listLocataires, isLoading: loadingLocataireDtails } =
    useGetLocatairesQuery();
  const [createVersement, { isLoading: loadingCreation }] =
    useCreateVersementMutation();
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    // Use useEffect to update filteredRows when listLocataires changes
    if (!loadingLocataireDtails && listLocataires) {
      const filteredData = listLocataires
        .filter((locataire) => locataire.name)
        .map((locataire) => ({ num: locataire.num, name: locataire.name }))
        .sort((a, b) => {
          // Extract numeric and alphabetic parts
          const [numA, alphaA] = a.num.match(/(\d+)([A-Za-z]*)/).slice(1);
          const [numB, alphaB] = b.num.match(/(\d+)([A-Za-z]*)/).slice(1);

          // Compare numeric parts first
          const numComparison = parseInt(numA, 10) - parseInt(numB, 10);

          // If numeric parts are equal, compare alphabetic parts
          if (numComparison === 0) {
            return alphaA.localeCompare(alphaB);
          }

          return numComparison;
        });

      setFilteredRows(filteredData);
    } else {
      setFilteredRows([]);
    }
  }, [loadingLocataireDtails, listLocataires]);

  // console.log("liste versements", listVersements);
  console.log(filteredRows);

  const [updateVersement, { isLoading: loadingUpdate }] =
    useUpdateVersementMutation();

  const handleAddForm = () => {
    const formData = getValues();
    const versementData = { ...formData };
    console.log(versementData);

    createVersement(versementData);
    onHandleClose();
  };
  const handleEditForm = async () => {
    const formData = getValues();
    const updatedVersement = { ...formData, _id: compoundId };
    const result = await updateVersement(updatedVersement);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    formType === "edit" ? handleEditForm(data) : handleAddForm(data);
    onHandleClose();
    refetch();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {formType === "edit"
            ? "Modifier un versement"
            : "Ajouter un versement"}
        </DialogTitle>
        {/* {loadingUpdate && <CircularProgress />}

          {loadingDetails ? (
            <CircularProgress />
          ) : (
            )} */}
        <DialogContent>
          {formType === "add" && (
            <Controller
              name="num"
              control={control}
              defaultValue=""
              rules={{ required: "le locataire est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.num}
                  helperText={errors.num && errors.num.message}
                  id="outlined-numero-chambre"
                  select
                  label="Locataire"
                  margin="normal"
                  defaultValue=""
                  sx={{ width: "100%" }}
                >
                  {filteredRows.map((option) => (
                    <MenuItem key={option.num} value={option.num}>
                      {`${option.num} - ${option.name}`}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
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
          <Button onClick={onHandleClose}>Annuler</Button>
          <Button type="submit">
            {formType === "edit" ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
export default AddVersement;
