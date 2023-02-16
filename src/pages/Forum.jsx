import React from 'react'
import {Avatar, Typography,styled, Box, Button} from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import UpdateForum from '../components/UpdateForum'
import { useNavigate } from 'react-router-dom'

function Forum() {
  const Span = styled("Span")({fontSize:"18px",fontWeight:"500"})
  const [forum,setForum] = useState({})
  const { token } = useSelector((state) => state.admin);
  const params = useParams()
const navigate = useNavigate();
  useEffect(()=>
  {
      async function getUser()
      {
          try{
              const response = await fetch(`${process.env.REACT_APP_API}/api/admin/forums/${params.forumId}`,{
                  headers:{
                      'Authorization': token,
                  }
              })
              const data = await response.json()
              console.log(data)
              setForum(data.forum)
          }
          catch(err)
          {
              console.log(err)
          }
      }
      getUser()
  },[])

  
  const [openProfile,setOpenProfile] = useState(false)
  function handleCloseProfileDialog()
  {
      setOpenProfile(false)
  }

  async function deleteForum(){
    try{
        const response = await fetch(`${process.env.REACT_APP_API}/api/forum/${params.forumId}`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
                "Authorization":token
            }
        })
        const data = await response.json()
        console.log(data)
        // window.location.reload();
        navigate('/forums')
    }
    catch(err)
    {
        console.log(err)
    }
  }

      return (
          <Box sx={{marginBottom:"30px"}}>
              <Avatar src={`${process.env.REACT_APP_API}/${forum?.image}`} alt={forum?.title} sx={{marginBottom:"10px",width:"120px",height:"120px",fontSize:"38px"}}/>
              <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>اسم النادي: <Span>{forum?.title}</Span></Typography>
              <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>المادة : <Span>{forum?.Subject?.title}</Span></Typography>
              <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>اسم المعلم: <Span>{forum?.Teacher?.name}</Span></Typography>
              <Typography sx={{fontSize:"18px",fontWeight:"600",marginBottom:"12px"}}>عدد الطلاب : <Span>{forum?.Students?.length}</Span></Typography>
              <Box sx={{marginTop:"20px",display:"flex",columnGap:"14px"}}>
                  <Button variant="contained" onClick={()=>setOpenProfile(true)}>تعديل معلومات النادي </Button>
                  <Dialog open={openProfile} onClose={handleCloseProfileDialog}>
                      <UpdateForum forum={forum} openProfile={openProfile} handleCloseProfileDialog={handleCloseProfileDialog}/>
                  </Dialog>
                  <Button variant="contained" onClick={()=>deleteForum()}>حذف النادي</Button>
              </Box>
          </Box>
      )
}

export default Forum