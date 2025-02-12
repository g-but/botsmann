export async function generateStaticParams() {
  // For now, generate a static page for the placeholder
  // Later, this will be populated from the CMS content
  return [
    { slug: 'placeholder' },
    { slug: 'welcome' }
  ];
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <article className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">
        {params.slug === 'placeholder' ? 'Blog Post' : 'Welcome to Our Blog'}
      </h1>
      <time className="text-gray-500 mb-8 block">
        {new Date().toLocaleDateString()}
      </time>
      <div className="prose prose-lg">
        <p>This page is under construction.</p>
      </div>
    </article>
  );
}
