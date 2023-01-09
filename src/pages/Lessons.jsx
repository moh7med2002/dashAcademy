import React, { useEffect, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import {  useNavigate, useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import EditLesson from "../components/EditLesson";

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
    id: "density",
    label: "الاجراءات",
    minWidth: 170,
    align: "center",
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const Lessons = () => {
  const {token} = useSelector((state)=>state.admin)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit } = useForm();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteLesson = (lesson)=>{
    fetch(`${process.env.REACT_APP_API}/api/lesson/${lesson.id}`, {
      method: "DELETE",
      headers:{
        "Authorization":token
    }
    }).then(res => res.json()).then(data => window.location.reload()).catch(err => console.log(err))
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
        setAllLessons(data.lessons.filter(lesson=>lesson.status===1));
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Typography
        variant="h3"
        sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
      >
        الدروس
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
        <Button
          sx={{ marginBottom: "20px" }}
          color="success"
          variant="contained"
          onClick={() => setOpenAdd(true)}
        >
          + إضافة درس
        </Button>
        </Box>
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
                      <Tooltip title={"تعديل الدرس"} placement="bottom">
                        <Button onClick={() => {
                          setOpenEdit(e.id);
                        }}>
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title={"حذف الدرس"} placement="bottom">
                        <Button onClick={() => deleteLesson(e)} color={"danger"}>
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <Dialog open={openEdit===e.id} onClose={() => setOpenEdit(false)}>
                        <EditLesson editLesson={e} setOpenEdit={setOpenEdit}/>
                    </Dialog>
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
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <form
          onSubmit={handleSubmit((data) => {
            fetch(`${process.env.REACT_APP_API}/api/lesson/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization":token
              },
              body: JSON.stringify({
                title: data.name,
                UnitId: params.UnitId,
                videoUrl: data.url,
                content: data.describe,
              }),
            })
              .then((res) => res.json())
              .then((info) => {
                setOpenAdd(false);
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          })}
        >
          <DialogTitle>إضافة درس</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"اسم الدرس"}
              type="text"
              fullWidth
              variant="standard"
              {...register("name")}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"رابط الدرس"}
              type="text"
              fullWidth
              variant="standard"
              {...register("url")}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"وصف الدرس"}
              type="text"
              fullWidth
              variant="standard"
              {...register("describe")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>إلغاء</Button>
            <Button type="submit" >
              موافق
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Lessons;
