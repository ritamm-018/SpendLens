/**
 * Discovery Flow State Machine
 * 
 * Manages the progressive onboarding flow with screen-by-screen navigation,
 * data persistence, and validation.
 * 
 * Requirements: 2.2, 2.3, 2.5, 2.7, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6
 */

import type { UseCase, ToolId } from '@/lib/audit/types';

export type ScreenId =
  | 'welcome'
  | 'use-case'
  | 'team-size'
  | 'tools'
  | 'costs'
  | 'review';

export interface ToolSelection {
  toolId: ToolId;
  planId?: string;
  addedAt: Date;
}

export interface CostInput {
  monthlySpend: number;
  seats: number;
  validatedAt: Date;
}

export interface DiscoveryState {
  currentScreen: ScreenId;
  completedScreens: Set<ScreenId>;
  data: {
    useCase?: UseCase;
    teamSize?: number;
    tools: ToolSelection[];
    costs: Record<string, CostInput>;
  };
  intelligenceShown: string[]; // Track shown intelligence statements
  sessionId: string;
  startedAt: Date;
  lastUpdated: Date;
}

export interface DiscoveryContext {
  useCase?: UseCase;
  teamSize?: number;
  tools: ToolSelection[];
  costs: Record<string, CostInput>;
  totalSpend: number;
}

/**
 * Discovery Flow State Machine
 * Manages navigation, validation, and persistence
 */
export class DiscoveryFlowMachine {
  private state: DiscoveryState;

  constructor(initialState?: Partial<DiscoveryState>) {
    this.state = this.initializeState(initialState);
  }

  /**
   * Initialize state with defaults
   */
  private initializeState(partial?: Partial<DiscoveryState>): DiscoveryState {
    const now = new Date();
    return {
      currentScreen: partial?.currentScreen || 'welcome',
      completedScreens: partial?.completedScreens || new Set<ScreenId>(),
      data: {
        useCase: partial?.data?.useCase,
        teamSize: partial?.data?.teamSize,
        tools: partial?.data?.tools || [],
        costs: partial?.data?.costs || {},
      },
      intelligenceShown: partial?.intelligenceShown || [],
      sessionId: partial?.sessionId || this.generateSessionId(),
      startedAt: partial?.startedAt || now,
      lastUpdated: partial?.lastUpdated || now,
    };
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `discovery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Navigate to next screen
   * Returns the next screen ID or null if at end
   */
  next(): ScreenId | null {
    const current = this.state.currentScreen;
    const transitions: Record<ScreenId, ScreenId | null> = {
      welcome: 'use-case',
      'use-case': 'team-size',
      'team-size': 'tools',
      tools: 'costs',
      costs: 'review',
      review: null, // Triggers submission
    };

    const nextScreen = transitions[current];
    if (nextScreen) {
      this.state.completedScreens.add(current);
      this.state.currentScreen = nextScreen;
      this.state.lastUpdated = new Date();
      this.persist();
    }
    return nextScreen;
  }

  /**
   * Navigate to previous screen
   * Returns the previous screen ID or null if at start
   */
  back(): ScreenId | null {
    const current = this.state.currentScreen;
    const backTransitions: Record<ScreenId, ScreenId | null> = {
      welcome: null,
      'use-case': 'welcome',
      'team-size': 'use-case',
      tools: 'team-size',
      costs: 'tools',
      review: 'costs',
    };

    const prevScreen = backTransitions[current];
    if (prevScreen) {
      this.state.currentScreen = prevScreen;
      this.state.lastUpdated = new Date();
      this.persist();
    }
    return prevScreen;
  }

  /**
   * Jump to a specific screen (only if already completed)
   */
  jumpTo(screen: ScreenId): boolean {
    if (this.state.completedScreens.has(screen) || screen === 'welcome') {
      this.state.currentScreen = screen;
      this.state.lastUpdated = new Date();
      this.persist();
      return true;
    }
    return false;
  }

  /**
   * Update data for current screen
   */
  updateData(data: Partial<DiscoveryState['data']>): void {
    this.state.data = { ...this.state.data, ...data };
    this.state.lastUpdated = new Date();
    this.persist();
  }

  /**
   * Add a tool to the selection
   */
  addTool(toolId: ToolId, planId?: string): void {
    const tool: ToolSelection = {
      toolId,
      planId,
      addedAt: new Date(),
    };
    this.state.data.tools.push(tool);
    this.state.lastUpdated = new Date();
    this.persist();
  }

  /**
   * Remove a tool from the selection
   */
  removeTool(toolId: ToolId): void {
    this.state.data.tools = this.state.data.tools.filter((t) => t.toolId !== toolId);
    // Also remove associated costs
    delete this.state.data.costs[toolId];
    this.state.lastUpdated = new Date();
    this.persist();
  }

  /**
   * Update cost for a specific tool
   */
  updateCost(toolId: ToolId, cost: Omit<CostInput, 'validatedAt'>): void {
    this.state.data.costs[toolId] = {
      ...cost,
      validatedAt: new Date(),
    };
    this.state.lastUpdated = new Date();
    this.persist();
  }

  /**
   * Track that an intelligence statement was shown
   */
  markIntelligenceShown(statementId: string): void {
    if (!this.state.intelligenceShown.includes(statementId)) {
      this.state.intelligenceShown.push(statementId);
      this.persist();
    }
  }

  /**
   * Validate current screen can proceed
   */
  canProceed(): boolean {
    const validators: Record<ScreenId, () => boolean> = {
      welcome: () => true,
      'use-case': () => !!this.state.data.useCase,
      'team-size': () =>
        !!this.state.data.teamSize && this.state.data.teamSize > 0,
      tools: () => this.state.data.tools.length > 0,
      costs: () => this.validateCosts(),
      review: () => this.validateComplete(),
    };

    return validators[this.state.currentScreen]();
  }

  /**
   * Validate that all tools have costs entered
   */
  private validateCosts(): boolean {
    const toolIds = this.state.data.tools.map((t) => t.toolId);
    return toolIds.every((toolId) => {
      const cost = this.state.data.costs[toolId];
      return (
        cost &&
        typeof cost.monthlySpend === 'number' &&
        cost.monthlySpend >= 0 &&
        typeof cost.seats === 'number' &&
        cost.seats > 0
      );
    });
  }

  /**
   * Validate that all required data is complete
   */
  private validateComplete(): boolean {
    return (
      !!this.state.data.useCase &&
      !!this.state.data.teamSize &&
      this.state.data.teamSize > 0 &&
      this.state.data.tools.length > 0 &&
      this.validateCosts()
    );
  }

  /**
   * Get current state (read-only)
   */
  getState(): Readonly<DiscoveryState> {
    return this.state;
  }

  /**
   * Get current context for intelligence generation
   */
  getContext(): DiscoveryContext {
    const totalSpend = Object.values(this.state.data.costs).reduce(
      (sum, cost) => sum + cost.monthlySpend,
      0
    );

    return {
      useCase: this.state.data.useCase,
      teamSize: this.state.data.teamSize,
      tools: this.state.data.tools,
      costs: this.state.data.costs,
      totalSpend,
    };
  }

  /**
   * Get progress percentage (0-100)
   */
  getProgress(): number {
    const screens: ScreenId[] = [
      'welcome',
      'use-case',
      'team-size',
      'tools',
      'costs',
      'review',
    ];
    const currentIndex = screens.indexOf(this.state.currentScreen);
    return Math.round(((currentIndex + 1) / screens.length) * 100);
  }

  /**
   * Persist state to browser storage
   */
  private persist(): void {
    if (typeof window === 'undefined') return;

    try {
      const serialized = this.serialize();
      sessionStorage.setItem(
        `discovery-${this.state.sessionId}`,
        JSON.stringify(serialized)
      );
    } catch (error) {
      console.error('Failed to persist discovery state:', error);
    }
  }

  /**
   * Serialize state for storage
   */
  private serialize(): Record<string, unknown> {
    return {
      currentScreen: this.state.currentScreen,
      completedScreens: Array.from(this.state.completedScreens),
      data: {
        useCase: this.state.data.useCase,
        teamSize: this.state.data.teamSize,
        tools: this.state.data.tools.map((t) => ({
          toolId: t.toolId,
          planId: t.planId,
          addedAt: t.addedAt.toISOString(),
        })),
        costs: Object.fromEntries(
          Object.entries(this.state.data.costs).map(([toolId, cost]) => [
            toolId,
            {
              monthlySpend: cost.monthlySpend,
              seats: cost.seats,
              validatedAt: cost.validatedAt.toISOString(),
            },
          ])
        ),
      },
      intelligenceShown: this.state.intelligenceShown,
      sessionId: this.state.sessionId,
      startedAt: this.state.startedAt.toISOString(),
      lastUpdated: this.state.lastUpdated.toISOString(),
    };
  }

  /**
   * Deserialize state from storage
   */
  private static deserialize(data: Record<string, unknown>): Partial<DiscoveryState> | null {
    try {
      return {
        currentScreen: data.currentScreen as ScreenId,
        completedScreens: new Set(data.completedScreens as ScreenId[]),
        data: {
          useCase: (data.data as any)?.useCase,
          teamSize: (data.data as any)?.teamSize,
          tools: ((data.data as any)?.tools || []).map((t: any) => ({
            toolId: t.toolId,
            planId: t.planId,
            addedAt: new Date(t.addedAt),
          })),
          costs: Object.fromEntries(
            Object.entries((data.data as any)?.costs || {}).map(([toolId, cost]: [string, any]) => [
              toolId,
              {
                monthlySpend: cost.monthlySpend,
                seats: cost.seats,
                validatedAt: new Date(cost.validatedAt),
              },
            ])
          ),
        },
        intelligenceShown: data.intelligenceShown as string[],
        sessionId: data.sessionId as string,
        startedAt: new Date(data.startedAt as string),
        lastUpdated: new Date(data.lastUpdated as string),
      };
    } catch (error) {
      console.error('Failed to deserialize discovery state:', error);
      return null;
    }
  }

  /**
   * Restore state from browser storage
   */
  static restore(sessionId: string): DiscoveryFlowMachine | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = sessionStorage.getItem(`discovery-${sessionId}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      const deserialized = DiscoveryFlowMachine.deserialize(data);
      if (!deserialized) return null;

      return new DiscoveryFlowMachine(deserialized);
    } catch (error) {
      console.error('Failed to restore discovery state:', error);
      return null;
    }
  }

  /**
   * Clear state from browser storage
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(`discovery-${this.state.sessionId}`);
    } catch (error) {
      console.error('Failed to clear discovery state:', error);
    }
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.clear();
    this.state = this.initializeState();
    this.persist();
  }
}
