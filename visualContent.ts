export interface VisualContent {
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  wordmarkTitle: string;
  wordmarkSubtitle: string;
  crewSectionTitle: string;
  crewSectionSubtitle: string;
  votingSectionTitle: string;
  votingSectionSubtitle: string;
  noticesSectionTitle: string;
  noticesSectionSubtitle: string;
  confessionsSectionTitle: string;
  vaultSectionTitle: string;
  footerSlogan: string;
}

const STORAGE_KEY = 'munna_darinda_visual_content_v1';

export const DEFAULT_VISUAL_CONTENT: VisualContent = {
  heroBadge: 'Patna Law College · BBA.LLB 2026-31 Batch',
  heroTitlePrefix: 'Welcome to the',
  heroTitleHighlight: 'Munna Darinda Team',
  heroTitleSuffix: 'Hub',
  heroSubtitle: 'Attendance low, swag high. The official brotherhood portal, academic vault, notice board, and confession wall for Patna Law College (BBA.LLB).',
  wordmarkTitle: 'Munna Darinda Hub',
  wordmarkSubtitle: 'Patna Law College (BBA.LLB 2026-31)',
  crewSectionTitle: 'The Munna Darinda Crew',
  crewSectionSubtitle: 'The legal eagles, debate champions, front-row scholars, and legendary backbenchers defining the batch of Patna Law College.',
  votingSectionTitle: 'The Batch Voting Arena',
  votingSectionSubtitle: 'Direct democracy for the Patna Law College BBA.LLB cohort. Cast your vote on mass bunks, assignment extension petitions, batch outings, and cafeteria disputes.',
  noticesSectionTitle: 'Official Notice Board',
  noticesSectionSubtitle: 'Stay updated with critical university schedules, moot trial calls, exam dates, and batch directives.',
  confessionsSectionTitle: 'The Backbench Confessions Wall',
  vaultSectionTitle: 'Munna Darinda Study Vault',
  footerSlogan: 'Built with pride for the Patna Law College BBA.LLB 2026-31 fraternity. United in court, undefeated on campus.',
};

export const getVisualContent = (): VisualContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VISUAL_CONTENT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_VISUAL_CONTENT, ...parsed };
  } catch {
    return DEFAULT_VISUAL_CONTENT;
  }
};

export const saveVisualContent = (content: Partial<VisualContent>): VisualContent => {
  const current = getVisualContent();
  const updated = { ...current, ...content };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
};

export const resetVisualContent = (): VisualContent => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return DEFAULT_VISUAL_CONTENT;
};
