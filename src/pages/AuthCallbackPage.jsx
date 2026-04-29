import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Landing page for OAuth2 callbacks.
 *
 * The Spring Boot backend redirects here after a successful Google/GitHub login:
 * {@code http://localhost:5173/auth/callback?token=<jwt>}
 *
 * This page reads the token from the query string, stores it, then redirects to /app.
 */
export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      saveToken(token);
      navigate('/app', { replace: true });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, saveToken, navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-neutral-400">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm">Finishing sign-in…</p>
      </div>
    </div>
  );
}
