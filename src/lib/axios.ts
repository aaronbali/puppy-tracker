import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://puppy-tracker-teal.vercel.app'
  : '';

export const api = axios.create({ baseURL });
