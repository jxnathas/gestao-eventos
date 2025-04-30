import { useState, useEffect } from 'react';
import { fetchUserById } from '@/lib/api/userApi';
import { useAuthStore } from '@/lib/stores/authStore';
import { User } from '@/types/user';

export function useUser() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        if (userId) {
          const fetchedUser = await fetchUserById(userId);
          setUserData(fetchedUser);
        } else {
          setError('User ID is not available');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return { user: userData, loading, error };
}