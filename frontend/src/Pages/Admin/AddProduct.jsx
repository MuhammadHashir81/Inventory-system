import React, { useState, useContext } from "react";
import { Plus } from "lucide-react";
import { AdminProductsContext } from "../../Components/Context/AdminProductsProvider";
import toast, { Toaster } from "react-hot-toast";

const AddProduct = () => {
  const { addProduct } = useContext(AdminProductsContext);

  const [product, setProduct] = useState({
    name: "",
    priceJohrabad: "",
    priceOther: "",
    category: "",
    description: "",
    inventory: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.category ||
      !product.description ||
      !product.priceJohrabad ||
      !product.priceOther ||
      !product.inventory
    ) {
      toast.error("All fields are required");
      return;
    }

    const result = await addProduct({
      ...product,
      priceJohrabad: parseFloat(product.priceJohrabad),
      priceOther: parseFloat(product.priceOther),
      inventory: parseInt(product.inventory),
    });

    if (result.success) {
      toast.success(result.message || "Product added successfully!");
      setProduct({
        name: "",
        priceJohrabad: "",
        priceOther: "",
        category: "",
        description: "",
        inventory: "",
      });
    } else {
      toast.error(result.message || "Failed to add product");
    }
  };

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
      <Toaster />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Plus size={24} className="text-blue-600" />
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1 sm:mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1 sm:mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 sm:mb-2">Price (Johrabad)</label>
            <input
              type="number"
              name="priceJohrabad"
              placeholder="Enter price for Johrabad"
              value={product.priceJohrabad}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 sm:mb-2">Price (Other Cities)</label>
            <input
              type="number"
              name="priceOther"
              placeholder="Enter price for other cities"
              value={product.priceOther}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label className="text-gray-700 font-medium mb-1 sm:mb-2">Inventory</label>
            <input
              type="number"
              name="inventory"
              placeholder="Enter inventory"
              value={product.inventory}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label className="text-gray-700 font-medium mb-1 sm:mb-2">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={product.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
