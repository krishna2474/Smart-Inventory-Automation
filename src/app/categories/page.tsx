'use client';

import { use, useEffect, useState } from 'react';
import DashboardSidebar from '@/components/Sidebar';
import AddCategoryModal from '@/components/modals/AddCategory';
import { Button } from '@/components/Button';
import { Header } from '@/sections/Header';

interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: Date;
  productCount: number; 
}

interface CategoryFormData {
  name: string;
  description: string;
}
export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/category');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Categories:', data.data); // Log the fetched categories
          
          setCategories(data.data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <>
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } sm:w-64 lg:w-80 xl:w-96 shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'} sm:block`}
        >
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleCollapse}
          />
      </div>

      {/* Sidebar Toggle Button for Mobile */}
      <div className="sm:hidden absolute top-4 left-4 z-10">
        <Button
          onClick={toggleSidebar}
          className="bg-blue-600 text-white rounded-md p-2 shadow-md hover:bg-blue-700"
          >
          {isSidebarOpen ? 'Close' : 'Open'} Sidebar
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Categories</h1>

        {/* Add Category Button */}
        <Button
          onClick={toggleModal}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors"
          >
          Add Category
        </Button>

        {/* Add Category Modal */}
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onAddCategory={() => {}}
          />

        {/* Skeleton Loaders */}
        {loading ? (
          <div className="space-y-8 sm:space-y-10">
            {[...Array(3)].map((_, index) => (
              <div
              key={index}
              className="animate-pulse bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-lg"
              >
                <div className="h-6 sm:h-8 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>

                <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm sm:text-base border-collapse bg-zinc-900 bg-opacity-30 text-white">
                    <thead>
                      <tr className="bg-white/10 text-white uppercase tracking-wider">
                        <th className="p-4 text-center">Category ID</th>
                        <th className="p-4 text-center">Name</th>
                        <th className="p-4 text-center">Description</th>
                        <th className="p-4 text-center">Created At</th>
                        <th className="p-4 text-center">Total Products</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(3)].map((_, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-white/10 transition-colors">
                          <td className="p-4 text-center">
                            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-400">No categories found.</p>
        ) : (
          categories.map((category) => (
            <div
            key={category.category_id}
            className="mb-8 sm:mb-10 bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-lg transition-all duration-300"
           
            >
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4">{category.name}</h2>
              <p className="text-sm sm:text-base text-gray-400 mb-4">{category.description}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                
  Created at: {new Date(category.created_at).toLocaleDateString()+"" || 'Invalid Date'}
</p>  

              <p className="text-xs sm:text-sm text-gray-500">Total Products: {category.productCount}</p> {/* New Field */}
            </div>
          ))
        )}
      </div>
    </div></>
  );
}
