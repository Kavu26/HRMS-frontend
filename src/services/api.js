import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeService = {
  getAll: async () => {
    const response = await api.get('/api/employees');
    return response.data;
  },
  
  getById: async (employeeId) => {
    const response = await api.get(`/api/employees/${employeeId}`);
    return response.data;
  },
  
  create: async (employeeData) => {
    const response = await api.post('/api/employees', employeeData);
    return response.data;
  },
  
  delete: async (employeeId) => {
    await api.delete(`/api/employees/${employeeId}`);
  },
};

export const attendanceService = {
  getAll: async () => {
    const response = await api.get('/api/attendance');
    return response.data;
  },
  
  getById: async (attendanceId) => {
    const response = await api.get(`/api/attendance/${attendanceId}`);
    return response.data;
  },
  
  getByEmployee: async (employeeId) => {
    const response = await api.get(`/api/attendance/employee/${employeeId}`);
    return response.data;
  },
  
  create: async (attendanceData) => {
    const response = await api.post('/api/attendance', attendanceData);
    return response.data;
  },
  
  update: async (attendanceId, attendanceData) => {
    const response = await api.put(`/api/attendance/${attendanceId}`, attendanceData);
    return response.data;
  },
  
  delete: async (attendanceId) => {
    await api.delete(`/api/attendance/${attendanceId}`);
  },
};

export default api;
