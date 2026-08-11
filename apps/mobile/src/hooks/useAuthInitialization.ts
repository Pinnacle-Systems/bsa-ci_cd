import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestLocationPermission } from '@Utils/CustomLocation';

import Logger from '../utils/Logger';

export const useAuthInitialization = () => {
  const [tempUser, setTempUser] = useState('');
  const [compcode, setCompcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('userName');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setIsAdmin(parsed?.isAdmin || 0);
          setCompcode(parsed?.GCOMPCODE || '');
          setTempUser(parsed?.roleId || '');
        }
      } catch (error) {
        Logger.error('[useAuthInitialization] Failed to load stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    requestLocationPermission();
  }, []);

  const userRoleId = useMemo(
    () => (tempUser && compcode ? `${tempUser?.split('@')[0]}@${compcode}` : ''),
    [compcode, tempUser],
  );

  return { loading, isAdmin, userRoleId };
};
