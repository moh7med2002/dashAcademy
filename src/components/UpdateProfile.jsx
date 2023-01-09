import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'

export default function UpdateProfile(props) {
    const [name,setName] = useState(props.student.name)
    const [email,setEmail] = useState(props.student.email)
    const {token} = useSelector((state)=>state.admin)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    async function handleSubmit(e)
    {
        e.preventDefault()
        closeSnackbar()
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/admin/student/info`,{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":token
                },
                body:JSON.stringify({
                    id:props.student.id,
                    name:name,
                    email:email
                })
            })
            const data = await response.json();
            if(response.status!==200&&response.status!==201)
            {
                enqueueSnackbar(data.message,{variant:"error",autoHideDuration:"20000"})
                throw new Error('failed occured')
            }
            window.location.reload();
            props.handleCloseProfileDialog()
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <Box sx={{width:"400px"}}>
                <DialogTitle>تعديل بيانات الطالب </DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    margin="dense"
                    label={"اسم الطالب"}
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    required
                    />
                    <TextField
                    autoFocus
                    margin="dense"
                    label={"الايميل"}
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                    required
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={props.handleCloseProfileDialog}>إلغاء</Button>
                <Button  type="submit">موافق</Button>
                </DialogActions>
            </Box>
        </form>
    );
}
