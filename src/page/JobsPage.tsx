import { useState, useEffect } from 'react';
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
import axios from 'axios';
import { baseUrl } from '../api/baseUrl';
import type { Job } from '../types';

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // LinkedIn-style Filters
  
  const [filterType, setFilterType] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterRemote, setFilterRemote] = useState('');

  useEffect(() => {
    axios
      .get<Job[]>(`${baseUrl}/jobs/all`)
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error('Failed to fetch jobs:', err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Unique filter options from jobs data
  const typeOptions = Array.from(new Set(jobs.map(j => j.contract_type))).filter(Boolean);
  const experienceOptions = Array.from(new Set(jobs.map(j => j.experience_level))).filter(Boolean);

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    return (
     
      (filterType === '' || job.contract_type === filterType) &&
      (filterExperience === '' || job.experience_level === filterExperience) &&
      (filterRemote === '' ||
        (filterRemote === 'Remote'
          ? job.location.toLowerCase().includes('remote')
          : !job.location.toLowerCase().includes('remote'))) &&
      (
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company_name.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        (job.sector && job.sector.toLowerCase().includes(search.toLowerCase()))
      )
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / entriesPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  // Reset to page 1 when search or entriesPerPage or filters change
  useEffect(() => {
    setPage(1);
  }, [search, entriesPerPage, filterType, filterExperience, filterRemote]);

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

            {/* Top Bar: LinkedIn Filters + Search */}
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

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                {/* Location Filter */}
               
                {/* Type Filter */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    displayEmpty
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    renderValue={selected => selected ? selected : 'All Types'}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {typeOptions.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Experience Level Filter */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    displayEmpty
                    value={filterExperience}
                    onChange={e => setFilterExperience(e.target.value)}
                    renderValue={selected => selected ? selected : 'All Experience'}
                  >
                    <MenuItem value="">All Experience</MenuItem>
                    {experienceOptions.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Remote/Onsite Filter */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    displayEmpty
                    value={filterRemote}
                    onChange={e => setFilterRemote(e.target.value)}
                    renderValue={selected => selected ? selected : 'Remote/Onsite'}
                  >
                    <MenuItem value="">Remote/Onsite</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Onsite">Onsite</MenuItem>
                  </Select>
                </FormControl>
                {/* Entries Per Page */}
                <FormControl size="small">
                  <Select
                    labelId="entries-label"
                    value={entriesPerPage}
                    onChange={e => setEntriesPerPage(Number(e.target.value))}
                  >
                    {[5, 10, 25, 50].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value} / page
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Search */}
                <TextField
                  size="small"
                  placeholder="Search jobs..."
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

            {/* Render Filtered + Paginated Jobs */}
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <JobsCardList jobs={paginatedJobs} />
            )}

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
