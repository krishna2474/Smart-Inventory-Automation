'use client';

import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts'
import 'react-loading-skeleton/dist/skeleton.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import DashboardSidebar from '@/components/Sidebar'; // Import the sidebar

pdfMake.vfs = pdfFonts.vfs;

interface Product {
  product_id: string;
  name: string;
  stock: number;
  category: string;
  totalSold?: number;
}

interface SalesSummary {
  totalRevenue: number;
  totalInvoices: number;
}

const COLORS = ['#4caf50', '#ff9800', '#2196f3'];

const CustomReportSkeleton = () => (
  <div className="animate-pulse space-y-8">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center">
      <div className="bg-zinc-800 h-10 w-48 rounded-md"></div>
      <div className="bg-zinc-800 h-9 w-32 rounded-md"></div>
    </div>

    {/* Summary Cards Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-zinc-800 p-4 rounded-xl">
        <div className="bg-zinc-700 h-6 w-32 rounded-md mb-2"></div>
        <div className="bg-zinc-700 h-10 w-24 rounded-md mx-auto"></div>
      </div>
      <div className="bg-zinc-800 p-4 rounded-xl">
        <div className="bg-zinc-700 h-6 w-32 rounded-md mb-2"></div>
        <div className="bg-zinc-700 h-10 w-24 rounded-md mx-auto"></div>
      </div>
      <div className="hidden md:block bg-zinc-800 p-4 rounded-xl">
        <div className="bg-zinc-700 h-6 w-32 rounded-md mb-2"></div>
        <div className="bg-zinc-700 h-10 w-24 rounded-md mx-auto"></div>
      </div>
    </div>

    {/* Stock Distribution Chart Skeleton */}
    <div className="bg-zinc-800 p-6 rounded-xl">
      <div className="bg-zinc-700 h-8 w-48 rounded-md mb-4"></div>
      <div className="relative h-60">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-700 rounded-full w-32 h-32"></div>
        <div className="absolute top-1/4 left-1/4 bg-zinc-700 h-6 w-24 rounded-md"></div>
        <div className="absolute top-3/4 right-1/4 bg-zinc-700 h-6 w-24 rounded-md"></div>
        <div className="absolute bottom-1/4 left-1/2 bg-zinc-700 h-6 w-24 rounded-md"></div>
        <div className="absolute top-1/2 right-10 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute top-3/4 left-10 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute bottom-10 left-1/4 bg-zinc-700 h-4 w-16 rounded-md"></div>
      </div>
    </div>

    {/* Top Selling Products Chart Skeleton */}
    <div className="bg-zinc-800 p-6 rounded-xl">
      <div className="bg-zinc-700 h-8 w-56 rounded-md mb-4"></div>
      <div className="h-72 relative">
        <div className="absolute bottom-0 left-10 bg-zinc-700 h-10 w-16 rounded-md"></div>
        <div className="absolute bottom-0 left-32 bg-zinc-700 h-16 w-16 rounded-md"></div>
        <div className="absolute bottom-0 left-54 bg-zinc-700 h-12 w-16 rounded-md"></div>
        <div className="absolute bottom-0 left-76 bg-zinc-700 h-20 w-16 rounded-md"></div>
        <div className="absolute bottom-0 left-98 bg-zinc-700 h-8 w-16 rounded-md"></div>
        <div className="absolute left-10 bottom-12 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-32 bottom-18 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-54 bottom-14 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-76 bottom-22 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-98 bottom-10 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-10 bottom-24 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-32 bottom-30 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-54 bottom-26 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-76 bottom-34 bg-zinc-700 h-4 w-16 rounded-md"></div>
        <div className="absolute left-98 bottom-22 bg-zinc-700 h-4 w-16 rounded-md"></div>
      </div>
    </div>

    {/* Low Stock and Out of Stock Lists Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-800 p-6 rounded-xl">
        <div className="bg-zinc-700 h-8 w-40 rounded-md mb-4"></div>
        <ul className="space-y-2">
          <li className="bg-zinc-700 h-5 w-full rounded-md"></li>
          <li className="bg-zinc-700 h-5 w-4/5 rounded-md"></li>
          <li className="bg-zinc-700 h-5 w-3/4 rounded-md"></li>
        </ul>
      </div>
      <div className="bg-zinc-800 p-6 rounded-xl">
        <div className="bg-zinc-700 h-8 w-48 rounded-md mb-4"></div>
        <ul className="space-y-2">
          <li className="bg-zinc-700 h-5 w-full rounded-md"></li>
          <li className="bg-zinc-700 h-5 w-2/3 rounded-md"></li>
          <li className="bg-zinc-700 h-5 w-1/2 rounded-md"></li>
        </ul>
      </div>
    </div>
  </div>
);

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Example default state
  const [isCollapsed, setIsCollapsed] = useState(false); // Example default state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const stockChartRef = useRef<HTMLDivElement>(null);
  const topSellingChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [productsRes, topSellingRes, summaryRes] = await Promise.all([
          fetch('/api/v1/reports/products'),
          fetch('/api/v1/reports/top-selling'),
          fetch('/api/v1/reports/sales-summary'),
        ]);

        const productsData = await productsRes.json();
        const topSellingData = await topSellingRes.json();
        const summaryData = await summaryRes.json();

        setProducts(productsData);
        setTopSelling(topSellingData);
        setSummary(summaryData);
      } catch (err) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter(p => p.stock === 0);

  const stockPieData = [
    { name: 'Sufficient', value: products.filter(p => p.stock > 10).length, info: 'Products with more than 10 in stock' },
    { name: 'Low Stock', value: lowStock.length, info: 'Products with stock between 1-10' },
    { name: 'Out of Stock', value: outOfStock.length, info: 'Products with zero stock' },
  ];

  const downloadPDFReport = async () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const documentDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Inventory Report', style: 'header' },
        { text: `Report Date: ${formattedDate}`, style: 'reportDate' },
        { text: '\n\n' },

        { text: 'Sales Summary', style: 'sectionHeader' },
        { text: '\n' },
        summary ? [
          { text: `Total Invoices: `, style: 'bold' },
          { text: `${summary.totalInvoices}\n` },
          { text: `Total Revenue: `, style: 'bold' },
          { text: `₹${summary.totalRevenue?.toFixed(2)}\n\n` },
        ] : { text: 'Sales summary data not available.\n\n' },

        { text: 'Stock Distribution', style: 'sectionHeader' },
        { text: '\n' },
        {
          ul: stockPieData.map(item => ({
            text: `${item.name}: <span class="math-inline">\{item\.value\} products \(</span>{item.info})`,
            style: 'listItem',
          })),
        },
        { text: '\n\n' },

        { text: 'Top Selling Products', style: 'sectionHeader' },
        { text: '\n' },
        topSelling.length > 0 ? {
          table: {
            body: [
              [{ text: 'Product Name', style: 'tableHeader' }, { text: 'Total Sold', style: 'tableHeader' }],
              ...topSelling.map(item => [item.name, item.totalSold?.toString() || '0']),
            ],
          },
          layout: 'lightHorizontalLines',
        } : { text: 'No top selling products data available.\n\n' },
        { text: '\n\n' },

        { text: 'Low Stock Products', style: 'sectionHeader' },
        { text: '\n' },
        lowStock.length > 0 ? {
          ul: lowStock.map(item => ({
            text: `${item.name} (Stock: ${item.stock})`,
            style: 'listItemWarning',
          })),
        } : { text: 'No products with low stock.\n\n' },
        { text: '\n\n' },

        { text: 'Out of Stock Products', style: 'sectionHeader' },
        { text: '\n' },
        outOfStock.length > 0 ? {
          ul: outOfStock.map(item => ({
            text: `${item.name}`,
            style: 'listItemDanger',
          })),
        } : { text: 'No products are out of stock.\n' },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        reportDate: {
          fontSize: 10,
          alignment: 'center',
          color: '#718096', // Gray
          margin: [0, 0, 0, 15],
        },
        sectionHeader: {
          fontSize: 18,
          bold: true,
          margin: [0, 15, 0, 10],
          color: '#374151', // Dark gray
        },
        bold: {
          bold: true,
        },
        listItem: {
          fontSize: 12,
          margin: [0, 5],
        },
        listItemWarning: {
          fontSize: 12,
          margin: [0, 5],
          color: '#facc15', // Yellow
        },
        listItemDanger: {
          fontSize: 12,
          margin: [0, 5],
          color: '#ef4444', // Red
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: '#4b5563', // Medium gray
        },
      },
      pageMargins: [40, 60, 40, 60],
    };

    pdfMake.createPdf(documentDefinition).download('inventory_report.pdf');
  };
  const downloadCSVReport = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const data = [
      ['Report Type', 'Inventory Report'],
      ['Report Date', formattedDate],
      [], // Empty row for spacing
      ['Section', 'Sales Summary'],
      ['Item', 'Total Invoices', 'Total Revenue'],
      ['Value', summary?.totalInvoices || 'N/A', `₹${summary?.totalRevenue?.toFixed(2) || 'N/A'}`],
      [],
      ['Section', 'Stock Distribution'],
      ['Status', 'Count', 'Description'],
      ['Sufficient', products.filter(p => p.stock > 10).length, 'Products with more than 10 in stock'],
      ['Low Stock', lowStock.length, 'Products with stock between 1-10'],
      ['Out of Stock', outOfStock.length, 'Products with zero stock'],
      [],
      ['Section', 'Top Selling Products'],
      ['Product Name', 'Total Sold'],
      ...topSelling.map(item => [item.name, item.totalSold || 0]),
      [],
      ['Section', 'Low Stock Products'],
      ['Product Name', 'Current Stock'],
      ...lowStock.map(item => [item.name, item.stock]),
      [],
      ['Section', 'Out of Stock Products'],
      ['Product Name'],
      ...outOfStock.map(item => [item.name]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'inventory_report.csv');
  };
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
  return (
    
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        isSidebarOpen={isSidebarOpen}
        toggleCollapse={toggleCollapse}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 space-y-10 md:p-10 transition-all duration-300 ${
          isSidebarOpen && !isCollapsed ? 'ml-64' : isSidebarOpen && isCollapsed ? 'ml-20' : 'ml-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-600">📊 Reports Dashboard</h1>
          <div className="space-x-2">
            <button
              onClick={downloadPDFReport}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm md:text-base"
            >
       
            Download PDF
          </button>
          <button
            onClick={downloadCSVReport}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <CustomReportSkeleton />
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl text-center border border-white/30">
                <p className="text-xl font-semibold text-purple-300">🧾 Total Invoices</p>
                <p className="text-3xl font-bold">{summary.totalInvoices}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl text-center border border-white/30">
                <p className="text-xl font-semibold text-purple-300">💸 Total Revenue</p>
                <p className="text-3xl font-bold">₹{summary.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Stock Status Pie Chart */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-white/30" ref={stockChartRef}>
            <h2 className="text-xl font-semibold mb-4 text-purple-300">📦 Stock Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stockPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stockPieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-white/30 shadow-lg transition-all hover:shadow-2xl hover:bg-zinc-900" ref={topSellingChartRef}>
            <h2 className="text-xl font-semibold mb-4 text-purple-300">🔥 Top Selling Products</h2>
            {topSelling.length === 0 ? (
              <p>No sales data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSelling} onMouseLeave={() => setActiveBar(null)}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar
                    dataKey="totalSold"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    onMouseEnter={(e) => setActiveBar(e.dataKey)}
                  >
                    {topSelling.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={entry.name === activeBar ? '#fff' : '#8b5cf6'}
                        style={{ transition: 'fill 0.3s' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Low Stock and Out of Stock Lists Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Low Stock List */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-white/30 shadow-lg transition-all hover:shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center">
                <span className="mr-2">⚠️</span> Low Stock Products
              </h2>
              {lowStock.length === 0 ? (
                <p className="text-green-400 text-lg">All stocks are sufficient ✅</p>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  {lowStock.map(p => (
                    <li
                      key={p.product_id}
                      className="text-white hover:text-yellow-500 transition-colors"
                    >
                      <span className="font-semibold">{p.name}</span> — In Stock: {p.stock}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Out of Stock List */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-white/30 shadow-lg transition-all hover:shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 text-red-400 flex items-center">
                <span className="mr-2">❌</span> Out of Stock Products
              </h2>
              {outOfStock.length === 0 ? (
                <p className="text-green-400 text-lg">No products are out of stock 🔥</p>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  {outOfStock.map(p => (
                    <li
                      key={p.product_id}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <span className="font-semibold">{p.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div></div>
  );
}
