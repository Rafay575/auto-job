import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  Avatar,
  Link,
  Button,
  CssBaseline,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import dayjs from "dayjs";
import { baseUrl } from "../api/baseUrl";
import type { Job } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
// THEME AND LAYOUT COMPONENTS
import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';
import Header from "../components/Header";

const xThemeComponents2 = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const formatDate = (dateStr?: string) =>
  dateStr ? dayjs(dateStr).format("MMM D, YYYY") : "";

export default function JobDetailPage(props: { disableCustomTheme?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Job>(`${baseUrl}/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((_err) => {
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents2}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : theme.palette.background.default,
            overflow: "auto",
          })}
        >
          
          <Stack
            spacing={2}
            sx={{
              alignItems: "stretch",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
             <Header />
            {/* Back Button */}
            <Box sx={{ pt: 2 }}>
              <Button
                component={RouterLink}
                to="/jobs"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 3 }}
                variant="outlined"
              >
                Back to Jobs
              </Button>
            </Box>

            {loading ? (
              <Typography>Loading...</Typography>
            ) : !job ? (
              <Typography>Job not found.</Typography>
            ) : (
              <Box sx={{  mx: "auto", p: { xs: 1, md: 3 } }}>
                {/* Job Header */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar sx={{ width: 64, height: 64 }}>
                    {job.title && job.title[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {job.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {job.company_name}
                    </Typography>
                    <Stack direction="row" spacing={2} mt={1}>
                      <Chip label={job.location} />
                      {job.salary && (
                        <Chip label={`Salary: ${job.salary}`} color="info" />
                      )}
                      <Chip
                        label={job.location === "Remote" ? "Remote" : "Onsite"}
                        color={job.location === "Remote" ? "success" : "default"}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Job Details */}
                <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
                  {job.experience_level && (
                    <Chip
                      label={`Experience: ${job.experience_level}`}
                      variant="outlined"
                    />
                  )}
                  {job.contract_type && (
                    <Chip
                      label={`Contract: ${job.contract_type}`}
                      variant="outlined"
                    />
                  )}
                  {job.work_type && (
                    <Chip
                      label={`Work: ${job.work_type}`}
                      variant="outlined"
                    />
                  )}
                  {job.sector && (
                    <Chip
                      label={`Sector: ${job.sector}`}
                      variant="outlined"
                    />
                  )}
                  {job.applications_count && (
                    <Chip
                      label={`Applicants: ${job.applications_count}`}
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Stack spacing={1} mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Posted:</strong> {formatDate(job.posted_time)} |{" "}
                    <strong>Published:</strong> {formatDate(job.published_at)}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {job.company_url && (
                      <Link
                        href={job.company_url}
                        target="_blank"
                        underline="hover"
                        sx={{ display: "inline-flex", alignItems: "center" }}
                      >
                        Company Site <OpenInNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
                      </Link>
                    )}
                    {job.job_url && (
                      <Link
                        href={job.job_url}
                        target="_blank"
                        underline="hover"
                        sx={{ display: "inline-flex", alignItems: "center" }}
                      >
                        View Job <OpenInNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
                      </Link>
                    )}
                  </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Job Description */}
                <Typography variant="h6" gutterBottom>
                  Job Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {job.description}
                </Typography>

                {/* Benefits */}
                {job.benefits && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Benefits
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      {job.benefits}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
