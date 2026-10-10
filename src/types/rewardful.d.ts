// Rewardful affiliate tracking (loaded via rw.js in the root layout).
// window.Rewardful.referral holds the referral UUID when the visitor
// arrived through an affiliate link.
interface Window {
  Rewardful?: {
    referral?: string;
    q?: unknown[];
  };
  _rwq?: string;
}
