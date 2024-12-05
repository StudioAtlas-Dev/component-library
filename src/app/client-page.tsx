'use client';

import { useState, useCallback, useEffect } from 'react';
import ComponentGrid from '@/components/ComponentGrid';
import FilterBar from '@/components/FilterBar';
import { SortOption } from '@/types/component';
import { filterComponents } from '@/store/components';

interface ClientPageProps {
  initialComponents: any[];
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

  const handleFilter = useCallback(() => {
    const filtered = filterComponents(initialComponents, search, selectedType, sortBy);
    setFilteredComponents(filtered);
  }, [search, selectedType, sortBy, initialComponents]);

  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        types={types}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onFilter={handleFilter}
      />

      <div className="mt-8">
        <ComponentGrid components={filteredComponents} />
      </div>
    </>
  );
}
