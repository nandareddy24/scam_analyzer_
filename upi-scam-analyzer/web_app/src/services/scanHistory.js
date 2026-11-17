// Shared client-side scan history and submitted report storage utility.
// Preserves existing localStorage key ('scam_analyzer_scan_history') and Firestore saveScan contract.

import { getCurrentUser } from './authService';
import { saveScan } from './firestoreService';

export const SCAN_HISTORY_KEY = 'scam_analyzer_scan_history';
export const SUBMITTED_REPORTS_KEY = 'scam_analyzer_submitted_reports';
const MAX_LOCAL_HISTORY = 50;

export function normalizeModuleType(rawType) {
  const t = String(rawType || 'INPUT').toUpperCase();
  if (t === 'SMS' || t === 'MESSAGE') return 'MESSAGE';
  if (t === 'QR' || t === 'OCR' || t === 'QR/OCR') return 'OCR';
  if (t === 'URL' || t === 'DOMAIN') return 'URL';
  if (t === 'UPI' || t === 'VPA') return 'UPI';
  if (t === 'PHONE' || t === 'CALLER') return 'PHONE';
  return t;
}

export function classifyRisk(item) {
  const score = typeof item?.score === 'number' ? item.score : 0;
  const riskLevel = item?.riskLevel;

  if (riskLevel === 'high' || score >= 12) {
    return {
      key: 'dangerous',
      label: 'Dangerous',
      shortLabel: 'DANGEROUS',
      rangeLabel: '12-25',
      score,
      maxScore: 25,
    };
  }

  if (riskLevel === 'medium' || (score >= 5 && score < 12)) {
    return {
      key: 'warning',
      label: 'Warning',
      shortLabel: 'WARNING',
      rangeLabel: '5-11',
      score,
      maxScore: 25,
    };
  }

  return {
    key: 'safe',
    label: 'Safe',
    shortLabel: 'SAFE',
    rangeLabel: '0-4',
    score,
    maxScore: 25,
  };
}

export function formatScanTimestamp(value) {
  if (!value) return 'Unknown time';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }
  return parsed.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getScanHistory(filterType = null) {
  try {
    const raw = localStorage.getItem(SCAN_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    if (!filterType || filterType === 'ALL') return parsed;
    const normalizedFilter = normalizeModuleType(filterType);
    return parsed.filter((item) => normalizeModuleType(item.type) === normalizedFilter);
  } catch {
    return [];
  }
}

export function recordScanResult(analysisResult, typeOverride = null) {
  if (!analysisResult) return null;

  const isoTimestamp = analysisResult.timestamp || new Date().toISOString();
  const normalizedType = normalizeModuleType(typeOverride || analysisResult.type);
  const risk = classifyRisk(analysisResult);

  const enrichedResult = {
    ...analysisResult,
    type: typeOverride ? typeOverride.toLowerCase() : (analysisResult.type || 'input'),
    timestamp: isoTimestamp,
  };

  const entry = {
    id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: normalizedType,
    target: String(analysisResult.input || '').trim() || 'Untitled input',
    verdict: analysisResult.result || risk.label,
    status: analysisResult.status || risk.shortLabel,
    score: risk.score,
    riskLevel: analysisResult.riskLevel || (risk.key === 'dangerous' ? 'high' : risk.key === 'warning' ? 'medium' : 'low'),
    timestamp: isoTimestamp,
    reasons: Array.isArray(analysisResult.reasons) ? analysisResult.reasons : [],
    advice: analysisResult.advice || '',
    indicators: analysisResult.indicators || null,
    fullResult: enrichedResult,
  };

  try {
    const existing = getScanHistory();
    const updated = [entry, ...existing].slice(0, MAX_LOCAL_HISTORY);
    localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Storage fail-safe
  }

  // Persist to Firestore if authenticated user has a real uid (preserving existing contract)
  try {
    const user = getCurrentUser();
    if (user?.uid && !user.uid.startsWith('demo-')) {
      saveScan(user.uid, enrichedResult).catch(() => {
        // Fail silently when offline or Firebase rules restrict writes
      });
    }
  } catch {
    // Non-blocking
  }

  return enrichedResult;
}

export function clearScanHistory(filterType = null) {
  try {
    if (!filterType || filterType === 'ALL') {
      localStorage.removeItem(SCAN_HISTORY_KEY);
      return [];
    }
    const normalizedFilter = normalizeModuleType(filterType);
    const remaining = getScanHistory().filter(
      (item) => normalizeModuleType(item.type) !== normalizedFilter
    );
    localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(remaining));
    return remaining;
  } catch {
    return [];
  }
}

export function getSubmittedReports() {
  try {
    const raw = localStorage.getItem(SUBMITTED_REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSubmittedReport(report) {
  const entry = {
    id: `REP-${Date.now().toString(36).toUpperCase()}`,
    type: report.type,
    target: report.target.trim(),
    reason: report.reason.trim(),
    proofText: (report.proofText || '').trim(),
    status: 'Logged for Review',
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = getSubmittedReports();
    const updated = [entry, ...existing].slice(0, 50);
    localStorage.setItem(SUBMITTED_REPORTS_KEY, JSON.stringify(updated));
  } catch {
    // Storage fail-safe
  }

  return entry;
}

export function clearSubmittedReports() {
  try {
    localStorage.removeItem(SUBMITTED_REPORTS_KEY);
  } catch {
    // Storage fail-safe
  }
}
