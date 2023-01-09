import { createTheme } from "@mui/material";

export const theme = createTheme({
  direction: 'rtl',
  palette:{
    primary: {
      main: '#18a0fb',
      contrastText: '#fff'
    },
    danger:{
      main: "#f44336"
    }
  }
});