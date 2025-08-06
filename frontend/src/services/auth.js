import api from './api';

export const login = async (dni, password, rememberMe = false) => {
  try {
    const res = await api.post('/usuarios/login', {
      dni,
      password,
      rememberMe
    });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Error en la API');
  }
};
