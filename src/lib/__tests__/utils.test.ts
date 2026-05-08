import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, getSeverityColor, generateId } from '../utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234.56)).toBe('$1,235');
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(25.5)).toBe('26%');
      expect(formatPercentage(100)).toBe('100%');
      expect(formatPercentage(0)).toBe('0%');
    });
  });

  describe('getSeverityColor', () => {
    it('should return correct color classes', () => {
      expect(getSeverityColor('optimized')).toContain('green');
      expect(getSeverityColor('minor')).toContain('blue');
      expect(getSeverityColor('moderate')).toContain('yellow');
      expect(getSeverityColor('significant')).toContain('red');
    });
  });

  describe('generateId', () => {
    it('should generate ID of correct length', () => {
      expect(generateId(8)).toHaveLength(8);
      expect(generateId(12)).toHaveLength(12);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });
});
