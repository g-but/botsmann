'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import MDXComponents from './MDXComponents';

interface ClientMDXContentProps {
  source: MDXRemoteSerializeResult;
  slug: string;
}

export default function ClientMDXContent({ source, slug }: ClientMDXContentProps) {
  // Create a complete components map including the slug context for images
  const componentsWithContext = {
    ...MDXComponents,
    img: (imgProps: React.ImgHTMLAttributes<HTMLImageElement>) => {
      return MDXComponents.img({
        ...imgProps,
        slug,
      });
    },
    // Ensure Callout is explicitly passed as a prop to avoid the "Expected component `Callout` to be defined" error
    Callout: MDXComponents.Callout,
  };

  return (
    <div className="prose prose-gray max-w-none">
      <MDXRemote {...source} components={componentsWithContext} />
    </div>
  );
}
