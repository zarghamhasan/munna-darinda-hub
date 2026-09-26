import { ExcelCensusData } from '../types';

const CENSUS_STORAGE_KEY = 'munna_darinda_excel_census_v3';

export const DEFAULT_CENSUS: ExcelCensusData = {
  studentCount: 120,
  fileName: 'PLC_BBA_LLB_Master_Enrollment_2026-31.xlsx',
  sheetName: 'Enrolled_Cohort_2026',
  totalRows: 124,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Zargham Hasan & Harshvardhan',
  phoneDirectoryVerified: '120 Student Mobile Contacts Verified',
  detectedColumns: ['S.No', 'Student Full Name', 'Phone Number', 'Gender', 'Batch Year', 'Status / Role'],
  firewallLocked: true,
  previewRows: [
    { 'S.No': 1, 'Student Full Name': 'Harshvardhan', 'Phone Number': '+91 98350 12001', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Founder & Admin' },
    { 'S.No': 2, 'Student Full Name': 'Harsh', 'Phone Number': '+91 98350 12002', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'General Manager & Admin' },
    { 'S.No': 3, 'Student Full Name': 'Madhav', 'Phone Number': '+91 98350 12003', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Activity Manager & Admin' },
    { 'S.No': 4, 'Student Full Name': 'Ayush', 'Phone Number': '+91 98350 12004', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Head Admin' },
    { 'S.No': 5, 'Student Full Name': 'Zargham Hasan', 'Phone Number': '+91 98350 12007', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Website Developer & Admin' },
    { 'S.No': 6, 'Student Full Name': 'Sarvjeet', 'Phone Number': '+91 98350 12010', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Relation Manager & Admin' },
    { 'S.No': 7, 'Student Full Name': 'Ayush Raj', 'Phone Number': '+91 98350 12038', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Operations Anchor & Admin' },
    { 'S.No': 8, 'Student Full Name': 'Akshar', 'Phone Number': '+91 98350 12012', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Head Admin' },
    { 'S.No': 9, 'Student Full Name': 'Gaurav', 'Phone Number': '+91 98350 12018', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Head Admin' },
    { 'S.No': 10, 'Student Full Name': 'Ayush (Moot)', 'Phone Number': '+91 98350 12019', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Head Admin & Moot Lead' },
    { 'S.No': 11, 'Student Full Name': 'Rohan Kumar', 'Phone Number': '+91 98350 12025', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Enrolled Classmate' },
    { 'S.No': 12, 'Student Full Name': 'Priya Sharma', 'Phone Number': '+91 98350 12028', 'Gender': 'Female', 'Batch Year': '2026-31', 'Status / Role': 'Enrolled Classmate' },
  ],
};

export const getCensusData = (): ExcelCensusData => {
  try {
    const raw = localStorage.getItem(CENSUS_STORAGE_KEY);
    if (!raw) return DEFAULT_CENSUS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CENSUS,
      ...parsed,
    };
  } catch {
    return DEFAULT_CENSUS;
  }
};

export const saveCensusData = (census: Partial<ExcelCensusData>): ExcelCensusData => {
  const current = getCensusData();
  const updated: ExcelCensusData = {
    ...current,
    ...census,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CENSUS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
};

export const resetCensusData = (): ExcelCensusData => {
  try {
    localStorage.removeItem(CENSUS_STORAGE_KEY);
  } catch {}
  return DEFAULT_CENSUS;
};
