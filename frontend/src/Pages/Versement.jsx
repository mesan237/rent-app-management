import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditFormVersement from "../components/Forms/versementForm/editFormVersement";

import { useGetVersementsQuery } from "../slices/versementSlices";
import {
  Avatar,
  CircularProgress,
  InputBase,
  Snackbar,
  alpha,
  Backdrop,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import AjouterVersement from "../components/Forms/versementForm/addForm";
import { useGetLocatairesQuery } from "../slices/locatairesApiSlice";
import { useEffect } from "react";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "../slices/snackbar/snackbarSlice";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";

import CustomDialogValidation from "../components/Widgets/CustomDialogValidation";
import { useDeleteVersementMutation } from "../slices/versementSlices.js";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // console.log(row);
  const [deleteVersement] = useDeleteVersementMutation();

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleClosBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const deleteVersementHandler = async (versementId) => {
    try {
      handleCloseDelete();
      handleOpenBackdrop();
      const result = await deleteVersement(versementId);
      console.log(result);
      if (result) {
        handleClosBackdrop();
      }
      props.refetch();
    } catch (error) {
      console.log(error, " error for deletion");
    }
  };

  const [versId, setVersId] = useState("");
  return (
    <React.Fragment>
      <CustomizedDialogs
        onHandleDelete={deleteVersementHandler}
        versId={versId}
        handleClickOpenDelete={handleClickOpenDelete}
        handleCloseDelete={handleCloseDelete}
        openDelete={openDelete}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleClosBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.historique[0].nameLocataire}
        </TableCell>
        <TableCell align="right">{row.nbrVersement}</TableCell>
        <TableCell align="right">{row.totalAmount}</TableCell>
        <TableCell align="right">{row.comments}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Historique
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Date du versement
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Montant</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.historique.map((historyRow, idx) => {
                    const handleClick = () => {
                      const id = `${historyRow._id}-${props.versementId}`;
                      handleClickOpenDelete();
                      setVersId(id);
                      // console.log(versId);
                    };
                    return (
                      <TableRow key={idx}>
                        <TableCell align="left">
                          {new Date(historyRow.date).getUTCDate()}{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                          }).format(new Date(historyRow.date))}{" "}
                          {new Date(historyRow.date).getUTCFullYear()}
                        </TableCell>
                        <TableCell align="left">
                          {historyRow.versement}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ display: "flex", gap: 1.5 }}
                        >
                          <Avatar
                            onClick={handleClick}
                            variant="rounded"
                            sx={{ bgcolor: "#fce4e4" }}
                          >
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </Avatar>
                          <EditFormVersement
                            refetch={props.refetch}
                            compoundId={`${historyRow._id}-${props.versementId}`}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    user: PropTypes.string.isRequired,
    // comments: PropTypes.string.isRequired,
    nbrVersement: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    historique: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        versement: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function Versement() {
  const [filteredRows, setFilteredRows] = useState([]);
  const { data: listLocataires, isLoading: loadingLocataireDtails } =
    useGetLocatairesQuery();

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

  const {
    data: listVersements,
    // isLoading,
    // error,
    refetch,
  } = useGetVersementsQuery();

  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  const [searchbarState, setSearchbarState] = useState("");

  const [depositList, setDepositList] = useState([]);
  useEffect(() => {
    if (listVersements) {
      const filteredList = listVersements.filter((versement) =>
        versement.historique[0]?.nameLocataire
          .toLowerCase()
          .includes(searchbarState.toLowerCase())
      );
      // console.log(filteredList);
      // Set depositList to the filtered list if it has items, otherwise use the full list
      setDepositList(filteredList);
    }
  }, [listVersements, searchbarState]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        margin: "1rem",
      }}
    >
      {/* Ajouter un versement */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{ fontWeight: "bold", fontSize: "1.8rem" }}
          color="text.primary"
        >
          Versements
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Recercher un locataire..."
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearchbarState(e.target.value)}
          />
        </Search>
        <AjouterVersement locataires={filteredRows} refetch={refetch} />
      </div>

      <TableContainer component={Paper} color="primary">
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>
                Profile locataire
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Nobre de versements
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Montant total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Commentaire
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!depositList ? (
              <CircularProgress />
            ) : (
              depositList.map((row, index) => (
                <Row
                  key={index}
                  row={row}
                  versementId={row._id}
                  refetch={refetch}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function CustomizedDialogs({
  onHandleDelete,
  versId,
  openDelete,
  handleCloseDelete,
}) {
  return (
    <React.Fragment>
      <CustomDialogValidation
        open={openDelete}
        onClose={handleCloseDelete}
        title="SUPPRESSION"
        onCloseButtonClick={() => onHandleDelete(versId)}
        btnColor="error"
      >
        <Typography gutterBottom>
          Êtes-vous sûr(e) de vouloir supprimer ce versement ?
        </Typography>
        <Typography gutterBottom>Cette suppression est définitive</Typography>
      </CustomDialogValidation>
    </React.Fragment>
  );
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  width: "300px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
