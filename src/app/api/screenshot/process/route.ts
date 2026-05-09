import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Enhanced tool recognition database
const AI_TOOLS_DATABASE = {
  // Coding AI
  cursor: ['cursor', 'cursor.sh', 'cursor ai', 'cursor.com'],
  copilot: ['github copilot', 'copilot', 'gh copilot', 'microsoft copilot'],
  codeium: ['codeium', 'codeium.com'],
  tabnine: ['tabnine', 'tab nine'],
  windsurf: ['windsurf', 'windsurf ai', 'codeium windsurf'],
  
  // Chat AI
  chatgpt: ['chatgpt', 'chat gpt', 'gpt-4', 'gpt-3.5', 'openai chat'],
  claude: ['claude', 'claude ai', 'anthropic claude', 'claude pro', 'claude.ai'],
  gemini: ['gemini', 'google gemini', 'bard', 'gemini pro'],
  perplexity: ['perplexity', 'perplexity ai', 'perplexity.ai'],
  
  // API Services
  'openai-api': ['openai api', 'openai', 'gpt api', 'gpt-4 api'],
  'anthropic-api': ['anthropic api', 'claude api', 'anthropic'],
  'google-ai': ['google ai', 'palm api', 'gemini api'],
  
  // Design & Prototyping
  v0: ['v0', 'v0.dev', 'vercel v0'],
  midjourney: ['midjourney', 'mid journey'],
  'dall-e': ['dall-e', 'dalle', 'dall e'],
  
  // Other
  jasper: ['jasper', 'jasper ai', 'jasper.ai'],
  writesonic: ['writesonic', 'write sonic'],
  copy: ['copy.ai', 'copy ai'],
};

// Normalize tool name for matching
function normalizeToolName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

// Find canonical tool name
function findCanonicalToolName(detectedName: string): string {
  const normalized = normalizeToolName(detectedName);
  
  for (const [canonical, variants] of Object.entries(AI_TOOLS_DATABASE)) {
    if (variants.some(variant => normalized.includes(variant) || variant.includes(normalized))) {
      return canonical;
    }
  }
  
  return detectedName; // Return original if no match
}

/**
 * POST /api/screenshot/process
 * 
 * World-class screenshot processing with advanced AI extraction
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', code: 'NO_FILE' },
        { status: 400 }
      );
    }

    // Enhanced file type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: `Invalid file type: ${file.type}. Please upload JPG, PNG, GIF, or WebP.`,
          code: 'INVALID_TYPE',
          acceptedTypes: validTypes
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum of 10MB`,
          code: 'FILE_TOO_LARGE',
          maxSize: maxSize,
          actualSize: file.size
        },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Screenshot processing is not configured. Please contact support.', code: 'API_NOT_CONFIGURED' },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Determine media type
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

    // Use Claude 3.5 Sonnet with vision to extract data
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log(`Processing screenshot: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.1, // Low temperature for consistent extraction
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are an expert at extracting AI tool subscription data from billing screenshots, invoices, and expense reports.

TASK: Analyze this image and extract ALL AI tool subscriptions with maximum accuracy.

RECOGNIZED AI TOOLS (look for these):
**Coding AI:** Cursor, GitHub Copilot, Codeium, Tabnine, Windsurf, Replit, Amazon CodeWhisperer
**Chat AI:** ChatGPT, Claude, Gemini, Perplexity, Poe, Character.AI
**API Services:** OpenAI API, Anthropic API, Google AI API, Cohere API
**Design/Creative:** Midjourney, DALL-E, Stable Diffusion, v0, Figma AI
**Writing:** Jasper, Copy.ai, Writesonic, Grammarly Premium
**Research:** Elicit, Consensus, Semantic Scholar
**Other:** Any other AI/ML tools or services

EXTRACTION RULES:
1. Extract tool name EXACTLY as shown (preserve capitalization)
2. Identify plan tier (Free, Pro, Team, Enterprise, Business, etc.)
3. Count number of seats/licenses/users
4. Extract monthly cost in USD (convert if needed)
5. If annual billing, divide by 12 for monthly cost
6. Look for recurring charges, subscriptions, or SaaS payments
7. Ignore one-time purchases or non-AI tools
8. Be thorough - check entire image for all AI tools

CONFIDENCE SCORING:
- 1.0 = Perfect clarity, all data clearly visible
- 0.8-0.9 = High confidence, minor ambiguity
- 0.6-0.7 = Medium confidence, some guessing required
- 0.4-0.5 = Low confidence, significant uncertainty
- <0.4 = Very uncertain, recommend manual entry

OUTPUT FORMAT (JSON only, no markdown):
{
  "tools": [
    {
      "name": "Exact Tool Name",
      "plan": "Plan Tier",
      "seats": number,
      "monthlySpend": number,
      "confidence": number,
      "notes": "any relevant details"
    }
  ],
  "totalMonthlySpend": number,
  "teamSize": number,
  "confidence": number,
  "imageQuality": "excellent|good|fair|poor",
  "detectionNotes": "what you found and any issues"
}

If NO AI tools found:
{
  "tools": [],
  "totalMonthlySpend": 0,
  "teamSize": 0,
  "confidence": 0,
  "imageQuality": "unknown",
  "detectionNotes": "No AI tool subscriptions detected. This may be: [reason]"
}

IMPORTANT:
- Return ONLY valid JSON (no markdown, no code blocks, no explanations)
- Be conservative with confidence scores
- Include detection notes to explain what you found
- If image is unclear, say so in detectionNotes
- Extract ALL AI tools visible, not just the first few`,
            },
          ],
        },
      ],
    });

    const processingTime = Date.now() - startTime;
    console.log(`Claude API response received in ${processingTime}ms`);

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // Remove any leading/trailing whitespace
    jsonText = jsonText.trim();

    let extractedData;
    try {
      extractedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', responseText);
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response. The image may be unclear or contain no AI tool data.',
          code: 'PARSE_ERROR',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        },
        { status: 500 }
      );
    }

    // Validate extracted data structure
    if (!extractedData.tools || !Array.isArray(extractedData.tools)) {
      return NextResponse.json(
        { 
          error: 'Invalid data format from AI. Please try a clearer screenshot.',
          code: 'INVALID_FORMAT'
        },
        { status: 500 }
      );
    }

    // Normalize tool names for better matching
    extractedData.tools = extractedData.tools.map((tool: any) => ({
      ...tool,
      canonicalName: findCanonicalToolName(tool.name),
    }));

    // Calculate total if not provided
    if (!extractedData.totalMonthlySpend) {
      extractedData.totalMonthlySpend = extractedData.tools.reduce(
        (sum: number, tool: any) => sum + (tool.monthlySpend || 0),
        0
      );
    }

    // Estimate team size if not provided
    if (!extractedData.teamSize) {
      extractedData.teamSize = Math.max(
        1,
        extractedData.tools.reduce((max: number, tool: any) => Math.max(max, tool.seats || 0), 0)
      );
    }

    // Check if any tools were found
    if (extractedData.tools.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No AI tool subscriptions detected in this image.',
          code: 'NO_TOOLS_FOUND',
          confidence: extractedData.confidence || 0,
          imageQuality: extractedData.imageQuality || 'unknown',
          detectionNotes: extractedData.detectionNotes || 'Could not identify any AI tools in the screenshot.',
          suggestions: [
            'Try uploading a clearer screenshot',
            'Ensure AI tool names are visible',
            'Check that pricing information is shown',
            'Use a screenshot from your billing dashboard',
            'Or enter your data manually instead'
          ]
        },
        { status: 422 }
      );
    }

    // Check confidence threshold
    if (extractedData.confidence < 0.3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Low confidence in extracted data. Please verify or try a clearer screenshot.',
          code: 'LOW_CONFIDENCE',
          confidence: extractedData.confidence,
          imageQuality: extractedData.imageQuality || 'poor',
          detectionNotes: extractedData.detectionNotes,
          partialData: extractedData.tools, // Include partial data for user review
          suggestions: [
            'Upload a higher resolution screenshot',
            'Ensure text is clearly readable',
            'Try a screenshot from a different angle',
            'Or review and edit the extracted data manually'
          ]
        },
        { status: 422 }
      );
    }

    const totalTime = Date.now() - startTime;
    console.log(`Screenshot processed successfully in ${totalTime}ms`);
    console.log(`Found ${extractedData.tools.length} tools with ${extractedData.confidence} confidence`);

    // Return extracted data with metadata
    return NextResponse.json({
      success: true,
      data: {
        tools: extractedData.tools,
        totalMonthlySpend: extractedData.totalMonthlySpend,
        teamSize: extractedData.teamSize,
        confidence: extractedData.confidence,
        imageQuality: extractedData.imageQuality || 'good',
        detectionNotes: extractedData.detectionNotes,
      },
      metadata: {
        processingTime: totalTime,
        fileName: file.name,
        fileSize: file.size,
        model: 'claude-3-5-sonnet-20241022',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('Screenshot processing error:', error);
    
    // Handle specific errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response. Please try again with a clearer screenshot.',
          code: 'PARSE_ERROR',
          details: error.message
        },
        { status: 500 }
      );
    }

    // Handle Anthropic API errors
    if (error instanceof Error && error.message.includes('API')) {
      return NextResponse.json(
        { 
          error: 'AI service temporarily unavailable. Please try again in a moment.',
          code: 'API_ERROR',
          details: error.message
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process screenshot. Please try again or enter data manually.',
        code: 'UNKNOWN_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: totalTime
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}