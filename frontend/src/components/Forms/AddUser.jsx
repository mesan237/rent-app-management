import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AddTenant from "./AddTenant";

function AddUser({ refetch }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ajouter un locataire
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <AddTenant
          onHandleClose={handleClose}
          formType="add"
          refetch={refetch}
          setOpen={setOpen}
        />
      </Dialog>
    </React.Fragment>
  );
}

export default AddUser;
