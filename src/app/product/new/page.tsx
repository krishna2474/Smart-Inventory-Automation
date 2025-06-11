'use client';
import { Background } from '@/components/Background';
import AddProductModal from '@/components/modals/AddProductModal';
import React, { useEffect, useState } from 'react';
const NewProductPage = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(true);

  const handleAddProduct = (newProduct: {
    id: string;
    name: string;
    price: number;
    stock: number;
    category_id: string;
    supplier_id: string;
  }) => {
    console.log('New Product Added:', newProduct);
    // Handle the logic to add the product, such as an API call or updating state
    setIsAddProductModalOpen(false); // Close the modal after adding
  };


  return (
    <Background >
      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <AddProductModal
          onAddProduct={handleAddProduct}
          isOpen={isAddProductModalOpen}
          onClose={()=>{}}
        />
      )}
    </Background>
  );
};

export default NewProductPage;
