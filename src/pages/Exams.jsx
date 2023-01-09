import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import { Link, useNavigate, useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import EditExamDialog from "../components/EditExamDialog";

const columns = [
  { id: "name", label: "الرقم", minWidth: 170, align: "center" },
  { id: "code", label: "اسم الاختبار", minWidth: 100, align: "center" },
  { id: "duration", label: "مدة الاختبار بالدقائق", minWidth: 100, align: "center" },
  { id: "number", label: "عدد الأسئلة", minWidth: 100, align: "center" },
  {
    id: "density",
    label: "الاجراءات",
    minWidth: 170,
    align: "center",
    format: (value) => value.toFixed(2),
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const Exams = () => {
  const {token} = useSelector((state)=>state.admin)
  const [openExam, setOpenExam] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openEdit, setOpenEdit] = React.useState(false);
  const { register, handleSubmit } = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allExams, setAllExams] = useState([]);
  const [ExamEdit,setExamEdit] = useState({})

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/api/unit/exams/${params.unitId}`,{
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => {
        setAllExams(data.exams);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Typography
        variant="h3"
        sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
      >
        الاختبارات
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          sx={{ marginBottom: "20px" }}
          color="success"
          variant="contained"
          onClick={() => setOpenExam(true)}
        >
          + إضافة اختبار
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
              {allExams
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, i) => (
                  <TableRow key={i + "g"} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="center">{e.id}</TableCell>
                    <TableCell align="center">{e.title}</TableCell>
                    <TableCell align="center">{e.duration}</TableCell>
                    <TableCell align="center">{e.questionsNumber}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={"تعديل الاختبار"} placement="bottom">
                        <Button
                          onClick={() => {
                            setExamEdit(e)
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title={"الانتقال الى أسئلة الاختبار"}
                        placement="bottom"
                      >
                        <Link to={`/courses/${params.CourseId}/unit/${params.unitId}/exams/${e.id}/questions`}>
                          <Button>
                            <ReplyIcon />
                          </Button>
                        </Link>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={allExams?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={openExam} onClose={() => setOpenExam(false)}>
        <form
          onSubmit={handleSubmit((data) => {
            fetch(`${process.env.REACT_APP_API}/api/exam/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization":token
              },
              body: JSON.stringify({
                title: data.title,
                duration: data.duration,
                questionsNumber: data.numberOfQuestions,
                UnitId:params.unitId
              }),
            })
              .then((res) => res.json())
              .then((info) => {
                setOpenExam(false);
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          })}
        >
          <DialogTitle>إضافة اختبار</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"اسم الاختبار"}
              type="text"
              fullWidth
              variant="standard"
              {...register("title")}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"مدة الاختبار بالدقائق"}
              type="text"
              fullWidth
              variant="standard"
              {...register("duration")}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"عدد الأسئلة"}
              type="text"
              fullWidth
              variant="standard"
              {...register("numberOfQuestions")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExam(false)}>إلغاء</Button>
            <Button type="submit">
              موافق
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <EditExamDialog exam={ExamEdit} setOpenEdit={setOpenEdit}/>
      </Dialog>
    </div>
  );
};
export default Exams;