import { allPosts, Post } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import Link from 'next/link';

export default function Blog() {
  const posts = allPosts.sort((a: Post, b: Post) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Insights and updates from the Botsmann team on AI, technology, and innovation.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-openai-green">{post.title}</Link>
              </h2>
              <p className="mt-4 text-gray-600">{post.excerpt}</p>
              <div className="mt-4">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-medium text-openai-green hover:text-opacity-80">
                  Read more
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
