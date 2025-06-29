import type { BioSample, BioSampleCreate, PaginatedBioSamples } from "../types/biosample";
import type { Comment, CommentCreate } from "../types/comment";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// BioSample API functions
export async function fetchBioSamples(page: number = 1, size: number = 10): Promise<PaginatedBioSamples> {
  const res = await fetch(`${BASE_URL}/biosamples/?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Failed to fetch biosamples");
  return res.json();
}

export async function fetchBioSample(id: number): Promise<BioSample> {
  const res = await fetch(`${BASE_URL}/biosamples/${id}`);
  if (!res.ok) throw new Error("Failed to fetch biosample");
  return res.json();
}

export async function createBioSample(data: BioSampleCreate): Promise<BioSample> {
  const res = await fetch(`${BASE_URL}/biosamples/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create biosample");
  return res.json();
}

export async function updateBioSample(id: number, data: BioSampleCreate): Promise<BioSample> {
  const res = await fetch(`${BASE_URL}/biosamples/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update biosample");
  return res.json();
}

export async function deleteBioSample(id: number): Promise<BioSample> {
  const res = await fetch(`${BASE_URL}/biosamples/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete biosample");
  return res.json();
}

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

