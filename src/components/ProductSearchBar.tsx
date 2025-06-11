'use client';

import { Input } from '@/components/Input' 
import { useDebounce } from '@/lib/hooks/useDebounce'; 
import { useEffect, useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
};

export default function ProductSearchBar({ onSearch }: Props) {
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced]);

  return (
    <Input
      placeholder="Search products..."
      value={input}
      onChange={(e:any) => setInput(e.target.value)}
      className="w-full sm:w-64"
    />
  );
}
