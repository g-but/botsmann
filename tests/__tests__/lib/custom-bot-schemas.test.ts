import {
  CreateCustomBotSchema,
  UpdateCustomBotSchema,
  CreateKnowledgeChunkSchema,
  AccentColorSchema,
  NavConfigSchema,
} from '@/lib/validations/custom-bot';

describe('Custom Bot Schemas', () => {
  describe('AccentColorSchema', () => {
    it('accepts valid colors', () => {
      const validColors = ['blue', 'green', 'indigo', 'red', 'amber'];
      validColors.forEach((color) => {
        const result = AccentColorSchema.safeParse(color);
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid colors', () => {
      const result = AccentColorSchema.safeParse('purple');
      expect(result.success).toBe(false);
    });
  });

  describe('NavConfigSchema', () => {
    it('accepts valid nav config', () => {
      const result = NavConfigSchema.safeParse({
        menuItems: [
          { id: 'home', label: 'Home', icon: 'home' },
          { id: 'about', label: 'About', section: 'main' },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty menu items', () => {
      const result = NavConfigSchema.safeParse({ menuItems: [] });
      expect(result.success).toBe(true);
    });

    it('provides default for missing menuItems', () => {
      const result = NavConfigSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.menuItems).toEqual([]);
      }
    });
  });

  describe('CreateCustomBotSchema', () => {
    const validBot = {
      slug: 'my-test-bot',
      title: 'My Test Bot',
      description: 'A helpful test bot',
      emoji: '🤖',
      accent_color: 'blue',
      system_prompt:
        'You are a helpful assistant. Please provide accurate and concise answers to user questions.',
    };

    it('accepts valid bot data', () => {
      const result = CreateCustomBotSchema.safeParse(validBot);
      expect(result.success).toBe(true);
    });

    it('accepts minimal required fields', () => {
      const result = CreateCustomBotSchema.safeParse({
        slug: 'minimal-bot',
        title: 'Minimal Bot',
        system_prompt: 'You are a helpful assistant. Please provide accurate and concise answers.',
      });
      expect(result.success).toBe(true);
    });

    describe('slug validation', () => {
      it('accepts valid slugs', () => {
        const validSlugs = ['my-bot', 'bot123', 'test-bot-v2', 'simple'];
        validSlugs.forEach((slug) => {
          const result = CreateCustomBotSchema.safeParse({
            ...validBot,
            slug,
          });
          expect(result.success).toBe(true);
        });
      });

      it('rejects slugs with uppercase', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          slug: 'MyBot',
        });
        expect(result.success).toBe(false);
      });

      it('rejects slugs with spaces', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          slug: 'my bot',
        });
        expect(result.success).toBe(false);
      });

      it('rejects slugs with special characters', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          slug: 'my_bot',
        });
        expect(result.success).toBe(false);
      });

      it('rejects slugs too short', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          slug: 'ab',
        });
        expect(result.success).toBe(false);
      });

      it('rejects slugs too long', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          slug: 'a'.repeat(51),
        });
        expect(result.success).toBe(false);
      });
    });

    describe('title validation', () => {
      it('rejects titles too short', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          title: 'AB',
        });
        expect(result.success).toBe(false);
      });

      it('rejects titles too long', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          title: 'A'.repeat(101),
        });
        expect(result.success).toBe(false);
      });
    });

    describe('system_prompt validation', () => {
      it('rejects prompts too short', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          system_prompt: 'Short prompt',
        });
        expect(result.success).toBe(false);
      });

      it('rejects prompts too long', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          system_prompt: 'A'.repeat(10001),
        });
        expect(result.success).toBe(false);
      });
    });

    describe('description validation', () => {
      it('accepts empty description', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          description: undefined,
        });
        expect(result.success).toBe(true);
      });

      it('rejects descriptions too long', () => {
        const result = CreateCustomBotSchema.safeParse({
          ...validBot,
          description: 'D'.repeat(501),
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('UpdateCustomBotSchema', () => {
    it('accepts partial updates', () => {
      const result = UpdateCustomBotSchema.safeParse({
        title: 'Updated Title',
      });
      expect(result.success).toBe(true);
    });

    it('accepts all update fields', () => {
      const result = UpdateCustomBotSchema.safeParse({
        title: 'Updated Title',
        description: 'Updated description',
        emoji: '🎉',
        accent_color: 'green',
        is_published: true,
        is_public: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts null description', () => {
      const result = UpdateCustomBotSchema.safeParse({
        description: null,
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty object', () => {
      const result = UpdateCustomBotSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('CreateKnowledgeChunkSchema', () => {
    const validChunk = {
      bot_id: '123e4567-e89b-12d3-a456-426614174000',
      topic: 'Getting Started',
      content: 'This is the content of the knowledge chunk with enough characters.',
    };

    it('accepts valid knowledge chunk', () => {
      const result = CreateKnowledgeChunkSchema.safeParse(validChunk);
      expect(result.success).toBe(true);
    });

    it('accepts chunk with all optional fields', () => {
      const result = CreateKnowledgeChunkSchema.safeParse({
        ...validChunk,
        question: 'How do I get started?',
        keywords: ['getting-started', 'tutorial', 'beginners'],
        source: 'Documentation v1.0',
        metadata: { section: 'introduction' },
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid bot_id', () => {
      const result = CreateKnowledgeChunkSchema.safeParse({
        ...validChunk,
        bot_id: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('rejects content too short', () => {
      const result = CreateKnowledgeChunkSchema.safeParse({
        ...validChunk,
        content: 'Short',
      });
      expect(result.success).toBe(false);
    });

    it('rejects content too long', () => {
      const result = CreateKnowledgeChunkSchema.safeParse({
        ...validChunk,
        content: 'A'.repeat(10001),
      });
      expect(result.success).toBe(false);
    });

    it('rejects too many keywords', () => {
      const result = CreateKnowledgeChunkSchema.safeParse({
        ...validChunk,
        keywords: Array.from({ length: 21 }, (_, i) => `keyword-${i}`),
      });
      expect(result.success).toBe(false);
    });
  });
});
