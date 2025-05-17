import { useEffect } from 'react';
import { useUser } from '../types/user';
import useLocalStorage from '../hooks/useLocalStorage';

type FilterValues = {
  searchTerm: string;
  showCompleted: boolean;
  showStarred: boolean;
  showScheduledForLater: boolean;
  selectedPriority: 'Low' | 'Medium' | 'High' | undefined;
  showDueDate: 'Overdue' | 'Upcoming' | 'All';
};

type FiltersProps = {
  onFiltersChange: (filterValues: FilterValues) => void;
};

const initialFilterValues: FilterValues = {
  searchTerm: '',
  showCompleted: false,
  showStarred: false,
  showScheduledForLater: false,
  selectedPriority: undefined,
  showDueDate: 'All',
};

export default function Filters({ onFiltersChange }: FiltersProps) {
  const [filters, setFilters] = useLocalStorage<FilterValues>('filters', initialFilterValues);
  const { user } = useUser();

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  useEffect(() => {
    if (user) {
      setFilters(initialFilterValues);
    }
  }, [user]);

  const updateFilters = (updates: Partial<FilterValues>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="filter-menu-list">
      <div className="filter-buttons">
        <button
          className={filters.showCompleted ? 'filter-btn active' : 'filter-btn'}
          onClick={() => updateFilters({ showCompleted: !filters.showCompleted })}
          type="button"
        >
          {filters.showCompleted ? '✓ ' : ''}Completed
        </button>

        <button
          className={filters.showStarred ? 'filter-btn active' : 'filter-btn'}
          onClick={() => updateFilters({ showStarred: !filters.showStarred })}
          type="button"
        >
          {filters.showStarred ? '✓ ' : ''}Starred
        </button>

        <button
          className={filters.showScheduledForLater ? 'filter-btn active' : 'filter-btn'}
          onClick={() => updateFilters({ showScheduledForLater: !filters.showScheduledForLater })}
          type="button"
        >
          {filters.showScheduledForLater ? '✓ ' : ''}Scheduled for Later
        </button>
      </div>

      <div className="filter-selects">
        <select
          onChange={(e) =>
            updateFilters({
              selectedPriority: e.target.value ? (e.target.value as FilterValues['selectedPriority']) : undefined,
            })
          }
          value={filters.selectedPriority || ''}
          className="filter-select priority"
        >
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          onChange={(e) => updateFilters({ showDueDate: e.target.value as FilterValues['showDueDate'] })}
          value={filters.showDueDate}
          className="filter-select due"
        >
          <option value="All">All Due Dates</option>
          <option value="Overdue">Overdue</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );
}
