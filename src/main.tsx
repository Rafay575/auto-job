import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import store from "./redux/store.ts";
import { Provider } from "react-redux";
import { SnackProvider } from "./components/SnackContext.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RqvqRFiDz4OAtX7VCuEnyy8onPWHaqnEJtuydS56VwVNbTibOQ9okPxS1WMlDMv7lLBetlh3DKsCEFLEZPjQ2e300roSNUj7V');
// Inside your app root

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* ✅ Wrap with Redux Provider */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
             <Elements stripe={stripePromise}>

            <App />
             </Elements>
          </LocalizationProvider>
        </SnackProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
