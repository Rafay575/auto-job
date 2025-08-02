import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './page/Home';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Checkout from './page/Checkout';
import Dashboard from './page/Dashboard';
import UsersPage from './page/UsersPage';
import OrdersPage from './page/OrdersPage';
import HomePage from './page/UserDashboard';
import JobsPage from './page/JobsPage';
import JobsHistoryPage from './page/JobHistory';
import JobDetailsPage from './page/JobDetailsPage';
import Profile from './page/Profile';
import AccountSettings from './page/AccountSettings';
import ProfileWizard from './components/ProfileWizard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/wizard" element={<ProfileWizard />} />
        {/* Admin Routes (user_type: 1) */}
        <Route element={<ProtectedRoute allowedRoles={[1]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>

        {/* User Routes (user_type: 0) */}
        <Route element={<ProtectedRoute allowedRoles={[0]} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/check-out" element={<Checkout />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs-history-page" element={<JobsHistoryPage />} />
        </Route>

        {/* Shared Routes (user_type: 0 or 1) */}
        <Route element={<ProtectedRoute allowedRoles={[0, 1]} />}>
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
