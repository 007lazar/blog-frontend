import type {CommentView} from "@/types/comment.ts";

export interface BlogView {
    _id: string
    title: string
    content: string
    author: string
    tags?: string[]
    comments: CommentView[]
}
