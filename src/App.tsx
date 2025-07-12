// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import Checkout from './page/Checkout';
import Dashboard from './page/Dashboard';
import UsersPage from './page/UsersPage';
import JobsPage from './page/JobsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users"     element={<UsersPage />} />
        <Route path="/jobs"      element={<JobsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
