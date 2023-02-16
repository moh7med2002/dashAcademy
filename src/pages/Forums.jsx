import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {Box,Button,Dialog,styled,Typography,
} from "@mui/material";
import {Link} from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddForum from "../components/AddForum";

const columns = [
    { id: "name", label: "اسم النادي", minWidth: 120, align: "center" },
    { id: "code", label: "المادة ", minWidth: 100, align: "center" },
    { id: "level", label: "اسم المعلم", minWidth: 150, align: "center" },
    { id: "profile", label: "صفحة النادي", minWidth: 150, align: "center" }


    ];

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    }));
function Forums() {
  const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = useState(true);
    const [forums,setForums] = useState([])
    const [openAddForum,setOpenAddForum] = useState(false)
    
    const {token} = useSelector((state)=>state.admin)
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    useEffect(()=>
    {
        async function getStudents()
        {
            setLoading(true)
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/admin/forums/all`,{
                    headers:{
                        "Authorization":token
                    }
                })
                const data = await response.json()
                console.log('data: aaaaaaaaaaaaaaaaaaa', data.forums);
                setForums(data.forums)
                setLoading(false)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getStudents()
    },[])

    return (
        <div>
        <Typography
            variant="h3"
            sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
        >
        النوادي
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
            sx={{ marginBottom: "20px" }}
            variant="contained"
            onClick={()=>setOpenAddForum(true)}
            >
            إضافة نادي
            </Button>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>
                    {columns.map((column) => (
                    <StyledTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                    >
                        {column.label}
                    </StyledTableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                <ClipLoader
                    color={"#18a0fb"}
                    loading={loading}
                    size={80}
                    cssOverride={{
                    display: "block",
                    marginInline: "auto",
                    borderWidth: "5px",
                    }}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                {forums
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'qw'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.title}</TableCell>
                        <TableCell align="center">{e.subject}</TableCell>
                        <TableCell align="center">{e.Teacher.name}</TableCell>
                        <TableCell align="center">
                            <Link to={`/forums/view/${e.id}`}>
                                <Button>
                                    <VisibilityIcon/>
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={forums?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        <Dialog open={openAddForum} onClose={()=>setOpenAddForum(false)}>
                <AddForum setOpenAdd={setOpenAddForum}/>
            </Dialog>
        </div>
    );
}

export default Forums