import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import PrivateRoute from "./components/shared/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/shared/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Create history instance outside component
const history = createBrowserHistory();

function App() {
  return (
    <HistoryRouter
      history={history}
      future={{
        v7_startTransition: true, // Enables React.startTransition wrapping
        v7_relativeSplatPath: true, // New relative path resolution
        v7_partialHydration: true, // Optional: For SSR improvements
      }}
    >
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </HistoryRouter>
  );
}

export default App;
