import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import { useState } from "react";
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'

export default function UpdatePassword(props) {
    const {enqueueSnackbar} = useSnackbar()
    const [password,setPassword] = useState("")
    const {token} = useSelector((state)=>state.admin)
    async function handleSubmit(e)
    {
        e.preventDefault()
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/admin/student/password`,{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":token
                },
                body:JSON.stringify({
                    id:props.studentId,
                    password:password
                })
            })
            const data = await response.json()
            enqueueSnackbar(data.message,{variant:"success",autoHideDuration:"2000"})
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <Box sx={{width:"300px"}}>
                <DialogTitle>تعديل كلمة المرور</DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={"كلمة المرور الجديدة"}
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={props.handleClosePasswordDialog}>إلغاء</Button>
                <Button onClick={props.handleClosePasswordDialog} type="submit">موافق</Button>
                </DialogActions>
            </Box>
        </form>
    );
}
