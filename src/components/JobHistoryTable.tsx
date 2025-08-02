import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

interface Job {
  id: number;
  title: string;
  company: string;
  appliedDate: string;
  status: string;
}

interface JobHistoryTableProps {
  jobs: Job[];
}

export default function JobHistoryTable({ jobs }: JobHistoryTableProps) {
  if (jobs.length === 0) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          No job history yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Job Title</strong></TableCell>
            <TableCell><strong>Company</strong></TableCell>
            <TableCell><strong>Applied Date</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>{job.appliedDate}</TableCell>
              <TableCell>{job.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
