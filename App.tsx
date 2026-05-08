import { Navigate, Route, Routes } from "react-router-dom";
import { CandidateActionsProvider } from "./context/CandidateActionsContext";
import { CandidateProfilePage } from "./pages/CandidateProfilePage";
import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <CandidateActionsProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/candidate/:id" element={<CandidateProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CandidateActionsProvider>
  );
}
