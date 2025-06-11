import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: { id: string; name: string; price: number; stock: number; category_id: string; supplier_id: string }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{  category_id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ supplier_id: string; name: string }[]>([]);
  useEffect(() => {
    console.log("Categories updated:", categories); // ✅ Logs after update
  }, [categories]);
  const router = useRouter()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/category');
        if (response.ok) {
          const data = await response.json();
          console.log('Categories:', data.data); // Log the fetched categories
          
          setCategories(data.data); // Assuming the response is an array of categories
          
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/v1/supplier');
        if (response.ok) {
          const data = await response.json();
          console.log('Suppliers:', data.data); // Log the fetched suppliers
          
          setSuppliers(data.data); // Assuming the response is an array of suppliers
        } else {
          console.error('Failed to fetch suppliers');
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setProductName('');
      setPrice(0);
      setStock(0);
      setSelectedCategory('');
      setSelectedSupplier('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !selectedCategory || !selectedSupplier || price <= 0 || stock <= 0) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        products: [
          {
            name: productName.trim(),
            price,
            stock,
            supplier_id: selectedSupplier,
            category_id: selectedCategory,
          },
        ],
      };

      console.log('Product Data:', productData); // Log the product data being sent to the API

      const response = await fetch('/api/v1/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData), // Send data as an array of objects
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      const newProduct = {
        id: data.id,
        name: productName.trim(),
        price,
        stock,
        category_id: selectedCategory,
        supplier_id: selectedSupplier,
      };

      onAddProduct(newProduct);
      toast.success('Product added successfully!');
      router.push("/dashboard")
      onClose();
    } catch (error) {
      setError('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full max-w-md border border-white/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full p-3 bg-gray-300/15 text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:bg-gray-300/20"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Enter price"
              className="w-full p-3 bg-gray-300/15 text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:bg-gray-300/20"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              placeholder="Enter stock quantity"
              className="w-full p-3 bg-gray-300/15 text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:bg-gray-300/20"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select
              value={selectedCategory}
            onChange={(e) => {setSelectedCategory(e.target.value)
            }}
              className="w-full p-3 bg-gray-300/15 text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:bg-gray-300/20"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => {setSelectedSupplier(e.target.value); console.log(e.target.value);
              }}
              className="w-full p-3 bg-gray-300/15 text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition hover:bg-gray-300/20"
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={()=>{router.back()}}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl transition"
            >
              Cancel
            </button>

            {/* Loading button */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
