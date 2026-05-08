import type { CandidateStatus } from "../types/candidate";

const statusClassName: Record<CandidateStatus, string> = {
  "Open to work": "badge badge-green",
  Interviewing: "badge badge-blue",
  Shortlisted: "badge badge-amber",
  Hired: "badge badge-dark",
  Rejected: "badge badge-muted",
};

export function StatusBadge({ status }: { status: CandidateStatus }) {
  return <span className={statusClassName[status] ?? "badge"}>{status}</span>;
}

export function ScoreBadge({ score }: { score: number }) {
  return <span className="score-badge">{score}</span>;
}
