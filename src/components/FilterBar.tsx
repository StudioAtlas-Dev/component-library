import { SortOption } from '@/types/component';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  types: string[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  types,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex gap-4 mb-8 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by tags"
          className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="All">All</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="Date Added">Date Added</option>
          <option value="Name">Name</option>
        </select>
      </div>
    </div>
  );
}
