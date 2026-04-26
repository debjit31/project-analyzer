import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Wifi, X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const locationOptions = ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX'];
const typeOptions = ['Full-time', 'Part-time', 'Contract', 'Remote'];

const JobFilters = ({ onFilter, onSearch }) => {
  const [search, setSearch] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState(80);

  const applyFilters = (updates = {}) => {
    const state = { search, selectedLocations, selectedTypes, remoteOnly, salaryMin, ...updates };
    onFilter?.(state);
  };

  const toggleLocation = (loc) => {
    const next = selectedLocations.includes(loc)
      ? selectedLocations.filter((l) => l !== loc)
      : [...selectedLocations, loc];
    setSelectedLocations(next);
    applyFilters({ selectedLocations: next });
  };

  const toggleType = (type) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(next);
    applyFilters({ selectedTypes: next });
  };

  const clearAll = () => {
    setSearch('');
    setSelectedLocations([]);
    setSelectedTypes([]);
    setRemoteOnly(false);
    setSalaryMin(80);
    onFilter?.({ search: '', selectedLocations: [], selectedTypes: [], remoteOnly: false, salaryMin: 80 });
  };

  const hasFilters = search || selectedLocations.length || selectedTypes.length || remoteOnly || salaryMin !== 80;

  // Trigger a live backend search when Enter is pressed or search button clicked
  const triggerSearch = () => {
    applyFilters();
    if (search.trim()) onSearch?.(search.trim());
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-5 sticky top-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-semibold text-neutral-100">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Search</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/60 border border-neutral-700 rounded-xl focus-within:border-teal-600 transition-colors">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); applyFilters({ search: e.target.value }); }}
            onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
            placeholder="Role, company, skill…"
            className="bg-transparent text-sm text-neutral-300 placeholder-neutral-600 outline-none w-full"
          />
          {search && (
            <button
              onClick={triggerSearch}
              className="p-1 rounded text-teal-400 hover:text-teal-300 shrink-0"
              title="Search live jobs"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {search.trim().length >= 3 && (
          <p className="text-[11px] text-neutral-600 mt-1.5 flex items-center gap-1">
            Press ↵ or → to search live jobs
          </p>
        )}
      </div>

      {/* Remote toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-neutral-500" />
          <span className="text-sm text-neutral-300">Remote only</span>
        </div>
        <button
          onClick={() => { setRemoteOnly(!remoteOnly); applyFilters({ remoteOnly: !remoteOnly }); }}
          className={cn(
            'relative w-10 h-5.5 rounded-full transition-colors duration-200',
            remoteOnly ? 'bg-teal-600' : 'bg-neutral-700'
          )}
        >
          <span className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            remoteOnly ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </button>
      </div>

      {/* Location */}
      <div>
        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2.5 block">
          <MapPin className="w-3.5 h-3.5 inline mr-1" />Location
        </label>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((loc) => (
            <button
              key={loc}
              onClick={() => toggleLocation(loc)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-lg border transition-all',
                selectedLocations.includes(loc)
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-600 hover:text-neutral-200'
              )}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Job type */}
      <div>
        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2.5 block">Job Type</label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-lg border transition-all',
                selectedTypes.includes(type)
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-600 hover:text-neutral-200'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Min Salary</label>
          <span className="text-xs text-teal-400 font-semibold">${salaryMin}K+</span>
        </div>
        <input
          type="range" min={40} max={200} step={10} value={salaryMin}
          onChange={(e) => { setSalaryMin(Number(e.target.value)); applyFilters({ salaryMin: Number(e.target.value) }); }}
          className="w-full h-1.5 rounded-full appearance-none bg-neutral-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:cursor-pointer accent-teal-500"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-neutral-600">$40K</span>
          <span className="text-[10px] text-neutral-600">$200K</span>
        </div>
      </div>
    </div>
  );
};

export { JobFilters };
