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
import QuizIcon from '@mui/icons-material/Quiz';
import FactCheckIcon from '@mui/icons-material/FactCheck';
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
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import { Link, useNavigate, useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import EditUnit from "../components/EditUnit";

const columns = [
  { id: "name", label: "الرقم", minWidth: 170, align: "center" },
  { id: "code", label: "اسم الوحدة", minWidth: 100, align: "center" },
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

const Courses = () => {
  const {token} = useSelector((state)=>state.admin)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openEdit, setOpenEdit] = React.useState(null);
  const [openAdd, setOpenAdd] = React.useState(false);
  const { register, handleSubmit } = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allUnits, setAllUnits] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const unitDelete = (unit) => {
    fetch(`${process.env.REACT_APP_API}/api/unit/${unit.id}`, {
      method: "DELETE",
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => window.location.reload())
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/api/unit/course/${params.CourseId}`,{
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => {
        setAllUnits(data.units);
        setLoading(false);
      });
  }, []);


  return (
    <div>
      <Typography
        variant="h3"
        sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
      >
        الوحدات
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          sx={{ marginBottom: "20px" }}
          color="success"
          variant="contained"
          onClick={() => setOpenAdd(true)}
        >
          + إضافة وحدة
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
              {allUnits
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, i) => (
                  <TableRow key={i + "g"} hover role="checkbox" tabIndex={-1}>
                    {/* EDIT DIALOG */}
                    <Dialog open={openEdit === e.id} onClose={() => {setOpenEdit(null)}}>
                          <EditUnit setOpenEdit={setOpenEdit} unit={e}/>
                    </Dialog>
                    <TableCell align="center">{e.id}</TableCell>
                    <TableCell align="center">{e.title}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={"تعديل الوحدة"} placement="bottom">
                        <Button
                          onClick={() => {
                            setOpenEdit(e.id);
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title={"الانتقال الى دروس الوحدة"}
                        placement="bottom"
                      >
                        <Link to={`/courses/${params.CourseId}/${e.id}`}>
                          <Button>
                            <ReplyIcon />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip
                        title={"جدول قبول ورفض الدروس "}
                        placement="bottom"
                      >
                        <Link to={`/courses/${params.CourseId}/checkLessons/${e.id}`}>
                          <Button>
                            <FactCheckIcon />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip
                        title={"الانتقال الى اختبارات الوحدة"}
                        placement="bottom"
                      >
                        <Link to={`/courses/${params.CourseId}/unit/${e.id}/exams`}>
                          <Button>
                            <QuizIcon />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip title={"حذف الوحدة"} placement="bottom">
                        <Button onClick={()=>{unitDelete(e)}} color={"danger"}>
                          <DeleteIcon />
                        </Button>
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
          count={allUnits?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <form
          onSubmit={handleSubmit((data) => {
            fetch(`${process.env.REACT_APP_API}/api/unit/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization":token
              
              },
              body: JSON.stringify({
                title: data.title,
                CourseId: params.CourseId,
              }),
            })
              .then((res) => res.json())
              .then((info) => {
                setOpenAdd(false)
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          })}
        >
          <DialogTitle>إضافة وحدة</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"اسم الوحدة"}
              type="text"
              fullWidth
              variant="standard"
              {...register("title")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>إلغاء</Button>
            <Button type="submit">
              موافق
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Courses;
