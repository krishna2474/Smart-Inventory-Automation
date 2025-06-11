"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { X, Menu as MenuIcon, Box, Truck, File as FileIcon, Tag, Coins, BarChart } from "lucide-react";
import DashboardSidebar from "@/components/Sidebar";
import { Header } from "@/sections/Header";

const Skeleton = ({
  width,
  height,
  style = {},
}: {
  width: string;
  height: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      width,
      height,
      backgroundColor: "#333",
      borderRadius: "8px",
      animation: "skeleton-loading 1.5s infinite ease-in-out",
      ...style,
    }}
  />
);

type DashboardData = {
  stats: {
    products: number;
    suppliers: number;
    categories: number;
    invoices: number;
    payments: number;
    users: number; // Added total users
  };
  lowStockProducts: {
    product_id: number;
    name: string;
    stock: number;
    created_at: string;
  }[];
  invoiceStatusBreakdown: {
    pending: number;
    paid: number;
    overdue: number;
  };
  recentInvoices: {
    invoice_id: number;
    supplier: { name: string };
    totalAmount: number;
    status: string;
    invoiceDate: string;
  }[];
  recentPayments: {
    payment_id: number;
    invoice_id: number;
    invoice: { fileName: string; fileUrl: string };
    amount: number;
    paymentDate: string;
    method: string
  }[];
  topCategories: {
    category_id: number;
    name: string;
    productCount: number;
    products: { name: string; stock: number }[];
  }[];
  recentlyAddedProducts: any[];
};

// Memoize the Skeleton component if it receives props that might change
const MemoizedSkeleton = React.memo(Skeleton);

// Create a separate component for the Top Categories Chart
const TopCategoriesChart = React.memo(
  ({
    data,
    handleMouseMove,
    handleMouseLeave,
    hoveredCategory,
  }: {
    data: DashboardData["topCategories"] | undefined;
    handleMouseMove: (state: any) => void;
    handleMouseLeave: () => void;
    hoveredCategory: {
      x: number;
      y: number;
      name: string;
      products: { name: string; stock: number }[];
    } | null;
  }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const prevData = useRef<DashboardData["topCategories"] | undefined>(undefined);

    useEffect(() => {
      if (data && prevData.current !== data) {
        setIsAnimating(true);
        const animationTimeout = setTimeout(() => {
          setIsAnimating(false);
        }, 500); // Adjust duration as needed
        return () => clearTimeout(animationTimeout);
      }
      prevData.current = data;
    }, [data]);

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <XAxis dataKey="name" stroke="#888" />
          <YAxis />
          <Line
            type="monotone"
            dataKey="productCount"
            stroke="#7c3aed"
            strokeWidth={2}
            isAnimationActive={isAnimating}
            animationDuration={500} // Match the timeout
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  },
  (prevProps, nextProps) => prevProps.data === nextProps.data // Only re-render if data changes
);

export default function DashboardPage() {
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

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<{
    x: number;
    y: number;
    name: string;
    products: { name: string; stock: number }[];
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const verifyToken = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token'); // Or your token storage
    console.log("Token:", token);

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/v1/verify-token', { // Dedicated client-side verification endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true); // Assuming your backend returns { isValid: true/false }
      } else {
        setIsAuthenticated(false);
        router.push('/login');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setIsAuthenticated(false);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cacheBuster = Math.random().toString(36).substring(7);
      const res = await fetch(`/api/v1/dashboard?cb=${cacheBuster}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const responseData = await res.json();
      console.log("Dashboard data:", responseData);
      setData(responseData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);
  const statCards = data
  ? [
      { title: "Users", value: data.stats.users }, // Added Users card
      { title: "Products", value: data.stats.products },
      { title: "Suppliers", value: data.stats.suppliers },
      { title: "Categories", value: data.stats.categories },
      { title: "Invoices", value: data.stats.invoices },
      { title: "Payments", value: data.stats.payments },
  ]
  : [];
// Memoize the statCards array if 'data' doesn't change
const memoizedStatCards = React.useMemo(() => statCards, [data]);
const handleFileClick = (fileUrl: string) => {
 setSelectedFile(fileUrl);
 setIsModalOpen(true);
}
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const intervalId = setInterval(() => {
        fetchData(); // Fetch data every 30 seconds
      }, 30000);

      return () => clearInterval(intervalId); // Clean up interval on unmount
    }
  }, [isAuthenticated, fetchData]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <p>You are not authenticated. Redirecting...</p>;
  }

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  if (error) {
    return <p>Error loading dashboard data: {error}</p>;
  }


    const handleMouseMove = (state: any) => {
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        if (state?.activePayload?.[0]) {
            const category = state.activePayload[0].payload;
            const { chartX, chartY } = state;
            tooltipTimeout.current = setTimeout(() => {
                setHoveredCategory({
                    x: chartX,
                    y: chartY,
                    name: category.name,
                    products: category.products,
                });
            }, 50);
        } else {
            setHoveredCategory(null);
        }
    };

    const handleMouseLeave = () => {
        tooltipTimeout.current = setTimeout(() => {
            setHoveredCategory(null);
        }, 200); // short delay
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setIsCollapsed(false); // When opening, ensure it's not collapsed
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed && !isSidebarOpen) {
            setIsSidebarOpen(true); // If collapsing from a closed state, open it first
        }
    };

    const navigate = (path: string) => {
        setIsSidebarOpen(false); // Close full sidebar on navigation (optional)
        setIsCollapsed(true); // Collapse the smaller sidebar (optional)
        router.push(path);
    };
    const SidebarItem = ({ icon, label, path }: { icon: React.ReactNode; label: string; path: string }) => (
        <button onClick={() => navigate(path)} className={`block py-2 px-4 rounded-md hover:bg-[#222] w-full text-left ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>

                {icon}
                {!isCollapsed && <span className="ml-2">{label}</span>}
            </div>
        </button>
    );

 
    return (
 <>
 <div className="bg-black">
 <Header/>

 <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <DashboardSidebar
                isSidebarOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                toggleCollapse={toggleCollapse}
            />

            {/* Main Content */}
            <div className={`flex-1 p-6 space-y-6 transition-all duration-300 ease-in-out ${!isSidebarOpen ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
                }`}>

                {!isSidebarOpen && (
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white focus:outline-none mb-4">
                        <MenuIcon size={20} /> Menu
                    </button>
                )}
                {error && <div className="text-red-500 text-center">{error}</div>}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {loading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-[#111] rounded-2xl p-6 flex flex-col items-center justify-center shadow-md"
                            >
                                <MemoizedSkeleton width="100px" height="30px" />
                                <MemoizedSkeleton width="150px" height="20px" />
                            </div>
                        ))
                        : memoizedStatCards.map((card) => (
                            <div
                                key={card.title}
                                className="bg-[#111] rounded-2xl p-6 flex flex-col items-center justify-center shadow-md"
                            >
                                <p className="text-3xl font-bold">{card.value}</p>
                                <p className="text-sm text-gray-400 mt-1">{card.title}</p>
                            </div>
                        ))}
                </div>

                {/* Low Stock & Recent Invoices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
                        {loading ? (
                            <>
                                <MemoizedSkeleton width="60%" height="15px" />
                                <MemoizedSkeleton width="80%" height="15px" style={{ marginTop: "8px" }} />
                                <MemoizedSkeleton width="70%" height="15px" style={{ marginTop: "8px" }} />
                            </>
                        ) : data?.lowStockProducts.length === 0 ? (
                            <p className="text-sm text-gray-400">No low stock products.</p>
                        ) : (
                            <ul className="space-y-2">
                                {data?.lowStockProducts.map((item) => (
                                    <li
                                        key={item.product_id}
                                        className="flex justify-between items-center border-b border-gray-700 pb-2"
                                    >
                                        <span>{item.name}</span>
                                        <span className="text-sm text-gray-400">{item.stock} left</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-[#111] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Recent Invoices</h2>
                            <button
                                className="bg-purple-600 px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                                onClick={() => router.push("/upload-invoice")}
                            >
                                Upload Invoice
                            </button>
                        </div>
                        {loading ? (
                            <>
                                <MemoizedSkeleton width="100%" height="15px" />
                                <MemoizedSkeleton width="100%" height="15px" style={{ marginTop: "8px" }} />
                                <MemoizedSkeleton width="100%" height="15px" style={{ marginTop: "8px" }} />
                            </>
                        ) : data?.recentInvoices.length === 0 ? (
                            <p className="text-sm text-gray-400">No recent invoices.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400">
                                        <th className="text-left">Invoice ID</th>
                                        <th className="text-left">Supplier</th>
                                        <th className="text-left">Amount</th>
                                        <th className="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recentInvoices.map((inv) => (
                                        <tr key={inv.invoice_id} className="border-t border-gray-700">
                                            <td className="py-2">{inv.invoice_id}</td>
                                            <td>{inv.supplier.name}</td>
                                            <td className="py-2">{inv.totalAmount}</td>
                                            <td>{inv.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Top Categories Chart */}
                <div className="bg-[#111] rounded-2xl p-6 relative">
                    <h2 className="text-lg font-semibold mb-4">
                        Stock Levels by Top Categories
                    </h2>
                    {loading ? (
                        <MemoizedSkeleton width="100%" height="250px" />
                    ) : data?.topCategories.length === 0 ? (
                        <p className="text-sm text-gray-400">No category data.</p>
                    ) : (
                        <TopCategoriesChart
                            data={data?.topCategories}
                            handleMouseMove={handleMouseMove}
                            handleMouseLeave={handleMouseLeave}
                            hoveredCategory={hoveredCategory}
                        />
                    )}
                    {hoveredCategory && (
                        <div
                            style={{
                                position: "absolute",
                                top: hoveredCategory.y,
                                left: hoveredCategory.x + 20,
                                backgroundColor: "#1f1f1f",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #333",
                                zIndex: 10,
                                width: "220px",
                                pointerEvents: "none",
                            }}
                        >
                            <p className="text-sm font-semibold text-purple-400 mb-2">
                                {hoveredCategory.name}
                            </p>
                            <ul className="text-sm space-y-1 max-h-[150px] overflow-y-auto">
                                {hoveredCategory.products.map((prod, idx) => (
                                    <li key={idx} className="flex justify-between">
                                        <span>{prod.name}</span>
                                        <span className="text-gray-400">{prod.stock}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <button onClick={() => setIsModalOpen(false)}>Close</button>
                            <iframe
                                src={selectedFile? selectedFile : ""}
                                width="100%"
                                height="600px"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
                {/* Payments Summary */}
                <div className="bg-[#111] rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
                    {loading ? (
                        <>
                            <MemoizedSkeleton width="90%" height="15px" />
                            <MemoizedSkeleton width="90%" height="15px" style={{ marginTop: "8px" }} />
                            <MemoizedSkeleton width="90%" height="15px" style={{ marginTop: "8px" }} />
                        </>
                    ) : data?.recentPayments.length === 0 ? (
                        <p className="text-sm text-gray-400">No payments yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="text-left">Payment ID</th>
                                    <th className="text-left">Invoice</th>
                                    <th className="text-left">Amount</th>
                                    <th className="text-left">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.recentPayments.map((pmt) => (
                                    <tr key={pmt.payment_id} className="border-t border-gray-700">
                                        <td className="py-2">{pmt.payment_id}</td>
                                        <td>
                <button
                  onClick={() => handleFileClick(pmt.invoice.fileUrl)}
                  className="text-blue-500 hover:underline"
                >
                  {pmt.invoice.fileName}
                </button>
              </td>
                                        <td className="py-2">₹{pmt.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div> </div>
            </div>
        </div> </>       
    );
}
