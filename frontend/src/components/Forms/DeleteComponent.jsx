import * as React from "react";
import { Avatar, Typography } from "@mui/material";
import CustomDialogValidation from "../Widgets/CustomDialogValidation";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { pink } from "@mui/material/colors";

export default function DeleteDialog({
  onHandleDelete,
  rowId,
  openDelete,
  handleClickOpenDelete,
  handleCloseDelete,
  message,
}) {
  return (
    <React.Fragment>
      <GridActionsCellItem
        icon={
          <Avatar variant="rounded" sx={{ bgcolor: "#fce4e4" }}>
            <DeleteIcon sx={{ color: pink[500] }} />
          </Avatar>
        }
        label="Delete"
        onClick={handleClickOpenDelete}
        color="inherit"
      />
      <CustomDialogValidation
        open={openDelete}
        onClose={handleCloseDelete}
        title="SUPPRESSION"
        onCloseButtonClick={() => onHandleDelete(rowId)}
        btnColor="error"
      >
        <Typography gutterBottom>{message}</Typography>
        <Typography gutterBottom>Cette suppression est définitive</Typography>
      </CustomDialogValidation>
    </React.Fragment>
  );
}
