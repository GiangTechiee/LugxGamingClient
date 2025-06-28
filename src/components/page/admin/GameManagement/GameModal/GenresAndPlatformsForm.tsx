'use client';

import { Genre, Platform } from '@/types/game';

interface GenresAndPlatformsFormProps {
  selectedGenres: number[];
  selectedPlatforms: number[];
  onGenreChange: (genres: number[]) => void;
  onPlatformChange: (platforms: number[]) => void;
  genres: Genre[];
  platforms: Platform[];
}

export const GenresAndPlatformsForm = ({
  selectedGenres,
  selectedPlatforms,
  onGenreChange,
  onPlatformChange,
  genres,
  platforms,
}: GenresAndPlatformsFormProps) => {
  const handleGenreChange = (genreId: number) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    onGenreChange(newGenres);
  };

  const handlePlatformChange = (platformId: number) => {
    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter((id) => id !== platformId)
      : [...selectedPlatforms, platformId];
    onPlatformChange(newPlatforms);
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Thể loại</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {genres.map((genre) => (
            <label key={genre.genre_id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.genre_id)}
                onChange={() => handleGenreChange(genre.genre_id)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">{genre.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Nền tảng</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map((platform) => (
            <label key={platform.platform_id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform.platform_id)}
                onChange={() => handlePlatformChange(platform.platform_id)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">{platform.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};