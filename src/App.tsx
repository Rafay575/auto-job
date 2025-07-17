// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import Checkout from './page/Checkout';
import Dashboard from './page/Dashboard';
import UsersPage from './page/UsersPage';
import JobsPage from './page/JobsPage';
import SignUp from './page/SignUp';
import Profile from './page/Profile';
import AccountSettings from './page/AccountSettings';
import ProfileWizard from './components/ProfileWizard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users"     element={<UsersPage />} />
        <Route path="/jobs"      element={<JobsPage />} />
        <Route path="/profile"      element={<Profile />} />
        <Route path="/account-settings"      element={<AccountSettings />}  />
        <Route path="/wizard"      element={<ProfileWizard />}  />
      </Routes>
    </Router>
  );
}

export default App;
