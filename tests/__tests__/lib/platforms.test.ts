import { searchAmazon } from '@/lib/platforms/amazon';
import { searchRicardo } from '@/lib/platforms/ricardo';

describe('Platform Integrations', () => {
  describe('Amazon Integration', () => {
    it('returns empty array when API is not configured', async () => {
      const originalKey = process.env.AMAZON_API_KEY;
      delete process.env.AMAZON_API_KEY;
      const results = await searchAmazon('electronics', {});
      process.env.AMAZON_API_KEY = originalKey;
      expect(results).toEqual([]);
    });

    it('returns empty array when API is not yet implemented', async () => {
      const results = await searchAmazon('electronics/computers', {
        type: 'laptop',
        minRam: '8GB',
      });
      expect(results).toEqual([]);
    });
  });

  describe('Ricardo Integration', () => {
    it('returns empty array when API is not configured', async () => {
      const originalKey = process.env.RICARDO_API_KEY;
      delete process.env.RICARDO_API_KEY;
      const results = await searchRicardo('electronics', {});
      process.env.RICARDO_API_KEY = originalKey;
      expect(results).toEqual([]);
    });

    it('returns empty array when API is not yet implemented', async () => {
      const results = await searchRicardo('electronics/computers', {
        type: 'laptop',
        minRam: '8GB',
      });
      expect(results).toEqual([]);
    });
  });

  describe('Concurrent Search Performance', () => {
    it('handles multiple concurrent searches', async () => {
      const searches = Array(5)
        .fill(null)
        .map(() =>
          Promise.all([searchAmazon('electronics', {}), searchRicardo('electronics', {})]),
        );

      const results = await Promise.all(searches);
      results.forEach(([amazonResults, ricardoResults]) => {
        expect(amazonResults).toEqual([]);
        expect(ricardoResults).toEqual([]);
      });
    });
  });
});
