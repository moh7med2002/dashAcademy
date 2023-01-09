import React from 'react'
import {DialogTitle,DialogContent,TextField,DialogActions,Button, Typography} from '@mui/material'
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from 'react';

export default function AddGroupLesson({setOpenAdd,GroupId}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin)
    const [load,setLoad] = useState(false)

    return (
        <div>
            <form
            onSubmit={handleSubmit((data) => {
                setLoad(true)
                fetch(`${process.env.REACT_APP_API}/api/group/lesson/create`, {
                method: "POST",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title:data.title,day:data.day,meetLink:data.meetLink,startTime:data.startTime,
                    EndTime:data.EndTime,GroupId:GroupId})
                })
                .then((res) => res.json())
                .then((info) => {
                    window.location.reload();
                    setOpenAdd(false);
                    setLoad(false)
                })
                .catch((err) => {
                    console.log(err);
                });
            })}
            >
            <DialogTitle>إضافة درس</DialogTitle>
            <DialogContent sx={{width:"500px"}}>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"اسم الدرس"}
                type="text"
                fullWidth
                variant="standard"
                {...register("title")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"رابط لقاء الزوم"}
                type="text"
                fullWidth
                variant="standard"
                {...register("meetLink")}
                />
                <Typography sx={{marginTop:"24px",fontSize:"15px"}}>يوم الدرس</Typography>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                fullWidth
                type="date"
                variant="standard"
                {...register("day")}
                />
                <Typography sx={{marginTop:"24px",fontSize:"15px"}}>موعد البداية</Typography>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                type="time"
                fullWidth
                variant="standard"
                {...register("startTime")}
                />
                <Typography sx={{marginTop:"24px",fontSize:"15px"}}>موعد النهاية</Typography>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                type="time"
                fullWidth
                variant="standard"
                {...register("EndTime")}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenAdd(false)}>إلغاء</Button>
                {!load?
                <Button type="submit">
                موافق
                </Button>
                :
                <Button>يتم الإنشاء ...</Button>}
            </DialogActions>
            </form>
        </div>
    )
}