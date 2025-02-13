import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { MDXRenderer } from '../components/MDXRenderer';

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString()}
        </time>
        <span>•</span>
        <span>{post.author}</span>
      </div>
      <div className="prose prose-lg">
        <MDXRenderer code={post.body.code} />
      </div>
    </article>
  );
}
