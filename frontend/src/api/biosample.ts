import type { BioSample } from "../types/biosample";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchBioSamples() {
  const res = await fetch(`${BASE_URL}/biosamples`);
  if (!res.ok) throw new Error("Failed to fetch biosamples");
  return res.json();
}

export async function createBioSample(data: BioSample) {
  const res = await fetch(`${BASE_URL}/biosamples`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create biosample");
  return res.json();
}