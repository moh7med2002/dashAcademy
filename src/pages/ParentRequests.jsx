import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {Button,styled,Typography,} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment'
import { useNavigate } from "react-router-dom";

const columns = [
    { id: "name", label: "اسم الأب", minWidth: 170, align: "center" },
    { id: "code", label: "اسم الطالب", minWidth: 100, align: "center" },
    { id: "date", label: "التاريخ", minWidth: 100, align: "center" },
    { id: "accept", label: "قبول", minWidth: 100, align: "center" },
    { id: "reject", label: "رفض", minWidth: 100, align: "center" }
    ];

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    }));

    const ParentRequests = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = useState(true);
    const [requests,setRequests] = useState([])

    const {token} = useSelector((state)=>state.admin)
    const navigate = useNavigate()

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>
    {
        async function getParentRequests()
        {
            setLoading(true)
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/admin/parent/request`,{
                    headers:{
                        "Authorization":token
                    }
                })
                const data = await response.json()
                setRequests(data.list)
                setLoading(false)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getParentRequests()
    },[])
    
    async function acceptRequest(id)
    {
        try{
            filterRequests(id)
            const response = await fetch(`${process.env.REACT_APP_API}/api/admin/parent/request/accept/${id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
            })
            const data = await response.json()
            console.log(data)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    async function rejectRequest(id)
    {
        try{
            filterRequests(id)
            const response = await fetch(`${process.env.REACT_APP_API}/api/admin/parent/request/reject/${id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
            })
            const data = await response.json()
            console.log(data)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    function filterRequests(id)
    {
        setRequests(back=>back.filter(item=>item.id.toString()!==id.toString()))
    }

    return (
        <div>
        <Typography
            variant="h3"
            sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
        >
            جدول طلبات الأب
        </Typography>
        <Button onClick={()=>navigate('/')} variant="contained" sx={{marginBottom:"20px",marginTop:"10px"}}>الطلبات المنتهية</Button>
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
                {requests
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'qw'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.Parent.name}</TableCell>
                        <TableCell align="center">{e.Student.name}</TableCell>
                        <TableCell align="center">{moment(e.createdAt).format("MMM Do YY")}</TableCell>
                        <TableCell align="center">
                            <Button color="success" onClick={()=>acceptRequest(e.id)}><CheckIcon/></Button>
                        </TableCell>
                        <TableCell align="center">
                            <Button color="error" onClick={()=>rejectRequest(e.id)}><CloseIcon/></Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={requests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </div>
    );
};

export default ParentRequests;
