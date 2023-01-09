import React, { useState } from 'react'
import { TextField, Typography,Button, Paper,Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import {successLogin} from '../redux/user'
import {useDispatch} from 'react-redux'

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [user,setUser] = useState({email:"",password:""})

    async function handleChange(e)
    {
        const {name,value} = e.target
        setUser(back=>
            {
                return {...back,[name]:value}
            })
    }

    async function handleLogin(e)
    {
        e.preventDefault()
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/admin/login`,{
                method:"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(user)
            })
            const data = await response.json()
            if(response.status!==200&response.status!==201)
            {
                throw new Error('failed occured')
            }
            dispatch(successLogin({token:data.token,user:data.Admin}))
            navigate('/')
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <>
        <Container>
            <form onSubmit={(e)=>handleLogin(e)}>
                <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",height:"90vh"}}>
                    <Paper sx={{width:{md:"500px",xs:"100%"},display:"flex",flexDirection:"column",alignItems:"center",padding:"30px"}}>
                        <Typography sx={{fontSize:"28px",fontWeight:"500",marginBottom:"20px"}}>تسجيل الدخول</Typography>
                        <TextField name="email" label="الايميل" onChange={(e)=>handleChange(e)}
                        sx={{width:"100%",marginBottom:"15px"}} required/>
                        <TextField name="password" label="كلمة المرور" onChange={(e)=>handleChange(e)} type="password"
                        sx={{width:"100%",marginBottom:"15px"}} required/>
                        <Button variant='contained' sx={{width:"100%"}} type="submit">تسجيل</Button>
                    </Paper>
                </Box>
            </form>
        </Container>
        </>
    )
}
