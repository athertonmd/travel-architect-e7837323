
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import ViewTrip from "@/pages/ViewTrip";
import Auth from "@/pages/Auth";
import CreateTrip from "@/pages/CreateTrip";
import SabreCredentials from "@/pages/SabreCredentials";
import PdfDesignSettings from "@/pages/PdfDesignSettings";
import Archive from "@/pages/Archive";
import HotelBank from "@/pages/HotelBank";
import ManageTravellers from "@/pages/ManageTravellers";
import Notifications from "@/pages/Notifications";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="auth" element={<Auth />} />
              <Route index element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
              <Route path="trip/:id" element={<ProtectedRoute><ViewTrip /></ProtectedRoute>} />
              <Route path="settings/sabre" element={<ProtectedRoute><SabreCredentials /></ProtectedRoute>} />
              <Route path="settings/pdf-design" element={<ProtectedRoute><PdfDesignSettings /></ProtectedRoute>} />
              <Route path="archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
              <Route path="hotels" element={<ProtectedRoute><HotelBank /></ProtectedRoute>} />
              <Route path="travellers" element={<ProtectedRoute><ManageTravellers /></ProtectedRoute>} />
              <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </React.StrictMode>
  );
}
