'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScreenshotUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) {
      setError('No file detected. Please try again.');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(droppedFile.type)) {
      setError(`Invalid file type: ${droppedFile.type}. Please upload JPG, PNG, GIF, or WebP.`);
      return;
    }
    
    // Validate file size (10MB)
    if (droppedFile.size > 10 * 1024 * 1024) {
      setError(`File too large: ${(droppedFile.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 10MB.`);
      return;
    }
    
    handleFile(droppedFile);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError(`Invalid file type: ${selectedFile.type}. Please upload JPG, PNG, GIF, or WebP.`);
      return;
    }
    
    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(`File too large: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 10MB.`);
      return;
    }
    
    handleFile(selectedFile);
  };

  const handleFile = (file: File) => {
    setFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processScreenshot = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Call API to process screenshot
      const response = await fetch('/api/screenshot/process', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process screenshot');
      }

      if (!result.success) {
        throw new Error(result.error || 'No data extracted');
      }

      // Set extracted data
      setExtractedData(result.data);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process screenshot. Please try again or enter manually.');
    } finally {
      setProcessing(false);
    }
  };

  const confirmAndContinue = () => {
    if (!extractedData) return;

    // Store extracted data in sessionStorage
    sessionStorage.setItem('screenshot-data', JSON.stringify(extractedData));
    
    // Navigate to audit form with prefilled flag
    router.push('/audit?prefilled=screenshot');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-emerald-900/50 bg-emerald-950/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            <Upload className="h-3 w-3" />
            Screenshot Upload
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-50">
            Upload Your Billing Screenshot
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            We'll automatically extract your AI tool subscriptions using AI-powered OCR
          </p>
        </motion.div>

        {/* Upload Area */}
        {!preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="block cursor-pointer">
              <Card
                className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center transition-all hover:border-emerald-500 hover:bg-emerald-950/20 backdrop-blur-sm hover:scale-[1.01]"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className="mx-auto h-16 w-16 text-zinc-600 transition-colors group-hover:text-emerald-500" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                  Drop your screenshot here
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  or click anywhere to browse
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25">
                  <ImageIcon className="h-4 w-4" />
                  Choose File
                </div>
                <p className="mt-6 text-xs text-zinc-500">
                  Supports: PNG, JPG, GIF, WebP • Max 10MB
                </p>
                <p className="mt-2 text-xs text-zinc-600">
                  Works with: Stripe, Expensify, Brex, Ramp, credit card statements
                </p>
              </Card>
            </label>
          </motion.div>
        )}

        {/* Preview & Processing */}
        {preview && !extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden p-6 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg border border-zinc-800 object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-50">
                    {file?.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {(file!.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {!processing && !error && (
                    <div className="mt-4 flex gap-3">
                      <Button onClick={processScreenshot} className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                        <Upload className="mr-2 h-4 w-4" />
                        Extract Data with AI
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPreview(null);
                          setFile(null);
                          setError(null);
                        }}
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {processing && (
              <Card className="p-8 text-center bg-zinc-900/50 border-zinc-800">
                <div className="relative">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-500" />
                  <div className="absolute inset-0 mx-auto h-12 w-12 animate-ping rounded-full bg-emerald-500/20" />
                </div>
                <h3 className="mt-6 font-semibold text-zinc-50">
                  Processing your screenshot...
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Using Claude 3.5 Sonnet Vision to extract tool names, plans, and costs
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="mt-4 text-xs text-zinc-500">
                  This usually takes 5-10 seconds
                </p>
              </Card>
            )}

            {error && (
              <Card className="border-rose-900/50 bg-rose-950/20 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-rose-100">
                      Processing Failed
                    </h3>
                    <p className="mt-1 text-sm text-rose-300">
                      {error}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setError(null);
                          setPreview(null);
                          setFile(null);
                        }}
                        className="border-rose-800 text-rose-300 hover:bg-rose-950/50"
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/audit')}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Enter Manually Instead
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Extracted Data */}
        {extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-emerald-900/50 bg-emerald-950/20 p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-100">
                    Data Extracted Successfully!
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      {Math.round(extractedData.confidence * 100)}% confidence
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      {extractedData.tools.length} AI tool{extractedData.tools.length !== 1 ? 's' : ''} found
                    </span>
                    {extractedData.totalMonthlySpend > 0 && (
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        ${extractedData.totalMonthlySpend.toFixed(2)}/mo total
                      </span>
                    )}
                  </div>
                  {extractedData.detectionNotes && (
                    <p className="mt-3 text-xs text-emerald-400/80 italic">
                      {extractedData.detectionNotes}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-50">
                  Detected Tools
                </h3>
                <div className="text-xs text-zinc-500">
                  Image Quality: <span className="capitalize text-zinc-400">{extractedData.imageQuality || 'good'}</span>
                </div>
              </div>
              <div className="space-y-3">
                {extractedData.tools.map((tool: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:border-emerald-700 hover:bg-zinc-800/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-zinc-50">
                          {tool.name}
                        </div>
                        {tool.confidence && (
                          <div className={`text-xs px-2 py-0.5 rounded ${
                            tool.confidence >= 0.8 
                              ? 'bg-emerald-950/50 text-emerald-400' 
                              : tool.confidence >= 0.6
                              ? 'bg-amber-950/50 text-amber-400'
                              : 'bg-rose-950/50 text-rose-400'
                          }`}>
                            {Math.round(tool.confidence * 100)}%
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-zinc-400">
                        <span>{tool.plan}</span>
                        <span className="text-zinc-700">•</span>
                        <span>{tool.seats} seat{tool.seats !== 1 ? 's' : ''}</span>
                      </div>
                      {tool.notes && (
                        <div className="mt-2 text-xs text-zinc-500 italic">
                          {tool.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold tabular-nums text-zinc-50">
                        ${tool.monthlySpend.toFixed(2)}
                      </div>
                      <div className="text-xs text-zinc-500">per month</div>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.div>
                ))}
              </div>
              
              {extractedData.teamSize > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-zinc-400">Estimated Team Size</div>
                      <div className="mt-1 text-xs text-zinc-500">Based on seat counts</div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-50">{extractedData.teamSize}</div>
                  </div>
                </div>
              )}
              
              {extractedData.totalMonthlySpend > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-zinc-400">Total Monthly Spend</div>
                      <div className="mt-1 text-xs text-zinc-500">Combined across all tools</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        ${extractedData.totalMonthlySpend.toFixed(2)}
                      </div>
                      <div className="text-xs text-zinc-500">
                        ${(extractedData.totalMonthlySpend * 12).toFixed(2)}/year
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                  setExtractedData(null);
                  setError(null);
                }}
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Upload Different Screenshot
              </Button>
              <Button 
                onClick={confirmAndContinue} 
                className="flex-1 group bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Continue to Audit
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              title: 'AI-Powered',
              description: 'Uses Claude 3.5 Sonnet Vision to extract data accurately',
            },
            {
              title: 'Secure',
              description: 'Your screenshots are processed securely and never stored',
            },
            {
              title: 'Fast',
              description: 'Get results in 10 seconds vs 90 seconds manual entry',
            },
          ].map((item, i) => (
            <Card key={i} className="p-4 text-center bg-zinc-900/50 border-zinc-800">
              <h4 className="font-semibold text-zinc-50">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-zinc-400">
                {item.description}
              </p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
