'use client';

import { useState, useEffect } from 'react';
import { genreService } from '@/services/genreService';
import { Genre } from '@/types/genre';
import GenreCard from './GenreCard';
import GenreModal from './GenreModal';
import { Toaster, toast } from 'react-hot-toast';

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await genreService.getAllGenres();
      setGenres(response.data || []);
    } catch {
      toast.error('Lỗi khi tải danh sách thể loại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleEdit = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedGenre(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa thể loại này?')) {
      try {
        await genreService.deleteGenre(id);
        toast.success('Xóa thể loại thành công');
        fetchGenres();
      } catch {
        toast.error('Lỗi khi xóa thể loại');
      }
    }
  };

  const handleSave = async () => {
    await fetchGenres();
    setIsModalOpen(false);
    setSelectedGenre(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto sm:p-6">
        <Toaster position="top-right" />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Quản lý thể loại</h1>
          <button
            onClick={handleCreate}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm thể loại
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <GenreCard
                key={genre.genre_id}
                genre={genre}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <GenreModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          genre={selectedGenre}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}