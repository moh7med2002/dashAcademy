import React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, InputLabel, TextField } from "@mui/material";
import { useState } from "react";

export default function CheckSession({setOpenCheck,acceptSession,filterSessions,id,token}) {

    const [session,setSession] = useState({startDate:null,startTime:null,meetLink:null})

    function handleChange(e)
    {
        const {value,name} = e.target
        setSession(back=>
            {
                return {...back,[name]:value}
            })
    }

    async function acceptSession()
    {
        filterSessions(id)
        setOpenCheck(false)
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/psycho/accept`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                    "Content-Type":'application/json'
                },
                body:JSON.stringify({requestPsycho:id,startTime:session.startTime,startDate:session.startDate,meetLink:session.meetLink})
            })
            const data = await response.json()
            console.log(data)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <Box sx={{width:"450px",maxWidth:"100%"}}>
            <DialogTitle sx={{marginBottom:"10px"}}>قبول الجلسة</DialogTitle>
                <DialogContent>
                    <InputLabel sx={{marginBottom:"10px",fontSize:"14px"}}>التاريخ</InputLabel>
                    <TextField fullWidth type="date" name="startDate" onChange={(e)=>handleChange(e)}/>
                    <InputLabel sx={{marginBottom:"10px",fontSize:"14px",marginTop:"15px"}}>الساعة</InputLabel>
                    <TextField fullWidth type="time" onChange={(e)=>handleChange(e)} name="startTime"/>
                    <InputLabel sx={{marginBottom:"10px",fontSize:"14px",marginTop:"15px"}}>رابط الزوم</InputLabel>
                    <TextField fullWidth type="text" onChange={(e)=>handleChange(e)} name="meetLink"/>
                </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpenCheck(false)}>إلغاء</Button>
                <Button onClick={acceptSession}>موافق</Button>
            </DialogActions>
        </Box>
    );
}
