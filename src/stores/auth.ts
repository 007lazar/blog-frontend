import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null as User | null
    }),
    actions: {
        loginSuccess(userData: User, accessToken: string) {
            this.isAuthenticated = true
            this.user = userData

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('user', JSON.stringify(userData))
        },
        logout() {
            this.isAuthenticated = false
            this.user = null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
        },
        checkAuth() {
            const token = localStorage.getItem('accessToken')
            const userData = localStorage.getItem('user')

            if (token && userData) {
                try {
                    const parsed = JSON.parse(userData)

                    if (parsed && typeof parsed._id === 'string') {
                        this.isAuthenticated = true
                        this.user = parsed as User
                        return
                    } else {
                        // clear corrupted shape
                        localStorage.removeItem('user')
                    }
                } catch {
                    // clear corrupted JSON
                    localStorage.removeItem('user')
                }
            }

            this.isAuthenticated = false
            this.user = null
        }
    }
})