import type { Comment, CommentCreate } from "../types/comment";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Comment API functions
export async function fetchComments(): Promise<Comment[]> {
    const res = await fetch(`${BASE_URL}/comments/`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
  }
  
  export async function fetchCommentsByBioSample(biosampleId: number): Promise<Comment[]> {
    const comments = await fetchComments();
    return comments.filter(comment => comment.biosample_id === biosampleId);
  }
  
  export async function createComment(data: CommentCreate): Promise<Comment> {
    const res = await fetch(`${BASE_URL}/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return res.json();
  }
  
  export async function deleteComment(id: number): Promise<Comment> {
    const res = await fetch(`${BASE_URL}/comments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete comment");
    return res.json();
  }