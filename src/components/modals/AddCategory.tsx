import React, { useState } from 'react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: { category_id: string; name: string }) => void; // Pass category_id as well
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsLoading(true);
    setError(null); // Reset error state on new submission

    try {
      // Make the API request to add the category
      const response = await fetch('/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      // Check for a successful response
      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      // Get the category_id from the response
      const data = await response.json();

      // Pass the category_id and name to the parent
      const newCategory = {
        category_id: data.category_id, // Assuming the API response includes the category_id
        name: categoryName.trim(),
      };

      onAddCategory(newCategory); // Pass both category_id and name to the parent
      setCategoryName('');
      onClose();
    } catch (error) {
      setError('Failed to add category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full max-w-md border border-white/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-3 bg-gray-400/10 text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:bg-gray-300/20"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium transition"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
