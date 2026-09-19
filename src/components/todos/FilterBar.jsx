const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export default function FilterBar({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <div className="filter-bar">
      <span className="count">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <div className="filters" role="group" aria-label="Filter todos">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={filter === option.value ? 'active' : ''}
            aria-pressed={filter === option.value}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button type="button" onClick={onClearCompleted} disabled={completedCount === 0}>
        Clear completed ({completedCount})
      </button>
    </div>
  )
}
