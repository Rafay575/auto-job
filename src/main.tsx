import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import store from './redux/store.ts';
import { Provider } from 'react-redux';
import { SnackProvider } from './components/SnackContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* ✅ Wrap with Redux Provider */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
         <SnackProvider>

        <App />
         </SnackProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
