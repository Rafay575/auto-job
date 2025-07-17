// src/components/MenuContent.tsx
import { NavLink, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import { useAppSelector } from '../redux/hooks'; // adjust path as needed


export default function MenuContent() {
  const location = useLocation();
const user = useAppSelector((state) => state.auth.user);
const userType = user?.user_type; // 0 = regular user, 1 = admin
const allMenuItems = [
  { text: 'Home',  icon: <HomeRoundedIcon />,      path: '/dashboard' },
  { text: 'Jobs',  icon: <AnalyticsRoundedIcon />, path: '/jobs' },
  { text: 'Users', icon: <PeopleRoundedIcon />,    path: '/users' },
];

const mainListItems = userType === 0
  ? allMenuItems.filter(item => item.text === 'Jobs')
  : allMenuItems;

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              // mark selected if current URL matches the item’s path
              selected={location.pathname === item.path}
              sx={{
                '&.active': {
                  backgroundColor: 'action.selected',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
