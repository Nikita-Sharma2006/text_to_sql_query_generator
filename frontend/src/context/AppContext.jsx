import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Configure Request Interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shogun_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to parse database table info from raw sql schema content
const parseTablesFromSql = (name, rawSql) => {
  const tableRegex = /CREATE\s+TABLE\s+([a-zA-Z0-9_`]+)\s*\(([\s\S]*?)\);/gi;
  const tables = [];
  let match;

  while ((match = tableRegex.exec(rawSql)) !== null) {
    const tableName = match[1].replace(/[`"']/g, '');
    const columnsBlock = match[2];
    const columnLines = columnsBlock.split(',').map(line => line.trim());
    const columns = [];

    columnLines.forEach(line => {
      if (/^(PRIMARY KEY|KEY|CONSTRAINT|FOREIGN KEY|UNIQUE)/i.test(line)) return;
      const colMatch = /^([a-zA-Z0-9_`]+)\s+([a-zA-Z]+(\([0-9,]+\))?)/i.exec(line);
      if (colMatch) {
        columns.push(`${colMatch[1].replace(/[`"']/g, '')} (${colMatch[2].toUpperCase()})`);
      }
    });

    tables.push({
      name: tableName,
      columns: columns.length > 0 ? columns : ['id (INT)', 'name (VARCHAR)']
    });
  }

  if (tables.length === 0) {
    tables.push({
      name: name.replace(/\.sql$/i, ''),
      columns: ['id (INT)', 'created_at (TIMESTAMP)', 'data (JSON)']
    });
  }
  return tables;
};

// Map backend schema document to frontend expectations
const mapBackendSchema = (s) => {
  const tables = parseTablesFromSql(s.schemaName, s.schemaContent);
  return {
    id: s._id,
    name: s.schemaName,
    size: `${(s.schemaContent.length / 1024).toFixed(1)} KB`,
    tableCount: tables.length,
    tables: tables,
    timestamp: new Date(s.uploadedAt).toISOString().replace('T', ' ').substring(0, 16)
  };
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shogun_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('shogun_token') || null);

  const [historyList, setHistoryList] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [schemasList, setSchemasList] = useState([]);

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('shogun_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: false,
      notifications: true,
      scrollSpeed: 'steady'
    };
  });

  // Sync token to local storage and axios header
  useEffect(() => {
    if (token) {
      localStorage.setItem('shogun_token', token);
    } else {
      localStorage.removeItem('shogun_token');
    }
  }, [token]);

  // Sync settings
  useEffect(() => {
    localStorage.setItem('shogun_settings', JSON.stringify(settings));
  }, [settings]);

  // Fetch all user specific details from backend
  const fetchUserData = async () => {
    try {
      const [historyRes, favoritesRes, schemasRes] = await Promise.all([
        api.get('/history'),
        api.get('/favorites'),
        api.get('/schemas')
      ]);

      if (historyRes.data.success) setHistoryList(historyRes.data.data);
      if (favoritesRes.data.success) setFavoritesList(favoritesRes.data.data);
      if (schemasRes.data.success) setSchemasList(schemasRes.data.data);
    } catch (err) {
      console.error('Failed to fetch user specific info from backend:', err);
    }
  };

  // Fetch data on token changes
  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setHistoryList([]);
      setFavoritesList([]);
      setSchemasList([]);
    }
  }, [token]);

  // Compute schemas list dynamically
  const schemas = schemasList.map(s => mapBackendSchema(s));

  // Compute combined queries (history logs + starred collections)
  const queries = (() => {
    const list = historyList.map(h => {
      const fav = favoritesList.find(f => f.generatedSQL === h.generatedSQL);
      return {
        id: h._id,
        prompt: h.prompt,
        sql: h.generatedSQL,
        explanation: h.explanation,
        timestamp: new Date(h.createdAt).toISOString().replace('T', ' ').substring(0, 16),
        isFavorite: !!fav,
        favoriteId: fav ? fav._id : null
      };
    });

    // Merge favorites not in history
    favoritesList.forEach(fav => {
      if (!list.some(q => q.sql === fav.generatedSQL)) {
        list.push({
          id: `fav-dummy-${fav._id}`,
          prompt: fav.prompt,
          sql: fav.generatedSQL,
          explanation: 'Starred query template.',
          timestamp: new Date(fav.createdAt).toISOString().replace('T', ' ').substring(0, 16),
          isFavorite: true,
          favoriteId: fav._id
        });
      }
    });

    // Sort by id descending
    return list.sort((a, b) => b.id.localeCompare(a.id));
  })();

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data.data;
        const mappedUser = {
          id: receivedUser.id || receivedUser._id,
          name: receivedUser.fullName,
          email: receivedUser.email,
          avatar: '/assets/samurai_avatar.png'
        };
        localStorage.setItem('shogun_token', receivedToken);
        localStorage.setItem('shogun_user', JSON.stringify(mappedUser));

        setUser(mappedUser);
        setToken(receivedToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Login credentials rejected.');
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { fullName: name, email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data.data;
        const mappedUser = {
          id: receivedUser.id || receivedUser._id,
          name: receivedUser.fullName,
          email: receivedUser.email,
          avatar: '/assets/samurai_avatar.png'
        };
        localStorage.setItem('shogun_token', receivedToken);
        localStorage.setItem('shogun_user', JSON.stringify(mappedUser));

        setUser(mappedUser);
        setToken(receivedToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Registration rejected.');
    }
  };

  const logout = () => {
    localStorage.removeItem('shogun_token');
    localStorage.removeItem('shogun_user');
    setUser(null);
    setToken(null);
    setHistoryList([]);
    setFavoritesList([]);
    setSchemasList([]);
  };

  const toggleFavorite = async (queryId) => {
    const query = queries.find(q => q.id === queryId);
    if (!query) return;

    try {
      if (query.isFavorite) {
        const favId = query.favoriteId;
        if (favId) {
          const res = await api.delete(`/favorites/${favId}`);
          if (res.data.success) {
            setFavoritesList(prev => prev.filter(f => f._id !== favId));
          }
        }
      } else {
        const res = await api.post('/favorites', {
          prompt: query.prompt,
          generatedSQL: query.sql
        });
        if (res.data.success) {
          setFavoritesList(prev => [res.data.data, ...prev]);
        }
      }
    } catch (err) {
      console.error('Star toggle failed:', err);
      throw new Error(err.response?.data?.message || 'Failed to toggle favorite.');
    }
  };

  const deleteQuery = async (queryId) => {
    try {
      const res = await api.delete(`/history/${queryId}`);
      if (res.data.success) {
        setHistoryList(prev => prev.filter(h => h._id !== queryId));
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to delete query record.');
    }
  };

  const uploadSchema = async (name, rawSql) => {
    try {
      const blob = new Blob([rawSql], { type: 'text/plain' });
      const file = new File([blob], name, { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('schemaFile', file);

      const res = await api.post('/schemas/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        const schemasRes = await api.get('/schemas');
        if (schemasRes.data.success) {
          setSchemasList(schemasRes.data.data);
        }
        return res.data.data.schema;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to upload schema.');
    }
  };

  const deleteSchema = async (schemaId) => {
    try {
      const res = await api.delete(`/schemas/${schemaId}`);
      if (res.data.success) {
        setSchemasList(prev => prev.filter(s => s._id !== schemaId));
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to delete schema.');
    }
  };

  const generateSQL = async (prompt) => {
    try {
      const res = await api.post('/ai/generate', { prompt });
      if (res.data.success) {
        const data = res.data.data;
        
        // Refresh history list if query was successfully generated (no clarification required)
        if (!data.needsClarification) {
          const historyRes = await api.get('/history');
          if (historyRes.data.success) {
            setHistoryList(historyRes.data.data);
          }
        }
        
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to generate query.');
    }
  };

  const executeSQL = async (sql) => {
    try {
      const res = await api.post('/ai/execute', { sql });
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to execute database query.');
    }
  };

  const updateProfile = async (name, email) => {
    try {
      const res = await api.put('/auth/profile', { fullName: name, email });
      if (res.data.success) {
        const updatedUser = {
          ...user,
          name: res.data.data.user.fullName,
          email: res.data.data.user.email
        };
        localStorage.setItem('shogun_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const res = await api.put('/auth/change-password', { oldPassword, newPassword });
      return res.data.success;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const toggleSettings = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <AppContext.Provider value={{
      user,
      queries,
      schemas,
      settings,
      login,
      register,
      logout,
      toggleFavorite,
      deleteQuery,
      uploadSchema,
      deleteSchema,
      generateSQL,
      executeSQL,
      updateProfile,
      updatePassword,
      toggleSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
