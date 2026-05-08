import { NextRequest, NextResponse } from 'next/server';
import { leadCaptureSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = leadCaptureSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, company, role, reportId } = validationResult.data;
    const totalSavings = body.totalSavings || 0;

    // TODO: Store in Supabase
    console.log('Lead captured:', { email, company, role, reportId, totalSavings });

    // TODO: Send email via Resend
    // For now, just log it
    console.log('Would send email to:', email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
