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
  const { isSignedIn, isLoaded, user } = useAuth();
  const [isChecking, setIsChecking] = React.useState(true);
  const [status, setStatus] = React.useState('Initializing...');

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[SSOCallback] Starting callback handler...');
      console.log('[SSOCallback] isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'user:', !!user);
      
      if (!isLoaded) {
        setStatus('Loading authentication...');
        return;
      }
      
      if (!isSignedIn) {
        console.log('[SSOCallback] User not signed in, redirecting to landing...');
        navigate('/', { replace: true });
        return;
      }
      
      if (!user) {
        setStatus('Waiting for user data...');
        return;
      }

      try {
        setStatus('Syncing with backend...');
        console.log('[SSOCallback] Syncing user:', user.id);
        
        // Import api here to avoid circular dependency
        const { default: api } = await import('./api/axios');
        
        // Sync user with backend (this creates the user record if new)
        console.log('[SSOCallback] Calling /user/sync...');
        const syncResponse = await api.post('/user/sync', { 
          clerkUser: user 
        });
        
        console.log('[SSOCallback] Sync response:', syncResponse.data);
        
        // Check profile completion from sync response
        if (syncResponse.data.success && !syncResponse.data.data.profileCompleted) {
          console.log('[SSOCallback] New user, redirecting to onboarding...');
          setStatus('Redirecting to onboarding...');
          setTimeout(() => navigate('/onboarding', { replace: true }), 100);
        } else {
          console.log('[SSOCallback] Existing user, redirecting to dashboard...');
          setStatus('Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 100);
        }
      } catch (error) {
        console.error('[SSOCallback] Error in OAuth callback:', error);
        console.error('[SSOCallback] Error details:', error.response?.data || error.message);
        setStatus('Error occurred, redirecting to onboarding...');
        // For new users, if sync fails, still send to onboarding
        setTimeout(() => navigate('/onboarding', { replace: true }), 100);
      } finally {
        setIsChecking(false);
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001D39]">
      <div className="text-white text-center">
        <div className="text-2xl mb-4">
          {isChecking ? 'Completing sign in...' : 'Redirecting...'}
        </div>
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
