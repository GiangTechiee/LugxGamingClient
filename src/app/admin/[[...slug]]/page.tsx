import AdminLayout from '@/components/page/admin/AdminLayout';
import GenresPage from '@/components/page/admin/GenreManagement/GenresPage';
import UsersPage from '@/components/page/admin/UserManagement/UsersPage';
import PlatformPage from '@/components/page/admin/PlatformManagement/PlatformPage';
import GamePage from '@/components/page/admin/GameManagement/GamePage';
import PromotionPage from '@/components/page/admin/PromotionManagement/PromotionPage';
import PaymentPage from '@/components/page/admin/PaymentManagement/PaymentPage';
import { notFound, redirect } from 'next/navigation';

// Map slug to corresponding component
const pageComponents: { [key: string]: React.ComponentType } = {
  users: UsersPage,
  genres: GenresPage,
  platforms: PlatformPage,
  games: GamePage,
  promotions: PromotionPage,
  invoices: PaymentPage,
};

export default async function AdminPage({ params }: { params: { slug?: string[] } }) {
  // Await params before using its properties
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0];

  // If no slug provided, redirect to the first available page (users)
  if (!slug) {
    redirect('/admin/users');
  }

  // Check if the slug exists in our page components
  if (!pageComponents[slug]) {
    return notFound();
  }

  const Component = pageComponents[slug];

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}