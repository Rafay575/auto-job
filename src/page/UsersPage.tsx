import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  MenuItem,
  Pagination,
  Select,
  FormControl,
  
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import UsersList from '../components/UsersList';
import Header from '../components/Header';
import {useState} from "react"
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function UsersPage(props: { disableCustomTheme?: boolean }) {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [page, setPage] = useState(1);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'stretch',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            {/* Users Section Header */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Users Management
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small">
                  <label id="entries-label" >Entries</label>
                  <Select
                    labelId="entries-label"
                    value={entriesPerPage}
                    label="Entries"
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  >
                    {[5, 10, 25, 50].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value} / page
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

            {/* Users List */}
            <UsersList />

            {/* Pagination Controls */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * entriesPerPage + 1} to{' '}
                {page * entriesPerPage} of 100 users
              </Typography>

              <Pagination
                count={10}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
