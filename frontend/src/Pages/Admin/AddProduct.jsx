import axios from "axios";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState({
        name: "",
        priceJohrabad: "",
        priceOther: "",
        category: "",
        description: "",
        inventory: "",
        batchNo: "",
        costPrice: ""
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (
            !product.name ||
            !product.priceJohrabad ||
            !product.priceOther ||
            !product.inventory ||
            !product.batchNo ||
            !product.costPrice
        ) {
            toast.error("All fields are required");
            return;
        }
        try {
            const res = await axios.post(`${apiUrl}/api/admin/products/add`, product);
            toast.success(res.data.message || "Product added successfully!");
            window.scrollTo(0, 0)
            setProduct({
                name: "",
                priceJohrabad: "",
                priceOther: "",
                category: "",
                description: "",
                inventory: "",
                batchNo: "",
                costPrice: ""
            });
        } catch (error) {
            toast.error(error.response.data.message || "Failed to add product");
        }
        setLoading(false)
    };

    return (
        <div className="w-full ">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Plus size={24} className="text-blue-600" />
                    New Product
                </h2>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-blue-600 mb-4 hover:bg-blue-700 text-white !text-xs px-2 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base font-medium"

                >
                    View all products
                </button>

            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1 sm:mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={handleChange}
                        required
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
                            required
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
                            required
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className="text-gray-700 font-medium mb-1 sm:mb-2">Inventory</label>
                        <input
                            type="number"
                            name="inventory"
                            placeholder="Enter stock"
                            required
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


                    <div className="flex flex-col sm:col-span-2">
                        <label className="text-gray-700 font-medium mb-1 sm:mb-2">Cost Price</label>
                        <input
                            type="number"
                            name="costPrice"
                            placeholder="cost price"
                            required
                            value={product.costPrice}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className="text-gray-700 font-medium mb-1 sm:mb-2">Batch no</label>
                        <input
                            type="text"
                            name="batchNo"
                            placeholder="Enter batch no"
                            value={product.batchNo}

                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    disabled={loading}
                >
                  <Plus size={24} />   {loading ? "Adding..." : 'Add Product'}
                </button>
            </form>
        </div>
    );
}

export default AddProduct;
