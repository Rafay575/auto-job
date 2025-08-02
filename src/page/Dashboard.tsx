// src/pages/AdminDashboardPage.tsx
import  { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,


} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";
import { baseUrl, API_URL } from "../api/baseUrl";
import SideMenu from "../components/SideMenu";
import AppNavbar from "../components/AppNavbar";
import AppTheme from "../theme/AppTheme";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface Stats {
  totalJobs: number;
  pendingCount: number;
  appliedCount: number;
  totalSpending: string;
}

interface JobItem {
  user_job_id: number;
  user_id: number;
  job_id: number;
  title: string;
  company_name: string;
  location: string;
  salary: string;
  purchased_at: string;
  status: string;
}

interface PaymentItem {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../theme/customizations";
export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    pendingCount: 0,
    appliedCount: 0,
    totalSpending: "0.00",
  });
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`${baseUrl}/admin/dashboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data.stats);
          setJobs(res.data.data.jobs);
          setPayments(res.data.data.payments);
        }
      })
      .catch((err) => console.error("Admin dashboard load failed", err))
      .finally(() => setLoading(false));
  }, [user, token]);

  // take only top 5
  const recentJobs = jobs.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  const cardStats = [
    { label: "Total Jobs", value: stats.totalJobs, icon: <WorkIcon fontSize="large" color="primary" /> },
    { label: "Pending", value: stats.pendingCount, icon: <HourglassEmptyIcon fontSize="large" color="warning" /> },
    { label: "Applied", value: stats.appliedCount, icon: <CheckCircleIcon fontSize="large" color="success" /> },
    { label: "Total Spending", value: `$${stats.totalSpending}`, icon: <MonetizationOnIcon fontSize="large" color="secondary" /> },
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
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
           
            overflow: "auto",
          }}
        >
          <Box sx={{ mx: 3, mt: { xs: 8, md: 0 }, pb: 5 }}>
            <Header />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, my: 4 }}>

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={
                    user?.profile_image_url
                    ? `${API_URL}${user.profile_image_url}`
                    : undefined
                  }
                  >
                  {!user?.profile_image_url && user?.name
                    ? user.name[0].toUpperCase()
                    : null}
                </Avatar>
                   
                <Box>
                  <Typography variant="h5">
                    Good day, {user?.name || "User"}
                  </Typography>
                  <Typography color="text.secondary">
                    Here’s what’s happening with your account
                  </Typography>
                </Box>
              </Stack>
                </Box>
            {/* Stats */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, my: 4 }}>
              
              {cardStats.map((s) => (
                <Card
                  key={s.label}
                  sx={{ flex: "1 1 calc(25% - 24px)", minWidth: 200, boxShadow: 3, borderRadius: 2 }}
                >
                  <CardContent>
                    <Stack spacing={1} alignItems="center">
                      {s.icon}
                      <Typography color="text.secondary">{s.label}</Typography>
                      <Typography variant="h4" fontWeight="bold">{s.value}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Recent 5 Jobs */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Top 5 Purchased Jobs
              </Typography>
              {loading ? (
                <Typography>Loading…</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ border: 1, borderColor: 'divider' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>#</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>User ID</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Job ID</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Title</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Company</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Purchased At</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentJobs.map((j, idx) => (
                        <TableRow key={j.user_job_id}>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{idx + 1}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{j.user_id}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{j.job_id}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{j.title}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{j.company_name}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{new Date(j.purchased_at).toLocaleString()}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{j.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            {/* Recent 5 Payments */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Top 5 Payments
              </Typography>
              {loading ? (
                <Typography>Loading…</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ border: 1, borderColor: 'divider' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>#</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>User ID</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Amount</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Currency</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Status</TableCell>
                        <TableCell sx={{ border: 1, borderColor: 'divider' }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentPayments.map((p, idx) => (
                        <TableRow key={p.id}>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{idx + 1}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{p.user_id}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>${p.amount}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{p.currency}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{p.status}</TableCell>
                          <TableCell sx={{ border: 1, borderColor: 'divider' }}>{new Date(p.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
