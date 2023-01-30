import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {Box,Button,styled,Typography,
} from "@mui/material";
import {useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const columns = [
    { id: "name", label: "اسم الطالب", minWidth: 170, align: "center" },
    { id: "code", label: "المبلغ المدخل", minWidth: 100, align: "center" },
    { id: "details", label: "الحالة", minWidth: 100, align: "center" }
    ];

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    }));

    const FinishWallet = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = useState(true);
    const [wallets,setWallets] = useState([])
    const navigate = useNavigate()

    const {token} = useSelector((state)=>state.admin)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    useEffect(()=>
    {
        async function getWallets()
        {
            setLoading(true)
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/api/wallet/admin/wallets/all`,{
                    headers:{
                        "Authorization":token
                    }
                })
                const data = await response.json()
                setWallets(data.wallets.filter(wallet=>wallet.status!==0))
                setLoading(false)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getWallets()
    },[])

    return (
        <div>
        <Typography
            variant="h3"
            sx={{ marginBottom: "20px",marginTop:"15px",fontSize:"38px"}}
        >
            جدول المعاملات المنتهية 
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
                {wallets
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((e, i) => (
                    <TableRow key={i+'qw'} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="center">{e.Student.name}</TableCell>
                        <TableCell align="center">{e.money}</TableCell>
                        <TableCell align="center" sx={{color:e.status===1?'red':'green'}}>
                            {e.status===1?'مرفوض':'مقبول'}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={wallets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </div>
    );
};

export default FinishWallet;
