import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ScoreBadge, StatusBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { ErrorState, LoadingSkeleton } from "../components/StateBlocks";
import { Tag } from "../components/Tag";
import { useCandidateActions } from "../context/CandidateActionsContext";
import { getCandidateById } from "../services/candidatesApi";
import type { Candidate } from "../types/candidate";
import { formatDate, getDisplayStatus } from "../utils/candidates";

interface RouterLocationState {
  from?: { pathname: string; search: string };
}

export function CandidateProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as RouterLocationState | null;
  const backTarget = state?.from ? `${state.from.pathname}${state.from.search}` : "/";
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { decisions, setDecision } = useCandidateActions();

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    setIsLoading(true);
    setError(null);

    getCandidateById(id)
      .then((data) => {
        if (!ignore) setCandidate(data);
      })
      .catch((caughtError: Error) => {
        if (!ignore) setError(caughtError);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const decision = id ? decisions[id] ?? null : null;
  const displayStatus = useMemo(
    () => (candidate ? getDisplayStatus(candidate, decision) : "Open to work"),
    [candidate, decision],
  );

  if (!id) return <Navigate to="/" replace />;

  if (isLoading) {
    return (
      <main className="profile-page">
        <Link className="back-link" to={backTarget}>Back to directory</Link>
        <LoadingSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <Link className="back-link" to={backTarget}>Back to directory</Link>
        <ErrorState onRetry={() => window.location.reload()} />
      </main>
    );
  }

  if (!candidate) {
    return (
      <main className="profile-page">
        <Link className="back-link" to={backTarget}>Back to directory</Link>
        <section className="state-panel">
          <h1>Candidate not found</h1>
          <p>This profile may have been removed from the current talent pool.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Link className="back-link" to={backTarget}>Back to directory</Link>

      <section className="profile-header">
        <div className="profile-identity">
          <div className="card-topline">
            <StatusBadge status={displayStatus} />
            <ScoreBadge score={candidate.score} />
          </div>
          <h1>{candidate.fullName}</h1>
          <p>{candidate.headline}</p>
          <dl className="profile-facts">
            <div>
              <dt>Location</dt>
              <dd>{candidate.location}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{candidate.yearsOfExperience} years</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{candidate.availability}</dd>
            </div>
          </dl>
        </div>
        <div className="profile-actions" aria-label="Candidate actions">
          <Button
            variant={decision === "shortlisted" ? "primary" : "secondary"}
            onClick={() => setDecision(candidate.id, decision === "shortlisted" ? null : "shortlisted")}
          >
            {decision === "shortlisted" ? "Shortlisted" : "Shortlist"}
          </Button>
          <Button
            variant={decision === "rejected" ? "danger" : "secondary"}
            onClick={() => setDecision(candidate.id, decision === "rejected" ? null : "rejected")}
          >
            {decision === "rejected" ? "Rejected" : "Reject"}
          </Button>
        </div>
      </section>

      <div className="profile-layout">
        <section className="profile-main">
          <ProfileSection title="About">
            <p className="summary">{candidate.summary}</p>
          </ProfileSection>

          <ProfileSection title="Skills">
            <div className="tag-row large-tags">
              {candidate.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection title="Experience">
            <div className="timeline">
              {candidate.experience.map((item) => (
                <article className="timeline-item" key={`${item.company}-${item.start}`}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.company}</p>
                  </div>
                  <span>{item.start} - {item.end}</span>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection title="Projects">
            <div className="project-grid">
              {candidate.projects.map((project) => (
                <article className="project-card" key={project.name}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">
                    {project.tech.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </ProfileSection>
        </section>

        <aside className="metadata-panel" aria-label="Candidate metadata">
          <h2>Profile details</h2>
          <Metadata label="Status" value={displayStatus} />
          <Metadata label="Score" value={`${candidate.score}/100`} />
          <Metadata label="Updated" value={formatDate(candidate.updatedAt)} />
          <Metadata label="Education" value={candidate.education ?? "Not provided"} />
          <Metadata label="Languages" value={candidate.languages?.join(", ") ?? "Not provided"} />
          {candidate.links?.portfolio && (
            <a href={candidate.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
          )}
          {candidate.links?.github && (
            <a href={candidate.links.github} target="_blank" rel="noreferrer">GitHub</a>
          )}
          {candidate.links?.linkedin && (
            <a href={candidate.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          )}
        </aside>
      </div>
    </main>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="profile-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="metadata-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
