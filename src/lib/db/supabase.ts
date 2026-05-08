// Supabase Database Client

import { createClient } from '@supabase/supabase-js';
import { EnhancedAuditResult } from '@/lib/intelligence/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side operations with elevated permissions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Database Types
 */
export interface AuditRecord {
  id: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  ai_summary: string | null;
  created_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  source: string | null;
  referrer: string | null;
}

export interface LeadRecord {
  id: string;
  email: string;
  company: string | null;
  role: string | null;
  audit_id: string;
  total_savings: number;
  is_high_value: boolean;
  created_at: string;
  consultation_booked: boolean;
  consultation_booked_at: string | null;
}

export interface ShareRecord {
  id: string;
  audit_id: string;
  platform: string;
  created_at: string;
}

/**
 * Save audit to database
 */
export async function saveAudit(
  result: EnhancedAuditResult,
  source?: string,
  referrer?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('audits')
      .insert({
        id: result.id,
        input: result.input,
        result: result,
        ai_summary: result.aiSummary || null,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        source: source || null,
        referrer: referrer || null,
      });

    if (error) {
      console.error('Error saving audit:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving audit:', error);
    return { success: false, error: 'Failed to save audit' };
  }
}

/**
 * Get audit by ID
 */
export async function getAudit(
  id: string
): Promise<{ data: EnhancedAuditResult | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('result')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching audit:', error);
      return { data: null, error: error.message };
    }

    return { data: data.result as EnhancedAuditResult };
  } catch (error) {
    console.error('Error fetching audit:', error);
    return { data: null, error: 'Failed to fetch audit' };
  }
}

/**
 * Save lead to database
 */
export async function saveLead(
  email: string,
  auditId: string,
  totalSavings: number,
  company?: string,
  role?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isHighValue = totalSavings >= 500;

    const { error } = await supabaseAdmin
      .from('leads')
      .insert({
        email,
        company: company || null,
        role: role || null,
        audit_id: auditId,
        total_savings: totalSavings,
        is_high_value: isHighValue,
        created_at: new Date().toISOString(),
        consultation_booked: false,
      });

    if (error) {
      console.error('Error saving lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving lead:', error);
    return { success: false, error: 'Failed to save lead' };
  }
}

/**
 * Track share event
 */
export async function trackShare(
  auditId: string,
  platform: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('shares')
      .insert({
        audit_id: auditId,
        platform,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error tracking share:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking share:', error);
    return { success: false, error: 'Failed to track share' };
  }
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey);
}
