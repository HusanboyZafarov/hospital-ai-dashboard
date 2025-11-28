import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { Dashboard } from "./pages/Dashboard";
import { PatientsList } from "./pages/PatientsList";
import { PatientProfile } from "./pages/PatientProfile";
import { Medications } from "./pages/Medications";
import { Diet } from "./pages/Diet";
import { Activities } from "./pages/Activities";
import { AIAssistant } from "./pages/AIAssistant";
import { Appointments } from "./pages/Appointments";
import { Surgeries } from "./pages/Surgeries";

// For push

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patient/:id" element={<PatientProfile />} />
        <Route path="/surgeries" element={<Surgeries />} />
        <Route path="/records" element={<Dashboard />} />
        <Route path="/care-plans" element={<Dashboard />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/settings" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
