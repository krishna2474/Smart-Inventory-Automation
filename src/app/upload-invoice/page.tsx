"use client";

import { Background } from "@/components/Background";
import { Header } from "@/sections/Header";
import AddSupplierModal from "@/components/modals/AddSupplierModal"; // Import AddSupplierModal
import { useState, useCallback, useEffect } from "react";
import AddCategoryModal from "@/components/modals/AddCategory";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Supplier = {
  supplier_id: string;
  name: string;
};

type Category = {
  category_id: string;
  name: string;
};

type Product = {
  name: string;
  unit_price?: number;
  quantity?: number;
  category_id?: string;
};

type InvoiceData = {
  products: Product[];
};

type SupplierFormData = {
  name: string;
  contact: string;
  email: string;
  address: string;
};
;

export default function UploadInvoicePage() {
  const router = useRouter();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>(""); // Initialize with an empty string
const [fileName, setFileName] = useState<string>(""); // Initialize with an empty string
const [fileUrl, setFileUrl] = useState<string>(""); // Initialize with an empty string
  const fetchData = async () => {
    try {
      const [supplierRes, categoryRes] = await Promise.all([
        fetch("/api/v1/supplier"),
        fetch("/api/v1/category"),
      ]);

      if (!supplierRes.ok || !categoryRes.ok) {
        console.error("Failed to fetch data", { supplierRes, categoryRes });
        return;
      }

      const supplierData: Supplier[] = (await supplierRes.json()).data;
      const categoryData: Category[] = (await categoryRes.json()).data;

      setSuppliers(supplierData);
      setCategories(categoryData);
      console.log("Fetched suppliers:", supplierData);

    } catch (error) {
      console.error("Error fetching suppliers or categories:", error);
    }
  };
  useEffect(() => {


    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);
    setIsLoading(false);

    if (data.fileUrl) {
      setResult(data.fileUrl);
      if (data.extractedData) {
        try {
          const parsedData: InvoiceData = JSON.parse(data.extractedData);
          setFileName(data.fileName); // Set the file name
          setFileUrl(data.fileUrl); // Set the file URL
          setInvoiceData(parsedData);
          // Calculate total amount here or after editing products
          const initialTotal = parsedData.products.reduce((sum, product) => sum + (product.unit_price || 0) * (product.quantity || 0), 0);
          setTotalAmount(initialTotal);
          setShowModal(true);
        } catch (error) {
          console.error("Error parsing extracted data:", error);
          alert("Error parsing the extracted data");
        }
      }
    } else {
      alert("Upload failed");
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setSelectedFile(selected);
      setFile(selected);
    }
  };

  const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected supplier:", event.target.value);
    setSelectedSupplier(suppliers.find((supplier) => supplier.supplier_id === event.target.value) || null);
  };

  const handleCategoryChange = (productIndex: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = event.target.value;
    console.log("Selected category:", newCategoryId);

    setInvoiceData((prevData) => {
      if (!prevData) return prevData;
      const updatedProducts = [...prevData.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        category_id: newCategoryId,
      };
      return { ...prevData, products: updatedProducts };
    });
  };

  const handleProductChange = (productIndex: number, field: keyof Product, value: string) => {
    setInvoiceData((prevData) => {
      if (!prevData) return prevData;
      const updatedProducts = [...prevData.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        [field]: value,
      };

      // Recalculate total amount here, inside the callback where prevData is available
      const newTotal = updatedProducts.reduce((sum, product) => sum + (Number(product.unit_price) || 0) * (Number(product.quantity) || 0), 0);
      setTotalAmount(newTotal);

      return { ...prevData, products: updatedProducts };
    });
  };
  const handleInvoiceDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceDate(event.target.value);
  };

  const handleAddSupplier = async (newSupplier: SupplierFormData) => {
    try {
      // Assuming you add the supplier to the database via an API call.
      // Here we're just adding it to the state locally.
      setSuppliers((prev) => [
        ...prev,
        { supplier_id: `${prev.length + 1}`, name: newSupplier.name },
      ]);
      setShowAddSupplierModal(false);

      // Refetch the supplier data after adding a new supplier
      await fetchData();  // This triggers the refetching of the suppliers
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  const handleAddCategory = async (newCategory: Category) => {
    try {
      setCategories((prev) => [...prev, newCategory]);
      setShowAddCategoryModal(false);

      // Refetch the category data after adding a new category
      await fetchData();  // This triggers the refetching of the categories
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddProductsAndInvoice = async () => {
    if (!invoiceData || invoiceData.products.length === 0 || !selectedSupplier || totalAmount === null || !invoiceDate) {
      return toast.error("Please ensure you have product data, selected a supplier, and provided the invoice date and total amount.");
    }

    setIsLoading(true); // Start loading

    // Prepare product data for the /product endpoint
    const productsForDB = invoiceData.products.map((product) => ({
      supplier_id: selectedSupplier.supplier_id,
      name: product.name,
      description: "Description Here", // You might want to add description in your invoiceData
      price: Number(product.unit_price), // Convert to Decimal if needed
      stock: Number(product.quantity),
      category_id: product.category_id,
    }));

    // Prepare invoice data for the /invoice endpoint
    const invoicePayload = {
      fileUrl: fileUrl,
      fileName: fileName,
      supplier_id: selectedSupplier.supplier_id,
      totalAmount: totalAmount,
      invoiceDate: invoiceDate,
    };

    try {
      const [invoiceRes, productRes] = await Promise.all([
        fetch("/api/v1/invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoicePayload),
        }),
        fetch("/api/v1/product", { // Assuming you have a bulk product create endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: productsForDB }),
        }),
      ]);

      const invoiceDataRes = await invoiceRes.json();
      const productDataRes = await productRes.json();

      if (invoiceRes.ok && productRes.ok) {
        toast.success("Invoice and products added successfully!");
        setShowModal(false);
        router.push('/dashboard'); // Redirect to dashboard or another appropriate page
      } else {
        const invoiceError = invoiceRes.ok ? null : `Failed to add invoice: ${invoiceDataRes?.message || 'Unknown invoice error'}`;
        const productError = productRes.ok ? null : `Failed to add products: ${productDataRes?.message || 'Unknown product error'}`;
        toast.error(`<span class="math-inline">\{invoiceError ? invoiceError \+ ' ' \: ''\}</span>{productError || ''}`);
      }
    } catch (error) {
      console.error("Error adding invoice and products:", error);
      toast.error("Error occurred while adding the invoice and products.");
    } finally {
      setIsLoading(false); // End loading
    }
  };


  return (
    <>
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
        <Background>
          <div className="max-w-xl w-full p-8 bg-gray-900 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Upload Invoice</h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById("invoiceInput")?.click()}
              className={`cursor-pointer p-6 border-2 border-dashed rounded-xl transition-all
                  ${isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/30 bg-white/5"}`}
            >
              <div className="text-center">
                <p className="text-lg">
                  {selectedFile ? (
                    <>✅ <span className="font-semibold">{selectedFile.name}</span></>
                  ) : (
                    <>Drag & Drop an invoice or <span className="underline">click to select</span></>
                  )}
                </p>
                <p className="text-sm text-white/50 mt-2">Only PDF, PNG, JPG allowed</p>
              </div>
              <input
                id="invoiceInput"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileInput}
                hidden
              />
            </div>

            {selectedFile && (
              <div className="mt-4 text-center">
                <button
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl font-medium text-white transition"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Invoice"}
                </button>
              </div>
            )}

            {result && (
              <div className="mt-6 text-center">
                <a
                  href={result}
                  className="text-purple-400 hover:text-purple-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Uploaded Invoice
                </a>
              </div>
            )}
          </div>
        </Background>
      </div>
      {showModal && invoiceData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
    <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full max-w-5xl border border-white/30 transition-all duration-300">
      <h3 className="text-2xl font-semibold text-center mb-6 text-white">Edit Invoice Details</h3>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <label className="block text-sm font-medium text-white">Supplier</label>
            <select
              className="w-full mt-2 p-3 pr-10 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40 appearance-none"
              onChange={handleSupplierChange}
              value={selectedSupplier?.supplier_id || ""}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id} className="bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-black rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transitionhover:bg-gray-300/20">
                  {supplier.name}
                </option>
              ))}
              <div className="pointer-events-none absolute top-[52px] right-4 transform -translate-y-1/2 transition-transform duration-300 ease-in-out group-focus-within:rotate-180">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </select>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-white">Invoice Date</label>
            <input
              type="date"
              className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
              value={invoiceDate}
              onChange={handleInvoiceDateChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Total Amount</label>
          <input
            type="number"
            className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
            value={totalAmount || ''}
            readOnly
          />
        </div>

        <div className="text-center flex justify-center gap-4 mb-4">
          <button
            type="button"
            className="text-purple-400 hover:text-purple-500 transition"
            onClick={() => setShowAddSupplierModal(true)}
          >
            Add New Supplier
          </button>
          <button
            type="button"
            className="text-purple-400 hover:text-purple-500 transition"
            onClick={() => setShowAddCategoryModal(true)}
          >
            Add New Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-2 text-center font-semibold bg-purple-500/30 backdrop-blur-md p-3 rounded-md text-white">
            <div>Product Name</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Category</div>
          </div>
          {invoiceData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-2 relative group">
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleProductChange(index, "name", e.target.value)}
                placeholder="Product Name"
                className="w-full p-2 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transitionhover:bg-gray-300/20"
              />
              <input
                type="text"
                value={product.unit_price || ''}
                onChange={(e) => handleProductChange(index, "unit_price", e.target.value)}
                placeholder="Price"
                className="w-full p-2 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transitionhover:bg-gray-300/20"
              />
              <input
                type="number"
                value={product.quantity || ''}
                onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                placeholder="Quantity"
                className="w-full p-2 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transitionhover:bg-gray-300/20"
              />
              <div className="relative">
                <select
                  className="w-full p-2 pr-8 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40 appearance-none"
                  value={product.category_id || ""}
                  onChange={(e) => handleCategoryChange(index, e)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-2 transform -translate-y-1/2 transition-transform duration-300 ease-in-out group-focus-within:rotate-180">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleAddProductsAndInvoice}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-medium text-white transition"
          >
            Update Inventory
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Modals */}
<AddSupplierModal
  isOpen={showAddSupplierModal}
  onClose={() => setShowAddSupplierModal(false)}
  onAddSupplier={handleAddSupplier}
/>

<AddCategoryModal
  isOpen={showAddCategoryModal}
  onClose={() => setShowAddCategoryModal(false)}
  onAddCategory={handleAddCategory}
/>
    </>
  );
} 