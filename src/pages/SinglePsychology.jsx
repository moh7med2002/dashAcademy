import { Box, Typography ,styled } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Image = styled("img")({
    borderRadius:"10px",
    height:"320px",
    width:"100%",
})

export default function SinglePsychology() {
    const {id} = useParams()
    const [psychology,setPsychology] = useState(null)
    const {token} = useSelector((state)=>state.admin)

    useEffect(()=>
    {
        async function getPsychology()
        {
            try{
                    const response = await fetch(`${process.env.REACT_APP_API}/api/psycho/${id}`,{
                        headers:{
                            "Authorization":token
                        }
                    })
                    const data = await response.json()
                    setPsychology(data.psycho)
                }
                catch(err)
                {
                    console.log(err)
            }
        }
        getPsychology()
    },[id])

    return (
        <>
        {
            psychology&&
            <Box sx={{width:"500px",maxWidth:"100%"}}>
                <Image src={`${process.env.REACT_APP_API}/images/${psychology.image}`}/>
                <Box sx={{marginTop:"10px"}}>
                    <Typography sx={{fontSize:"22px",fontWeight:"500",marginBottom:"15px"}}>{psychology.title}</Typography>
                    <Box sx={{display:"flex",justifyContent:"space-between"}}>
                        <Typography sx={{fontSize:"15px",fontWeight:"500"}}>السعر : {psychology.price} دج</Typography>
                        <Typography sx={{fontSize:"15px",fontWeight:"500"}}>المدة : {psychology.duration} دقائق</Typography>
                    </Box>
                    <Typography sx={{fontSize:"15px",fontWeight:"500",marginTop:"10px"}}>المعلم : {psychology.Teacher.name}</Typography>
                    <Typography sx={{fontSize:"14px",marginTop:"20px",textAlign:"justify",textJustify:"inter-word"}}>{psychology.description}</Typography>
                </Box>
            </Box>
        }
        </>
    )
}
