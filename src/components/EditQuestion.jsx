import React from 'react'
import {DialogTitle,TextField,DialogContent,DialogActions,Button} from '@mui/material'
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

export default function EditQuestion({setOpenEdit,question}) {
    const { register, handleSubmit } = useForm();
    const {token} = useSelector((state)=>state.admin);
    return (
        <div>
            <form
            onSubmit={handleSubmit((data) => {
                fetch(`${process.env.REACT_APP_API}/api/exam/question/update/${question.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":token
                },
                body: JSON.stringify({
                    question: data.title,
                    answer1:data.answer1,
                    answer2:data.answer2,
                    answer3:data.answer3,
                    answer4:data.answer4,
                    answer1Id:question.answers[0]?.id,
                    answer2Id:question.answers[1]?.id,
                    answer3Id:question.answers[2]?.id,
                    answer4Id:question.answers[3]?.id,
                    rightAnswer:data.rightAnswer
                }),
                })
                .then((res) => res.json())
                .then((info) => {
                    setOpenEdit(false)
                    window.location.reload()
                })
                .catch((err) => {
                    console.log(err);
                });
            })}
            >
            <DialogTitle>تعديل السؤال</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"عنوان السؤال"}
                type="text"
                fullWidth
                variant="standard"
                defaultValue={question.title}
                {...register("title")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"الإجابة الأولى"}
                type="text"
                fullWidth
                defaultValue={question.answers[0]?.title}
                variant="standard"
                {...register("answer1")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"الإجابة الثانية"}
                type="text"
                fullWidth
                defaultValue={question.answers[1]?.title}
                variant="standard"
                {...register("answer2")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"الإجابة الثالثة"}
                type="text"
                fullWidth
                defaultValue={question.answers[2]?.title}
                variant="standard"
                {...register("answer3")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"الإجابة الرابعة"}
                type="text"
                fullWidth
                defaultValue={question.answers[3]?.title}
                variant="standard"
                {...register("answer4")}
                />
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"الإجابة الصحيحة"}
                type="text"
                fullWidth
                defaultValue={question.answers.findIndex(question=>question.isRight===true)+1}
                variant="standard"
                {...register("rightAnswer")}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenEdit(false)}>إلغاء</Button>
                <Button type="submit">
                موافق
                </Button>
            </DialogActions>
            </form>
        </div>
    )
}