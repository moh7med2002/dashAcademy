import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {Box,Button,styled,Typography,} from "@mui/material";
import {  useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

    const columns = [
    { id: "name", label: "الرقم", minWidth: 170, align: "center" },
    { id: "code", label: "اسم الدرس", minWidth: 100, align: "center" },
    {
        id: "as",
        label: "رابط الدرس",
        minWidth: 170,
        align: "center",
    },
    {
        id: "population",
        label: "وصف الدرس",
        minWidth: 170,
        align: "center",
    },
    {
        id: "accept",
        label: "قبول",
        align: "center",
    },
    {
        id: "reject",
        label: "رفض",
        align: "center",
    }
    ];

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    }));

    const CheckLessons = () => {
    const {token} = useSelector((state)=>state.admin)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const navigate = useNavigate();
    const params = useParams();
    const [allLessons, setAllLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API}/api/lesson/unit/${params.UnitId}`,{
        headers:{
            "Authorization":token
        }
        })
        .then((res) => res.json())
        .then((data) => {
            setAllLessons(data.lessons.filter(lesson=>lesson.status===0));
            setLoading(false);
        });
    }, []);

    async function acceptLesson(id)
    {
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/lesson/accept/${id}`,{
                method:"PUT",
                headers:{
                    'Authorization': token
                }
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            filterLesson(id)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    async function rejectLesson(id)
    {
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/api/lesson/${id}`,{
                method:"DELETE",
                headers:{
                    'Authorization': token
                }
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            filterLesson(id)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    function filterLesson(id)
    {
        setAllLessons(back=>back.filter(lesson=>lesson.id!==id))
    }

    return (
        <div>
        <Typography
            variant="h3"
            sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
        >
            جدول قبول ورفض الدروس
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
            sx={{ marginBottom: "20px" }}
            variant="contained"
            onClick={() => navigate(-1)}
            >
            رجوع
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
                {allLessons
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'qw'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.id}</TableCell>
                        <TableCell align="center">{e.title}</TableCell>
                        <TableCell align="center">{e.videoUrl}</TableCell>
                        <TableCell align="center">{e.content}</TableCell>
                        <TableCell align="center">
                            <Button color="success" onClick={()=>acceptLesson(e.id)}><CheckIcon/></Button>
                        </TableCell>
                        <TableCell align="center">
                            <Button color="error" onClick={()=>rejectLesson(e.id)}><DeleteIcon/></Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={allLessons?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </div>
    );
};

export default CheckLessons;
