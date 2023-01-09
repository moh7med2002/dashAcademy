import {Box,styled,Table,TableCell,TableBody,TableContainer,TableHead,TablePagination,TableRow, Button, Typography,Paper, Dialog}
from '@mui/material'
import { useState } from 'react';
import AddGroup from '../components/AddGroup';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: "code", label: "اسم المجموعة", minWidth: 100, align: "center" },
    { id: "code", label: "سعر المجموعة", minWidth: 100, align: "center" },
    {
        id: "size",
        label: "المرحلة الدراسية",
        minWidth: 170,
        align: "center",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "asd",
        label: "السنة الدراسية",
        minWidth: 170,
        align: "center",
        format: (value) => value.toFixed(2),
    },
    { id: "section", label: "الشعبة الدراسية", minWidth: 150, align: "center" },
    {
        id: "density",
        label: "الإجراءات",
        minWidth: 170,
        align: "center",
        format: (value) => value.toFixed(2),
    },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export default function Groups()
{
    const navigate = useNavigate()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [groups,setGroups] = useState([])
    const [openAddGroup,setOpenAddGroup] = useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>
    {
        async function getGroups()
        {
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/group/all`)
                const data = await response.json()
                setGroups(data.groupes)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getGroups()
    },[])

    return(
        <Box>
            <Typography variant="h3" sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}>
            المجموعات
            </Typography>
            <Button sx={{ marginBottom: "20px" }} color="success" variant="contained" onClick={()=>setOpenAddGroup(true)}>
            + إضافة مجموعة
            </Button>
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
                {groups?.length>0?
                    groups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'pq'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.title}</TableCell>
                        <TableCell align="center">{e.price}</TableCell>
                        <TableCell align="center">{e.Level.title}</TableCell>
                        <TableCell align="center">{e.Class.title}</TableCell>
                        <TableCell align="center">{e.Section?.title||''}</TableCell>
                        <TableCell align="center">
                            <Button onClick={()=>navigate(`/groups/${e.id}`)}>مشاهدة</Button>
                        </TableCell>
                    </TableRow>
                    ))
                :
                <TableRow>
                    <TableCell colSpan={6}>لا يوجد مجموعات متاحة</TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={groups?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
            <Dialog open={openAddGroup} onClose={()=>setOpenAddGroup(false)}>
                <AddGroup setOpenAdd={setOpenAddGroup}/>
            </Dialog>
        </Box>
    )
}