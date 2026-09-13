import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import AiImprove from './components/AiImprove';
import ResumePreview from './components/ResumePreview';
import Jobs from './components/Jobs';
import JobDetails from './components/JobDetails';
import AiJobMatch from './components/AiJobMatch';
import ApplyJob from './components/ApplyJob';
import Applications from './components/Applications';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import AdminJobForm from './components/AdminJobForm';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Protected Candidate Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/resume/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/resume/experience" element={<ProtectedRoute><Experience /></ProtectedRoute>} />
          <Route path="/resume/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="/resume/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/resume/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
          <Route path="/ai-improve" element={<ProtectedRoute><AiImprove /></ProtectedRoute>} />
          <Route path="/jobs/:id/match" element={<ProtectedRoute><AiJobMatch /></ProtectedRoute>} />
          <Route path="/jobs/:id/apply" element={<ProtectedRoute><ApplyJob /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/jobs/new" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
          <Route path="/admin/jobs/:id/edit" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
