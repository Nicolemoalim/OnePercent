import config from '../config/config';

export const isAuthenticated = () => {
  const token = localStorage.getItem(config.TOKEN_KEY);
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem(config.TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(config.TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(config.TOKEN_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/login';
};