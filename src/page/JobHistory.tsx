import  { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  CssBaseline,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import type { GridPaginationModel } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

import { useNavigate } from 'react-router-dom';

import SideMenu from '../components/SideMenu';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import AppTheme from '../theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';
import { baseUrl } from '../api/baseUrl';
import { useSnack } from '../components/SnackContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

interface JobHistoryItem {
  id: number;
  title: string;
  company_name: string;
  location: string;

  purchased_at: string;
  status: string;
}

export default function JobsHistoryPage(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnack();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [jobs, setJobs] = useState<JobHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
  page: 0,
  pageSize: 10,
});

  // fetch jobs
  useEffect(() => {
    if (!user?.id) return;
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${baseUrl}/jobs/my-jobs`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const payload = await res.json();
        if (!payload.success) throw new Error(payload.error || 'Failed to load jobs');
        setJobs(payload.jobs);
      } catch (err: any) {
        showSnackbar(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user, token, showSnackbar]);

  // filter rows
  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company_name.toLowerCase().includes(search.toLowerCase())
  );

  // add serial numbers
  const rowsWithSr = filtered.map((job, index) => ({ ...job, sr: index + 1 }));

  // define columns
  const columns: GridColDef[] = [
    { field: 'sr', headerName: '#', width: 70, sortable: false },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 150 },
    { field: 'company_name', headerName: 'Company', flex: 1, minWidth: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'purchased_at',
      headerName: 'Purchased At',
      width: 180,
     
    },
    { field: 'location', headerName: 'Location', flex: 1, minWidth: 120 },
   
  ];

  const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Stack spacing={2} sx={{ alignItems: 'stretch', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />

            {/* Top Bar */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
              <Typography variant="h5" fontWeight="bold">Job Purchase History</Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small">
                  <Select value={entriesPerPage} onChange={e => setEntriesPerPage(Number(e.target.value))}>
                    {[5, 10, 25, 50].map(v => (
                      <MenuItem key={v} value={v}>{v} / page</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  placeholder="Search history..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>

            {/* DataGrid */}
            <Box sx={{ height: 600, width: '100%' }}>
             <DataGrid
  rows={rowsWithSr}
  columns={columns}
  getRowId={row => row.id}
  loading={loading}
  disableRowSelectionOnClick    
  pagination             
  paginationModel={paginationModel}
  onPaginationModelChange={model => setPaginationModel(model)}
  pageSizeOptions={[5, 10, 25, 50]}
  onRowClick={params => navigate(`/jobs/${params.id}`)}
  autoHeight
/>

            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
