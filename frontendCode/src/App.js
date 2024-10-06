import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import HomePage from './pages/HomePage';
import TripListPage from './pages/TriplistPage';
import BookingListPage from './pages/BookingListPage';
import ExpenseListPage from './pages/ExpenseListPage';
import AccommodationPage from './pages/AccomudationPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/AdminPage';
// import ManageAccommodationsPage from './pages/ManageAccommodationsPage';
// import ManageBookingsPage from './pages/ManageBookingsPage';
import UserManagementPage from './pages/UserManagementPage';
import ReportManagementPage from './pages/ReportManagementPage';
import UserNavBar from './components/UserNavBar';
import AdminNavBar from './components/AdminNavBar';
import Logout from './pages/Logout';

// Example authentication and role check
const isAuthenticated = !!localStorage.getItem('token');
const isAdmin = localStorage.getItem('role') === 'admin';

const AuthenticatedLayout = ({ children }) => (
  <>
    {isAdmin ? <AdminNavBar /> : <UserNavBar />}
    {children}
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/logout" element={<Logout />} />

        {isAuthenticated && (
          <>
            {isAdmin ? (
              // Admin Routes
              <>
                <Route path="/admin" element={<AuthenticatedLayout><AdminPage /></AuthenticatedLayout>} />
                <Route path="/admin/accommodations" element={<AuthenticatedLayout><AccommodationPage /></AuthenticatedLayout>} />
                <Route path="/admin/bookings" element={<AuthenticatedLayout><BookingListPage /></AuthenticatedLayout>} />
                <Route path="/admin/users" element={<AuthenticatedLayout><UserManagementPage /></AuthenticatedLayout>} />
                <Route path="/admin/reports" element={<AuthenticatedLayout><ReportManagementPage /></AuthenticatedLayout>} />
              </>
            ) : (
              // User Routes
              <>
                <Route path="/trips" element={<AuthenticatedLayout><TripListPage /></AuthenticatedLayout>} />
                <Route path="/expenses" element={<AuthenticatedLayout><ExpenseListPage /></AuthenticatedLayout>} />
                <Route path="/Profile" element={<AuthenticatedLayout><UserProfilePage /></AuthenticatedLayout>} />
              </>
            )}
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
