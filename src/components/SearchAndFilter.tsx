import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  onlyAvailable: boolean;
  onOnlyAvailableChange: (checked: boolean) => void;
  totalFilteredCount: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onlyAvailable,
  onOnlyAvailableChange,
  totalFilteredCount,
}) => {
  return (
    <div className="space-y-4 pt-6">
      {/* Search Input Row & Available Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="도서명, 저자, 도서번호, 출판사로 검색..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-stone-200/90 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all text-stone-800 placeholder-stone-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 rounded transition-colors"
              title="검색어 지우기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Available only toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-stone-700 bg-white/80 border border-stone-200/80 px-3.5 py-2.5 rounded-xl hover:bg-white transition-colors">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => onOnlyAvailableChange(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-400 cursor-pointer accent-emerald-600"
          />
          <span className="font-medium">예약 가능 도서만 보기</span>
        </label>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b border-stone-200/60 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            전체 분류
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count indicator */}
        <div className="text-xs text-stone-500 tabular-nums shrink-0 self-center">
          검색 결과 <span className="font-semibold text-stone-900">{totalFilteredCount}</span>권
        </div>
      </div>
    </div>
  );
};
