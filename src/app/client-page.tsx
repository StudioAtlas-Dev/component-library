'use client';

import { useState, useEffect } from 'react';
import ComponentGrid from '@/components/ComponentGrid';
import FilterBar from '@/components/FilterBar';
import { ComponentMeta, SortOption } from '@/types/component';
import { filterComponents } from '@/store/components';

interface ClientPageProps {
  initialComponents: ComponentMeta[];
  types: string[];
}

export default function ClientPage({ initialComponents, types }: ClientPageProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Name');
  const [filteredComponents, setFilteredComponents] = useState(initialComponents);

  // Run filter on mount and whenever search/type/sort changes
  useEffect(() => {
    const filtered = filterComponents(initialComponents, search, selectedType, sortBy);
    setFilteredComponents(filtered);
  }, [search, selectedType, sortBy, initialComponents]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          types={types}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="mt-8">
          <ComponentGrid components={filteredComponents} />
        </div>
      </div>
    </div>
  );
}
