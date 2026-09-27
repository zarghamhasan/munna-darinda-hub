import { AppPasswords, AuthorizedAdmin } from '../types';

const STORAGE_KEY = 'munna_darinda_passwords_v2';
const ADMINS_STORAGE_KEY = 'munna_darinda_authorized_admins_v1';

export const DEFAULT_PASSWORDS: AppPasswords = {
  adminPass: 'PLC_ADMIN_2026',
  classmatePass: 'PLC_CLASS_2026',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Zargham Hasan (Developer) & Harshvardhan (Founder)',
};

export const DEFAULT_ADMINS: AuthorizedAdmin[] = [
  {
    id: 'harshvardhan',
    username: 'harshvardhan',
    displayName: 'Harshvardhan (Founder & Excel Commander)',
    roleTitle: 'Founder, Admin & Excel Master Commander',
    isProtected: true,
  },
  {
    id: 'zargham',
    username: 'zargham',
    displayName: 'Zargham Hasan (Developer & Admin)',
    roleTitle: 'Website Developer & IT Cell Manager',
    isProtected: true,
  },
  {
    id: 'zargham-hasan',
    username: 'zargham hasan',
    displayName: 'Zargham Hasan (Developer & Admin)',
    roleTitle: 'Website Developer & IT Cell Manager',
    isProtected: true,
  },
  {
    id: 'admin',
    username: 'admin',
    displayName: 'Admin Commander',
    roleTitle: 'Cohort Commander & Portal Admin',
    isProtected: true,
  },
  {
    id: 'administrator',
    username: 'administrator',
    displayName: 'System Administrator',
    roleTitle: 'PLC Administrator',
    isProtected: true,
  },
  {
    id: 'harsh',
    username: 'harsh',
    displayName: 'Harsh (Admin & Co Founder)',
    roleTitle: 'General Manager & Co-Founder',
  },
  {
    id: 'ayush',
    username: 'ayush',
    displayName: 'Ayush (Head Admin)',
    roleTitle: 'Head Admin & Debate Strategist',
  },
  {
    id: 'ayush-raj',
    username: 'ayush raj',
    displayName: 'Ayush Raj (Admin & Operations Anchor)',
    roleTitle: 'Operations Anchor & Ghat Philosopher',
  },
  {
    id: 'madhav',
    username: 'madhav',
    displayName: 'Madhav (Activity Manager & Admin)',
    roleTitle: 'Activity Manager',
  },
  {
    id: 'akshar',
    username: 'akshar',
    displayName: 'Akshar (Head Admin)',
    roleTitle: 'Head Admin & Senior Council',
  },
  {
    id: 'gaurav',
    username: 'gaurav',
    displayName: 'Gaurav (Head Admin)',
    roleTitle: 'Head Admin & Operations Lead',
  },
  {
    id: 'sarvjeet',
    username: 'sarvjeet',
    displayName: 'Sarvjeet (Relation Manager & Admin)',
    roleTitle: 'Relation Manager',
  },
];

export const DEVELOPER_KEYS = [
  'HARSHVARDHAN_FOUNDER',
  'DEV_ZARGHAM_72',
  'zarghamDev72',
  'PLC_HARSHVARDHAN',
  'harshvardhan2026',
];

/**
 * Normalizes any passcode or username string for robust matching:
 * lowercase, removes spaces, hyphens, and underscores.
 */
export const normalizeCode = (val: string): string => {
  return (val || '').toLowerCase().replace(/[\s\-_]/g, '').trim();
};

/**
 * Retrieve active authorized admins list from localStorage or return defaults.
 * Guarantees that essential core leaders (Harshvardhan, Zargham, Admin) always exist.
 */
export const getAuthorizedAdmins = (): AuthorizedAdmin[] => {
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMINS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure protected defaults are retained so users can never be locked out
      const merged = [...parsed];
      DEFAULT_ADMINS.forEach((def) => {
        const normDef = normalizeCode(def.username);
        const exists = merged.some((m) => normalizeCode(m.username) === normDef);
        if (!exists) {
          merged.push(def);
        }
      });
      return merged;
    }
    return DEFAULT_ADMINS;
  } catch {
    return DEFAULT_ADMINS;
  }
};

/**
 * Add a new authorized admin (Developer function).
 */
export const addAuthorizedAdmin = (admin: {
  username: string;
  displayName: string;
  roleTitle: string;
}): AuthorizedAdmin[] => {
  const current = getAuthorizedAdmins();
  const cleanUsername = admin.username.trim().toLowerCase();

  // Check if already exists
  const existingIdx = current.findIndex((a) => a.username.toLowerCase() === cleanUsername);
  const newEntry: AuthorizedAdmin = {
    id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    displayName: admin.displayName.trim() || `${admin.username} (Admin)`,
    roleTitle: admin.roleTitle.trim() || 'Admin',
    addedAt: new Date().toISOString(),
    isProtected: false,
  };

  let updated: AuthorizedAdmin[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      displayName: newEntry.displayName,
      roleTitle: newEntry.roleTitle,
    };
  } else {
    updated = [...current, newEntry];
  }

  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
};

/**
 * Remove an authorized admin (Developer function).
 */
export const removeAuthorizedAdmin = (idOrUsername: string): { success: boolean; admins: AuthorizedAdmin[]; error?: string } => {
  const current = getAuthorizedAdmins();
  const target = current.find(
    (a) => a.id === idOrUsername || a.username.toLowerCase() === idOrUsername.toLowerCase()
  );

  if (!target) {
    return { success: false, admins: current, error: 'Administrator not found in registry.' };
  }

  if (target.isProtected) {
    return {
      success: false,
      admins: current,
      error: `"${target.displayName}" is a protected core founder/developer entry and cannot be removed to prevent lockout.`,
    };
  }

  const updated = current.filter((a) => a.id !== target.id);
  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return { success: true, admins: updated };
};

/**
 * Reset authorized admins to original default list.
 */
export const resetAuthorizedAdmins = (): AuthorizedAdmin[] => {
  try {
    localStorage.removeItem(ADMINS_STORAGE_KEY);
  } catch {}
  return DEFAULT_ADMINS;
};

/**
 * Check if a username is in authorized admin registry.
 */
export const checkIsAuthorizedAdmin = (usernameInput: string): { isAuthorized: boolean; admin?: AuthorizedAdmin } => {
  const raw = usernameInput.trim();
  const norm = normalizeCode(raw);
  if (!norm) return { isAuthorized: false };

  const admins = getAuthorizedAdmins();
  const matched = admins.find((a) => {
    const aNorm = normalizeCode(a.username);
    const aNameNorm = normalizeCode(a.displayName);
    return aNorm === norm || aNorm.includes(norm) || norm.includes(aNorm) || aNameNorm.includes(norm);
  });

  if (matched) {
    return { isAuthorized: true, admin: matched };
  }

  // Universal admin aliases
  const recognizedAliases = ['admin', 'administrator', 'founder', 'developer', 'commander', 'harshvardhan', 'zargham', 'harsh'];
  if (recognizedAliases.includes(norm)) {
    return {
      isAuthorized: true,
      admin: {
        id: norm,
        username: norm,
        displayName: norm === 'harshvardhan'
          ? 'Harshvardhan (Founder & Admin)'
          : norm.includes('zargham')
          ? 'Zargham Hasan (Developer & Admin)'
          : `${raw || 'Admin'} Commander`,
        roleTitle: 'Cohort Commander',
        isProtected: true,
      },
    };
  }

  return { isAuthorized: false };
};

/**
 * Retrieve active passwords from localStorage or return defaults.
 */
export const getAppPasswords = (): AppPasswords => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PASSWORDS;
    const parsed = JSON.parse(raw);
    return {
      adminPass: parsed.adminPass || DEFAULT_PASSWORDS.adminPass,
      classmatePass: parsed.classmatePass || DEFAULT_PASSWORDS.classmatePass,
      lastUpdated: parsed.lastUpdated || DEFAULT_PASSWORDS.lastUpdated,
      updatedBy: parsed.updatedBy || DEFAULT_PASSWORDS.updatedBy,
    };
  } catch {
    return DEFAULT_PASSWORDS;
  }
};

/**
 * Save new passwords updated by Developer.
 */
export const saveAppPasswords = (newPasswords: {
  adminPass: string;
  classmatePass: string;
  updatedBy?: string;
}): AppPasswords => {
  const updated: AppPasswords = {
    adminPass: newPasswords.adminPass.trim(),
    classmatePass: newPasswords.classmatePass.trim(),
    lastUpdated: new Date().toISOString(),
    updatedBy: newPasswords.updatedBy || 'Zargham Hasan (Developer)',
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
};

/**
 * Reset passwords back to factory defaults.
 */
export const resetAppPasswords = (): AppPasswords => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return DEFAULT_PASSWORDS;
};

/**
 * Verifies if entered passcode matches active classmate password or accepted fallbacks.
 * Also grants access if an admin/dev passcode is accidentally entered in the classmate field.
 */
export const verifyClassmatePasscode = (entered: string): boolean => {
  const raw = entered.trim();
  const norm = normalizeCode(raw);
  if (!norm) return false;

  const current = normalizeCode(getAppPasswords().classmatePass);
  const defaultPass = normalizeCode(DEFAULT_PASSWORDS.classmatePass);

  if (norm === current || norm === defaultPass) return true;

  const legacyCodes = [
    'plcclass2026',
    'plc2026',
    'darinda',
    'patnalaw',
    'darinda2025',
    'class2026',
    'classmate',
    'guest',
    'visitor',
  ];
  if (legacyCodes.includes(norm)) return true;

  // If someone entered admin pass or dev pass in the classmate input, let them in!
  if (verifyAdminPassword(raw) || verifyDeveloperKey(raw)) {
    return true;
  }

  return false;
};

/**
 * Verifies if entered password matches active admin password or developer master keys.
 * Extremely forgiving with casing, spaces, and underscores.
 */
export const verifyAdminPassword = (entered: string): boolean => {
  const raw = entered.trim();
  const norm = normalizeCode(raw);
  if (!norm) return false;

  const current = normalizeCode(getAppPasswords().adminPass);
  const defaultPass = normalizeCode(DEFAULT_PASSWORDS.adminPass);

  if (norm === current || norm === defaultPass) return true;

  const accepted = [
    'plcadmin2026',
    'darinda',
    'admin',
    'admin2026',
    'harshvardhan',
    'harshvardhan2026',
    'harshvardhanfounder',
    'devzargham72',
    'zarghamdev72',
    'zargham72',
    'zargham',
    'plcharshvardhan',
    'devadmin2026',
  ];

  if (accepted.some((a) => normalizeCode(a) === norm)) return true;
  return DEVELOPER_KEYS.some((k) => normalizeCode(k) === norm);
};

/**
 * Verifies Developer / Master authorization for changing passwords & managing roster.
 * Strictly exclusive to Website Developer (Zargham Hasan) and Founder (Harshvardhan) keys.
 */
export const verifyDeveloperKey = (entered: string): boolean => {
  const raw = entered.trim();
  const norm = normalizeCode(raw);
  if (!norm) return false;

  const validDevTokens = [
    'devzargham72',
    'dev_zargham_72',
    'zarghamdev72',
    'harshvardhanfounder',
    'harshvardhan2026',
    'plcharshvardhan',
  ];

  if (validDevTokens.some((t) => normalizeCode(t) === norm)) {
    return true;
  }
  return DEVELOPER_KEYS.some((k) => normalizeCode(k) === norm);
};

/**
 * Checks whether the current user session has Excel Master Command power.
 * Strictly requires isDeveloper or hasExcelMasterAccess, which is only granted with Master Key.
 */
export const hasExcelMasterClearance = (session: { isDeveloper?: boolean; username?: string; role?: string; hasExcelMasterAccess?: boolean } | null): boolean => {
  if (!session) return false;
  return Boolean(session.isDeveloper || session.hasExcelMasterAccess);
};

