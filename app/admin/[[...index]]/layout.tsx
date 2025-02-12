export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export const dynamic = 'force-static';
export const revalidate = false;
