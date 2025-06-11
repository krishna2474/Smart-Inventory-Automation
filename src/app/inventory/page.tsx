'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { LucideSearch, MenuIcon, Edit, Trash2, RefreshCw } from 'lucide-react';
import DashboardSidebar from '@/components/Sidebar'; // Assuming the path is correct
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Reusable Input Component with Glassmorphic Styling
const GlassmorphicInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    const baseClass =
      'bg-gray-800/10  backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40 px-3 py-2';
    return <input ref={ref} className={`${baseClass} ${className}`} {...props} />;
  }
);
GlassmorphicInput.displayName = 'GlassmorphicInput';

// Select Component for Category Filter with Glassmorphic Styling
const GlassmorphicSelect = ({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
}) => {
  const baseClass =
    'bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40 px-3 py-2';
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={`${baseClass} ${className}`}>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt === 'all' ? 'All Categories' : opt}
        </option>
      ))}
    </select>
  );
};

// Table UI Component
const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <table className={`w-full border border-gray-800 text-left text-white ${className}`}>{children}</table>
);
const TableHead = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <thead className={` bg-purple-500/30 backdrop-blur-md ${className}`}>{children}</thead>
);
const TableRow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={`border-t border-gray-800 ${className}`}>{children}</tr>
);
const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-2 ${className}`}>{children}</td>
);
const TableHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-2 text-sm font-semibold ${className}`}>{children}</th>
);

// Pagination UI Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) => {
  return (
    <div className={`flex justify-center gap-2 mt-4 ${className}`}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 focus:outline-none"
      >
        Prev
      </button>
      <span className="text-white px-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 focus:outline-none"
      >
        Next
      </button>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

const PAGE_SIZE = 10;
const POLLING_INTERVAL = 30000; // 30 seconds

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<{ id:string,name: string; category: string; stock: number; price: number }>({
    id:'',
    name: '',
    category: '',
    stock: 0,
    price: 0,
  });

  const router = useRouter();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsCollapsed(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/category');
      const fetchedCategories = res.data.data.map((category: { name: string }) => category.name);
      setCategories(['all', ...fetchedCategories]); // Include 'all' as the default option
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    const params: Record<string, string | number> = {
      page,
      limit: PAGE_SIZE,
    };
    if (search) params.search = search; // Include search term
    if (category !== 'all') params.category = category; // Include category if it's not 'all'

    try {
      const res = await axios.get('/api/v1/inventory', { params });
      setProducts(res.data.products);
      setTotalPages(Math.ceil(res.data.total / PAGE_SIZE)); // Set the total pages based on the response
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [search, category, page]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsCollapsed(true);
      } else {
        setIsSidebarOpen(true);
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const pollingIntervalId = setInterval(fetchProducts, POLLING_INTERVAL);
    return () => clearInterval(pollingIntervalId); // Cleanup on unmount
  }, [fetchProducts]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
        id: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    try {
      await axios.put(`/api/v1/product/?id=${selectedProduct.id}`, editFormData);
      fetchProducts(); // Refresh data after successful edit
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      // Optionally, display an error message
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await axios.delete(`/api/v1/product/?id=${selectedProduct.id}`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== selectedProduct.id));
      // Optionally, update totalPages if needed
      toast.success('Product deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
        toast.error('Failed to delete product!');
      console.error('Error deleting product:', error);
      // Optionally, display an error message
    }
  };

  return (
<div className="min-h-screen bg-black text-white flex">
  {/* Sidebar */}
  <div className="hidden md:block">
    <DashboardSidebar
      isSidebarOpen={isSidebarOpen}
      isCollapsed={isCollapsed}
      toggleSidebar={toggleSidebar}
      toggleCollapse={toggleCollapse}
    />
  </div>

  {/* Mobile sidebar overlay */}
  {isSidebarOpen && (
    <div
    className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm md:hidden"
    onClick={toggleSidebar} // ✅ closes when clicking the backdrop
  >
    <div
      className="w-64 bg-gray-900 h-full shadow-xl"
      onClick={e => e.stopPropagation()} // ❗ stops closing when clicking inside
    >
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          isCollapsed={false}
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleCollapse}
        />
      </div>
    </div>
  )}

  {/* Main Content */}
  <div
    className={`flex-1 p-6 space-y-6 transition-all duration-300 ease-in-out ${
      isSidebarOpen && !isCollapsed ? "md:ml-64" : isSidebarOpen ? "md:ml-16" : "ml-0"
    }`}
  >
    {/* Mobile menu button */}
    {!isSidebarOpen && (
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden text-gray-400 hover:text-white focus:outline-none mb-4"
      >
        <MenuIcon size={20} />
      </button>
    )}

        <h1 className="text-3xl font-bold mb-6 flex items-center justify-between">
          Inventory
          
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Increased Width Search Input with Glassmorphic Styling */}
          <div className="relative w-full md:w-1/2">
            <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <GlassmorphicInput
              placeholder="Search products..."
              className="pl-10 w-full"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 when search term changes
              }}
            />
          </div>

          {/* Category Select Dropdown with Glassmorphic Styling */}
          <div className="w-full md:w-48">
            <GlassmorphicSelect
              value={category}
              onChange={val => {
                setCategory(val);
                setPage(1); // Reset to page 1 when category changes
              }}
              options={categories} // Use the dynamic categories
            />
          </div>
          <button  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium transition" onClick={()=>router.push('/product/new')}
      >
        Add Product
      </button>
        </div>

        {/* Product Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader className="text-center">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="text-red-500 hover:text-red-600 focus:outline-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {/* Pagination Controls */}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={newPage => setPage(newPage)} />

        {/* Edit Modal */}
        {isEditModalOpen && selectedProduct && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md">
            <div className="bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-lg w-96 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">Edit Product</h2>
              <div className="mb-3">
                <label htmlFor="edit-name" className="block text-sm text-gray-200 mb-1">Name</label>
                <GlassmorphicInput type="text" id="edit-name" name="name" value={editFormData.name} onChange={handleEditInputChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-category" className="block text-sm text-gray-200 mb-1">Category</label>
                <GlassmorphicSelect
                  value={editFormData.category}
                  onChange={val => handleEditInputChange({ target: { name: 'category', value: val } } as React.ChangeEvent<HTMLSelectElement>)}
                  options={categories.filter(cat => cat !== 'all')}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-stock" className="block text-sm text-gray-200 mb-1">Stock</label>
                <GlassmorphicInput type="number" id="edit-stock" name="stock" value={editFormData.stock} onChange={handleEditInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-price" className="block text-sm text-gray-200 mb-1">Price</label>
                <GlassmorphicInput type="number" id="edit-price" name="price" value={editFormData.price} onChange={handleEditInputChange} />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditModalOpen(false)} className="px-3 py-1 bg-gray-700 text-white rounded focus:outline-none">Cancel</button>
                <button onClick={handleSaveEdit} className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-700 focus:outline-none">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedProduct && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-md">
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-md shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4 text-red-400">Confirm Delete</h2>
              <p className="text-gray-300 mb-4">Are you sure you want to delete "{selectedProduct.name}"?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-3 py-1 bg-gray-700 text-white rounded focus:outline-none">Cancel</button>
                <button onClick={handleConfirmDelete} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none">Delete</button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default InventoryPage;