import axios from 'axios'
import router from './router'

const api = axios.create({
    baseURL: 'http://localhost:3000',
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let isRefreshing = false
let queue: Array<(token: string) => void> = []

function onRefreshed(token: string) {
    queue.forEach(cb => cb(token))
    queue = []
}

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true

            if (!isRefreshing) {
                isRefreshing = true
                try {
                    const refreshToken = localStorage.getItem('refreshToken')
                    const { data } = await axios.post('http://localhost:3000/auth/refresh', { refreshToken })
                    localStorage.setItem('accessToken', data.accessToken)
                    isRefreshing = false
                    onRefreshed(data.accessToken)
                    original.headers.Authorization = `Bearer ${data.accessToken}`
                    return api(original)
                } catch {
                    isRefreshing = false
                    localStorage.clear()
                    router.push('/login')
                    return Promise.reject(err)
                }
            }

            return new Promise(resolve => {
                queue.push((newToken: string) => {
                    original.headers.Authorization = `Bearer ${newToken}`
                    resolve(api(original))
                })
            })
        }

        return Promise.reject(err)
    }
)

export default api