import { createContext, useContext, useState, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

type SnackVariant = AlertColor;

interface SnackContextValue {
  showSnackbar: (message: string, variant?: SnackVariant) => void;
}

const SnackContext = createContext<SnackContextValue>({ showSnackbar: () => {} });
export function useSnack() { return useContext(SnackContext); }

export function SnackProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<SnackVariant>('info');

  const showSnackbar = (msg: string, variant: SnackVariant = 'info') => {
    setMessage(msg);
    setSeverity(variant);
    setOpen(true);
  };

  const handleClose = (_?: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <SnackContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
        iconMapping={{
  success: <CheckCircleIcon sx={{ fontSize: 20, color: 'white' }} />,
  error: <ErrorIcon sx={{ fontSize: 20, color: 'white' }} />,
  warning: <WarningIcon sx={{ fontSize: 20, color: 'white' }} />,
  info: <InfoIcon sx={{ fontSize: 20, color: 'white' }} />,
}}

          sx={{
            width: '100%',
            color: 'white',
            border: '1px solid #212a39',
            background: 'linear-gradient(145deg, #0e1a2b, #0b1524)',
            boxShadow:
              '0px 8px 30px rgba(0, 0, 0, 0.4)',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackContext.Provider>
  );
}
