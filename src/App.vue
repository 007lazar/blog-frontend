<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {Button} from "@/components/ui/button";
import {useAuthStore} from "@/stores/auth.ts";
import router from "@/router";

const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push('/login')
}

</script>

<template>
  <nav class="bg-white shadow flex items-center justify-between px-8 py-4">
    <!-- Left: Brand -->
    <RouterLink to="/" class="text-2xl font-bold text-gray-800 hover:text-gray-600">
      MyBlogs
    </RouterLink>

    <!-- Center: Links -->
    <div class="flex space-x-6">
      <RouterLink to="/blogs" class="text-lg text-gray-700 hover:text-gray-500">
        Blogs
      </RouterLink>
      <RouterLink
          v-if="auth.isAuthenticated"
          to="/blog/create"
          class="text-lg text-gray-700 hover:text-gray-500"
      >
        Create Blog
      </RouterLink>
    </div>

    <!-- Right: Auth Buttons -->
    <div>
      <RouterLink v-if="!auth.isAuthenticated" to="/login">
        <Button variant="ghost" class="text-blue-600">Login</Button>
      </RouterLink>
      <Button
          v-else
          variant="ghost"
          class="text-red-600"
          @click="handleLogout"
      >
        Logout
      </Button>
    </div>
  </nav>

  <RouterView />
</template>


