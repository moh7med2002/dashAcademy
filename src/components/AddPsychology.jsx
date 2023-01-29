import React from 'react'
import {DialogTitle,DialogContent,TextField,FormControl,Select,InputLabel,Typography,MenuItem,Stack,DialogActions,Button,Box,styled} from '@mui/material'
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState } from 'react';
import { useEffect } from 'react';

const Image = styled("img")({width:"100%"})

export default function AddPsychology({setOpenAdd}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin)
    const [file,setFile] = useState('')

    const [teachers,setTeachers] = useState([])
    const [load,setLoad] = useState(false)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API}/api/teacher/all`,{
            headers:{
            "Authorization":token
        },
        })
        .then((res) => res.json())
        .then((data) => setTeachers(data.teachers));
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
                formData.append("duration", data.duration);

                fetch(`${process.env.REACT_APP_API}/api/psycho/create`, {
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
            <DialogTitle>إضافة جلسة</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"اسم الجلسة"}
                type="text"
                fullWidth
                variant="standard"
                required
                {...register("title")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"سعر الجلسة"}
                type="number"
                fullWidth
                variant="standard"
                required
                {...register("price")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"مدة الجلسة"}
                fullWidth
                type="number"
                required
                variant="standard"
                {...register("duration",{valueAsNumber:true,min:0})}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"وصف الجلسة"}
                type="text"
                multiline
                fullWidth
                variant="standard"
                {...register("description")}
                />
                <FormControl fullWidth sx={{ marginTop: "20px" }}>
                <InputLabel id="demo-simple-select-label">أخصائي الجلسة</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={"أخصائي الجلسة"}
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
                {file&&
                <Box sx={{height:"200px",overflow:"auto"}}>
                    <Image src={URL.createObjectURL(file)}/>
                </Box>}
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
