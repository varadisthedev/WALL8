import React, { useEffect } from 'react';
import { ClerkProvider, useAuth, SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { setupAxiosInterceptors } from './api/axios';
import App from './App';
import Login from './pages/Login';
import SignUpPage from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import LandingPage from './pages/LandingPage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function AxiosInterceptor() {
  const { getToken } = useAuth();

  useEffect(() => {
    setupAxiosInterceptors(getToken);
  }, [getToken]);

  return null;
}

// Custom SSO Callback component that handles redirect
function SSOCallback() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('✅ User signed in via OAuth, redirecting to /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001D39]">
      <div className="text-white text-xl">Completing sign in...</div>
    </div>
  );
}

export default function ClerkApp() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <AxiosInterceptor />
      <Routes>
        <Route path="/login/*" element={<LandingPage autoOpenLogin={true} />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/sso-callback" element={<SSOCallback />} />
        
        <Route 
          path="/" 
          element={
            <>
              <SignedIn>
                <App />
              </SignedIn>
              <SignedOut>
                <LandingPage />
              </SignedOut>
            </>
          } 
        />
        <Route path="/dashboard" element={<App />} />
        
        {/* Catch all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ClerkProvider>
  );
}
