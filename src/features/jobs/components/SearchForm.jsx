import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Button, Input, Select } from '../../../components/ui';

const dateOptions = [
  { value: 'anytime', label: 'Anytime' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
];

/**
 * Search form component for finding job-based projects
 */
const SearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    datePosted: 'anytime',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.jobTitle) params.set('title', formData.jobTitle);
    if (formData.location) params.set('location', formData.location);
    if (formData.datePosted !== 'anytime') params.set('posted', formData.datePosted);
    navigate(`/results?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 dark:bg-stone-900 dark:border-stone-700 p-8">
        <div className="space-y-5">
          <Input
            id="jobTitle"
            name="jobTitle"
            label="Job Title"
            placeholder="e.g., Frontend Engineer, React Developer"
            value={formData.jobTitle}
            onChange={handleChange}
            icon={Search}
          />

          <Input
            id="location"
            name="location"
            label="Location"
            placeholder="e.g., San Francisco, Remote"
            value={formData.location}
            onChange={handleChange}
            icon={MapPin}
          />

          <Select
            id="datePosted"
            name="datePosted"
            label="Date Posted"
            value={formData.datePosted}
            onChange={handleChange}
            options={dateOptions}
          />
        </div>

        <div className="mt-8">
          <Button type="submit" className="w-full" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Find Projects
          </Button>
        </div>
      </div>
    </form>
  );
};

export { SearchForm };
