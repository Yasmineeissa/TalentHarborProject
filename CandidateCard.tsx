import { Link, useLocation } from "react-router-dom";
import type { CandidateView } from "../types/candidate";
import { formatDate } from "../utils/candidates";
import { ScoreBadge, StatusBadge } from "./Badge";
import { Tag } from "./Tag";

export function CandidateCard({ candidate }: { candidate: CandidateView }) {
  const location = useLocation();

  return (
    <article className="candidate-card">
      <div className="card-topline">
        <StatusBadge status={candidate.displayStatus} />
        <ScoreBadge score={candidate.score} />
      </div>
      <div>
        <h3>{candidate.fullName}</h3>
        <p className="headline">{candidate.headline}</p>
      </div>
      <dl className="quick-facts">
        <div>
          <dt>Location</dt>
          <dd>{candidate.location}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>{candidate.yearsOfExperience} yrs</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(candidate.updatedAt)}</dd>
        </div>
      </dl>
      <div className="tag-row" aria-label={`${candidate.fullName} skills`}>
        {candidate.skills.slice(0, 5).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
      <Link className="profile-link" to={`/candidate/${candidate.id}`} state={{ from: location }}>
        View Profile
      </Link>
    </article>
  );
}
