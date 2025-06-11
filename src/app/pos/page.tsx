'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Product {
  product_id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    const toastId = toast.loading('Loading products...');
    try {
      const res = await fetch(`/api/v1/pos/product`, {
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        },
    });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast once products are fetched
    }
  };  
  useEffect(() => {
    
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.product_id === product.product_id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('Cannot add more than available stock');
          return prev;
        }
        return prev.map((p) =>
          p.product_id === product.product_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  const updateQuantity = (productId: string, amount: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product_id === productId) {
          const newQuantity = item.quantity + amount;
          if (newQuantity > item.stock) {
            toast.error('Stock limit reached');
            return item;
          }
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  const generateInvoice = async () => {
    const toastId = toast.loading('Generating invoice...');
    try {
      console.log('Generating invoice with items:', cart);
      
      const res = await fetch('/api/v1/pos/checkoutt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            ...item,
            price: Number(item.price).toFixed(2),
          })),
        }),
      });
      console.log('Response:', res);
      
      if (res.ok) {
        toast.success('Invoice generated!');
        setCart([]);
        fetchProducts(); // Refresh products after checkout
      } else {
        toast.error('Failed to generate invoice');
      }
    } catch (err) {
      console.log('Error:', err);
      
      toast.error('Error generating invoice');
    } finally {
      toast.dismiss(toastId);
    }
  };
  

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4">POS Simulator</h1>

      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="bg-zinc-800 p-4 rounded-xl mb-8">
          <h2 className="text-2xl font-semibold mb-2">Cart</h2>
          {cart.map((item) => (
            <div key={item.product_id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 bg-gray-600 text-white rounded"
                  onClick={() => updateQuantity(item.product_id, -1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 bg-gray-600 text-white rounded"
                  onClick={() => updateQuantity(item.product_id, 1)}
                >
                  +
                </button>
              </div>
              <span>₹{item.quantity * item.price}</span>
            </div>
          ))}
          <div className="mt-4 text-right">
            <button
              onClick={generateInvoice}
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <input
        className="w-full p-2 rounded bg-zinc-800 text-white mb-4"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.product_id}
            className="p-4 bg-zinc-900 rounded-xl border border-white/10 shadow-md"
          >
            <h2 className="font-semibold text-xl">{product.name}</h2>
            <p className="text-sm text-gray-400">₹{product.price}</p>
            <p className="text-sm text-gray-500 mb-2">In Stock: {product.stock}</p>
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
