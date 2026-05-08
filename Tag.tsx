export function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "active" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
