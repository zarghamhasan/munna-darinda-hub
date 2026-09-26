export type UserRole = 'guest' | 'classmate' | 'admin';

export interface AuthSession {
  isAuthenticated: boolean;
  role: UserRole;
  username: string;
  loginTime: string;
  isDeveloper?: boolean;
  hasExcelMasterAccess?: boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  alias?: string;
  role: string;
  category: 'leadership' | 'core' | 'moot' | 'backbenchers';
  bio: string;
  quote: string;
  avatarUrl?: string;
  rollNo?: string; // Kept optional for backwards compatibility, removed from UI
  batch: string;
  contact?: string;
  instagram?: string;
  linkedin?: string;
  isSpecialBadge?: string;
  isFounder?: boolean;
  isDeveloper?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'urgent' | 'academic' | 'moot' | 'event';
  date: string;
  author: string;
  authorId?: string;
  isPinned: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface Confession {
  id: string;
  text: string;
  authorAlias?: string;
  authorId?: string;
  timestamp: string;
  likes: number;
  category: 'funny' | 'academic' | 'campus' | 'shoutout';
  isApproved: boolean;
}

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  semester: string;
  type: 'Notes' | 'PYQ' | 'Bare Act / Summary' | 'Landmark Cases';
  url: string;
  author: string;
  pages?: string;
}

export interface OfficialLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'whatsapp' | 'forms' | 'university' | 'resource';
  isPrimary?: boolean;
}

export interface AppPasswords {
  adminPass: string;
  classmatePass: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface VotingPoll {
  id: string;
  title: string;
  description?: string;
  category: 'bunk' | 'assignment' | 'event' | 'other';
  options: PollOption[];
  createdBy: string;
  authorId?: string;
  createdAt: string;
  isClosed?: boolean;
  totalVotes: number;
  tags?: string[];
}

export interface AuthorizedAdmin {
  id: string;
  username: string; // lowercase match string
  displayName: string;
  roleTitle: string;
  addedAt?: string;
  isProtected?: boolean; // prevent accidental lockout of core dev/founder
}

export interface ExcelCensusData {
  studentCount: number;
  fileName: string;
  sheetName: string;
  totalRows: number;
  lastUpdated: string;
  updatedBy: string;
  phoneDirectoryVerified?: string;
  rollNumberRange?: string; // Legacy optional
  detectedColumns?: string[];
  previewRows?: Array<Record<string, any>>;
  firewallLocked?: boolean;
}

export interface SlideItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  category?: string;
  badge?: string;
  actionUrl?: string;
  actionText?: string;
}

export interface DualLogos {
  plcLogoUrl: string;
  teamLogoUrl: string;
}
