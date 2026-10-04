const LABELS: Record<string, string> = { HOT: 'Hot', WARM: 'Warm', COLD: 'Cold' };

/** Score comes from the DB as a plain string ('HOT' | 'WARM' | 'COLD'). */
export function ScoreBadge({ score }: { score: string }) {
  const key = score.toUpperCase();
  return (
    <span className={`score-badge score-${key.toLowerCase()}`}>
      {LABELS[key] ?? score}
    </span>
  );
}
