import React from 'react'
import {Avatar, Typography,styled, Box, Button} from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import UpdatePassword from '../components/UpdatePassword'
import UpdateProfile from '../components/UpdateProfile'

export default function Student() {

    const Span = styled("Span")({fontSize:"18px",fontWeight:"500"})
    const [user,setUser] = useState({})
    const { token } = useSelector((state) => state.admin);
    const params = useParams()

    useEffect(()=>
    {
        async function getUser()
        {
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/admin/students/${params.studentId}`,{
                    headers:{
                        'Authorization': token,
                    }
                })
                const data = await response.json()
                setUser(data.student)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getUser()
    },[])

    const [openUpdatePassword,setOpenUpdatePassword] = useState(false)
    function handleClosePasswordDialog()
    {
        setOpenUpdatePassword(false)
    }

    const [openProfile,setOpenProfile] = useState(false)
    function handleCloseProfileDialog()
    {
        setOpenProfile(false)
    }

        return (
            <Box sx={{marginBottom:"30px"}}>
                <Avatar src={`${process.env.REACT_APP_API}/${user?.image}`} alt={user?.name} sx={{marginBottom:"10px",width:"120px",height:"120px",fontSize:"38px"}}/>
                <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>الاسم : <Span>{user?.name}</Span></Typography>
                <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>الايميل  : <Span>{user?.email}</Span></Typography>
                <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>الجنس  : <Span>{user?.gender==='male'?"ذكر":"أنثى"}</Span></Typography>
                <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>المرحلة الدراسية : <Span>{user?.Level?.title}</Span></Typography>
                <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>الصف الدراسي : <Span>{user?.Class?.title}</Span></Typography>
                {user?.Section&&
                <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"8px"}}>الشعبة الدراسية  : <Span>{user?.Section.title}</Span></Typography>}
                <Box sx={{marginTop:"20px",display:"flex",columnGap:"14px"}}>
                    <Button variant="contained" onClick={()=>setOpenUpdatePassword(true)}>تعديل كلمة المرور</Button>
                    <Dialog open={openUpdatePassword} onClose={handleClosePasswordDialog}>
                        <UpdatePassword studentId={user.id} openUpdatePassword={openUpdatePassword} handleClosePasswordDialog={handleClosePasswordDialog}/>
                    </Dialog>
                    <Button variant="contained" onClick={()=>setOpenProfile(true)}>تعديل البيانات الشخصية </Button>
                    <Dialog open={openProfile} onClose={handleCloseProfileDialog}>
                        <UpdateProfile student={user} openProfile={openProfile} handleCloseProfileDialog={handleCloseProfileDialog}/>
                    </Dialog>
                </Box>
            </Box>
        )
}
