import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialogValidation = ({
  open,
  onClose,
  title,
  onCloseButtonClick,
  children,
  btnColor,
}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button
          autoFocus
          sx={{ fontWeight: "bold" }}
          onClick={onClose}
          variant="outlined"
          color="secondary"
        >
          Annuler
        </Button>
        <Button
          sx={{ fontWeight: "bold" }}
          onClick={onCloseButtonClick}
          variant="contained"
          color={btnColor}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialogValidation;
