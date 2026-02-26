<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

import type { BlogView } from '@/types/blog'
import type { CommentView } from '@/types/comment'

import { Card, CardHeader, CardTitle, CardContent, CardFooter,} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

// component state
const auth = useAuthStore()
const blogs = ref<BlogView[]>([])
const loading = ref(false)
const commentInputs = ref<Record<string, string>>({})
const submitting = ref<Record<string, boolean>>({})

// helper to flatten raw API response into your BlogView
function normalize(raw: any): BlogView {
  return {
    _id: raw._id,
    title: raw.title,
    content: raw.content,
    author: raw.author.username,
    tags: raw.tags,
    comments: (raw.comments as any[]).map(
        (c): CommentView => ({
          user: c.userId?.username ?? "Unknown user",
          content: c.content,
          createdAt: c.createdAt,
        })
    ),
  }
}


async function fetchBlogs() {
  loading.value = true
  try {
    const { data: raw } = await api.get<any[]>('/blog')
    blogs.value = raw.map(normalize)
  } catch (err) {
    console.error('Failed to load blogs', err)
  } finally {
    loading.value = false
  }
}

// post a comment, then replace that one blog with the updated version
async function submitComment(blogId: string) {
  const content = commentInputs.value[blogId]?.trim()
  if (!content) return

  submitting.value[blogId] = true
  try {
    const { data: updatedRaw } = await api.post<any>('/blog/comment/create', {
      blogId,
      content,
      userId: auth.user?._id,
    })
    const updated = normalize(updatedRaw)
    const i = blogs.value.findIndex((b) => b._id === blogId)
    if (i > -1) blogs.value[i] = updated
    commentInputs.value[blogId] = ''
  } catch (err) {
    console.error('Could not post comment', err)
    alert('Error posting comment.')
  } finally {
    submitting.value[blogId] = false
  }
}

onMounted(fetchBlogs)
</script>

<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">All Blogs</h1>

    <div v-if="loading" class="text-center text-muted-foreground">
      Loading...
    </div>

    <div v-else class="space-y-6">
      <Card
          v-for="blog in blogs"
          :key="blog._id"
          class="border hover:shadow transition-shadow"
      >
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle>{{ blog.title }}</CardTitle>
            <div class="flex space-x-2">
              <Badge v-for="tag in blog.tags || []" :key="tag" variant="secondary">
                {{ tag }}
              </Badge>
            </div>
          </div>
          <p class="text-sm text-muted-foreground">by {{ blog.author }}</p>
        </CardHeader>

        <CardContent>
          <p class="mb-4">{{ blog.content }}</p>
          <Separator class="my-4" />
          <div>
            <h2 class="text-lg font-semibold mb-2">Comments</h2>
            <div v-if="!blog.comments.length" class="text-sm text-muted-foreground">
              No comments yet.
            </div>
            <div
                v-for="(c, idx) in blog.comments"
                :key="c.user + c.createdAt + idx"
                class="mb-3"
            >
              <p class="text-sm">
                <span class="font-medium">{{ c.user }}</span>
                <span class="text-xs text-muted-foreground ml-2">
                  • {{ new Date(c.createdAt).toLocaleString() }}
                </span>
              </p>
              <p>{{ c.content }}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-2">
          <Textarea
              v-model="commentInputs[blog._id]"
              placeholder="Write a comment…"
              :disabled="submitting[blog._id]"
              rows="2"
          />
          <Button
              @click="submitComment(blog._id)"
              size="sm"
              :disabled="submitting[blog._id]"
          >
            {{ submitting[blog._id] ? 'Posting…' : 'Add Comment' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>