// Resend Email Client

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send audit report email
 */
export async function sendAuditReport(
  to: string,
  auditId: string,
  totalSavings: number,
  toolCount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: 'SpendLens <hello@spendlens.com>',
      to: [to],
      subject: `Your SpendLens Audit Results: $${totalSavings}/month in savings found`,
      html: getAuditReportTemplate(auditId, totalSavings, toolCount),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Get audit report email template
 */
function getAuditReportTemplate(
  auditId: string,
  totalSavings: number,
  toolCount: number
): string {
  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://spendlens.com'}/results/${auditId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SpendLens Audit Results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #18181b;
      background-color: #fafafa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .savings-box {
      background: #f0fdf4;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .savings-amount {
      font-size: 36px;
      font-weight: 700;
      color: #10b981;
      margin: 0;
    }
    .savings-label {
      font-size: 14px;
      color: #52525b;
      margin: 8px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cta-button {
      display: inline-block;
      background: #10b981;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      margin: 24px 0;
    }
    .cta-button:hover {
      background: #059669;
    }
    .footer {
      background: #fafafa;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #71717a;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your AI Spend Audit Results</h1>
    </div>
    
    <div class="content">
      <p>Hi there,</p>
      
      <p>Thanks for auditing your AI stack with SpendLens! We analyzed ${toolCount} tools and found optimization opportunities.</p>
      
      <div class="savings-box">
        <p class="savings-amount">$${totalSavings}/month</p>
        <p class="savings-label">Potential Monthly Savings</p>
      </div>
      
      <p>Your full report includes:</p>
      <ul>
        <li>Efficiency score and benchmark comparisons</li>
        <li>Operating profile classification</li>
        <li>Tool-by-tool breakdown with recommendations</li>
        <li>Strategic insights for your team</li>
        <li>Shareable results with social cards</li>
      </ul>
      
      <center>
        <a href="${reportUrl}" class="cta-button">View Full Report →</a>
      </center>
      
      <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e4e4e7;">
        <strong>Want to save even more?</strong><br>
        Credex offers discounted AI credits (20-30% off retail) for Cursor, Claude, ChatGPT Enterprise, and more. 
        If you're spending >$500/month on AI tools, we can help.
      </p>
      
      <center>
        <a href="https://credex.com/consultation" style="color: #10b981; text-decoration: none; font-weight: 600;">
          Book a 15-minute consultation →
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p>
        <strong>SpendLens</strong> by Credex<br>
        <a href="${reportUrl}">View Report</a> • 
        <a href="https://spendlens.com">Run Another Audit</a>
      </p>
      <p style="font-size: 12px; color: #a1a1aa; margin-top: 16px;">
        You received this email because you requested an audit report from SpendLens.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Check if Resend is configured
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
