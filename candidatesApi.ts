import candidateData from "../data/candidates.json";
import type { Candidate } from "../types/candidate";

let cachedCandidates: Candidate[] | null = null;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getCandidates(options?: { forceError?: boolean }) {
  if (options?.forceError) {
    await wait(450);
    throw new Error("Unable to load candidate data.");
  }

  if (cachedCandidates) {
    await wait(180);
    return cachedCandidates;
  }

  await wait(650);
  cachedCandidates = candidateData as Candidate[];
  return cachedCandidates;
}

export async function getCandidateById(id: string, options?: { forceError?: boolean }) {
  const candidates = await getCandidates(options);
  return candidates.find((candidate) => candidate.id === id) ?? null;
}
