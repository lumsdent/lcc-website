import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const loginWithDiscord = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/discord'
}

export const getCurrentUser = () => api.get('/auth/me')

export const logout = () => {
  localStorage.removeItem('jwt_token')
  window.location.href = '/login'
}

export default api
