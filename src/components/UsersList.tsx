import  { useEffect, useState } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseUrl } from '../api/baseUrl';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
interface UserRow {
  id: number;
  username: string;
  email: string;
  phone: string;
  created_at: string;
  user_type: number;
}

export default function UsersList({ search }: { search: string }) {
  const token = useSelector((state: any) => state.auth.token);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const fetchUsers = async () => {
    const { page, pageSize } = paginationModel;
    try {
      const res = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page + 1, // API expects 1-based index
          limit: pageSize,
          search,
        },
      });
      if (res.data.success) {
        setRows(res.data.data);
        setRowCount(res.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel, search]);

  const { page, pageSize } = paginationModel;

  const columns: GridColDef<UserRow>[] = [
    {
      field: 'sr',
      headerName: 'SR #',
      width: 80,
      sortable: false,
      valueGetter: (_params) => '', // We'll render SR manually
      renderCell: (_params) => (page * pageSize) + _params.api.getRowIndexRelativeToVisibleRows(_params.id) + 1,
    },
    { field: 'username', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },

    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center',height: '100%'}}>
          <IconButton sx={{ width: '32px', height: '32px'  }} onClick={() => console.log('Edit', params.row.id)}>
<EditRoundedIcon sx={{ fontSize: '14px' }} />

          </IconButton>
          <IconButton sx={{ width: '32px', height: '32px'  }} onClick={() => console.log('Delete', params.row.id)}>
            <DeleteRoundedIcon sx={{ fontSize: '14px' }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
