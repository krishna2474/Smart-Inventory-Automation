import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../Button";

type SupplierFormData = {
  name: string;
  contact: string;
  email: string;
  address: string;
};

const AddSupplierModal = ({
  isOpen,
  onClose,
  onAddSupplier,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplier: (newSupplier: SupplierFormData) => void;
}) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      // Send POST request to API
      const response = await fetch("api/v1/supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        // Show success toast
        toast.success("Supplier added successfully!");
        console.log("Supplier added:", result);
        
        onAddSupplier(formData); // Pass the new supplier data to the parent component
        setFormData({
          name: "",
          contact: "",
          email: "",
          address: "",
        });
        onClose(); // Close the modal after submission
      } else {
        // Show error toast
        toast.error("Failed to add supplier. Please try again.");
      }
    } catch (error) {
      // Handle network errors
      toast.error("An error occurred. Please check your connection.");
    }
  };

  // If isOpen is false, return null to not render the modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mx-5">
      <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full max-w-3xl sm:max-w-4xl border border-white/30 transition-all duration-300 overflow-auto">
        <h3 className="text-2xl font-semibold text-center mb-6 text-white">Add New Supplier</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative group">
            <label className="block text-sm font-medium text-white">Supplier Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
              placeholder="Supplier Name"
              required
            />
          </div>

          <div className="mb-6 relative group">
            <label className="block text-sm font-medium text-white">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
              placeholder="Contact"
            />
          </div>

          <div className="mb-6 relative group">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-6 relative group">
            <label className="block text-sm font-medium text-white">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
              placeholder="Address"
            />
          </div>

          <div className="mt-6 text-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-medium text-white transition"
            >
              Add Supplier
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-red-400 hover:text-red-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierModal;
