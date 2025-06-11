'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/Sidebar';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

type Supplier = {
  supplier_id: string;
  name: string;
};

type Invoice = {
  invoice_id: string;
  fileName: string;
  fileUrl: string;
  supplier: Supplier;
  totalAmount: string;
  invoiceDate: string;
  status: string;
};

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/v1/invoice');
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } sm:w-64 lg:w-80 xl:w-96 shrink-0 transition-all duration-300 ${
          isSidebarOpen ? 'block' : 'hidden'
        } sm:block`}
      >
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleCollapse}
        />
      </div>

      {/* Toggle Sidebar Button (Mobile) */}
      <div className="sm:hidden absolute top-4 left-4 z-10">
        <Button
          onClick={toggleSidebar}
          className="bg-blue-600 text-white rounded-md p-2 shadow-md hover:bg-blue-700"
        >
          {isSidebarOpen ? 'Close' : 'Open'} Sidebar
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Invoices</h1>

        <Button onClick={() => router.push('/upload-invoice')}>Add New Invoice</Button>

        <div className="overflow-x-auto mt-6 rounded-xl border border-white/10">
          <table className="w-full table-auto text-sm sm:text-base bg-zinc-900 bg-opacity-30 text-white">
            <thead className="bg-white/10 text-gray-300 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Invoice Name</th>
                <th className="px-4 py-3 text-left">Supplier</th>
                <th className="px-4 py-3 text-left">Amount (₹)</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-white/10 animate-pulse bg-white/5"
                    >
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <td key={i} className="px-4 py-3">
                            <div className="h-4 bg-white/20 rounded w-3/4" />
                          </td>
                        ))}
                    </tr>
                  ))
                : invoices.map((invoice) => (
                    <tr
                      key={invoice.invoice_id}
                      className="border-t border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedInvoiceUrl(invoice.fileUrl)}
                          className="text-blue-400 hover:underline"
                        >
                          {invoice.fileName}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {invoice.supplier?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3">₹{invoice.totalAmount}</td>
                      <td className="px-4 py-3">
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{invoice.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {selectedInvoiceUrl && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Invoice Preview</h2>
              <button
                onClick={() => setSelectedInvoiceUrl(null)}
                className="text-sm text-red-400 hover:text-red-500"
              >
                ✖ Close
              </button>
            </div>
            <div className="w-full h-[80vh] border border-white/20 rounded-xl overflow-hidden">
              <iframe
                src={selectedInvoiceUrl}
                className="w-full h-full"
                title="Invoice Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
