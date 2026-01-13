import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPercent,
  toISOString,
} from '@/lib/format';

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('formats numbers as USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('supports compact notation', () => {
      const result = formatCurrency(1234567, { compact: true });
      expect(result).toMatch(/\$1\.2M|\$1M/); // Different locales may vary
    });

    it('supports decimal places', () => {
      expect(formatCurrency(1234.56, { decimals: 2 })).toBe('$1,234.56');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with locale separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('supports compact notation', () => {
      const result = formatNumber(1234567, { compact: true });
      expect(result).toMatch(/1\.2M|1M/);
    });

    it('supports decimal places', () => {
      expect(formatNumber(1234.567, { decimals: 2 })).toBe('1,234.57');
    });
  });

  describe('formatDate', () => {
    it('formats dates with default long style', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('supports short style', () => {
      const result = formatDate('2024-01-15', { style: 'short' });
      expect(result).toMatch(/1\/15\/24|15\/1\/24/); // US or other locale
    });

    it('accepts Date objects', () => {
      const date = new Date('2024-06-20');
      const result = formatDate(date);
      expect(result).toContain('June');
      expect(result).toContain('20');
    });

    it('accepts timestamps', () => {
      const timestamp = new Date('2024-03-10').getTime();
      const result = formatDate(timestamp);
      expect(result).toContain('March');
      expect(result).toContain('10');
    });
  });

  describe('formatPercent', () => {
    it('formats decimal values as percentages', () => {
      expect(formatPercent(0.5)).toBe('50%');
      expect(formatPercent(1)).toBe('100%');
      expect(formatPercent(0.123)).toBe('12%');
    });

    it('supports decimal places', () => {
      expect(formatPercent(0.1234, { decimals: 1 })).toBe('12.3%');
      expect(formatPercent(0.8567, { decimals: 2 })).toBe('85.67%');
    });
  });

  describe('toISOString', () => {
    it('returns ISO string for current date when no argument', () => {
      const result = toISOString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('returns ISO string for provided date', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = toISOString(date);
      expect(result).toBe('2024-01-15T10:30:00.000Z');
    });
  });
});
