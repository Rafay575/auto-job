import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import OTP from './OTP'; // OTP Component that you shared
import { useSnack } from '../components/SnackContext'; // Snack context for snackbar
import axios from 'axios';
import { baseUrl } from '../api/baseUrl';
import { useForm, Controller } from 'react-hook-form'; // React Hook Form
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const { showSnackbar } = useSnack();
  const [step, setStep] = React.useState(1); // Step to manage dialog transitions (1: Forgot password, 2: OTP, 3: Reset password)

  const [otp, setOtp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false); // For loading indicator in the button
  const [email, setEmail] = React.useState(''); // Store email in the state
  const [resetToken, setResetToken] = React.useState(''); // Store reset token after OTP verification
  const [showPassword, setShowPassword] = React.useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false); // Toggle confirm password visibility
// adding speacial character and one capital letter in password must
  // Initialize react-hook-form
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Handle continue (forgot password step)
  const handleContinue = async (data: any) => {
    setLoading(true);
    const email = data.email;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showSnackbar("Please enter a valid email address.", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/forgot-password`, { email });
      showSnackbar(res.data.message, "success");
      setEmail(email); // Store the email in state
      setStep(2); // Move to OTP step
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle verify OTP step
  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/verify-otp`, { email, otp });
      showSnackbar(res.data.message, "success");
      setResetToken(res.data.reset_token); // Store reset_token received in response
      setStep(3); // Move to password reset step
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "OTP verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password step
  const handleResetPassword = async () => {
    if (password !== newPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      showSnackbar("Password must be at least 8 characters long", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/reset-password`, { reset_token: resetToken, new_password: newPassword });
      showSnackbar(res.data.message, "success");
      handleClose(); // Close the dialog
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Password reset failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form when dialog is closed
  React.useEffect(() => {
    if (!open) {
      reset(); // Reset form fields when the dialog is closed
      setStep(1); // Reset the step to initial state
      setOtp('');
      setPassword('');
      setNewPassword('');
      setResetToken(''); // Reset the reset token
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { background: 'linear-gradient(45deg, #1C2025, #303740)' } }}>
      {step === 1 && (
        <>
          <DialogTitle>Reset password</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <DialogContentText>
              Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
            </DialogContentText>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address"
                }
              }}
              render={({ field, fieldState }) => (
                <OutlinedInput
                  {...field}
                  autoFocus
                  required
                  margin="dense"
                  label="Email address"
                  placeholder="Email address"
                  type="email"
                  fullWidth
                  error={!!fieldState.error}
                  
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" onClick={handleSubmit(handleContinue)} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
            </Button>
          </DialogActions>
        </>
      )}

      {step === 2 && (
        <>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <DialogContentText>
              Please enter the OTP sent to your email address.
            </DialogContentText>
            <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={6} />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" onClick={handleVerify} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
            </Button>
          </DialogActions>
        </>
      )}

      {step === 3 && (
        <>
          <DialogTitle>Reset Your Password</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: { xs: '100%', sm: '400px' } }}>
            <OutlinedInput
              autoFocus
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              placeholder="New password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: '100%', padding: '12px' }}
              endAdornment={
                <Button onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</Button>
              }
            />
            <OutlinedInput
              required
              margin="dense"
              id="new-password"
              name="new-password"
              label="New Password"
              placeholder="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ width: '100%', padding: '12px' }}
              endAdornment={
                <Button sx={{p:'0'}} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</Button>
              }
            />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" onClick={handleResetPassword} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
