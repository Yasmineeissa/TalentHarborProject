import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CandidateCard } from "../components/CandidateCard";
import { FilterPanel } from "../components/FilterPanel";
import { EmptyState, ErrorState, LoadingSkeleton } from "../components/StateBlocks";
import { Stat } from "../components/Stat";
import { useCandidateActions } from "../context/CandidateActionsContext";
import { getCandidates } from "../services/candidatesApi";
import type { Candidate, CandidateFilters, CandidateStatus } from "../types/candidate";
import { applyDecisions, defaultFilters, filterCandidates, uniqueSorted } from "../utils/candidates";
import { filtersFromSearchParams, searchParamsFromFilters } from "../utils/queryState";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { decisions } = useCandidateActions();
  const filters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    getCandidates({ forceError: searchParams.get("simulateError") === "1" })
      .then((data) => {
        if (!ignore) setCandidates(data);
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
  }, [searchParams]);

  const candidatesWithDecisions = useMemo(
    () => applyDecisions(candidates, decisions),
    [candidates, decisions],
  );

  const filteredCandidates = useMemo(
    () => filterCandidates(candidatesWithDecisions, filters),
    [candidatesWithDecisions, filters],
  );

  const facets = useMemo(() => {
    const allSkills = candidatesWithDecisions.flatMap((candidate) => candidate.skills);
    return {
      locations: uniqueSorted(candidatesWithDecisions.map((candidate) => candidate.location)),
      skills: uniqueSorted(allSkills),
      availability: uniqueSorted(candidatesWithDecisions.map((candidate) => candidate.availability)),
      statuses: uniqueSorted(
        candidatesWithDecisions.map((candidate) => candidate.displayStatus),
      ) as CandidateStatus[],
    };
  }, [candidatesWithDecisions]);

  const updateFilters = (next: CandidateFilters) => {
    setSearchParams(searchParamsFromFilters(next));
  };

  const resetFilters = () => {
    setSearchParams(searchParamsFromFilters(defaultFilters));
  };

  const topSkills = useMemo(
    () =>
      Object.entries(
        candidates.reduce<Record<string, number>>((counts, candidate) => {
          candidate.skills.forEach((skill) => {
            counts[skill] = (counts[skill] ?? 0) + 1;
          });
          return counts;
        }, {}),
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([skill]) => skill)
        .join(", "),
    [candidates],
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Talent Harbor</p>
          <h1>Recruit frontend engineers with sharper signal.</h1>
          <p>
            Browse vetted UI talent, compare signals quickly, and keep shortlist decisions
            synchronized while you move through profiles.
          </p>
          <a className="button button-primary hero-action" href="#directory">
            Browse Candidates
          </a>
        </div>
        <div className="stats-strip" aria-label="Talent pool stats">
          <Stat label="Candidates" value={candidates.length || 30} />
          <Stat label="Locations" value={facets.locations.length || 6} />
          <Stat label="Top skills" value={topSkills || "React, TypeScript"} />
        </div>
      </section>

      <section className="directory-shell" id="directory">
        <FilterPanel
          filters={filters}
          locations={facets.locations}
          skills={facets.skills}
          availability={facets.availability}
          statuses={facets.statuses}
          resultCount={filteredCandidates.length}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        {isLoading && <LoadingSkeleton />}
        {!isLoading && error && <ErrorState onRetry={() => setSearchParams(new URLSearchParams(searchParams))} />}
        {!isLoading && !error && filteredCandidates.length === 0 && <EmptyState onReset={resetFilters} />}
        {!isLoading && !error && filteredCandidates.length > 0 && (
          <div className="candidate-grid">
            {filteredCandidates.map((candidate) => (
              <CandidateCard candidate={candidate} key={candidate.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
