import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import type { BlogPost } from '@/types/blog';

const POSTS_PATH = path.join(process.cwd(), 'content/blog');

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(POSTS_PATH);
  const posts = await Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(path.join(POSTS_PATH, file), 'utf8');
      const { data, content } = matter(source);
      return {
        ...data,
        slug: file.replace(/\.mdx$/, ''),
        content: await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }),
      } as BlogPost;
    })
  );
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const source = await fs.readFile(path.join(POSTS_PATH, `${slug}.mdx`), 'utf8');
    const { data, content } = matter(source);
    return {
      ...data,
      slug,
      content: await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }),
    } as BlogPost;
  } catch (error) {
    return null;
  }
}
