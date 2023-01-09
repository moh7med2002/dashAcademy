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
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { ClipLoader } from "react-spinners";

const columns = [
  { id: "name", label: "الرقم", minWidth: 170, align: "center" },
  { id: "code", label: "اسم المادة", minWidth: 100, align: "center" },
  { id: "level", label: "المرحلة الدراسية", minWidth: 100, align: "center" },
  { id: "class", label: "السنة الدراسية", minWidth: 100, align: "center" },
  { id: "section", label: "الشعبة الدراسية", minWidth: 150, align: "center" }
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const Courses = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [levels, setLevels] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [level, setLevel] = useState("1");
  const [myClass, setMyClass] = useState("1");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useSelector((state)=>state.admin)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/api/level/all`,{
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => setLevels(data.levels));

    fetch(`${process.env.REACT_APP_API}/api/class/all`,{
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => setClasses(data.classes));

    fetch(`${process.env.REACT_APP_API}/api/section/all`,{
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => setSections(data.sections));

    fetch(`${process.env.REACT_APP_API}/api/subject/all`,{
      headers:{
        "Authorization":token
    }
    })
      .then((res) => res.json())
      .then((data) => {
        setAllSubjects(data.subjects);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Typography
        variant="h3"
        sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
      >
        المواد
      </Typography>
      <Button
        sx={{ marginBottom: "20px" }}
        color="success"
        variant="contained"
        onClick={() => setOpenAdd(true)}
      >
        + إضافة مادة
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
            <TableBody sx={{position: 'relative'}}>
                <ClipLoader
                  color={'#18a0fb'}
                  loading={loading}
                  size={80}
                  cssOverride={{
                    display: 'block',
                    marginInline: 'auto',
                    borderWidth: '5px',
                  }}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              {allSubjects
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, i) => (
                  <TableRow key={i} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="center">{e.id}</TableCell>
                    <TableCell align="center">{e.title}</TableCell>
                    <TableCell align="center">{e.Level.title}</TableCell>
                    <TableCell align="center">{e.Class.title}</TableCell>
                    <TableCell align="center">{e.Section?.title||''}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={allSubjects?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetch(`${process.env.REACT_APP_API}/api/subject/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization":token
              },
              body: JSON.stringify({
                title: subject,
                ClassId: myClass,
                LevelId: level,
                SectionId: section,
              }),
            })
              .then((res) => res.json())
              .then((info) => {
                setOpenAdd(false)
                window.location.reload()
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <DialogTitle>إضافة مادة</DialogTitle>
          <DialogContent>
            {/* المرحلة */}
            <FormControl fullWidth sx={{ marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-label">المرحلة</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={"المرحلة"}
                onChange={(e) => { setLevel(e.target.value) ; setMyClass("")}}
                defaultValue="1"
                required
              >
                {levels?.map((e, i) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* السنة الدراسية */}
            <FormControl fullWidth sx={{ marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-label">
                السنة الدراسية
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={"السنة الدراسية"}
                onChange={(e) => { setMyClass(e.target.value) ; setSection("") }}
                required
              >
                {classes
                  ?.filter((e) => e.LevelId == level)
                  ?.map((e, i) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* الشعبة */}
            <FormControl fullWidth sx={{ marginTop: "20px" }}>
              <InputLabel id="demo-simple-select-label">الشعبة</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={"الشعبة"}
                onChange={(e) => setSection(e.target.value)}
              >
                {level == "3" &&
                  sections
                    .filter((e) => e.ClassId == myClass)
                    ?.map((e, i) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.title}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={"اسم المادة"}
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setSubject(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>إلغاء</Button>
            <Button type={"submit"}>
              موافق
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Courses;
