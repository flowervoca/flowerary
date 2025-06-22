import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IFilters } from '@/types/search';

interface ISearchFiltersProps {
  filters: IFilters;
  availableTags: string[];
  onToggleFilter: (
    type: keyof IFilters,
    value: string,
  ) => void;
  onResetFilters: () => void;
}

export function SearchFilters({
  filters,
  availableTags,
  onToggleFilter,
  onResetFilters,
}: ISearchFiltersProps) {
  return (
    <aside id='filter' className='w-full md:w-64 shrink-0'>
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>필터</h2>
          <Button
            variant='outline'
            onClick={onResetFilters}
          >
            <RotateCcw className='w-3 h-3 mr-1' />
            초기화
          </Button>
        </div>

        {/* 태그 필터 (꽃말) */}
        <div className='mb-6'>
          <h3 className='text-lg font-bold mb-2'>태그</h3>
          <div className='space-y-1 max-h-48 overflow-y-auto'>
            {availableTags.map((tag) => (
              <div key={tag} className='flex items-center'>
                <input
                  type='checkbox'
                  id={`tag-${tag}`}
                  checked={filters.tags.includes(tag)}
                  onChange={() =>
                    onToggleFilter('tags', tag)
                  }
                  className='w-4 h-4 rounded'
                />
                <label
                  htmlFor={`tag-${tag}`}
                  className='ml-2 text-sm'
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
