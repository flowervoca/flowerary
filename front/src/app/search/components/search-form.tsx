import { Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SearchTabType } from '@/types/search';
import { formatDate } from '@/utils/search-utils';

interface ISearchFormProps {
  activeTab: SearchTabType;
  flowerNameInput: string;
  flowerDescInput: string;
  searchDate: Date | undefined;
  onActiveTabChange: (tab: SearchTabType) => void;
  onFlowerNameChange: (value: string) => void;
  onFlowerDescChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onDateClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchForm({
  activeTab,
  flowerNameInput,
  flowerDescInput,
  searchDate,
  onActiveTabChange,
  onFlowerNameChange,
  onFlowerDescChange,
  onDateChange,
  onDateClear,
  onSubmit,
}: ISearchFormProps) {
  return (
    <article
      id='search'
      className='my-8 flex justify-center'
    >
      <h2 className='sr-only'>검색</h2>
      <form
        onSubmit={onSubmit}
        className='w-full max-w-2xl'
      >
        <Tabs
          className='flex w-full justify-center items-center'
          defaultValue='flowerName'
          value={activeTab}
          onValueChange={(value) =>
            onActiveTabChange(value as SearchTabType)
          }
        >
          <TabsList className='bg-secondary p-1 rounded-full h-12'>
            <TabsTrigger
              value='flowerName'
              className='text-lg rounded-full py-4 px-16 flex-1 text-gray-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold'
            >
              꽃 검색
            </TabsTrigger>
            <TabsTrigger
              value='flowerDesc'
              className='text-lg rounded-full py-4 px-16 flex-1 text-gray-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold'
            >
              꽃말 검색
            </TabsTrigger>
          </TabsList>
          <div className='relative w-full mt-4 flex rounded-full border-2 border-primary py-3 px-8 gap-4 bg-white'>
            <TabsContent
              value='flowerName'
              className='w-full'
            >
              <input
                id='flowerName'
                type='text'
                placeholder='꽃의 이름을 검색하세요!'
                className='w-full h-full text-center text-lg outline-none focus:outline-none active:outline-none'
                value={flowerNameInput}
                onChange={(e) =>
                  onFlowerNameChange(e.target.value)
                }
              />
            </TabsContent>
            <TabsContent
              value='flowerDesc'
              className='w-full'
            >
              <input
                id='flowerDesc'
                type='text'
                placeholder='꽃의 설명을 검색하세요!'
                className='w-full h-full text-center text-lg outline-none focus:outline-none active:outline-none'
                value={flowerDescInput}
                onChange={(e) =>
                  onFlowerDescChange(e.target.value)
                }
              />
            </TabsContent>

            {/* 선택된 날짜 표시 */}
            {searchDate && (
              <div className='flex justify-center mb-4 absolute top-2.5 right-28'>
                <div className='inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm text-primary'>
                  <span>
                    {formatDate(searchDate)} (
                    {searchDate.getMonth() + 1}월{' '}
                    {searchDate.getDate()}일)
                  </span>
                  <button
                    onClick={onDateClear}
                    className='hover:bg-primary/20 rounded-full p-1'
                    type='button'
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className='p-0 bg-transparent hover:bg-transparent w-8 h-8'
                  type='button'
                >
                  <Calendar className='!w-5 !h-5 text-primary' />
                  <span className='sr-only'>날짜 선택</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0'
                align='center'
              >
                <CalendarComponent
                  mode='single'
                  selected={searchDate}
                  onSelect={onDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <button type='submit'>
              <Search className='w-5 h-5 text-primary' />
              <span className='sr-only'>검색</span>
            </button>
          </div>
        </Tabs>
      </form>
    </article>
  );
}
