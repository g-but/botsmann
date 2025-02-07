import { createClient } from 'contentful';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export async function generateStaticParams() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  });
  
  const res = await client.getEntries({ content_type: 'blogPost' });
  
  return res.items.map((item) => ({
    slug: item.fields.slug,
  }));
}

export default function BlogPostPlaceholder({ params }: any) {
  return (
    <div className="p-8">
      <h1>Blog Page Disabled</h1>
      <p>We're currently working on this page.</p>
    </div>
  );
} 