import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://stageapi.monkcommerce.app/task',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY || '',
  },
});

