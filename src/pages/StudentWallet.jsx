import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useState } from 'react';
import { Box,styled,Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Image = styled("img")({})
const Text = styled("h3")({})

export default function StudentWallet() {
    const params = useParams()
    const {token} = useSelector((state)=>state.admin)
    const [wallet,setWallet] = useState({})
    const [load,setLoad] = useState(false)
    const navig = useNavigate()

    useEffect(()=>
    {
        async function getWallets()
        {
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/wallet/admin/wallets/${params.id}`,{
                    headers:{
                        "Authorization":token
                    }
                })
                if(response.status!==200&&response.status!==201)
                {
                    throw new Error('failed occured')
                }
                const data = await response.json()
                setWallet(data.wallet)
                setLoad(true)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getWallets()
    },[])

    async function acceptWallet()
    {
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/wallet/admin/accept/${wallet?.id}`,{
                method:"POST",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            navig('/wallets')
        }
        catch(err)
        {
            console.log(err)
        }
    }

    async function rejectWallet()
    {
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/wallet/admin/reject/${wallet?.id}`,{
                method:"POST",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            navig('/wallets')
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <>
            {load&&
            <Box>
                <Image src={`${process.env.REACT_APP_API}/images/${wallet.image}`} sx={{width:"500px",maxWidth:"100%",height:"350px"}}/>
                <Text sx={{marginTop:"15px",fontSize:"18px"}}>اسم الطالب : {wallet.Student.name}</Text>
                <Text sx={{fontSize:"18px"}}>المبلغ المدخل : {wallet.money}د.ج</Text>
                <Button variant="contained" color="success" sx={{marginRight:"10px"}} onClick={()=>acceptWallet()}>قبول</Button>
                <Button variant="contained" color="error" onClick={()=>rejectWallet()}>رفض</Button>
            </Box>
            }
        </>
    )
}
