'use client';

import React from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks';

const components = {
  h1: (props: any) => (
    <h1 className="mb-8 text-4xl font-semibold tracking-tight text-gray-900" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-4 text-2xl font-semibold text-gray-900" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-4 text-xl font-semibold text-gray-900" {...props} />
  ),
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
  a: (props: any) => (
    <a className="text-openai-green hover:text-opacity-80" {...props} />
  ),
};

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}

export function MDXContent({ code }: { code: string }) {
  return (
    <MDXProvider components={components}>
      {code}
    </MDXProvider>
  );
}
