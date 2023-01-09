import React from 'react'
import {DialogTitle,DialogContent,TextField,Button,DialogActions} from '@mui/material'
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

export default function EditLesson({editLesson,setOpenEdit}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin)
    return (
        <form
            onSubmit={handleSubmit((data) => {
                fetch(`${process.env.REACT_APP_API}/api/lesson/${editLesson.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":token
                },
                body: JSON.stringify({
                    title: data.editName,
                    videoUrl: data.editUrl,
                    content: data.editDescribe,
                }),
                })
                .then((res) => res.json())
                .then((info) => {
                    setOpenEdit(false)
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
            })}
            >
            <DialogTitle>تعديل الدرس</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"اسم الدرس"}
                type="text"
                fullWidth
                defaultValue={editLesson.title}
                variant="standard"
                {...register("editName")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"رابط الدرس"}
                type="text"
                fullWidth
                defaultValue={editLesson.videoUrl}
                variant="standard"
                {...register("editUrl")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"وصف الدرس"}
                type="text"
                fullWidth
                defaultValue={editLesson.content}
                variant="standard"
                {...register("editDescribe")}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenEdit(false)}>إلغاء</Button>
                <Button type="submit">
                موافق
                </Button>
            </DialogActions>
        </form>
    )
}
