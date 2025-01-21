import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { Toaster } from 'sonner';
import Auth from './pages/Auth';
import Index from './pages/Index';
import CreateTrip from './pages/CreateTrip';
import ViewTrip from './pages/ViewTrip';
import Archive from './pages/Archive';
import ManageTravellers from './pages/ManageTravellers';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          } />
          <Route path="/trip/:id" element={
            <ProtectedRoute>
              <ViewTrip />
            </ProtectedRoute>
          } />
          <Route path="/archive" element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          } />
          <Route path="/travellers" element={
            <ProtectedRoute>
              <ManageTravellers />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </SessionContextProvider>
  );
}

export default App;