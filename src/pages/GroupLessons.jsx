import {Box,styled,Table,TableCell,TableBody,TableContainer,TableHead,TablePagination,TableRow, Button, Typography,Paper, Dialog}
from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddGroupLesson from '../components/AddGroupLesson';
import EditLessonGroup from '../components/EditLessonGroup';

const columns = [
    { id: "code1", label: "اسم الدرس", minWidth: 100, align: "center" },
    { id: "code2", label: "رابط الدرس", minWidth: 100, align: "center" },
    { id: "code3", label: "موعد الدرس", minWidth: 100, align: "center" },
    { id: "code4", label: "وقت البداية", minWidth: 100, align: "center" },
    { id: "code5", label: "وقت النهاية", minWidth: 100, align: "center" },
    { id: "code5", label: "تعديل الدرس", minWidth: 100, align: "center" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export default function GroupLessons()
{
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [lessons,setLessons] = useState([])
    const [openAddLesson,setOpenAddLesson] = useState(false)
    const params = useParams()
    const [editLesson,setEditLesson] = useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>
    {
        async function getLessons()
        {
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/group/lessons/${params.id}`)
                const data = await response.json()
                setLessons(data.lessons)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getLessons()
    },[])

    return(
        <Box>
            <Typography variant="h3" sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}>
            الدروس
            </Typography>
            <Button sx={{ marginBottom: "20px" }} color="success" variant="contained" onClick={()=>setOpenAddLesson(true)}>
            + إضافة درس
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
                {lessons?.length>0?
                    lessons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'pq'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.title}</TableCell>
                        <TableCell align="center">{e.meetLink}</TableCell>
                        <TableCell align="center">{e.day.split('T')[0]}</TableCell>
                        <TableCell align="center">{e.startTime}</TableCell>
                        <TableCell align="center">{e.EndTime}</TableCell>
                        <TableCell align="center">
                            <Button onClick={()=>setEditLesson(e.id)}>تعديل الدرس</Button>
                        </TableCell>
                        <Dialog open={editLesson===e.id} onClose={()=>setEditLesson(false)}>
                            <EditLessonGroup lesson={e} setOpenEdit={setEditLesson}/>
                        </Dialog>
                    </TableRow>
                    ))
                :
                <TableRow>
                    <TableCell colSpan={6}>لا يوجد دروس متاحة</TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={lessons?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
            <Dialog open={openAddLesson} onClose={()=>setOpenAddLesson(false)}>
                <AddGroupLesson setOpenAdd={setOpenAddLesson} GroupId={params.id}/>
            </Dialog>
        </Box>
    )
}