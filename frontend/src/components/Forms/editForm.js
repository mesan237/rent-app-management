import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import EditIcon from "@mui/icons-material/Edit";

import { useGetLocataireDetailsQuery } from "../../slices/locatairesApiSlice.js";

import * as React from "react";

import AddTenant from "./AddTenant.jsx";

function AddUser({ rowId }) {
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

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
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
      <Dialog open={open} onClose={handleClose}>
        <AddTenant
          onHandleClose={handleClose}
          formType="edit"
          setOpen={setOpen}
          locataire={locataire}
        />
      </Dialog>
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
