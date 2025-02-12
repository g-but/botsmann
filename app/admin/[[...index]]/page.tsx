export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return [
    { index: [] },           // /admin
    { index: ['index'] },    // /admin/index
    { index: ['config'] }    // /admin/config
  ];
}

export default function AdminPage() {
  // Redirect to the static admin page
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/index.html';
  }
  return null;
}
