import {Box,styled,Table,TableCell,TableBody,TableContainer,TableHead,TablePagination,TableRow, Button, Typography,Paper, Dialog}
from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const columns = [
    { id: "code1", label: "اسم الطالب", minWidth: 100, align: "center" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export default function GroupStudents()
{
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [students,setStudents] = useState([])
    const params = useParams()

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
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/group/one/${params.id}`)
                const data = await response.json()
                setStudents(data.groupe.Students)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getStudents()
    },[])


    return(
        <Box>
            <Typography variant="h3" sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}>
            الطلاب المسجلين
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
                {students?.length>0?
                    students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'pq'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.name}</TableCell>
                    </TableRow>
                    ))
                :
                <TableRow>
                    <TableCell colSpan={6}>لا يوجد طلاب مسجلين بالمجموعة</TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={students?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </Box>
    )
}