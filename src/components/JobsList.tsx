import {
  Box,
  Stack,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Link,
  Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { addToCart } from '../redux/cartSlice';
import type { Job } from '../types';
import type { RootState } from '../redux/store';
import dayjs from 'dayjs';

const getInitials = (title: string) =>
  title && title.length > 0 ? title[0].toUpperCase() : '';

const truncate = (str: string, n: number) =>
  str && str.length > n ? str.slice(0, n) + '...' : str;

const formatDate = (dateStr?: string) =>
  dateStr ? dayjs(dateStr).format('MMM D, YYYY') : '';

export default function JobsCardList({ jobs }: { jobs: Job[] }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const isJobInCart = (jobId: number): boolean => {
    return cartItems.some((item) => item.job.id === jobId);
  };

  const handleApply = (job: Job, applyType: 'AI' | 'Smart' | 'Manual') => {
   
    dispatch(addToCart({ job, applyType }));
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto' }}>
      <Stack spacing={4}>
        {jobs.map((job) => (
          <Card
            key={job.id}
            variant="outlined"
            sx={{
              transition: '0.3s',
              p: 2,
              textDecoration: 'none',
              '&:hover': {
                boxShadow: 6,
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent sx={{ pb: 0 }}>
              {/* Header: Avatar, Title, Company, Location, Salary, Remote/Onsite */}
              <Stack direction="row" alignItems="center" spacing={3} mb={1}>
                <Avatar
                  sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}
                  src={job.company_url || undefined}
                  alt={job.company_name || 'Company'}
                >
                  {getInitials(job.title)}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={0.5}
                    component={RouterLink}
                    to={`/jobs/${job.id}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline', color: 'primary.main' },
                    }}
                    onClick={(e) => e.stopPropagation()} // just in case, but not really needed here
                  >
                    {job.title}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.company_name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Stack>
                    {job.salary && (
                      <Chip
                        label={`Salary: ${job.salary}`}
                        color="info"
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Stack>
                </Box>
                <Chip
                  label={job.location === 'Remote' ? 'Remote' : 'Onsite'}
                  color={job.location === 'Remote' ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Stack>

              {/* Job Meta Chips */}
              <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2, flexWrap: 'wrap' }}>
                {job.experience_level && (
                  <Chip
                    label={`Experience: ${job.experience_level}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {job.contract_type && (
                  <Chip
                    label={`Contract: ${job.contract_type}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {job.work_type && (
                  <Chip
                    label={`Work: ${job.work_type}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {job.sector && (
                  <Chip
                    label={`Sector: ${job.sector}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {job.applications_count && (
                  <Chip
                    label={`Applicants: ${job.applications_count}`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Description & Benefits */}
              <Typography variant="body2" color="text.primary" gutterBottom sx={{ mb: 1.5 }}>
                {truncate(job.description, 1000)}
              </Typography>
              {job.benefits && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <strong>Benefits:</strong> {truncate(job.benefits, 100)}
                </Typography>
              )}

              {/* Dates and Links */}
              <Stack direction="row" spacing={3} sx={{ mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Posted:</strong> {job.posted_time ? formatDate(job.posted_time) : '—'}
                  {'  |  '}
                  <strong>Published:</strong> {job.published_at ? formatDate(job.published_at) : '—'}
                </Typography>
                {job.company_url && (
                  <Tooltip title="Company Website">
                    <Link
                      href={job.company_url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{
                        ml: 2,
                        fontSize: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      Company Site <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
                    </Link>
                  </Tooltip>
                )}
                {job.job_url && (
                  <Tooltip title="Job Posting">
                    <Link
                      href={job.job_url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{
                        ml: 2,
                        fontSize: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      View Job <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
                    </Link>
                  </Tooltip>
                )}
              </Stack>
            </CardContent>

            <CardActions
              sx={{
                justifyContent: 'flex-end',
                px: 2,
                pb: 2,
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
              }}
            >
              {isJobInCart(job.id) ? (
                <Chip
                  label="✅ Added to Cart"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              ) : (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleApply(job, 'AI')}
                  >
                    AI Quick Apply
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleApply(job, 'Smart')}
                  >
                    Smart Apply
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleApply(job, 'Manual')}
                  >
                    Manual Apply
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
