import { Button } from "./Button";

export function LoadingSkeleton() {
  return (
    <div className="candidate-grid" aria-label="Loading candidates">
      {Array.from({ length: 6 }, (_, index) => (
        <article className="candidate-card skeleton-card" key={index}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton-chip-row">
            <span className="skeleton skeleton-chip" />
            <span className="skeleton skeleton-chip" />
            <span className="skeleton skeleton-chip" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="state-panel" role="alert">
      <h2>Could not load candidates</h2>
      <p>The directory hit a temporary data issue. Try again to reload the talent pool.</p>
      <Button onClick={onRetry} variant="primary">Retry</Button>
    </section>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <section className="state-panel">
      <h2>No matching candidates</h2>
      <p>Adjust the search terms or remove active filters to broaden the results.</p>
      <Button onClick={onReset}>Reset all</Button>
    </section>
  );
}
