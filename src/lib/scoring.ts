// ─────────────────────────────────────────────────────────────────────────────
//  ★★★  LEAD SCORING RULES — SAM, TWEAK THESE  ★★★
// ─────────────────────────────────────────────────────────────────────────────
//  Every visitor who signs in at an open house (or via the widget) answers two
//  questions: "when are you looking to buy?" and "are you pre-approved?"
//  scoreLead() turns those answers into HOT / WARM / COLD.
//
//  Current rules (change the code below to change the business logic):
//    • HOT  = buying within 30 days AND pre-approved  (ready to transact)
//    • WARM = buying within 30 days but NOT pre-approved, OR 2–6 months out
//    • COLD = 6+ months out, or just browsing
//
//  The function also returns human-readable `reasons` so the dashboard can
//  show *why* a lead got its score. Keep reasons short and agent-friendly.
// ─────────────────────────────────────────────────────────────────────────────

export type LeadScore = 'HOT' | 'WARM' | 'COLD';

/** Timeline values produced by the capture form. */
export type TimelineAnswer =
  | 'lt_30_days' // "Within 30 days"
  | 'two_six_months' // "2–6 months"
  | 'gt_6_months' // "6+ months"
  | 'browsing'; // "Just browsing"

export interface ScoringInput {
  timeline: TimelineAnswer;
  preApproved: boolean;
}

export interface ScoringResult {
  score: LeadScore;
  reasons: string[];
}

export const TIMELINE_LABELS: Record<TimelineAnswer, string> = {
  lt_30_days: 'Within 30 days',
  two_six_months: '2–6 months',
  gt_6_months: '6+ months',
  browsing: 'Just browsing',
};

export function scoreLead(input: ScoringInput): ScoringResult {
  const { timeline, preApproved } = input;

  // ── ▼▼▼  EDIT THE RULES BELOW THIS LINE  ▼▼▼ ──────────────────────────────

  if (timeline === 'lt_30_days' && preApproved) {
    return {
      score: 'HOT',
      reasons: ['Buying within 30 days', 'Pre-approved'],
    };
  }

  if (timeline === 'lt_30_days' && !preApproved) {
    return {
      score: 'WARM',
      reasons: ['Buying within 30 days', 'Not pre-approved yet'],
    };
  }

  if (timeline === 'two_six_months') {
    return {
      score: 'WARM',
      reasons: [
        'Buying in 2–6 months',
        preApproved ? 'Pre-approved' : 'Not pre-approved yet',
      ],
    };
  }

  // timeline === 'gt_6_months' || 'browsing'
  return {
    score: 'COLD',
    reasons: [
      timeline === 'browsing' ? 'Just browsing' : 'Buying 6+ months out',
    ],
  };

  // ── ▲▲▲  EDIT THE RULES ABOVE THIS LINE  ▲▲▲ ──────────────────────────────
}
