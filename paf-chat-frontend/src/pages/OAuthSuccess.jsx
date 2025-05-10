
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      login(token);
      toast.success('Logged in with Google');
      navigate('/home');
    } else {
      toast.error('Login failed');
      navigate('/signin');
    }
  }, [token]);

  return null;
}
