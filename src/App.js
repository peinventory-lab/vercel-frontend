import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Shared / mixed
import Dashboard from './components/Dashboard';

// Director
import DirectorDashboard from './pages/director/DirectorDashboard';
import InventorySummaryPage from './pages/InventorySummaryPage';
import AddUserPage from './pages/director/AddUserPage';

// Inventory Manager
import InventoryManagerDashboard from './pages/manager/InventoryManagerDashboard';
import InventoryPage from './pages/InventoryPage';
import ApprovePage from './pages/ApprovePage';
import FulfillRequestsPage from './pages/FulfillRequestsPage';

// STEMbassador
import StembassadorDashboard from './pages/stembassador/StembassadorDashboard';
import RequestItemsPage from './pages/stembassador/RequestItemsPage';

// Optional: a simple not-found
const NotFound = () => <div style={{ padding: 24 }}>Page not found.</div>;

// Your guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ---------- Public routes ---------- */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ---------- Authenticated (any role) ---------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ---------- Director-only ---------- */}
      <Route
        path="/dashboard/director"
        element={
          <ProtectedRoute role="director">
            <DirectorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/director/inventory"
        element={
          <ProtectedRoute role="director">
            <InventorySummaryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/director/add-user"
        element={
          <ProtectedRoute role="director">
            <AddUserPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Inventory Manager-only ---------- */}
      <Route
        path="/dashboard/inventory"
        element={
          <ProtectedRoute role="inventoryManager">
            <InventoryManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ ALLOW both inventoryManager and stembassador */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute role={["inventoryManager", "stembassador"]}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approve"
        element={
          <ProtectedRoute role="inventoryManager">
            <ApprovePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request"
        element={
          <ProtectedRoute role="inventoryManager">
            <FulfillRequestsPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- STEMbassador-only ---------- */}
      <Route
        path="/dashboard/stembassador"
        element={
          <ProtectedRoute role="stembassador">
            <StembassadorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stembassador/request"
        element={
          <ProtectedRoute role="stembassador">
            <RequestItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-items"
        element={
          <ProtectedRoute role="stembassador">
            <RequestItemsPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Fallback ---------- */}
      <Route path="/unauthorized" element={<div style={{ padding: 24 }}>Unauthorized</div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;