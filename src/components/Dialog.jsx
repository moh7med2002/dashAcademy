import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog(props) {
  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          {props.inputs?.map((e, i) => (
            <TextField
              key={i}
              autoFocus
              margin="dense"
              id="name"
              label={e}
              type="text"
              fullWidth
              variant="standard"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>إلغاء</Button>
          <Button onClick={props.handleClose}>موافق</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
