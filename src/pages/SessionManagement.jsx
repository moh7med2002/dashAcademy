import {Box,styled,Table,TableCell,TableBody,TableContainer,TableHead,TablePagination,TableRow, Typography,Paper, Button, Dialog}
from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CheckSession from '../components/CheckSession';

const columns = [
    { id: "code", label: "اسم الطالب", minWidth: 100, align: "center" },
    { id: "section", label: "تاريخ الطلب", minWidth: 150, align: "center" },
    { id: "section", label: "الوصف", minWidth: 150, align: "center" },
    { id: "section", label: "قبول", minWidth: 30, align: "center" },
    { id: "section", label: "رفض", minWidth: 30, align: "center" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export default function SessionManagement()
{
    const {id} = useParams()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sessions,setSessions] = useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const {token} = useSelector((state)=>state.admin)

    useEffect(()=>
    {
        async function getSessions()
        {
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/psycho/requested/${id}`,{
                    headers:{
                        "Authorization":token
                    }
                })
                const data = await response.json()
                setSessions(data.psychos)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getSessions()
    },[id])

    async function rejectSession(id)
    {
        filterSessions(id)
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/psycho/reject`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                    "Content-Type":'application/json'
                },
                body:JSON.stringify({requestPsycho:id})
            })
            const data = await response.json()
            console.log(data)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    function filterSessions(id)
    {
        setSessions(back=>back.filter(item=>item.id!==id))
    }

    const [openCheck,setOpenCheck] = useState(false)

    return(
        <Box>
            <Typography variant="h3" sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}>
            جدول قبول ورفض الجلسات
            </Typography>
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
                {sessions?.length>0?
                    sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'pq'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.Student.name}</TableCell>
                        <TableCell align="center">{e.createdAt.split('T')[0]}</TableCell>
                        <TableCell align="center">{e.description}</TableCell>
                        <TableCell align="center">
                            <Button color='success' onClick={()=>setOpenCheck(e.id)}><CheckIcon/></Button>
                        </TableCell>
                        <Dialog open={e.id===openCheck} onClose={()=>setOpenCheck(false)}>
                            <CheckSession filterSessions={filterSessions} id={e.id} token={token} setOpenCheck={setOpenCheck} open={openCheck}/>
                        </Dialog>
                        <TableCell align="center">
                            <Button color='error' onClick={()=>rejectSession(e.id)}><CloseIcon/></Button>
                        </TableCell>
                    </TableRow>
                    ))
                :
                <TableRow>
                    <TableCell colSpan={6}>لا يوجد طلب جلسات متاحة</TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={sessions?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </Box>
    )
}