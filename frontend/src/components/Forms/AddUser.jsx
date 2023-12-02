import * as React from "react";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { chambres } from "../../utils/constants";
import { DatePicker } from "@mui/x-date-pickers";

import { useForm, Controller } from "react-hook-form";
import AddTenant from "./AddTenant";

function AddUser(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const handleEdit = (e) => {
  //   // e.preventDefault();
  //   const formData = getValues();
  //   // console.log("Form Data:", formData);
  //   const createTenant = { ...formData };
  //   console.log(createTenant);

  //   props.onhandleSubmit(createTenant);
  //   setOpen(false);
  // };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ajouter un locataire
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <AddTenant
          onHandleClose={handleClose}
          onHandleForm={props.onhandleSubmit}
          formType="add"
          setOpen={setOpen}
        />
      </Dialog>
    </React.Fragment>
  );
}

export default AddUser;
