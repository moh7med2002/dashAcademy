import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    styled,
    Typography,
    } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { ClipLoader } from "react-spinners";
import OpenQuestionDialog from "../components/OpenQuestionDialog";
import { useSelector } from "react-redux";
import EditQuestion from "../components/EditQuestion";

const columns = [
    { id: "Question", label: "السؤال", minWidth: 170, align: "center" },
    { id: "edit", label: "تعديل السؤال", minWidth: 100, align: "center" },
    { id: "Answer1", label: "الخيار الأول", minWidth: 100, align: "center" },
    { id: "Answer2", label: "الخيار الثاني", minWidth: 100, align: "center" },
    { id: "Answer3", label: "الخيار الثالث", minWidth: 100, align: "center" },
    { id: "Answer3", label: "الخيار الرابع", minWidth: 100, align: "center" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    }));

const Questions = () => {
    const {token} = useSelector((state)=>state.admin)
    const [openQuestion, setOpenQuestion] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [allQuestions, setAllQuestions] = useState([]);
    const [openEdit,setOpenEdit] = useState(null)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API}/api/exam/${params.examId}`,{
            headers:{
                "Authorization":token
            }
        })
        .then((res) => res.json())
        .then((data) => {
            setAllQuestions(data.questions);
            setLoading(false);
        });
    }, []);


    return (
        <div>
        <Typography
            variant="h3"
            sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
        >
            الأسئلة
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
            sx={{ marginBottom: "20px" }}
            color="success"
            variant="contained"
            onClick={() => setOpenQuestion(true)}
            >
            + إضافة سؤال
            </Button>
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
                {allQuestions
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i + "g"} hover role="checkbox" tabIndex={-1}>
                        <Dialog open={openEdit === e.id} onClose={()=>setOpenEdit(null)}>
                            <EditQuestion setOpenEdit={setOpenEdit} question={e}/>
                        </Dialog>
                        <TableCell align="center">{e.title}</TableCell>
                        <TableCell align="center">
                            <Button onClick={()=>setOpenEdit(e.id)}><EditIcon/></Button>
                        </TableCell>
                        {
                            e.answers?.map((answer,index)=>
                            {
                                return <TableCell align="center" key={index+answer.id} sx={{color:answer.isRight&&"red"}}>{answer.title}</TableCell>
                            })
                        }
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={allQuestions?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        <Dialog open={openQuestion} onClose={() => setOpenQuestion(false)}>
            <OpenQuestionDialog setOpenQuestion={setOpenQuestion} examId={params.examId}/>
        </Dialog>
    </div>
    );
};
export default Questions;