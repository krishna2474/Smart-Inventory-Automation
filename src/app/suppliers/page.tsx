'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/Sidebar';
import AddSupplierModal from '@/components/modals/AddSupplierModal';
import { Button } from '@/components/Button';

interface Invoice {
  invoice_id: string;
  totalAmount: number;
  invoiceDate: Date;
  status: string;
}

interface Supplier {
  supplier_id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  invoice: Invoice[];
}

interface SupplierFormData {
  name: string;
  email: string;
  contact: string;
  address: string;
}

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleAddSupplier = (newSupplier: SupplierFormData) => {
    setSuppliers((prevSuppliers) => [
      ...prevSuppliers,
      { ...newSupplier, supplier_id: Date.now().toString(), invoice: [] },
    ]);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/v1/supplier');
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data.data);
        } else {
          console.error('Failed to fetch suppliers');
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return (
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Suppliers</h1>

        {/* Add Supplier Button */}
        <Button
          onClick={toggleModal}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors"
        >
          Add Supplier
        </Button>

        {/* Add Supplier Modal */}
        <AddSupplierModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onAddSupplier={handleAddSupplier}
        />

        {/* Skeleton Loaders */}
        {loading ? (
          <div className="space-y-8 sm:space-y-10">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="border-t border-white/10  bg-white/5 animate-pulse bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border shadow-lg"
              >
                <div className="h-6 sm:h-8 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>

                <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm sm:text-base border-collapse bg-zinc-900 bg-opacity-30 text-white">
                    <thead>
                      <tr className="bg-white/10 text-white uppercase tracking-wider">
                        <th className="p-4 text-center">Invoice ID</th>
                        <th className="p-4 text-center">Amount (₹)</th>
                        <th className="p-4 text-center">Date</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-400">No suppliers found.</p>
        ) : (
          suppliers.map((supplier) => (
            <div
              key={supplier.supplier_id}
              className="mb-8 sm:mb-10 bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-lg transition-all duration-300"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4">{supplier.name}</h2>
              <p className="text-sm sm:text-base text-gray-400 mb-4">
                {supplier.email} | {supplier.contact} | {supplier.address}
              </p>

              <h3 className="text-lg sm:text-xl font-medium mb-3">Invoices</h3>

              {supplier.invoice.length === 0 ? (
                <p className="text-sm sm:text-base text-gray-500">No invoices available.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm sm:text-base border-collapse bg-zinc-900 bg-opacity-30 text-white">
                    <thead>
                      <tr className="bg-white/10 text-white uppercase tracking-wider">
                        <th className="p-4 border-b border-white/10 text-center align-middle">Invoice ID</th>
                        <th className="p-4 border-b border-white/10 text-center align-middle">Amount (₹)</th>
                        <th className="p-4 border-b border-white/10 text-center align-middle">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.invoice.map((invoice) => (
                        <tr key={invoice.invoice_id} className="hover:bg-white/10 transition-colors">
                          <td className="p-4 border-b border-white/10 text-center align-middle">
                            {invoice.invoice_id}
                          </td>
                          <td className="p-4 border-b border-white/10 text-center align-middle">
                            ₹{invoice.totalAmount}
                          </td>
                          <td className="p-4 border-b border-white/10 text-center align-middle">
                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
