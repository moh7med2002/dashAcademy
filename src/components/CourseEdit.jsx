import React from 'react'
import {DialogTitle,DialogContent,TextField,Button,DialogActions,FormControl,InputLabel,Select,MenuItem} from '@mui/material'
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

export default function CourseEdit({editCourse,teachers,setOpenEdit}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin)
    return (
        <form
            onSubmit={handleSubmit((data) => {
                fetch(`${process.env.REACT_APP_API}/api/course/${editCourse.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":token
                },
                body: JSON.stringify({
                    title: data.editTitle,
                    goals: data.editGoals,
                    TeacherId: data.editTeacher,
                    price: data.editPrice,
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
            <DialogTitle>تعديل دورة</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"اسم الدورة"}
                type="text"
                fullWidth
                defaultValue={editCourse.title}
                variant="standard"
                {...register("editTitle")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"هدف الدورة"}
                type="text"
                fullWidth
                defaultValue={editCourse.goals}
                variant="standard"
                {...register("editGoals")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"سعر الدورة"}
                type="number"
                fullWidth
                defaultValue={+editCourse.price}
                variant="standard"
                {...register("editPrice")}
                />
                <FormControl fullWidth sx={{ marginTop: "20px" }}>
                <InputLabel id="demo-simple-select-label">معلم الدورة</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={"معلم الدورة"}
                    defaultValue={editCourse.TeacherId}
                    {...register("editTeacher")}
                >
                    {teachers?.map((e, i) => (
                    <MenuItem key={e.id} value={e.id}>
                        {e.name}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
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