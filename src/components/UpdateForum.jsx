import React from "react";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
import {DialogTitle,DialogContent,TextField,FormControl,DialogActions,Button,Box} from '@mui/material'
// import { Box } from "@mui/material";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'

function UpdateForum(props) {
    // const { register, handleSubmit } = useForm();

  const [name,setName] = useState(props.forum.title)
  const {token} = useSelector((state)=>state.admin)
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  async function handleSubmit(e)
  {
      e.preventDefault()
      closeSnackbar()
      try{


          const response = await fetch(`${process.env.REACT_APP_API}/api/admin/forum/info`,{
              method:"PUT",
              headers:{
                  "Content-Type": "application/json",
                  "Authorization":token
              },
              body:JSON.stringify({
                  id:props.forum.id,
                  title:name,
              })
          })
          const data = await response.json();
          if(response.status!==200&&response.status!==201)
          {
              enqueueSnackbar(data.message,{variant:"error",autoHideDuration:"20000"})
              throw new Error('failed occured')
          }
          window.location.reload();
          props.handleCloseProfileDialog()
    
      }
      catch(err)
      {
          console.log(err)
      }
  }

  return (
      <form onSubmit={(e)=>handleSubmit(e)}>
          <Box sx={{width:"400px"}}>
              <DialogTitle>تعديل بيانات النادي </DialogTitle>
              <DialogContent>
                  <TextField
                  autoFocus
                  margin="dense"
                  label={"اسم النادي"}
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={(e)=>setName(e.target.value)}
                //   {...register("title")}
                  value={name}
                  required
                  />
                <FormControl fullWidth sx={{ marginTop: "20px" }}>
                </FormControl>
              </DialogContent>
              <DialogActions>
              <Button onClick={props.handleCloseProfileDialog}>إلغاء</Button>
              <Button  type="submit">موافق</Button>
              </DialogActions>
          </Box>
      </form>
  );
}

export default UpdateForum