'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className="p-1 bg-transparent hover:bg-transparent border-0 outline-none focus:outline-none cursor-pointer"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors text-yellow-400',
              star <= (hoverValue ?? value) && 'fill-yellow-400'
            )}
          />
        </button>
      ))}
    </div>
  );
}
