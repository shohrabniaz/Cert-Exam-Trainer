import type { StreakState } from "@/lib/types";

export function StreakBadge({ streak }: { streak: StreakState }) {
  return (
    <div className="flex flex-wrap gap-3">
      <StatChip
        label="Streak"
        value={`${streak.current} day${streak.current === 1 ? "" : "s"}`}
        hint={streak.current > 0 ? "Keep it going" : "Start today"}
        accent="#f59e0b"
      />
      <StatChip
        label="Best"
        value={`${streak.longest}`}
        hint="Longest streak"
        accent="#38bdf8"
      />
      <StatChip
        label="Active days"
        value={`${streak.totalDaysActive}`}
        hint="All time"
        accent="#34d399"
      />
    </div>
  );
}

function StatChip({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <div
      className="min-w-[7.5rem] flex-1 rounded-2xl border border-white/10 bg-[var(--bg-panel)] px-4 py-3"
      style={{ boxShadow: `inset 3px 0 0 ${accent}` }}
    >
      <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{hint}</p>
    </div>
  );
}
