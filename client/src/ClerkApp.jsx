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

// Auth completion component - runs after Clerk OAuth completes
function AuthComplete() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, user } = useAuth();
  const [status, setStatus] = React.useState('Checking profile...');

  useEffect(() => {
    const checkProfile = async () => {
      console.log('[AuthComplete] Checking profile status...');
      
      if (!isLoaded) {
        setStatus('Loading...');
        return;
      }

      if (!isSignedIn || !user) {
        console.log('[AuthComplete] Not signed in, redirecting to landing...');
        navigate('/', { replace: true });
        return;
      }

      try {
        console.log('[AuthComplete] User signed in, syncing with backend...');
        setStatus('Syncing account...');
        
        const { default: api } = await import('./api/axios');
        
        const syncResponse = await api.post('/user/sync', { 
          clerkUser: user 
        });
        
        console.log('[AuthComplete] Sync response:', syncResponse.data);
        
        if (syncResponse.data.success && !syncResponse.data.data.profileCompleted) {
          console.log('[AuthComplete] New user, redirecting to onboarding...');
          navigate('/onboarding', { replace: true });
        } else {
          console.log('[AuthComplete] Existing user, redirecting to dashboard...');
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('[AuthComplete] Error:', error);
        navigate('/onboarding', { replace: true });
      }
    };

    checkProfile();
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001D39]">
      <div className="text-white text-center">
        <div className="text-2xl mb-4">Setting up your account...</div>
        <div className="text-sm opacity-70">{status}</div>
      </div>
    </div>
  );
}

export default function ClerkApp() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <AxiosInterceptor />
      <Routes>
        <Route path="/login/*" element={<LandingPage autoOpenLogin={true} />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Clerk OAuth callback - completes handshake then redirects to /auth/complete */}
        <Route 
          path="/sso-callback" 
          element={
            <AuthenticateWithRedirectCallback 
              signInFallbackRedirectUrl="/auth/complete"
              signUpFallbackRedirectUrl="/auth/complete"
            />
          } 
        />
        
        {/* After OAuth completes, check profile and redirect appropriately */}
        <Route path="/auth/complete" element={<AuthComplete />} />
        
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

