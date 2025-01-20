import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { AuthPage } from "./pages/AuthPage";
import { BrainView } from "./pages/BrainView";
import { ProfilePage } from "./pages/ProfilePage";
import "./App.css";
import { Toaster } from "./components/ui/toaster";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  let { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");
  if (token) isAuthenticated = true;
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
          </Route>
          <Route
            path="/brain/:shareLink"
            element={
              <ProtectedRoute>
                <Layout>
                  <BrainView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
