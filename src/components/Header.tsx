import { useState } from 'react';
import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import TodayDateButton from './TodayDate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../redux/hooks";
import { removeFromCart } from '../redux/cartSlice';

export default function Header() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.length;
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const userType = user?.user_type;
  const dispatch = useDispatch();

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />

        <Stack direction="row" sx={{ gap: 1 }} alignItems="center">
          {userType === 0 && (
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
          <TodayDateButton />
          <ColorModeIconDropdown />
        </Stack>
      </Stack>

      {/* Drawer Sidebar */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            width: 380,
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Job Application Cart
          </Typography>

          {cartItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No jobs added yet.
            </Typography>
          ) : (
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
              {['AI', 'Smart', 'Manual'].map((type) => {
                const filtered = cartItems.filter((item) => item.applyType === type);
                const cost = type === 'AI' ? 5 : type === 'Smart' ? 10 : 15;
                if (filtered.length === 0) return null;

                return (
                  <Box key={type} sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        mb: 1,
                      }}
                    >
                      {type === 'AI'
                        ? 'AI Quick Apply'
                        : type === 'Smart'
                        ? 'Smart Apply'
                        : 'Manual Apply'}
                    </Typography>

                    <Stack spacing={2}>
                      {filtered.map((item) => (
                        <Box
                          key={item.job.id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: '#2A2A2A',
                            border: '1px solid #333',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            {item.job.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.job.company_name}
                          </Typography>

                          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {item.job.location}
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                            <AttachMoneyIcon sx={{ fontSize: 16, color: '#fff' }} />
                            <Typography variant="caption" color="#fff">
                              {cost}
                            </Typography>
                          </Stack>

                          {/* Remove from Cart Button */}
                          <IconButton
                            size="small"
                            aria-label="remove"
                            sx={{
                              position: 'absolute',
                              bottom: 6,
                              right: 6,
                             border: "none",
                             backgroundColor: 'transparent',
                             
                            }}
                            onClick={() => dispatch(removeFromCart(item.job.id))}
                          >
                            <DeleteIcon fontSize="small" sx={{ color: '#ddd' }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Total Price Section */}
          {cartItems.length > 0 && (
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: '1px solid #333',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight="bold" sx={{ color: '#fff' }}>
                  Total: $
                  {cartItems.reduce((total, item) => {
                    const price =
                      item.applyType === 'AI'
                        ? 5
                        : item.applyType === 'Smart'
                        ? 10
                        : 15;
                    return total + price;
                  }, 0)}
                </Typography>

                <Box>
                  <button
                    style={{
                      backgroundColor: '#013d79',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate('/check-out');
                      setCartOpen(false);
                    }}
                  >
                    Checkout
                  </button>
                </Box>
              </Stack>
            </Box>
          )}

        </Box>
      </Drawer>
    </>
  );
}
