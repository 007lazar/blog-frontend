<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    auth.loginSuccess(data.user, data.accessToken)

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    router.push('/')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Login failed')
  }
}
</script>


<template>
  <Card class="mx-auto mt-[200px] max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              v-model="email"
              required
          />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input
              id="password"
              type="password"
              v-model="password"
              required
          />
        </div>

        <Button
            type="submit"
            class="w-full"
            @click="handleLogin"
        >
          Login
        </Button>
      </div>

      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <RouterLink
            to="signup"
            class="underline font-bold text-blue-600 hover:text-blue-800"
        >
          Sign up
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
