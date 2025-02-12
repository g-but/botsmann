export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return [{ index: [''] }];
}

export default function AdminPage() {
  return null; // Let Next.js serve the static HTML from public/admin
}
