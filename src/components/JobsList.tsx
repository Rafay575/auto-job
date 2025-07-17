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
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import type { Job } from '../data/dummy_jobs';
import type { RootState } from '../redux/store'; // Make sure this points to your store file

const getInitials = (company: string) =>
  company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export default function JobsCardList({ jobs }: { jobs: Job[] }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleApply = (job: Job, applyType: 'AI' | 'Smart' | 'Manual') => {
    dispatch(addToCart({ job, applyType }));
  };

  const isJobInCart = (jobId: number): boolean => {
    return cartItems.some((item) => item.job.id === jobId);
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 }, mx: 'auto' }}>
      <Stack spacing={3}>
        {jobs.map((job) => (
          <Card
            key={job.id}
            variant="outlined"
            sx={{
              transition: '0.3s',
              '&:hover': {
                boxShadow: 6,
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  {getInitials(job.company)}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.company}
                    </Typography>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Stack>
                </Box>
                <Chip
                  label={job.location === 'Remote' ? 'Remote' : 'Onsite'}
                  color={job.location === 'Remote' ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              {job.description && (
                <Typography variant="body2" color="text.primary">
                  {job.description}
                </Typography>
              )}
            </CardContent>

            <CardActions
              sx={{
                justifyContent: 'flex-end',
                px: 2,
                pb: 2,
                flexWrap: 'wrap',
                gap: 1,
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
