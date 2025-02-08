'use client';

import React from 'react';
import type { BlogPost } from '@/types/blog';

interface ShareButtonsProps {
  post: BlogPost;
}

export default function ShareButtons({ post }: ShareButtonsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex items-center space-x-4 mt-8">
      <span className="text-sm text-gray-500">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-[#1DA1F2] transition-colors"
      >
        Share on X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-[#4267B2] transition-colors"
      >
        Share on Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-[#0077B5] transition-colors"
      >
        Share on LinkedIn
      </a>
    </div>
  );
}
