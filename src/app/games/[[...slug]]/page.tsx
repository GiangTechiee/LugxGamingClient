import { notFound } from "next/navigation";
import GameListPage from "@/components/page/game-list/GameListPage";
import GameDetailPage from "@/components/page/game-detail/GameDetailPage";
import { pageConfigs } from "../../../../constants/GameListPage/pageConfig";

interface GamesPageProps {
  params: {
    slug?: string[];
  };
}

export default async function GamesPage({
  params,
}: {
  params: Promise<GamesPageProps["params"]>;
}) {
  // Xây dựng path từ slug
  const { slug = [] } = await params;
  
  // Kiểm tra nếu slug có 1 phần tử và là số thì đây là game detail
  if (slug.length === 1 && /^\d+$/.test(slug[0])) {
    const gameId = parseInt(slug[0]);
    return <GameDetailPage gameId={gameId} />;
  }
  
  // Xử lý cho game list pages
  let pageKey: string;

  if (slug.length === 0) {
    // /games
    pageKey = "/games";
  } else {
    // /games/new, /games/hot, etc.
    pageKey = `/games/${slug.join("/")}`;
  }

  // Kiểm tra xem pageKey có tồn tại trong config không
  if (!pageConfigs[pageKey]) {
    notFound();
  }

  return <GameListPage pageKey={pageKey} />;
}