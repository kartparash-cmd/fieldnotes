export type Milestone = {
  id: string;
  name: string;
  phase: 1 | 2 | 3 | 4;
  targetMonth: number;
  hit: boolean;
  hitDate?: string;
};

export const MILESTONES: Milestone[] = [
  { id: "vault-operational", name: "Vault operational", phase: 1, targetMonth: 1, hit: false },
  { id: "tracker-mvp-deployed", name: "Tracker MVP deployed", phase: 1, targetMonth: 1, hit: false },
  { id: "concept-notes-8", name: "8 concept notes written", phase: 1, targetMonth: 1, hit: false },
  { id: "marie-eval-25", name: "25-prompt Marie eval running", phase: 1, targetMonth: 1, hit: false },
  { id: "cs1-published", name: "Case Study #1 published", phase: 1, targetMonth: 3, hit: false },
  { id: "neetcode-45", name: "45 LeetCode (60% of NeetCode 75)", phase: 1, targetMonth: 3, hit: false },
  { id: "cs2-published", name: "Case Study #2 published", phase: 2, targetMonth: 5, hit: false },
  { id: "aws-saa-passed", name: "AWS SAA passed", phase: 2, targetMonth: 6, hit: false },
  { id: "cs3-published", name: "Case Study #3 published", phase: 2, targetMonth: 6, hit: false },
  { id: "neetcode-65", name: "65 LeetCode complete", phase: 2, targetMonth: 6, hit: false },
  { id: "cs4-published", name: "Case Study #4 published", phase: 3, targetMonth: 7, hit: false },
  { id: "cs5-published", name: "Case Study #5 published", phase: 3, targetMonth: 8, hit: false },
  { id: "oss-merged", name: "Open source PR merged", phase: 3, targetMonth: 8, hit: false },
  { id: "first-long-blog", name: "First long blog post published", phase: 3, targetMonth: 9, hit: false },
  { id: "cs6-published", name: "Case Study #6 published", phase: 3, targetMonth: 9, hit: false },
  { id: "neetcode-75", name: "NeetCode 75 complete", phase: 3, targetMonth: 9, hit: false },
  { id: "applications-submitted", name: "Applications submitted (5-7 companies)", phase: 4, targetMonth: 10, hit: false },
  { id: "mocks-16", name: "16 mock interviews total", phase: 4, targetMonth: 11, hit: false },
  { id: "cs7-published", name: "Case Study #7 published (Tracker itself)", phase: 4, targetMonth: 11, hit: false },
  { id: "first-onsite", name: "First onsite interview", phase: 4, targetMonth: 12, hit: false },
  { id: "first-offer", name: "First FDE offer", phase: 4, targetMonth: 12, hit: false },
];
