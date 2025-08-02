import  { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  CssBaseline,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';

import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import axios from 'axios';
import { baseUrl } from '../api/baseUrl';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';

interface Order {
  order_id: number;
  user_id: number;
  user_name: string;
  job_id: number;
  job_title: string;
  status: string;
  sr: number;
  id: number;
}

export default function OrdersPage(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
// replace
// const [entriesPerPage, setEntriesPerPage] = useState(10);
// with:
const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
  page: 0,
  pageSize: 10,
});

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`${baseUrl}/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        if (res.data.success) {
          const data: Order[] = res.data.orders.map(
            (o: any, idx: number) => ({
              ...o,
              id: o.order_id,
              sr: idx + 1,
            })
          );
          setOrders(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, token]);

  const filtered = orders.filter(
    (o) => statusFilter === 'All' || o.status === statusFilter
  );

  const handleMarkApplied = (orderId: number) => {
    axios
      .put(
        `${baseUrl}/orders/${orderId}/status`,
        { status: 'applied' },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )
      .then((res) => {
        if (res.data.success) {
          setOrders((prev) =>
            prev.map((o) =>
              o.order_id === orderId ? { ...o, status: 'applied' } : o
            )
          );
        }
      })
      .catch(console.error);
  };

  const columns: GridColDef[] = [
    { field: 'sr', headerName: '#', width: 70, sortable: false },
    {
      field: 'user_name',
      headerName: 'User',
      width: 150,
      renderCell: (params) => (
       <Button
    variant="text"
    onClick={() =>
      navigate('/profile', {
        state: { userId: params.row.user_id }
      })
    }
  >
    {params.value}
  </Button>
      ),
    },
    {
      field: 'job_title',
      headerName: 'Job Title',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => navigate(`/jobs/${params.row.job_id}`)}
        >
          {params.value}
        </Button>
      ),
    },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'action',
      headerName: 'Action',
      width: 160,
      sortable: false,
      renderCell: (params) => (
      <Button
  variant="contained"
  size="small"
  disabled={params.row.status === 'applied'}
  onClick={() => handleMarkApplied(params.row.order_id)}
  sx={{
    ml: 2,
    color: '#000',
    // ensure the text stays black even when disabled
    '&.Mui-disabled': {
      color: '#000',
      // if you want to force it, you can also bump the opacity back up
      opacity: 1,
    },
  }}
>
  {params.row.status === 'applied' ? 'Applied' : 'Mark as Applied'}
</Button>

      ),
    },
  ];

  return (
    <AppTheme
      {...props}
      themeComponents={{
        ...chartsCustomizations,
        ...dataGridCustomizations,
        ...datePickersCustomizations,
        ...treeViewCustomizations,
      }}
    >
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, px: 3 }}>
          <Header />
          <Typography variant="h5" fontWeight="bold" my={2}>
            My Orders
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <FormControl size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as string)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="pending">pending</MenuItem>
                <MenuItem value="applied">applied</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ height: 500 }}>
         <DataGrid
  rows={filtered}
  columns={columns}
  loading={loading}
  disableRowSelectionOnClick
  pagination
  paginationModel={paginationModel}
  onPaginationModelChange={model => setPaginationModel(model)}
  pageSizeOptions={[5, 10, 25]}
  autoHeight
/>

          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
