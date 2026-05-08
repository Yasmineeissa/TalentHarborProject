import type { CandidateFilters, CandidateStatus } from "../types/candidate";
import { defaultFilters } from "../utils/candidates";
import { Button } from "./Button";
import { Tag } from "./Tag";

interface FilterPanelProps {
  filters: CandidateFilters;
  locations: string[];
  skills: string[];
  availability: string[];
  statuses: CandidateStatus[];
  resultCount: number;
  onChange: (next: CandidateFilters) => void;
  onReset: () => void;
}

const experienceOptions = [
  { label: "Any experience", value: "all" },
  { label: "3+ years", value: "3" },
  { label: "5+ years", value: "5" },
  { label: "7+ years", value: "7" },
];

export function FilterPanel({
  filters,
  locations,
  skills,
  availability,
  statuses,
  resultCount,
  onChange,
  onReset,
}: FilterPanelProps) {
  const updateFilter = <Key extends keyof CandidateFilters>(key: Key, value: CandidateFilters[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilters = [
    filters.search && `Search: ${filters.search}`,
    filters.location !== "all" && `Location: ${filters.location}`,
    filters.skill !== "all" && `Skill: ${filters.skill}`,
    filters.availability !== "all" && `Availability: ${filters.availability}`,
    filters.status !== "all" && `Status: ${filters.status}`,
    filters.minExperience !== "all" && `${filters.minExperience}+ years`,
    filters.sort !== defaultFilters.sort && `Sort: ${filters.sort}`,
  ].filter(Boolean) as string[];

  return (
    <section className="filter-panel" aria-labelledby="directory-filters">
      <div className="filter-heading">
        <div>
          <h2 id="directory-filters">Candidate directory</h2>
          <p>{resultCount} candidates</p>
        </div>
        <Button onClick={onReset} type="button" variant="ghost">Reset all</Button>
      </div>

      <div className="filter-grid">
        <label className="field wide-field">
          <span>Search</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Name, headline, or skill"
            type="search"
          />
        </label>
        <SelectField
          label="Location"
          value={filters.location}
          onChange={(value) => updateFilter("location", value)}
          options={["all", ...locations]}
          allLabel="All locations"
        />
        <SelectField
          label="Skill"
          value={filters.skill}
          onChange={(value) => updateFilter("skill", value)}
          options={["all", ...skills]}
          allLabel="All skills"
        />
        <SelectField
          label="Availability"
          value={filters.availability}
          onChange={(value) => updateFilter("availability", value)}
          options={["all", ...availability]}
          allLabel="Any availability"
        />
        <SelectField
          label="Status"
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={["all", ...statuses]}
          allLabel="Any status"
        />
        <SelectField
          label="Experience"
          value={filters.minExperience}
          onChange={(value) => updateFilter("minExperience", value)}
          options={experienceOptions.map((option) => option.value)}
          labels={Object.fromEntries(experienceOptions.map((option) => [option.value, option.label]))}
        />
        <SelectField
          label="Sort"
          value={filters.sort}
          onChange={(value) => updateFilter("sort", value as CandidateFilters["sort"])}
          options={["recent", "score", "experience"]}
          labels={{
            recent: "Recently updated",
            score: "Highest score",
            experience: "Most experience",
          }}
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="active-filters" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <Tag key={filter} tone="active">{filter}</Tag>
          ))}
        </div>
      )}
    </section>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  allLabel?: string;
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, allLabel, labels = {}, onChange }: SelectFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? allLabel ?? "All" : labels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
