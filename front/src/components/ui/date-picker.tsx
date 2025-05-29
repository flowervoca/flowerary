'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
  value?: Date;
  onChange?: (
    date: Date | undefined,
    dateValues?: { fday: string; fmonth: string },
  ) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = '날짜 선택',
  className,
}: DatePickerProps) {
  // 날짜를 'YYYY-MM-DD' 형식으로 포맷팅
  const formatDisplayDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd', { locale: ko });
  };

  // API 요청에 맞는 형식으로 변환 (fday: mm, fmonth: dd)
  // 요구사항에 따라 fday는 월(month), fmonth는 일(day)
  const getApiDateFormat = (date: Date | undefined) => {
    if (!date) return { fday: '', fmonth: '' };

    const month = String(date.getMonth() + 1).padStart(
      2,
      '0',
    ); // MM 형식 (fday)
    const day = String(date.getDate()).padStart(2, '0'); // DD 형식 (fmonth)

    return {
      fday: month, // 월(month)
      fmonth: day, // 일(day)
    };
  };

  // 날짜 선택 핸들러
  const handleSelect = (date: Date | undefined) => {
    if (onChange) {
      onChange(date, getApiDateFormat(date));
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <Calendar
        mode='single'
        selected={value}
        onSelect={handleSelect}
        locale={ko}
        initialFocus
        disabled={(date: Date) =>
          date > new Date() || date < new Date('1900-01-01')
        }
      />
    </div>
  );
}
