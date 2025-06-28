import { Genre } from '@/types/genre';
import { Pencil, Trash2 } from "lucide-react";

interface GenreCardProps {
  genre: Genre;
  onEdit: (genre: Genre) => void;
  onDelete: (id: number) => void;
}

export default function GenreCard({ genre, onEdit, onDelete }: GenreCardProps) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">ID:</span>
          <span className="text-white font-medium">#{genre.genre_id}</span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{genre.name}</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Mô tả:</span>
          <span className={`text-sm font-medium ${
            genre.description ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {genre.description ? 'Có' : 'Không có'}
          </span>
        </div>
        
        {genre.game_genres && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Số game:</span>
            <span className="text-white font-medium">{genre.game_genres.length}</span>
          </div>
        )}
      </div>
      
      <hr className="border-gray-600 my-4" />
      
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => onEdit(genre)}
          className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
          title="Sửa"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(genre.genre_id)}
          className="w-10 h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
          title="Xóa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}