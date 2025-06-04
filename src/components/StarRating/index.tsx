'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'default';
}

export function StarRating({ value, onChange, readOnly, size = 'default' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={cn(
            'p-1 bg-transparent hover:bg-transparent border-0 outline-none focus:outline-none cursor-pointer',
            size === 'sm' && 'p-0.5'
          )}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          disabled={readOnly}
        >
          <Star
            className={cn(
              'transition-colors text-yellow-400',
              size === 'sm' ? 'h-4 w-4' : 'h-6 w-6',
              star <= (hoverValue ?? value) && 'fill-yellow-400'
            )}
          />
        </button>
      ))}
    </div>
  );
}
