import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Input,
  Button,

  FormHelperText,
} from "@mui/material";
import AppTheme from "../theme/AppTheme";
import { useForm } from "react-hook-form";
import axios from "axios";
import { baseUrl } from "../api/baseUrl";
import { useSnack } from "../components/SnackContext";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
export default function AccountComponent({
  disableCustomTheme,
}: {
  disableCustomTheme?: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    register: registerPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm();
  const navigate = useNavigate();

  const token = useSelector((state: any) => state.auth.token);
  const { showSnackbar } = useSnack();

  React.useEffect(() => {
    axios
      .get(`${baseUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { name, email, phone } = res.data.data;
        setValue("name", name);
        setValue("email", email);
        setValue("phone", phone);
      });
  }, []);
const dispatch = useDispatch();

const onSubmitProfile = (data: any) => {
  axios
    .put(`${baseUrl}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      showSnackbar("Profile updated", "success");
      if (res.data?.success && res.data.user) {
        // dispatch(loginSuccess(res.data.user));
          dispatch(loginSuccess({ user: res.data.user, token }));
          navigate('/home');
      }
    })
    .catch(() => showSnackbar("Update failed", "error"));
};

  const onChangePassword = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      return showSnackbar("Passwords do not match", "error");
    }
    axios
      .put(
        `${baseUrl}/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        showSnackbar("Password updated", "success");
        resetPw();
      })
      .catch(() => showSnackbar("Password update failed", "error"));
  };



  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <Box sx={{ p: 2, mx: "auto"}}>
        <Box display="flex" flexWrap="wrap" gap={2} mb={4 }>
          <Box sx={{ width: { xs: "100%", lg: "49%" },height: "100%" }}>
            <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <form onSubmit={handleSubmit(onSubmitProfile)}>
                  <Stack spacing={2}>
                    <Input
                      placeholder="Full Name"
                      fullWidth
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 4,
                          message: "Minimum 4 characters",
                        },
                      })}
                    />
                    {errors.name?.message && (
                      <FormHelperText error>
                        {String(errors.name.message)}
                      </FormHelperText>
                    )}

                    <Input
                      placeholder="Email Address"
                      fullWidth
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email",
                        },
                      })}
                    />
                    {errors.email?.message && (
                      <FormHelperText error>
                        {String(errors.email.message)}
                      </FormHelperText>
                    )}

                    <Input
                      placeholder="Phone Number"
                      fullWidth
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/
,
                          message: "Enter valid UK phone number",
                        },
                      })}
                    />
                    {errors.phone?.message && (
                      <FormHelperText error>
                        {String(errors.phone.message)}
                      </FormHelperText>
                    )}
                  </Stack>
                  <Box mt={3} textAlign="right">
                    <Button variant="outlined" type="submit">
                      Save Profile
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: "100%", lg: "49%" }, height: "100%" }}>
            <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Change Password
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <form onSubmit={handlePwSubmit(onChangePassword)}>
                  <Stack spacing={2}>
                    <Input
                      placeholder="Current Password"
                      type="password"
                      fullWidth
                      {...registerPw("currentPassword", {
                        required: "Current password required",
                      })}
                    />
                    {pwErrors.currentPassword?.message && (
                      <FormHelperText error>
                        {String(pwErrors.currentPassword.message)}
                      </FormHelperText>
                    )}

                    <Input
                      placeholder="New Password"
                      type="password"
                      fullWidth
                      {...registerPw("newPassword", {
                        required: "New password required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                          message:
                            "Must include upper, lower, number, special character & 8+ chars",
                        },
                      })}
                    />
                    {pwErrors.newPassword?.message && (
                      <FormHelperText error>
                        {String(pwErrors.newPassword.message)}
                      </FormHelperText>
                    )}

                    <Input
                      placeholder="Confirm New Password"
                      type="password"
                      fullWidth
                      {...registerPw("confirmPassword", {
                        required: "Confirm password required",
                      })}
                    />
                    {pwErrors.confirmPassword?.message && (
                      <FormHelperText error>
                        {String(pwErrors.confirmPassword.message)}
                      </FormHelperText>
                    )}
                  </Stack>
                  <Box mt={3} textAlign="right">
                    <Button variant="outlined" type="submit">
                      Update Password
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Box>
                   
      </Box>
    </AppTheme>
  );
}
