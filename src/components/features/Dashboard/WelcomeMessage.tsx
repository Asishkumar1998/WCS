"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";

//   const maxWidth = useState<DialogProps['maxWidth']>('sm');

const WelcomeMessage = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs() {
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event: any, reason: any) => {
    console.log("reason",reason);
    
    if (reason === "backdropClick") {
      return;
    }
    setOpen(false);
  };

  return (
    <Fragment>
      <WelcomeMessage
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        // fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{ m: 0, p: 2, backgroundColor: "#b5001a", color: "white" }}
          id="customized-dialog-title"
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"nowrap"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h6" component="div"> Welcome to the New WCS Customer Portal! </Typography>
          
          <IconButton
          aria-label="close"
          onClick={() => handleClose(null, "close")}
        >
          <CloseIcon sx={{color:"white"}}/>
        </IconButton>
        </DialogTitle>
        {/* <IconButton
          aria-label="close"
          onClick={() => handleClose(null, "close")}
          
        >
          <CloseIcon />
        </IconButton> */}
        <DialogContent dividers>
          <Typography gutterBottom pt={1} pr={1} pl={1}>
            We’re pleased to introduce our <strong>newly enhanced portal</strong>, redesigned to make your experience faster, easier, and more efficient.
          </Typography>
          <br />
          <Typography gutterBottom pr={1} pl={1}>
            The updated platform features <strong>improved navigation, refined document-type selections, bulk-ordering capabilities, expanded service options,</strong> and a more seamless upload process.
          </Typography>
          <br/>
          <Typography gutterBottom pr={1} pl={1}>
           We invite you to explore the new layout and take advantage of these enhancements.
          </Typography>
          <br/>
          <Typography gutterBottom pr={1} pl={1}>
           If you have any questions or need assistance, please contact us <a href="wcs@wcss.com" style={{color:"#1868DB"}}>wcs@wcss.com</a>.
          </Typography>
          <br/>
          <Typography gutterBottom pb={1} pr={1} pl={1}>
            Thank you for your continued trust and partnership.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose(null, "close")}
            sx={{
              backgroundColor: "#b5001a",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              //   "&:hover": {
              //     backgroundColor: "#115293",
              //   },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </WelcomeMessage>
    </Fragment>
  );
}
