import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CandidateDecision } from "../types/candidate";

interface CandidateActionsContextValue {
  decisions: Record<string, CandidateDecision>;
  setDecision: (candidateId: string, decision: CandidateDecision) => void;
}

const CandidateActionsContext = createContext<CandidateActionsContextValue | null>(null);
const storageKey = "talent-harbor-decisions";

function readStoredDecisions() {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? (JSON.parse(value) as Record<string, CandidateDecision>) : {};
  } catch {
    return {};
  }
}

export function CandidateActionsProvider({ children }: { children: React.ReactNode }) {
  const [decisions, setDecisions] = useState<Record<string, CandidateDecision>>(readStoredDecisions);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(decisions));
  }, [decisions]);

  const setDecision = useCallback((candidateId: string, decision: CandidateDecision) => {
    setDecisions((current) => {
      const next = { ...current };
      if (decision === null) {
        delete next[candidateId];
      } else {
        next[candidateId] = decision;
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ decisions, setDecision }), [decisions, setDecision]);

  return (
    <CandidateActionsContext.Provider value={value}>{children}</CandidateActionsContext.Provider>
  );
}

export function useCandidateActions() {
  const context = useContext(CandidateActionsContext);
  if (!context) {
    throw new Error("useCandidateActions must be used inside CandidateActionsProvider");
  }
  return context;
}
