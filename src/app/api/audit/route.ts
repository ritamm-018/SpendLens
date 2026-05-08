import { NextRequest, NextResponse } from 'next/server';
import { auditInputSchema } from '@/lib/validation';
import { runAudit } from '@/lib/audit/engine';
import { AuditInput } from '@/lib/audit/types';
import { intelligenceEngine } from '@/lib/intelligence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = auditInputSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const input: AuditInput = validationResult.data;

    // Run audit
    const result = runAudit(input);

    // Enhance with intelligence
    const enhancedResult = await intelligenceEngine.enhance(result);

    // TODO: Store in database (Supabase)
    // For now, we return the full result and let the client store it
    // In production, you'd save to DB and return just the ID

    return NextResponse.json(enhancedResult);
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
