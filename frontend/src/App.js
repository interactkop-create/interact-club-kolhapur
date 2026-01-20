import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import { AdminMessages } from "./pages/admin/AdminMessages";
import { AdminBoardMembers } from "./pages/admin/AdminBoardMembers";
import { AdminEvents } from "./pages/admin/AdminEvents";
import { AdminNews } from "./pages/admin/AdminNews";
import { AdminGallery } from "./pages/admin/AdminGallery";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/board-members" element={<ProtectedRoute><AdminLayout><AdminBoardMembers /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute><AdminLayout><AdminEvents /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/news" element={<ProtectedRoute><AdminLayout><AdminNews /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute><AdminLayout><AdminGallery /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />

            {/* Public routes */}
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/about" element={<><Header /><About /><Footer /></>} />
            <Route path="/events" element={<><Header /><Events /><Footer /></>} />
            <Route path="/upcoming-events" element={<><Header /><UpcomingEvents /><Footer /></>} />
            <Route path="/board" element={<><Header /><Board /><Footer /></>} />
            <Route path="/news" element={<><Header /><News /><Footer /></>} />
            <Route path="/gallery" element={<><Header /><Gallery /><Footer /></>} />
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
