export type CandidateStatus =
  | "Open to work"
  | "Interviewing"
  | "Shortlisted"
  | "Hired"
  | "Rejected";

export type CandidateDecision = "shortlisted" | "rejected" | null;

export interface CandidateLinkSet {
  portfolio?: string;
  github?: string;
  linkedin?: string;
}

export interface CandidateExperience {
  company: string;
  title: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface CandidateProject {
  name: string;
  description: string;
  tech: string[];
}

export interface CandidateNote {
  date: string;
  text: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  availability: string;
  updatedAt: string;
  status: CandidateStatus;
  score: number;
  summary: string;
  languages?: string[];
  education?: string;
  links?: CandidateLinkSet;
  experience: CandidateExperience[];
  projects: CandidateProject[];
  notes?: CandidateNote[];
}

export interface CandidateView extends Candidate {
  decision: CandidateDecision;
  displayStatus: CandidateStatus;
}

export type SortOption = "recent" | "score" | "experience";

export interface CandidateFilters {
  search: string;
  location: string;
  skill: string;
  availability: string;
  status: string;
  minExperience: string;
  sort: SortOption;
}
