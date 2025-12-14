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

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        console.log('✅ User signed in via OAuth, syncing with backend...');
        
        // Import api here to avoid circular dependency
        const { default: api } = await import('./api/axios');
        
        // Sync user with backend (this creates the user record if new)
        const syncResponse = await api.post('/user/sync', { 
          clerkUser: user 
        });
        
        console.log('Sync response:', syncResponse.data);
        
        // Check profile completion from sync response
        if (syncResponse.data.success && !syncResponse.data.data.profileCompleted) {
          console.log('📝 New user, redirecting to onboarding...');
          navigate('/onboarding', { replace: true });
        } else {
          console.log('👤 Existing user, redirecting to dashboard...');
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        // For new users, if sync fails, still send to onboarding
        console.log('⚠️ Error occurred, defaulting to onboarding...');
        navigate('/onboarding', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001D39]">
      <div className="text-white text-xl">
        {isChecking ? 'Completing sign in...' : 'Redirecting...'}
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
