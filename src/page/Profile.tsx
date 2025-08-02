import {
  Box,
  Stack,
  
  CssBaseline,
} from '@mui/material';

import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import Header from '../components/Header';

import Profilecomponent from '../components/Profilecomponent';
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
  
  return (
    <AppTheme {...props} themeComponents={xThemeComponents2}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,overflow: 'auto',
          }}
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

            <Profilecomponent />

          
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
