// src/components/JobsCardList.tsx
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

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description?: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    description: 'Build and maintain scalable web applications using modern tools like React, Node.js, and GraphQL.',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Beta Inc',
    location: 'New York',
    description: 'Drive product strategy, roadmap, and feature development from ideation to launch.',
  },
  {
    id: 3,
    title: 'UI Designer',
    company: 'Gamma LLC',
    location: 'San Francisco',
    description: 'Create visually appealing and user-friendly interfaces for both web and mobile platforms.',
  },
];

const getInitials = (company: string) => {
  return company
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

export default function JobsCardList() {
  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 },  mx: 'auto' }}>
      <Stack spacing={3}>
        {jobs.map(job => (
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

            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              <Button size="small" variant="outlined">
                View Details
              </Button>
              <Button size="small" variant="contained">
                Apply Now
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
