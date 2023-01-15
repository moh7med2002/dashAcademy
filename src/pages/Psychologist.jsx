import {Box,styled,Table,TableCell,TableBody,TableContainer,TableHead,TablePagination,TableRow, Button, Typography,Paper, Dialog, Tooltip}
from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPsychology from '../components/AddPsychology';
import { useSelector } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditPsychology from '../components/EditPsychology';

const columns = [
    { id: "code", label: "العنوان", minWidth: 100, align: "center" },
    { id: "code", label: "السعر", minWidth: 100, align: "center" },
    { id: "code", label: "المدة", minWidth: 100, align: "center" },
    {
        id: "density",
        label: "الإجراءات",
        minWidth: 170,
        align: "center",
        format: (value) => value.toFixed(2),
    },
    { id: "code", label: "الحذف", minWidth: 100, align: "center" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export default function Psychologist()
{
    const {token} = useSelector((state)=>state.admin)
    const navigate = useNavigate()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [psychologys,setPsychologys] = useState([])
    const [openAddPsycholoy,setOpenAddPsycholoy] = useState(false)
    const [openEditPsychology,setOpenEditPsychology] = useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>
    {
        async function getPsychologys()
        {
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/psycho/all`,{
                    headers:{
                        "Authorization":token
                    }
                })
                const data = await response.json()
                setPsychologys(data.psychos)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getPsychologys()
    },[])

    async function deletePsychology(id)
    {
        filterData(id)
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/psycho/${id}`,{
                method:"DELETE",
                headers:{
                    "Authorization":token
                }
            })
        }
        catch(err)
        {
            console.log(err)
        }
    }

    function filterData(id)
    {
        setPsychologys(back=>back.filter(item=>item.id!==id))
    }

    return(
        <Box>
            <Typography variant="h3" sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}>
            جلسات الأخصائي النفسي
            </Typography>
            <Button sx={{ marginBottom: "20px" }} color="success" variant="contained" onClick={()=>setOpenAddPsycholoy(true)}>
            + إضافة جلسة
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
                {psychologys?.length>0?
                    psychologys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'pq'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.title}</TableCell>
                        <TableCell align="center">{e.price}</TableCell>
                        <TableCell align="center">{e.duration}</TableCell>
                        <TableCell align="center">
                            <Tooltip title="مشاهدة" placement="top">
                                <Button onClick={()=>navigate(`/psychologist/${e.id}`)}><VisibilityIcon/></Button>
                            </Tooltip>
                            <Tooltip title="تعديل" placement="top">
                                <Button onClick={()=>setOpenEditPsychology(e.id)}><ModeEditIcon/></Button>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                            <Tooltip title="حذف">
                                <Button onClick={()=>deletePsychology(e.id)} color="error"><DeleteIcon/></Button>
                            </Tooltip>
                            <Dialog open={openEditPsychology===e.id} onClose={()=>setOpenEditPsychology(false)}>
                                <EditPsychology setOpenEdit={setOpenEditPsychology} item={e}/>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                    ))
                :
                <TableRow>
                    <TableCell colSpan={6}>لا يوجد جلسات متاحة</TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={psychologys?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
            <Dialog open={openAddPsycholoy} onClose={()=>setOpenAddPsycholoy(false)}>
                <AddPsychology setOpenAdd={setOpenAddPsycholoy}/>
            </Dialog>
        </Box>
    )
}