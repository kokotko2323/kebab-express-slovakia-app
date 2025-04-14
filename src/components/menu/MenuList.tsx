
import React, { useState } from 'react';
import { menuCategories, menuItems } from '@/data/menuData';
import MenuItem from './MenuItem';

const MenuList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter items by selected category, or show all if no category is selected
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  return (
    <div>
      {/* Categories scrollable list */}
      <div className="mb-6">
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            <button
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-kebab-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Všetko
            </button>
            
            {menuCategories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-kebab-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Show selected category title */}
      {selectedCategory && (
        <h2 className="menu-category">{selectedCategory}</h2>
      )}

      {/* Menu items grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
