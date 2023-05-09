import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://dinggul.me',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
})

export default instance
