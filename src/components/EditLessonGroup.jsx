import React from 'react'
import {DialogTitle,DialogContent,TextField,FormControl,Select,InputLabel,MenuItem,DialogActions,Button, Box} from '@mui/material'
import { useSelector } from "react-redux";
import { useForm  , Controller} from "react-hook-form";
import { useState } from 'react';

export default function EditLessonGroup({setOpenEdit,lesson}) {
    const { handleSubmit  , control} = useForm({
        defaultValues:{
            title:lesson.title,
            day:lesson.day,
            startTime:lesson.startTime,
            EndTime :lesson.EndTime ,
            meetLink :lesson.meetLink,
        }
    });
    const {token} = useSelector((state)=>state.admin)

    const [load,setLoad] = useState(false)

    return (
        <div>
            <form
            onSubmit={handleSubmit((data) => {
                setLoad(true)
                fetch(`${process.env.REACT_APP_API}/api/group/lesson/update/${lesson.id}`, {
                method: "PUT",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title:data.title,day:data.day,startTime:data.startTime,EndTime :data.EndTime,meetLink:data.meetLink})
                })
                .then((res) => res.json())
                .then((info) => {
                    window.location.reload();
                    setOpenEdit(false);
                    setLoad(false)
                })
                .catch((err) => {
                    console.log(err);
                });
            })}
            >
            <DialogTitle>إضافة مجموعة</DialogTitle>
            <DialogContent sx={{width:"500px"}}>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="title"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="اسم الدرس" fullWidth variant="standard" />}
            />
            </Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="meetLink"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="موعد بداية اللقاء" fullWidth variant="standard" />}
            />
            </Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="day"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="يوم الدرس" fullWidth variant="standard" type={"date"}/>}
            /></Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="startTime"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="موعد البداية" fullWidth variant="standard" type={"time"}/>}
            /></Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="EndTime"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="موعد النهاية" fullWidth variant="standard" type={"time"} />}
            /></Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenEdit(false)}>إلغاء</Button>
                {!load?
                <Button type="submit">
                موافق
                </Button>
                :
                <Button>يتم التعديل ...</Button>}
            </DialogActions>
            </form>
        </div>
    )
}
