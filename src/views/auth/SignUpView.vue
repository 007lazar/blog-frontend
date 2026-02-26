<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {computed, ref} from "vue";
import api from "@/api.ts";
import {useRouter} from "vue-router";


const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const errorMessage = ref('')
const router= useRouter()



const passwordsMismatch = computed(() =>
    confirmPassword.value.length > 0 &&
    password.value !== confirmPassword.value
)

async function handleRegister() {
  errorMessage.value = ''

  if (passwordsMismatch.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    const { data } = await api.post('/auth/register', {
      firstName:       firstName.value,
      lastName:        lastName.value,
      username:        username.value,
      email:           email.value,
      password:        password.value,
      confirmPassword: confirmPassword.value
    })
    router.push('/login')
    console.log(JSON.stringify(data))
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Registration failed'
  }
}


</script>

<template>
  <Card class="mx-auto mt-[150px] max-w-sm">
    <form @submit.prevent="handleRegister" class="p-6 space-y-4">
      <h2 class="text-2xl font-semibold text-center">Sign Up</h2>

      <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>

      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="first-name">First name</Label>
            <Input id="first-name" placeholder="Max" required v-model="firstName" />
          </div>
          <div class="grid gap-2">
            <Label for="last-name">Last name</Label>
            <Input id="last-name" placeholder="Robinson" required v-model="lastName" />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="username">Username</Label>
          <Input
              id="username"
              placeholder="john-doe123"
              required
              v-model="username"
          />
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="email"
          />
        </div>
      </div>
      <div>
        <Label for="password">Password</Label>
        <Input id="password" type="password" v-model="password" required />
      </div>

      <div>
        <Label for="confirmPassword">Confirm Password</Label>
        <Input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            required
        />
        <!-- show live error under confirm field -->
        <p
            v-if="passwordsMismatch"
            class="text-red-600 text-sm mt-1"
        >
          Passwords do not match
        </p>
      </div>

      <!-- disable button if mismatch -->
      <Button
          type="submit"
          class="w-full"
          :disabled="passwordsMismatch"
      >
        Create Account
      </Button>

      <p class="text-center text-sm mt-4">
        Already have an account?
        <RouterLink to="/login" class="underline font-bold text-blue-600 hover:text-blue-800">
          Log in
        </RouterLink>
      </p>
    </form>
  </Card>
</template>


