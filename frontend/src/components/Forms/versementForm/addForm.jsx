import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import AddVersement from "./AddVersement";

function AddUser() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ width: "fit-content", fontWeight: "bold" }}
      >
        Ajouter un versement
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <AddVersement
          onHandleClose={handleClose}
          formType="add"
          setOpen={setOpen}
        />
      </Dialog>
    </React.Fragment>
  );
}

const AjouterVersement = () => {
  return (
    <>
      <AddUser />
    </>
  );
};

export default AjouterVersement;
