import matter from 'gray-matter';
import type {
  Guide,
  GuideMetadata,
  GuideCategory,
  DifficultyLevel,
  GuideFilters,
  TableOfContentsItem,
  ComparisonGuide,
} from '@/types/knowledge';

// GitHub repository configuration for knowledge content
const GITHUB_USERNAME = 'g-but';
const GITHUB_REPO = 'botsmann-knowledge-content';
const GITHUB_BRANCH = 'main';

// Base URL for raw GitHub content
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// Revalidation time in seconds (1 hour) - enables ISR
const REVALIDATE_INTERVAL = 3600;

/**
 * Extract table of contents from markdown content
 */
function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    toc.push({ id, title, level });
  }

  return toc;
}

/**
 * Calculate read time from content
 */
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

/**
 * Fetch all guides from the knowledge repository
 */
export async function fetchAllGuides(): Promise<GuideMetadata[]> {
  try {
    // Fetch guides directory listing
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/guides`,
      { next: { revalidate: REVALIDATE_INTERVAL } }
    );

    if (!res.ok) {
      console.info('Failed to fetch guides directory', res.status);
      return [];
    }

    const categories = await res.json();
    const allGuides: GuideMetadata[] = [];

    // Process each category directory (beginner, intermediate, advanced)
    for (const category of categories) {
      if (category.type !== 'dir') continue;

      // Fetch guides in this category
      const categoryRes = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/guides/${category.name}`,
        { next: { revalidate: REVALIDATE_INTERVAL } }
      );

      if (!categoryRes.ok) continue;

      const guides = await categoryRes.json();

      for (const guide of guides) {
        if (guide.type !== 'dir') continue;

        const slug = guide.name;

        // Fetch the index.mdx for this guide
        const mdxRes = await fetch(
          `${GITHUB_RAW_BASE}/guides/${category.name}/${slug}/index.mdx`,
          { next: { revalidate: REVALIDATE_INTERVAL } }
        );

        if (!mdxRes.ok) continue;

        const mdxContent = await mdxRes.text();
        const { data } = matter(mdxContent);

        // Skip unpublished guides
        if (data.published !== true) continue;

        allGuides.push({
          slug,
          title: data.title || slug,
          description: data.description || '',
          difficulty: data.difficulty || 'Beginner',
          readTime: data.readTime || calculateReadTime(mdxContent),
          author: data.author,
          publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
          updatedAt: data.updatedAt,
          tags: data.tags || [],
          prerequisites: data.prerequisites,
          icon: data.icon,
          category: data.category || 'getting-started',
          published: true,
        });
      }
    }

    // Sort by date (newest first)
    return allGuides.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.info('Failed to fetch guides:', error);
    return [];
  }
}

/**
 * Fetch a single guide by slug
 */
export async function fetchGuideBySlug(slug: string): Promise<Guide | null> {
  try {
    if (!slug) return null;

    // Try to find the guide in each difficulty category
    for (const difficulty of ['beginner', 'intermediate', 'advanced']) {
      const mdxRes = await fetch(
        `${GITHUB_RAW_BASE}/guides/${difficulty}/${slug}/index.mdx`,
        { next: { revalidate: REVALIDATE_INTERVAL } }
      );

      if (!mdxRes.ok) continue;

      const mdxContent = await mdxRes.text();
      const { data, content } = matter(mdxContent);

      // Skip unpublished
      if (data.published !== true) continue;

      return {
        metadata: {
          slug,
          title: data.title || slug,
          description: data.description || '',
          difficulty: data.difficulty || 'Beginner',
          readTime: data.readTime || calculateReadTime(content),
          author: data.author,
          publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
          updatedAt: data.updatedAt,
          tags: data.tags || [],
          prerequisites: data.prerequisites,
          icon: data.icon,
          category: data.category || 'getting-started',
          published: true,
        },
        content,
        tableOfContents: extractTableOfContents(content),
      };
    }

    return null;
  } catch (error) {
    console.info(`Failed to fetch guide ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch guides filtered by difficulty level
 */
export async function fetchGuidesByDifficulty(
  difficulty: DifficultyLevel
): Promise<GuideMetadata[]> {
  const allGuides = await fetchAllGuides();
  return allGuides.filter((guide) => guide.difficulty === difficulty);
}

/**
 * Fetch guides filtered by category
 */
export async function fetchGuidesByCategory(
  category: GuideCategory
): Promise<GuideMetadata[]> {
  const allGuides = await fetchAllGuides();
  return allGuides.filter((guide) => guide.category === category);
}

/**
 * Fetch guides with multiple filters
 */
export async function fetchGuidesWithFilters(
  filters: GuideFilters
): Promise<GuideMetadata[]> {
  let guides = await fetchAllGuides();

  if (filters.difficulty) {
    guides = guides.filter((g) => g.difficulty === filters.difficulty);
  }

  if (filters.category) {
    guides = guides.filter((g) => g.category === filters.category);
  }

  if (filters.tags && filters.tags.length > 0) {
    guides = guides.filter((g) =>
      filters.tags!.some((tag) => g.tags.includes(tag))
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    guides = guides.filter(
      (g) =>
        g.title.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower) ||
        g.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  return guides;
}

/**
 * Fetch all infrastructure comparison guides
 */
export async function fetchInfrastructureGuides(): Promise<ComparisonGuide[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/infrastructure`,
      { next: { revalidate: REVALIDATE_INTERVAL } }
    );

    if (!res.ok) {
      console.info('Failed to fetch infrastructure directory', res.status);
      return [];
    }

    const items = await res.json();
    const guides: ComparisonGuide[] = [];

    for (const item of items) {
      if (item.type !== 'dir') continue;

      const slug = item.name;

      const mdxRes = await fetch(
        `${GITHUB_RAW_BASE}/infrastructure/${slug}/index.mdx`,
        { next: { revalidate: REVALIDATE_INTERVAL } }
      );

      if (!mdxRes.ok) continue;

      const mdxContent = await mdxRes.text();
      const { data } = matter(mdxContent);

      if (data.published !== true) continue;

      guides.push({
        slug,
        title: data.title || slug,
        description: data.description || '',
        difficulty: data.difficulty || 'Intermediate',
        readTime: data.readTime || calculateReadTime(mdxContent),
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        category: 'infrastructure',
        published: true,
        comparisonType: data.comparisonType || 'tools',
        options: data.options || [],
        recommendation: data.recommendation,
      });
    }

    return guides;
  } catch (error) {
    console.info('Failed to fetch infrastructure guides:', error);
    return [];
  }
}

/**
 * Fetch a single infrastructure guide by slug
 */
export async function fetchInfrastructureGuideBySlug(
  slug: string
): Promise<(ComparisonGuide & { content: string; tableOfContents: TableOfContentsItem[] }) | null> {
  try {
    if (!slug) return null;

    const mdxRes = await fetch(
      `${GITHUB_RAW_BASE}/infrastructure/${slug}/index.mdx`,
      { next: { revalidate: REVALIDATE_INTERVAL } }
    );

    if (!mdxRes.ok) return null;

    const mdxContent = await mdxRes.text();
    const { data, content } = matter(mdxContent);

    if (data.published !== true) return null;

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      difficulty: data.difficulty || 'Intermediate',
      readTime: data.readTime || calculateReadTime(content),
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      category: 'infrastructure',
      published: true,
      comparisonType: data.comparisonType || 'tools',
      options: data.options || [],
      recommendation: data.recommendation,
      content,
      tableOfContents: extractTableOfContents(content),
    };
  } catch (error) {
    console.info(`Failed to fetch infrastructure guide ${slug}:`, error);
    return null;
  }
}

/**
 * Get unique tags from all guides
 */
export async function fetchAllTags(): Promise<string[]> {
  const guides = await fetchAllGuides();
  const tagSet = new Set<string>();

  for (const guide of guides) {
    for (const tag of guide.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}
