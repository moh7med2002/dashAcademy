import React from 'react'
import {DialogTitle,DialogContent,TextField,FormControl,Select,InputLabel,Typography,MenuItem,Stack,DialogActions,Button,Box} from '@mui/material'
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState } from 'react';
import { useEffect } from 'react';

export default function AddGroup({setOpenAdd}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin)
    const [file,setFile] = useState('')

    const [teachers,setTeachers] = useState([])
    const [subjects,setSubjects] = useState([])
    const [load,setLoad] = useState(false)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API}/api/teacher/all`,{
            headers:{
            "Authorization":token
        },
        })
        .then((res) => res.json())
        .then((data) => setTeachers(data.teachers));
    
        fetch(`${process.env.REACT_APP_API}/api/subject/all`,{
            headers:{
            "Authorization":token
        }
        })
        .then((res) => res.json())
        .then((data) => setSubjects(data.subjects));
    
        fetch(`${process.env.REACT_APP_API}/api/course/all`,
        {
        headers:{
            "Authorization":token
        }
        })
    }, []);

    return (
        <div>
            <form
            onSubmit={handleSubmit((data) => {
                setLoad(true)
                const formData = new FormData();
                formData.append("title", data.title);
                formData.append("image", file);
                formData.append("price", parseInt(data.price));
                formData.append("description",data.description);
                formData.append("TeacherId", data.TeacherId);
                formData.append("SubjectId", data.SubjectId);
                formData.append("goals", data.goals);
                formData.append("allowedStudents", data.students);

                fetch(`${process.env.REACT_APP_API}/api/group/create`, {
                method: "POST",
                body: formData,
                headers:{
                    "Authorization":token
                }
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
            <DialogTitle>إضافة مجموعة</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"اسم المجموعة"}
                type="text"
                fullWidth
                variant="standard"
                {...register("title")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"هدف المجموعة"}
                type="text"
                fullWidth
                variant="standard"
                {...register("goals")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"سعر المجموعة"}
                fullWidth
                type="number"
                variant="standard"
                {...register("price",{valueAsNumber:true,min:0})}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"وصف المجموعة"}
                type="text"
                fullWidth
                variant="standard"
                {...register("description")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"عدد الطلاب المسموحين"}
                type="number"
                fullWidth
                variant="standard"
                {...register("students")}
                />
                <FormControl fullWidth sx={{ marginTop: "20px" }}>
                <InputLabel id="demo-simple-select-label">اسم المادة</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={"اسم المادة"}
                    {...register("SubjectId")}
                >
                    {subjects?.map((e, i) => (
                    <MenuItem key={e.id} value={e.id}>
                        {e.title}({e.Level.title})({e.Class.title})({e.Section?.title||''})
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: "20px" }}>
                <InputLabel id="demo-simple-select-label">معلم الدورة</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={"معلم الدورة"}
                    {...register("TeacherId")}
                >
                    {teachers?.map((e, i) => (
                    <MenuItem key={e.id} value={e.id}>
                        {e.name}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
                <Box sx={{ marginTop: "20px" }}>
                <label>
                    <Stack direction="row" spacing={2}>
                    <AddPhotoAlternateIcon
                        sx={{ color: "#18a0fb", fontSize: "30px" }}
                    />
                    <Typography variant="p" sx={{ padding: "5px" }}>
                        إضافة صورة
                    </Typography>
                    <input
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ display: "none" }}
                        type={"file"}
                    />
                    </Stack>
                </label>
                </Box>
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
