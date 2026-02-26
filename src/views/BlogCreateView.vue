<!-- src/views/CreatePost.vue -->
<script setup lang="ts">
import type { BlogView } from '@/types/blog.ts'
import { ref }              from 'vue'
import { useRouter }        from 'vue-router'
import api                   from '@/api.ts'

import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import {useAuthStore} from "@/stores/auth.ts";


const auth = useAuthStore()
const title         = ref<string>('')
const content       = ref<string>('')
const tagsInput     = ref<string>('')
const errorMessage  = ref<string>('')
const isSubmitting  = ref<boolean>(false)

const router = useRouter()

async function handleSubmit() {
  errorMessage.value = ''
  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = 'Title and content are required'
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      title:   title.value.trim(),
      content: content.value.trim(),
      author: auth.user?._id || "Unknown user",
      tags:    tagsInput.value
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
    }

    await api.post<BlogView>('/blog/create', payload)

    router.push(`/blogs`)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to publish post'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Create New Blog Post</h1>

    <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <Label for="title">Title</Label>
        <Input
            id="title"
            v-model="title"
            type="text"
            placeholder="My awesome blog post"
            required
        />
      </div>

      <div>
        <Label for="content">Content</Label>
        <textarea
            id="content"
            v-model="content"
            rows="8"
            class="w-full border border-gray-300 rounded-md p-2
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write your story here..."
            required
        />
      </div>

      <div>
        <Label for="tags">
          Tags
          <span class="text-sm text-gray-500">(comma-separated)</span>
        </Label>
        <Input
            id="tags"
            v-model="tagsInput"
            type="text"
            placeholder="vue, nestjs, tailwind"
        />
      </div>

      <Button
          type="submit"
          class="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Publishing…' : 'Publish Post' }}
      </Button>
    </form>
  </main>
</template>