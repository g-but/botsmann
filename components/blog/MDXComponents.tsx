'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';

// Define custom MDX components with Tailwind styling
const MDXComponents = {
  // Headings
  h1: (props: any) => (
    <h1 className="mb-8 text-4xl font-semibold tracking-tight text-gray-900" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-4 mt-6 text-xl font-semibold text-gray-900" {...props} />
  ),
  
  // Text elements
  p: (props: any) => (
    <p className="mb-4 text-gray-600" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-4 list-disc pl-6 text-gray-600" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 list-decimal pl-6 text-gray-600" {...props} />
  ),
  li: (props: any) => (
    <li className="mb-2" {...props} />
  ),
  a: ({ href, ...props }: any) => {
    const isExternal = href?.startsWith('http');
    
    if (isExternal) {
      return (
        <a 
          href={href}
          className="text-openai-green hover:text-opacity-80"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    }
    
    return (
      <Link 
        href={href} 
        className="text-openai-green hover:text-opacity-80"
        {...props}
      />
    );
  },
  
  // Media elements
  img: (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    const [fullSrc, setFullSrc] = useState(src);
    
    useEffect(() => {
      if (!src) return;
      
      // If it's a relative path, convert to GitHub raw URL
      if (src.startsWith('./') || src.startsWith('../')) {
        // Extract the post slug from the URL
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'blog') {
          const postSlug = pathParts[2];
          const imagePath = src.replace(/^\.\//, ''); // Remove leading ./
          
          setFullSrc(`https://raw.githubusercontent.com/g-but/botsmann-blog-content/main/posts/${postSlug}/${imagePath}`);
        }
      }
    }, [src]);
    
    if (!src) {
      return <div className="my-8 p-4 bg-red-50 text-red-500">Image source missing</div>;
    }
    
    return (
      <div className="my-8">
        <Image 
          src={fullSrc}
          alt={alt || ''}
          width={800}
          height={450}
          className="rounded-lg"
        />
        {alt && <p className="mt-2 text-sm text-gray-500 italic">{alt}</p>}
      </div>
    );
  },
  
  // Custom components
  YouTube: ({ id }: { id: string }) => (
    <div className="my-8 aspect-video overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  ),
  
  Tweet: ({ id }: { id: string }) => (
    <div className="my-8">
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/x/status/${id}`}>Loading tweet...</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    </div>
  ),
  
  // Callout component for important information
  Callout: ({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800'
    };
    
    return (
      <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
        {children}
      </div>
    );
  }
};

export default MDXComponents; 