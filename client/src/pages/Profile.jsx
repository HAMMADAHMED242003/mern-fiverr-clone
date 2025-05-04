import { useState, useEffect } from 'react';
import { getProfile, refreshToken } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!token && refreshTokenValue) {
          const { accessToken } = await refreshToken(refreshTokenValue);
          localStorage.setItem('token', accessToken);
        }
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        if (err.message.includes('Token') || err.message.includes('refresh')) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!user) return <div className="text-center mt-10">User not found</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="mb-4">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
          }}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;