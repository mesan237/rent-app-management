import * as React from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import EditIcon from "@mui/icons-material/Edit";

import AddVersement from "./AddVersement.jsx";
import { blue } from "@mui/material/colors";
import { Avatar } from "@mui/material";

function EditFormVersement({ compoundId, refetch, versList }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // console.log("closing dialog");
  };

  return (
    <>
      <Avatar
        onClick={handleClickOpen}
        variant="rounded"
        sx={{ bgcolor: blue[100] }}
      >
        <EditIcon sx={{ color: blue[500] }} />
      </Avatar>
      <Dialog open={open} onClose={handleClose}>
        <AddVersement
          onHandleClose={handleClose}
          formType="edit"
          compoundId={compoundId}
          refetch={refetch}
          versList={versList}
        />
      </Dialog>
    </>
  );
}

export default EditFormVersement;
