import AuthUI from "@/components/page/auth/AuthUI";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface AuthPageProps {
  params: {
    slug: string;
  };
}

const VALID_AUTH_ROUTES = [
  'login',
  'register', 
  'reset-password',
  'confirm-reset-password'
] as const;

type ValidAuthRoute = typeof VALID_AUTH_ROUTES[number];

export async function generateMetadata({ params }: AuthPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const titleMap: Record<ValidAuthRoute, string> = {
    'login': 'Đăng nhập',
    'register': 'Đăng ký tài khoản',
    'reset-password': 'Đặt lại mật khẩu',
    'confirm-reset-password': 'Xác nhận đặt lại mật khẩu'
  };

  const descriptionMap: Record<ValidAuthRoute, string> = {
    'login': 'Đăng nhập vào tài khoản của bạn',
    'register': 'Tạo tài khoản mới',
    'reset-password': 'Khôi phục mật khẩu của bạn',
    'confirm-reset-password': 'Xác nhận đặt lại mật khẩu mới'
  };

  const isValidRoute = VALID_AUTH_ROUTES.includes(slug as ValidAuthRoute);
  
  if (!isValidRoute) {
    return {
      title: 'Trang không tồn tại',
      description: 'Trang bạn đang tìm kiếm không tồn tại'
    };
  }

  return {
    title: titleMap[slug as ValidAuthRoute],
    description: descriptionMap[slug as ValidAuthRoute],
    robots: {
      index: false, 
      follow: false
    }
  };
}

export function generateStaticParams() {
  return VALID_AUTH_ROUTES.map((slug) => ({
    slug: slug,
  }));
}

export default async function AuthPage({ params }: AuthPageProps) {
  const { slug } = await params;
  
  const isValidRoute = VALID_AUTH_ROUTES.includes(slug as ValidAuthRoute);
  
  if (!isValidRoute) {
    notFound();
  }

  return <AuthUI slug={slug} />;
}

export { VALID_AUTH_ROUTES, type ValidAuthRoute };