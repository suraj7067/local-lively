
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

const CategoryFilter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories: Category[] = [
    { id: 'all', name: 'All Events' },
    { id: 'dj', name: 'DJ Nights' },
    { id: 'standup', name: 'Stand-up Comedy' },
    { id: 'karaoke', name: 'Karaoke' },
    { id: 'live', name: 'Live Music' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'food', name: 'Food & Drinks' },
    { id: 'theater', name: 'Theater' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Browse Categories</h2>
        <motion.button 
          className="text-sm text-primary hover:underline font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All
        </motion.button>
      </div>
      
      <div className="scrollbar-hide overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className={`category-chip whitespace-nowrap ${
                activeCategory === category.id ? 'category-chip-active' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {category.name}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
