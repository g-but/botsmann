import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchBlogPosts, fetchBlogPostBySlug } from '@/lib/blog';
import Comments from '@/components/blog/Comments';
import ClientMDXContent from '@/components/blog/ClientMDXContent';
import { Metadata } from 'next';
import { format } from 'date-fns';

// Generate static paths for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await fetchBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await fetchBlogPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found | Botsmann',
      };
    }
    
    return {
      title: `${post.title} | Botsmann Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Error | Botsmann',
    };
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  console.log('Rendering blog post for slug:', params.slug);
  
  try {
    if (!params.slug) {
      console.error('Missing slug parameter');
      notFound();
    }
    
    const post = await fetchBlogPostBySlug(params.slug);
    
    if (!post) {
      console.error('Blog post not found for slug:', params.slug);
      notFound();
    }
    
    return (
      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <span>•</span>
            <span>{post.author}</span>
          </div>
          
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900">
            {post.title}
          </h1>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {post.featuredImage && (
            <div className="mt-8 relative h-96 w-full overflow-hidden rounded-lg">
              <Image 
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>
        
        <ClientMDXContent content={post.content} slug={post.slug} />
        
        <Comments slug={post.slug} />
      </article>
    );
  } catch (error) {
    console.error('Error rendering blog post:', error);
    throw error; // Re-throw to let Next.js error handling take over
  }
} 