interface Author {
  name: string;
  avatar: string;
  bio: string;
  social: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: Author;
  content: string;
  tags: string[];
  image: string;
  socialPreview?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export type { Author, BlogPost };
