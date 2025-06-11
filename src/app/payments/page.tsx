'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/Sidebar';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';

interface Payment {
  payment_id: string;
  invoice_id: string;
  amount: number;
  created_at: string;
  status: 'PENDING' | 'PAID';
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<{
    [key: string]: 'PENDING' | 'PAID' | null;
  }>({}); // Track status changes for each payment

  useEffect(() => {
    const fetchPayments = async () => {
      const toastId = 'fetch-payments';
      toast.loading('Loading payments...', { id: toastId }); // Only one toast!
  
      try {
        const response = await fetch('/api/v1/payment');
        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          console.error('Failed to fetch payments');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
        toast.dismiss(toastId);
      }
    };
  
    fetchPayments();
  }, []);
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStatusChange = (paymentId: string, newStatus: 'PENDING' | 'PAID') => {
    setUpdatedStatus((prev) => ({
      ...prev,
      [paymentId]: newStatus,
    }));
  };
  const handleUpdateStatus = async (paymentId: string) => {
    const newStatus = updatedStatus[paymentId];
    if (!newStatus) return;
  
    const toastId = toast.loading('Updating payment status...'); // Show loading toast
  
    try {
      const response = await fetch(`/api/v1/payment/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (response.ok) {
        setPayments((prev) =>
          prev.map((p) =>
            p.payment_id === paymentId ? { ...p, status: newStatus } : p
          )
        );
        setUpdatedStatus((prev) => ({
          ...prev,
          [paymentId]: null, // Reset after successful update
        }));
        toast.success('Payment status updated successfully!');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating payment status');
    } finally {
      toast.dismiss(toastId); // Dismiss the loading toast
    }
  };
  
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-black text-white relative">
      {/* Sidebar */}
      <div
        className={`fixed sm:relative z-40 bg-black transition-all duration-300 ease-in-out h-full
          ${isSidebarOpen ? 'left-0 w-64' : '-left-64'}
          sm:left-0 ${isCollapsed ? 'sm:w-20' : 'sm:w-64'}`}
      >
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleCollapse}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto sm:ml-0 mt-16 sm:mt-0">
        {/* Menu button only on small screens */}
        <button
          className="sm:hidden mb-4 px-4 py-2 bg-white text-black rounded-md font-semibold"
          onClick={toggleSidebar}
        >
          ☰ Menu
        </button>

        <h1 className="text-2xl sm:text-4xl font-bold mb-6">Payments</h1>

        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-lg"
              >
                <div className="h-6 sm:h-8 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-gray-400">No payments found.</p>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div
                key={payment.payment_id}
                className="bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-lg"
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Payment ID: {payment.payment_id}
                </h2>
                <p className="text-sm sm:text-base text-gray-400 mb-1">
                  Invoice ID: {payment.invoice_id}
                </p>
                <p className="text-sm sm:text-base text-gray-400 mb-1">
                  Amount: ₹{payment.amount}
                </p>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  Created At: {new Date(payment.created_at).toLocaleString()}
                </p>

                <div className="flex items-center gap-4">
                  <label htmlFor={`status-${payment.payment_id}`} className="text-white">
                    Status:
                  </label>
                  <select
                    id={`status-${payment.payment_id}`}
                    value={updatedStatus[payment.payment_id] || payment.status}
                    onChange={(e) =>
                      handleStatusChange(payment.payment_id, e.target.value as 'PENDING' | 'PAID')
                    }
                    className="bg-zinc-800 border border-white/20 text-white rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                  </select>

                  {/* Show Update button if the status has changed */}
                  {updatedStatus[payment.payment_id] && (
                    <Button
                      onClick={() => handleUpdateStatus(payment.payment_id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md ml-4"
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
