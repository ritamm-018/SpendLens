'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auditInputSchema, AuditInputFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Plus, Trash2, Loader2, CheckCircle, Globe } from 'lucide-react';
import { PRICING_DATA } from '@/lib/audit/pricing';
import { ToolId } from '@/lib/audit/types';
import { useSearchParams } from 'next/navigation';
import { getDefaultCurrency } from '@/lib/currency/currencies';

interface AuditFormProps {
  onSubmit: (data: AuditInputFormData) => void;
  isSubmitting: boolean;
}

function AuditFormInner({ onSubmit, isSubmitting }: AuditFormProps) {
  const searchParams = useSearchParams();
  const [prefilledFromScreenshot, setPrefilledFromScreenshot] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [showToolCountInput, setShowToolCountInput] = useState(false);
  const [toolCount, setToolCount] = useState(1);

  // Initialize currency from localStorage or browser locale
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-currency');
      if (stored) {
        setCurrency(stored);
      } else {
        const defaultCurrency = getDefaultCurrency();
        setCurrency(defaultCurrency);
      }
    }
  }, []);

  // Save currency preference
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-currency', newCurrency);
    }
  };

  // Get default values (check for screenshot data)
  const getDefaultValues = (): Partial<AuditInputFormData> => {
    // Check if coming from screenshot upload
    if (typeof window !== 'undefined' && searchParams?.get('prefilled') === 'screenshot') {
      const screenshotData = sessionStorage.getItem('screenshot-data');
      if (screenshotData) {
        try {
          const data = JSON.parse(screenshotData);
          setPrefilledFromScreenshot(true);
          
          // Map screenshot data to form format
          return {
            tools: data.tools.map((tool: any) => ({
              toolId: tool.name.toLowerCase().replace(/\s+/g, '-') as ToolId,
              planId: '',
              monthlySpend: tool.monthlySpend || 0,
              seats: tool.seats || 1,
            })),
            teamSize: data.teamSize || 1,
            primaryUseCase: 'coding',
            currency: currency,
          };
        } catch (e) {
          console.error('Failed to parse screenshot data:', e);
        }
      }
    }

    // Default values
    return {
      tools: [
        {
          toolId: 'cursor' as ToolId,
          planId: '',
          monthlySpend: 0,
          seats: 1,
        },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
      currency: currency,
    };
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AuditInputFormData>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: getDefaultValues(),
  });

  // Clear screenshot data after loading
  useEffect(() => {
    if (prefilledFromScreenshot && typeof window !== 'undefined') {
      sessionStorage.removeItem('screenshot-data');
    }
  }, [prefilledFromScreenshot]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools',
  });

  const toolsData = watch('tools');

  const availableTools = Object.values(PRICING_DATA);

  const handleFormSubmit = (data: AuditInputFormData) => {
    // Ensure currency is included
    const dataWithCurrency: AuditInputFormData = {
      ...data,
      currency: currency,
    };
    onSubmit(dataWithCurrency);
  };

  const handleAddTools = () => {
    if (toolCount > 0 && toolCount <= 20) {
      const toolsToAdd = toolCount - fields.length;
      for (let i = 0; i < toolsToAdd; i++) {
        append({
          toolId: 'chatgpt' as ToolId,
          planId: '',
          monthlySpend: 0,
          seats: 1,
        });
      }
      setShowToolCountInput(false);
      setToolCount(1);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Prefilled Notification */}
      {prefilledFromScreenshot && (
        <Card className="border-emerald-900/50 bg-emerald-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-100">
                  Data Loaded from Screenshot
                </h3>
                <p className="mt-1 text-sm text-emerald-300">
                  We've pre-filled the form with data extracted from your screenshot. Please review and adjust as needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tools Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-50">
              Your AI Tools
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Add all your AI tool subscriptions below
            </p>
          </div>
          
          {!showToolCountInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowToolCountInput(true)}
              disabled={fields.length >= 20}
            >
              <Plus className="h-4 w-4" />
              Add Tools
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="20"
                value={toolCount}
                onChange={(e) => setToolCount(Number(e.target.value))}
                placeholder="Number of tools"
                className="w-32"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddTools}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowToolCountInput(false);
                  setToolCount(1);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {fields.map((field, index) => {
          const selectedToolId = toolsData[index]?.toolId;
          const selectedTool = selectedToolId ? PRICING_DATA[selectedToolId] : null;

          return (
            <Card key={field.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Tool {index + 1}</CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div>
                  <Label htmlFor={`tools.${index}.toolId`}>Tool</Label>
                  <Select
                    id={`tools.${index}.toolId`}
                    {...register(`tools.${index}.toolId`)}
                  >
                    <option value="">Select a tool...</option>
                    {availableTools.map((tool) => (
                      <option key={tool.id} value={tool.id}>
                        {tool.name} ({tool.category.replace('-', ' ')})
                      </option>
                    ))}
                  </Select>
                  {errors.tools?.[index]?.toolId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.tools[index]?.toolId?.message}
                    </p>
                  )}
                </div>

                {/* Plan Selection */}
                {selectedTool && (
                  <div>
                    <Label htmlFor={`tools.${index}.planId`}>Plan</Label>
                    <Select
                      id={`tools.${index}.planId`}
                      {...register(`tools.${index}.planId`)}
                    >
                      <option value="">Select a plan...</option>
                      {selectedTool.plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.monthlyPricePerSeat}
                          {plan.isPerSeat ? '/seat' : ''}/mo
                        </option>
                      ))}
                    </Select>
                    {errors.tools?.[index]?.planId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tools[index]?.planId?.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Seats */}
                  <div>
                    <Label htmlFor={`tools.${index}.seats`}>Seats</Label>
                    <Input
                      id={`tools.${index}.seats`}
                      type="number"
                      min="1"
                      {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                    />
                    {errors.tools?.[index]?.seats && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tools[index]?.seats?.message}
                      </p>
                    )}
                  </div>

                  {/* Monthly Spend with Currency */}
                  <div>
                    <Controller
                      name={`tools.${index}.monthlySpend`}
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          value={field.value || 0}
                          currency={currency}
                          onValueChange={field.onChange}
                          onCurrencyChange={handleCurrencyChange}
                          label="Monthly Spend"
                          placeholder="0.00"
                          error={errors.tools?.[index]?.monthlySpend?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {errors.tools && typeof errors.tools.message === 'string' && (
          <p className="text-sm text-red-600">{errors.tools.message}</p>
        )}
      </div>

      {/* Team Info Section */}
      <Card className="relative z-0">
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              {...register('teamSize', { valueAsNumber: true })}
            />
            {errors.teamSize && (
              <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="primaryUseCase">Primary Use Case</Label>
            <Select id="primaryUseCase" {...register('primaryUseCase')}>
              <option value="coding">Coding</option>
              <option value="research">Research</option>
              <option value="chat">Chat / Brainstorming</option>
              <option value="api-integration">API Integration</option>
              <option value="design">Design / Prototyping</option>
              <option value="mixed">Mixed</option>
            </Select>
            {errors.primaryUseCase && (
              <p className="mt-1 text-sm text-red-600">{errors.primaryUseCase.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Generate Audit'
          )}
        </Button>
      </div>
    </form>
  );
}


// Wrapper with Suspense boundary
export function AuditForm(props: AuditFormProps) {
  return (
    <Suspense fallback={
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </Card>
    }>
      <AuditFormInner {...props} />
    </Suspense>
  );
}
