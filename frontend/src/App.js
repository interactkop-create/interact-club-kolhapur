import { useState, useEffect } from "react";
import { Maintenance } from "./pages/Maintenance";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Events } from "./pages/Events";
import { UpcomingEvents } from "./pages/UpcomingEvents";
import { Board } from "./pages/Board";
import { News } from "./pages/News";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminBoardMembers } from "./pages/admin/AdminBoardMembers";
import { AdminEvents } from "./pages/admin/AdminEvents";
import { AdminNews } from "./pages/admin/AdminNews";
import { AdminGallery } from "./pages/admin/AdminGallery";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminTasks } from "./pages/admin/AdminTasks";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/maintenance-status`);
        const data = await response.json();
        setMaintenanceMode(data.maintenance_mode);
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      } finally {
        setCheckingMaintenance(false);
      }
    };
    checkMaintenance();
  }, []);

  if (checkingMaintenance) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Admin routes - always accessible */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected admin routes with admin layout */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="board-members" element={<AdminBoardMembers />} />
                    <Route path="events" element={<AdminEvents />} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="tasks" element={<AdminTasks />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Public routes - show maintenance page if enabled */}
            <Route path="/*" element={
              maintenanceMode ? (
                <Maintenance />
              ) : (
                <>
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route index element={<Home />} />
                      <Route path="about" element={<About />} />
                      <Route path="events" element={<Events />} />
                      <Route path="upcoming-events" element={<UpcomingEvents />} />
                      <Route path="board" element={<Board />} />
                      <Route path="news" element={<News />} />
                      <Route path="gallery" element={<Gallery />} />
                      <Route path="contact" element={<Contact />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              )
            } />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </AuthProvider>
  );
}
