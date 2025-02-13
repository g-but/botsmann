'use client';

import React from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { components } from '../mdx-provider';

export function MDXRenderer({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
