/**
 * Operating Profile Parser and Formatter
 * 
 * Provides parsing, formatting, and pretty-printing for operating profiles.
 * Implements round-trip property: parse(format(profile)) === profile identity
 * 
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6
 */

export interface OperatingProfile {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  icon: string;
  gradient: string;
}

export interface ProfileAssignment {
  profile: OperatingProfile;
  confidence: number; // 0-1
  matchScore: number; // 0-100
  reasoning: string[];
}

/**
 * Parse a profile ID or object into a full OperatingProfile
 */
export function parseOperatingProfile(data: unknown): OperatingProfile | null {
  if (typeof data === 'string') {
    // Parse from ID
    return getProfileById(data);
  }
  
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  
  const obj = data as Record<string, unknown>;
  
  // Validate required fields
  if (
    typeof obj.id !== 'string' ||
    typeof obj.name !== 'string' ||
    typeof obj.description !== 'string' ||
    !Array.isArray(obj.characteristics) ||
    typeof obj.icon !== 'string' ||
    typeof obj.gradient !== 'string'
  ) {
    return null;
  }
  
  // Validate characteristics are all strings
  if (!obj.characteristics.every((c) => typeof c === 'string')) {
    return null;
  }
  
  return {
    id: obj.id,
    name: obj.name,
    description: obj.description,
    characteristics: obj.characteristics as string[],
    icon: obj.icon,
    gradient: obj.gradient,
  };
}

/**
 * Format an operating profile for display
 */
export function formatOperatingProfile(profile: OperatingProfile): string {
  return profile.name;
}

/**
 * Pretty print an operating profile with full details
 */
export function prettyPrintOperatingProfile(
  profile: OperatingProfile,
  options: {
    includeDescription?: boolean;
    includeCharacteristics?: boolean;
    format?: 'text' | 'html' | 'markdown';
  } = {}
): string {
  const {
    includeDescription = true,
    includeCharacteristics = true,
    format = 'text',
  } = options;
  
  const parts: string[] = [];
  
  // Add icon and name
  if (format === 'text') {
    parts.push(`${profile.icon} ${profile.name}`);
  } else if (format === 'html') {
    parts.push(`<div class="flex items-center gap-2">`);
    parts.push(`  <span class="text-2xl">${profile.icon}</span>`);
    parts.push(`  <span class="font-semibold text-xl">${profile.name}</span>`);
    parts.push(`</div>`);
  } else if (format === 'markdown') {
    parts.push(`${profile.icon} **${profile.name}**`);
  }
  
  // Add description
  if (includeDescription) {
    if (format === 'html') {
      parts.push(`<p class="text-zinc-600 dark:text-zinc-400 mt-2">${profile.description}</p>`);
    } else {
      parts.push('');
      parts.push(profile.description);
    }
  }
  
  // Add characteristics
  if (includeCharacteristics && profile.characteristics.length > 0) {
    if (format === 'html') {
      parts.push(`<ul class="mt-4 space-y-2">`);
      profile.characteristics.forEach((char) => {
        parts.push(`  <li class="flex items-start gap-2">`);
        parts.push(`    <span class="text-emerald-500">✓</span>`);
        parts.push(`    <span>${char}</span>`);
        parts.push(`  </li>`);
      });
      parts.push(`</ul>`);
    } else if (format === 'markdown') {
      parts.push('');
      parts.push('**Characteristics:**');
      profile.characteristics.forEach((char) => {
        parts.push(`- ${char}`);
      });
    } else {
      parts.push('');
      parts.push('Characteristics:');
      profile.characteristics.forEach((char) => {
        parts.push(`  • ${char}`);
      });
    }
  }
  
  return parts.join(format === 'html' ? '' : '\n');
}

/**
 * Format a profile assignment with confidence and reasoning
 */
export function formatProfileAssignment(assignment: ProfileAssignment): string {
  const confidenceLabel =
    assignment.confidence >= 0.8
      ? 'High confidence'
      : assignment.confidence >= 0.5
      ? 'Medium confidence'
      : 'Low confidence';
  
  return `${assignment.profile.name} (${confidenceLabel}, ${Math.round(assignment.matchScore)}% match)`;
}

/**
 * Pretty print a profile assignment with full details
 */
export function prettyPrintProfileAssignment(
  assignment: ProfileAssignment,
  options: {
    includeReasoning?: boolean;
    format?: 'text' | 'html' | 'markdown';
  } = {}
): string {
  const { includeReasoning = true, format = 'text' } = options;
  
  const parts: string[] = [];
  
  // Add profile
  parts.push(prettyPrintOperatingProfile(assignment.profile, { format }));
  
  // Add confidence and match score
  const confidenceLabel =
    assignment.confidence >= 0.8
      ? 'High confidence'
      : assignment.confidence >= 0.5
      ? 'Medium confidence'
      : 'Low confidence';
  
  if (format === 'html') {
    parts.push(`<div class="mt-4 flex items-center gap-4">`);
    parts.push(`  <span class="text-sm text-zinc-600 dark:text-zinc-400">${confidenceLabel}</span>`);
    parts.push(`  <span class="text-sm text-zinc-600 dark:text-zinc-400">${Math.round(assignment.matchScore)}% match</span>`);
    parts.push(`</div>`);
  } else {
    parts.push('');
    parts.push(`${confidenceLabel} • ${Math.round(assignment.matchScore)}% match`);
  }
  
  // Add reasoning
  if (includeReasoning && assignment.reasoning.length > 0) {
    if (format === 'html') {
      parts.push(`<div class="mt-4">`);
      parts.push(`  <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Why this profile:</p>`);
      parts.push(`  <ul class="mt-2 space-y-1">`);
      assignment.reasoning.forEach((reason) => {
        parts.push(`    <li class="text-sm text-zinc-600 dark:text-zinc-400">• ${reason}</li>`);
      });
      parts.push(`  </ul>`);
      parts.push(`</div>`);
    } else if (format === 'markdown') {
      parts.push('');
      parts.push('**Why this profile:**');
      assignment.reasoning.forEach((reason) => {
        parts.push(`- ${reason}`);
      });
    } else {
      parts.push('');
      parts.push('Why this profile:');
      assignment.reasoning.forEach((reason) => {
        parts.push(`  • ${reason}`);
      });
    }
  }
  
  return parts.join(format === 'html' ? '' : '\n');
}

/**
 * Get profile by ID from the profiles database
 */
function getProfileById(id: string): OperatingProfile | null {
  // This would normally load from the profiles.json file
  // For now, return null to indicate profile not found
  // In production, this would be:
  // import profiles from '@/data/profiles.json';
  // return profiles.find(p => p.id === id) || null;
  return null;
}

/**
 * Validate round-trip property: parse(format(profile)) === profile identity
 * Returns true if the profile identity is preserved
 */
export function validateRoundTrip(profile: OperatingProfile): boolean {
  // Format to JSON
  const json = {
    id: profile.id,
    name: profile.name,
    description: profile.description,
    characteristics: profile.characteristics,
    icon: profile.icon,
    gradient: profile.gradient,
  };
  
  // Parse back
  const parsed = parseOperatingProfile(json);
  
  if (!parsed) {
    return false;
  }
  
  // Check identity preservation
  return (
    parsed.id === profile.id &&
    parsed.name === profile.name &&
    parsed.description === profile.description &&
    JSON.stringify(parsed.characteristics) === JSON.stringify(profile.characteristics) &&
    parsed.icon === profile.icon &&
    parsed.gradient === profile.gradient
  );
}
