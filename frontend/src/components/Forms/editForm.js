import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import EditIcon from "@mui/icons-material/Edit";

import {
  useDeleteLocataireMutation,
  useGetLocataireDetailsQuery,
} from "../../slices/locatairesApiSlice.js";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import * as React from "react";

import AddTenant from "./AddTenant.jsx";
import { blue, pink } from "@mui/material/colors";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Backdrop, CircularProgress } from "@mui/material";
import CustomDialogValidation from "../Widgets/CustomDialogValidation.jsx";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function CustomizedDialogs({
  onHandleDelete,
  rowId,
  openDelete,
  handleClickOpenDelete,
  handleCloseDelete,
  deactivate,
}) {
  return (
    <React.Fragment>
      <GridActionsCellItem
        icon={<DeleteIcon sx={{ color: !deactivate ? pink[500] : "#ccc" }} />}
        label="Delete"
        onClick={handleClickOpenDelete}
        color="inherit"
        disabled={deactivate}
      />
      <CustomDialogValidation
        open={openDelete}
        onClose={handleCloseDelete}
        title="SUPPRESSION"
        onCloseButtonClick={() => onHandleDelete(rowId)}
        btnColor="error"
      >
        <Typography gutterBottom>
          Êtes-vous sûr(e) de vouloir supprimer ce locataire ?
        </Typography>
        <Typography gutterBottom>Cette suppression est définitive</Typography>
      </CustomDialogValidation>
    </React.Fragment>
  );
}

function AddUser({ rowId, refetch }) {
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
  } = useGetLocataireDetailsQuery(rowId);

  const [deleteLocataire] = useDeleteLocataireMutation();

  const deleteLocataireHandler = async (locataireId) => {
    try {
      handleCloseDelete();
      handleOpenBackdrop();
      const result = await deleteLocataire(locataireId);
      console.log(result);
      if (result) {
        handleClosBackdrop();
      }
      refetch();
    } catch (error) {
      console.log(error, " error for deletion");
    }
  };

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
  }, [locataire, refetch]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleClosBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleClosBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <GridActionsCellItem
        icon={<EditIcon sx={{ color: locataire?.name ? blue[500] : "#ccc" }} />}
        label="Edit"
        className="textPrimary"
        onClick={handleClickOpen}
        color="inherit"
        disabled={!locataire?.name}
      />
      <CustomizedDialogs
        onHandleDelete={deleteLocataireHandler}
        rowId={rowId}
        handleClickOpenDelete={handleClickOpenDelete}
        handleCloseDelete={handleCloseDelete}
        openDelete={openDelete}
        deactivate={!locataire?.name}
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

const EditLocataire = ({ rowId, refetch }) => {
  return (
    <>
      <AddUser rowId={rowId} refetch={refetch} />
    </>
  );
};

export default EditLocataire;
