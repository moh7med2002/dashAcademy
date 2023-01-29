import React from 'react'
import {DialogTitle,DialogContent,TextField,DialogActions,Button, Box} from '@mui/material'
import { useSelector } from "react-redux";
import { useForm  , Controller} from "react-hook-form";
import { useState } from 'react';

export default function EditPsychology({setOpenEdit,item}) {
    const { handleSubmit  , control} = useForm({
        defaultValues:{
            title:item.title,
            price:item.price,
            description:item.description,
            duration:item.duration
        }
    });
    const {token} = useSelector((state)=>state.admin)
    const [load,setLoad] = useState(false)

    return (
        <div>
            <form
            onSubmit={handleSubmit((data) => {
                setLoad(true)
                fetch(`${process.env.REACT_APP_API}/api/psycho/${item.id}`, {
                method: "PUT",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title:data.title,price:data.price,description:data.description,duration:data.duration})
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
            <DialogTitle>تعديل الجلسة</DialogTitle>
            <DialogContent sx={{width:"500px"}}>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="title"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="الاسم" fullWidth variant="standard" />}
            />
            </Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="price"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="السعر" fullWidth variant="standard" />}
            />
            </Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="duration"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField {...field} label="المدة" fullWidth variant="standard" type={"number"}/>}
            /></Box>
            <Box sx={{marginBottom:"15px"}}>
            <Controller
                name="description"
                control={control}
                rules={{required:true}}
                render={({ field }) => <TextField multiline {...field} label="وصف المجموعة" fullWidth variant="standard" />}
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
