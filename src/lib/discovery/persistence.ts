/**
 * Discovery Flow Persistence
 * 
 * Browser storage utilities for discovery flow state.
 * 
 * Requirements: 20.1, 20.2, 20.6
 */

import type { DiscoveryState } from './state-machine';

const STORAGE_PREFIX = 'spendlens-discovery';
const STORAGE_VERSION = '1.0';

/**
 * Save discovery state to browser storage
 */
export function saveDiscoveryState(sessionId: string, state: DiscoveryState): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data = {
      version: STORAGE_VERSION,
      state,
      savedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(`${STORAGE_PREFIX}-${sessionId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save discovery state:', error);
    return false;
  }
}

/**
 * Load discovery state from browser storage
 */
export function loadDiscoveryState(sessionId: string): DiscoveryState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(`${STORAGE_PREFIX}-${sessionId}`);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Version check
    if (data.version !== STORAGE_VERSION) {
      console.warn('Discovery state version mismatch, clearing state');
      clearDiscoveryState(sessionId);
      return null;
    }

    // Validate state structure
    if (!isValidState(data.state)) {
      console.warn('Invalid discovery state structure, clearing state');
      clearDiscoveryState(sessionId);
      return null;
    }

    return data.state;
  } catch (error) {
    console.error('Failed to load discovery state:', error);
    return null;
  }
}

/**
 * Clear discovery state from browser storage
 */
export function clearDiscoveryState(sessionId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}-${sessionId}`);
    return true;
  } catch (error) {
    console.error('Failed to clear discovery state:', error);
    return false;
  }
}

/**
 * List all discovery sessions in storage
 */
export function listDiscoverySessions(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const sessions: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const sessionId = key.replace(`${STORAGE_PREFIX}-`, '');
        sessions.push(sessionId);
      }
    }
    return sessions;
  } catch (error) {
    console.error('Failed to list discovery sessions:', error);
    return [];
  }
}

/**
 * Clear all discovery sessions from storage
 */
export function clearAllDiscoverySessions(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const sessions = listDiscoverySessions();
    sessions.forEach((sessionId) => clearDiscoveryState(sessionId));
    return true;
  } catch (error) {
    console.error('Failed to clear all discovery sessions:', error);
    return false;
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  sessionCount: number;
  totalSize: number;
  sessions: { sessionId: string; size: number; savedAt: string }[];
} {
  if (typeof window === 'undefined') {
    return { sessionCount: 0, totalSize: 0, sessions: [] };
  }

  try {
    const sessions = listDiscoverySessions();
    const sessionInfo = sessions.map((sessionId) => {
      const key = `${STORAGE_PREFIX}-${sessionId}`;
      const data = sessionStorage.getItem(key);
      const size = data ? new Blob([data]).size : 0;

      let savedAt = 'unknown';
      if (data) {
        try {
          const parsed = JSON.parse(data);
          savedAt = parsed.savedAt || 'unknown';
        } catch {
          // Ignore parse errors
        }
      }

      return { sessionId, size, savedAt };
    });

    const totalSize = sessionInfo.reduce((sum, info) => sum + info.size, 0);

    return {
      sessionCount: sessions.length,
      totalSize,
      sessions: sessionInfo,
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return { sessionCount: 0, totalSize: 0, sessions: [] };
  }
}

/**
 * Validate state structure
 */
function isValidState(state: unknown): state is DiscoveryState {
  if (typeof state !== 'object' || state === null) return false;

  const s = state as Record<string, unknown>;

  return (
    typeof s.currentScreen === 'string' &&
    s.completedScreens instanceof Set &&
    typeof s.data === 'object' &&
    s.data !== null &&
    Array.isArray((s.data as any).tools) &&
    typeof (s.data as any).costs === 'object' &&
    Array.isArray(s.intelligenceShown) &&
    typeof s.sessionId === 'string' &&
    s.startedAt instanceof Date &&
    s.lastUpdated instanceof Date
  );
}

/**
 * Clean up old sessions (older than 7 days)
 */
export function cleanupOldSessions(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const sessions = listDiscoverySessions();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    let cleaned = 0;

    sessions.forEach((sessionId) => {
      const key = `${STORAGE_PREFIX}-${sessionId}`;
      const data = sessionStorage.getItem(key);

      if (data) {
        try {
          const parsed = JSON.parse(data);
          const savedAt = new Date(parsed.savedAt).getTime();

          if (now - savedAt > maxAge) {
            clearDiscoveryState(sessionId);
            cleaned++;
          }
        } catch {
          // If we can't parse it, clear it
          clearDiscoveryState(sessionId);
          cleaned++;
        }
      }
    });

    return cleaned;
  } catch (error) {
    console.error('Failed to cleanup old sessions:', error);
    return 0;
  }
}
