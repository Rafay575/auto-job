import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import {

  
  CssBaseline,
} from '@mui/material';
import SideMenu from '../components/SideMenu';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import AppTheme from '../theme/AppTheme';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSnack } from '../components/SnackContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import { baseUrl } from '../api/baseUrl';
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
export default function CheckoutPage(props: { disableCustomTheme?: boolean} ) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const user      = useSelector((s: RootState) => s.auth.user);
  const stripe    = useStripe();
  const elements  = useElements();
  const { showSnackbar } = useSnack();
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const getTotal = () => cartItems.reduce((sum, item) =>
    sum + (item.applyType === 'AI' ? 5 : item.applyType === 'Smart' ? 10 : 15)
  , 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) { showSnackbar('Please log in before paying.', 'error'); return; }
    if (!stripe || !elements) { showSnackbar('Stripe.js not loaded.', 'error'); return; }

    setLoading(true);
    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card details not loaded');

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });
      if (pmError) throw pmError;

      const res = await fetch(`${baseUrl}/payments/stripe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotal(),
          currency: 'usd',
          user_id: user.id,
          cart: cartItems.map(i => ({ job_id: i.job.id, applyType: i.applyType })),
          payment_method_id: paymentMethod!.id,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Payment failed');

      dispatch(clearCart());
      setSuccess(true);
      showSnackbar('Payment successful!', 'success');
    } catch (err: any) {
      showSnackbar(err.message || 'Payment error. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
      <AppTheme {...props} themeComponents={xThemeComponents2}>
         <CssBaseline enableColorScheme />
         <Box sx={{ display: 'flex' }}>
           <SideMenu />
           <AppNavbar />
   
           <Box
             component="main"
         
          sx={{
            flexGrow: 1,
          
            p: 3,
            pt: { xs: 8, md: 3 },
          }}
        >
          <Header />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Checkout
          </Typography>

          <Stack
            direction={isDesktop ? 'row' : 'column'}
            spacing={3}
            alignItems="flex-start"
          >
            {/* --- CART PANEL --- */}
            <Paper
              component="form"
              onSubmit={handleCheckout}
              elevation={2}
              sx={{
                flex: isDesktop ? '0 0 40%' : '1',
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" mb={2}>
                Your Cart
              </Typography>

              {cartItems.length === 0 ? (
                <Typography color="text.secondary">No items in cart.</Typography>
              ) : (
                cartItems.map(item => {
                  const cost = item.applyType === 'AI'
                    ? 5
                    : item.applyType === 'Smart'
                    ? 10
                    : 15;
                  return (
                    <Box
                      key={item.job.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        pb: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold">{item.job.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.job.company_name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon fontSize="small" />
                        <Typography>${cost}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => dispatch(removeFromCart(item.job.id))}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })
              )}

              {!success && cartItems.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" mb={1}>
                    Payment Details
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <CardElement options={{ hidePostalCode: true }} />
                  </Box>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !stripe || !elements}
                  >
                    {loading ? 'Processing…' : `Pay $${getTotal()}`}
                  </Button>
                </>
              )}

              {success && (
                <Typography
                  variant="h6"
                  color="success.main"
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  Payment successful!
                </Typography>
              )}
            </Paper>

            {/* --- SUMMARY PANEL --- */}
            <Paper
              elevation={2}
              sx={{
                flex: isDesktop ? '0 0 55%' : '1',
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" mb={2}>
                Order Summary
              </Typography>
              <Typography gutterBottom>
                Total items: <strong>{cartItems.length}</strong>
              </Typography>
              <Typography gutterBottom>
                Amount due: <strong>${getTotal()}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Once you click “Pay”, you will be charged the total amount and
                receive a confirmation email.
              </Typography>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
