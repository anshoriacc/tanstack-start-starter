import axios from 'axios'
import { BACKEND_URL } from '@/constants/env'

const BASE_URL = BACKEND_URL

export const axiosApi = axios.create({
  baseURL: BASE_URL,
})

export default axiosApi
