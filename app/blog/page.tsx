import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';

export const metadata = {
  title: 'Blog - Botsmann',
  description: 'Explore the latest insights in AI automation and digital transformation',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <h1 className="mb-6 text-4xl font-semibold tracking-tight">Latest Articles</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: BlogPost) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group"
          >
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <time className="text-sm text-gray-500">{post.date}</time>
              <h2 className="mt-2 text-xl font-semibold group-hover:text-openai-green transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600 line-clamp-2">{post.description}</p>
              <div className="mt-4 flex items-center">
                <div className="relative h-10 w-10">
                  <Image 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{post.author.name}</p>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
