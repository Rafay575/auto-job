import React, { useState, useEffect } from 'react';
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
  CssBaseline,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import Header from '../components/Header';
import JobsCardList from '../components/JobsList';

import { alpha } from '@mui/material/styles';
import { jobs, type Job } from '../data/dummy_jobs';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents2 = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function JobsPage(props: { disableCustomTheme?: boolean }) {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / entriesPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  // Reset to page 1 when search or entriesPerPage changes
  useEffect(() => {
    setPage(1);
  }, [search, entriesPerPage]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents2}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

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

            {/* Top Bar: Search and Entries */}
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
                Available Jobs
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small">
                 
                  <Select
                    labelId="entries-label"
                    value={entriesPerPage}
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
                  placeholder="Search jobs..."
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

            {/* Render Filtered + Paginated Jobs */}
            <JobsCardList jobs={paginatedJobs} />

            {/* Pagination and Count */}
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
                {Math.min(page * entriesPerPage, filteredJobs.length)} of{' '}
                {filteredJobs.length} entries
              </Typography>

              <Pagination
                count={totalPages}
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
