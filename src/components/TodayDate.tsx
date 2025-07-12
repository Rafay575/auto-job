import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

export default function TodayDateButton() {
  // 1. Get today’s date and format it as “Apr 17, 2023”
  const today = dayjs().format('MMM DD, YYYY');

  return (
    <Button
      variant="outlined"             // same outlined look
      size="small"                   // same small size
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
      // no onClick needed, it’s just static
    >
      {today}
    </Button>
  );
}
