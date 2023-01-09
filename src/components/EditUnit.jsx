import React from 'react'
import {DialogTitle,DialogContent,TextField,Button,DialogActions} from '@mui/material'
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

export default function EditUnit({unit,setOpenEdit}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin)

    return (
        <form
        onSubmit={handleSubmit((data) => {
            fetch(`${process.env.REACT_APP_API}/api/unit/${unit.id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                    "Authorization":token
                },
                body: JSON.stringify({
                title: data.editTitle,
                }),
            })
                .then((res) => res.json())
                .then((info) => {
                setOpenEdit(null)
                window.location.reload();
                })
                .catch((err) => {
                console.log(err);
                });
            })}
        >
            <DialogTitle>تعديل الوحدة</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"اسم الوحدة"}
                type="text"
                fullWidth
                variant="standard"
                defaultValue={unit.title}
                {...register("editTitle")}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenEdit(null)}>إلغاء</Button>
            <Button type="submit">
                موافق
            </Button>
            </DialogActions>
        </form>
    )
}
