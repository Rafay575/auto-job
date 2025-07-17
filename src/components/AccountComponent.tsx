// src/pages/AccountSettings.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import AppTheme from '../theme/AppTheme';

export default function AccountComponent({ disableCustomTheme }: { disableCustomTheme?: boolean }) {
  // — your real data source here —
  const appliedJobs = [
    { id: 1, title: 'Front-end Developer', company: 'Acme Co.',   date: '2025-06-05', status: 'applied', type: 'quick'  },
    { id: 2, title: 'UI/UX Designer',     company: 'Beta Ltd.',  date: '2025-06-12', status: 'pending', type: 'smart'  },
    { id: 3, title: 'Backend Engineer',   company: 'Gamma Inc.', date: '2025-06-20', status: 'applied', type: 'manual' },
    // …
  ];

  // — dollars spent per type —
  const billingAmounts = { quick: 5, smart: 10, manual: 15 };
  const totalSpend = billingAmounts.quick + billingAmounts.smart + billingAmounts.manual;

  // — counts for tabs —
  const totalCount  = appliedJobs.length;
  const quickCount  = appliedJobs.filter(j => j.type === 'quick').length;
  const smartCount  = appliedJobs.filter(j => j.type === 'smart').length;
  const manualCount = appliedJobs.filter(j => j.type === 'manual').length;

  // — tab state for filtering —
  const [filter, setFilter] = React.useState<'all'|'quick'|'smart'|'manual'>('all');
  const handleTab = (_: any, v: any) => setFilter(v);
  const filteredJobs = filter === 'all'
    ? appliedJobs
    : appliedJobs.filter(j => j.type === filter);

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <Box sx={{ p: 2, mx: 'auto', maxWidth: 1200 }}>

        {/* ── Profile & Change Password ── */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
          <Box sx={{ width: { xs: '100%', lg: '49%' } }}>
            <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <TextField label="Full Name" defaultValue="Ali Hassan" fullWidth />
                  <TextField label="Email Address" type="email" defaultValue="ali.hassan@example.com" fullWidth />
                  <TextField label="Phone Number" defaultValue="+92 300 123 4567" fullWidth />
                </Stack>
                <Box mt={3} textAlign="right">
                  <Button variant="contained">Save Profile</Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: '100%', lg: '49%' } }}>
            <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Change Password
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <TextField label="Current Password" type="password" fullWidth />
                  <TextField label="New Password" type="password" fullWidth />
                  <TextField label="Confirm New Password" type="password" fullWidth />
                </Stack>
                <Box mt={3} textAlign="right">
                  <Button variant="contained">Update Password</Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* ── Spending Summary Cards ── */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
          {[
            { label: 'AI Quick Apply', amount: billingAmounts.quick },
            { label: 'Smart Apply',    amount: billingAmounts.smart },
            { label: 'Manual Apply',   amount: billingAmounts.manual },
            { label: 'Total Spend',    amount: totalSpend },
          ].map(({ label, amount }) => (
            <Card key={label} sx={{ flex: 1, minWidth: 180, textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{label}</Typography>
                <Typography variant="h4" color="primary">${amount}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* ── Tabs to Filter by Type ── */}
        <Box mb={3}>
          <Tabs
            value={filter}
            onChange={handleTab}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All (${totalCount})`}   value="all"   />
            <Tab label={`Quick (${quickCount})`} value="quick" />
            <Tab label={`Smart (${smartCount})`} value="smart" />
            <Tab label={`Manual (${manualCount})`} value="manual" />
          </Tabs>
        </Box>

        {/* ── Filtered Jobs Table ── */}
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {filter === 'all'
                ? `All Jobs (${filteredJobs.length})`
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Jobs (${filteredJobs.length})`}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Job #</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Date Applied</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map(job => (
                  <TableRow key={job.id} hover>
                    <TableCell>{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status === 'applied' ? 'Applied' : 'Pending'}
                        color={job.status === 'applied' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredJobs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No jobs to display.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </Box>
    </AppTheme>
  );
}
