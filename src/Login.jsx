import {Typography,TextField,Button, Box} from '@mui/material'
import {styled } from '@mui/system';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { successLogin } from '../../redux/userSilce';

const FormWrapper = styled('div')({
    width:"100%",
    minHeight:"100vh",
    display:"flex",
    alignItems:"center"
})
const FormAdd = styled('form')({
    width:"550px",
    maxWidth:"100%",
    margin:"0 auto",
    boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",
    padding:"20px 30px",
    borderRadius:"4px"
});


export default function Login() {

    const [username,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading]=useState(false);
    const {enqueueSnackbar , closeSnackbar}=useSnackbar();
    const dispatch=useDispatch();
    const navigate=useNavigate();


    const submitHandler=async(e)=>{
        e.preventDefault();
        closeSnackbar();
        if(!password || !username){
            enqueueSnackbar('الرجاء ادخال كلمة المرور و اسم المستخدم',{variant:"error"});
            return;
        }
        setLoading(true);
        try{
            const res=await fetch(`${process.env.REACT_APP_API }/api/auth/admin/login`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({username:username,password:password})
            });
            const data=await res.json();
            if(res.status!==200 && res.status!==201){
                const error=new Error('إسم مستخدم او كلمة المرور غير صحيح');
                error.message=data.message;
                throw error;
            }
            setLoading(false);
            enqueueSnackbar('تم تسجيل الدخول بنجاح',{variant:"success", autoHideDuration:1000});
            dispatch(successLogin({user:data.admin,token:data.token}));
            setTimeout(()=>{
                navigate('/dashboard');
            },1000);
        }
        catch(err){
            setLoading(false);
            enqueueSnackbar(err.message || "فشل تسجيل الدخول حاول مرة اخرى",{variant:"error"});
            console.log(err);
        }
    }
    return (
        <Box sx={{padding:"0 1rem"}}>
            <FormWrapper>
                <FormAdd onSubmit={e=>submitHandler(e)}>
                    <Typography compoennt="h2" sx={{fontSize:"32px",marginBottom:"16px",textAlign:"center"}}>تسجيل الدخول</Typography>
                    <TextField id="outlined-basic" type="text" label="اسم المستخدم" variant="outlined" sx={{marginY:"12px"}} fullWidth color="Black"
                    onChange={(e)=>setUserName(e.target.value)}/>
                    <TextField id="outlined-basic" type="password" label="كلمة المرور" variant="outlined" sx={{marginY:"12px"}} fullWidth 
                    color="Black" onChange={(e)=>setPassword(e.target.value)}/>
                    <Button type="submit" variant="contained" color="Black" fullWidth sx={{marginY:"12px", opacity:`${loading?"0.7":"1"}`}}>
                        {loading?"...تسجيل":"تسجيل"}
                    </Button>
                </FormAdd>
            </FormWrapper>
        </Box>
    )
}