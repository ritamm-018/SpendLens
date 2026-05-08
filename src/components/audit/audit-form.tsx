'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auditInputSchema, AuditInputFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { PRICING_DATA } from '@/lib/audit/pricing';
import { ToolId } from '@/lib/audit/types';

interface AuditFormProps {
  onSubmit: (data: AuditInputFormData) => void;
  isSubmitting: boolean;
}

export function AuditForm({ onSubmit, isSubmitting }: AuditFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuditInputFormData>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: {
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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools',
  });

  const toolsData = watch('tools');

  const availableTools = Object.values(PRICING_DATA);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Tools Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Your AI Tools
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                toolId: 'chatgpt' as ToolId,
                planId: '',
                monthlySpend: 0,
                seats: 1,
              })
            }
            disabled={fields.length >= 20}
          >
            <Plus className="h-4 w-4" />
            Add Tool
          </Button>
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

                  {/* Monthly Spend */}
                  <div>
                    <Label htmlFor={`tools.${index}.monthlySpend`}>Monthly Spend ($)</Label>
                    <Input
                      id={`tools.${index}.monthlySpend`}
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                    />
                    {errors.tools?.[index]?.monthlySpend && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tools[index]?.monthlySpend?.message}
                      </p>
                    )}
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
      <Card>
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
