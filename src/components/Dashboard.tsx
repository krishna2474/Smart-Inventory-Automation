import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
};

type Metrics = {
  products: number;
  suppliers: number;
  categories: number;
  lowStock: number;
};

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSampleData = () => {
      setTimeout(() => {
        setMetrics({
          products: 120,
          suppliers: 18,
          categories: 7,
          lowStock: 4,
        });
        setRecentInvoices([
          {
            id: "INV001",
            supplier: "ABC Pvt Ltd",
            date: "2025-02-20",
            amount: 15000,
            status: "Paid",
          },
          {
            id: "INV002",
            supplier: "XYZ Corp",
            date: "2025-02-21",
            amount: 25000,
            status: "Pending",
          },
          {
            id: "INV003",
            supplier: "LMN Enterprises",
            date: "2025-02-22",
            amount: 18000,
            status: "Paid",
          },
        ]);
        setLoading(false);
      }, 2000);
    };

    fetchSampleData();
  }, []);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-100">Dashboard</h1>
        <button className="bg-purple-600 hover:bg-purple-500 transition-colors text-white px-6 py-2 rounded-2xl shadow-lg">
          + Add Invoice
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(loading ? Array(4).fill(null) : Object.entries(metrics ?? {})).map(
          (item, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl shadow-lg p-6 hover:bg-gray-800 transition-colors duration-300"
            >
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-800 rounded w-16"></div>
                  <div className="h-4 bg-gray-800 rounded w-24"></div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-purple-600 text-white text-lg font-bold">
                    {item[1]}
                  </div>
                  <h3 className="text-lg font-medium text-gray-400 capitalize">
                    {item[0]}
                  </h3>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Recent Invoices Section */}
      <div className="bg-gray-900 rounded-2xl shadow-lg mt-8 p-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Recent Invoices
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Invoice ID</th>
                <th className="py-3 px-6 text-left">Supplier</th>
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Amount</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm font-light">
              {loading
                ? Array(3)
                    .fill(null)
                    .map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800 animate-pulse"
                      >
                        {Array(5)
                          .fill(null)
                          .map((__, idx) => (
                            <td
                              key={idx}
                              className="py-3 px-6 text-center bg-gray-800 rounded h-4"
                            ></td>
                          ))}
                      </tr>
                    ))
                : recentInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-3 px-6 text-left">{invoice.id}</td>
                      <td className="py-3 px-6 text-left">
                        {invoice.supplier}
                      </td>
                      <td className="py-3 px-6 text-center">{invoice.date}</td>
                      <td className="py-3 px-6 text-center">
                        ₹{invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-green-600 text-white"
                              : "bg-purple-600 text-white"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              {!loading && recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
