// ManageProducts.jsx
import React, { useState, useContext, useEffect } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { AdminProductsContext } from "../../Components/Context/AdminProductsProvider";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const ManageProducts = () => {
  const { products, fetchProducts, deleteProduct, updateProduct } = useContext(AdminProductsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Modals ---
  const openEditModal = (product) => {
    setSelectedProduct({
      ...product,
      priceJohrabad: product.price?.johrabad || "",
      priceOther: product.price?.other || "",
      sold: product.sold || 0,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedProduct(null);
    setIsDeleteModalOpen(false);
  };

  // --- Handlers ---
  const handleChange = (e) => {
    setSelectedProduct({ ...selectedProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!selectedProduct.name || !selectedProduct.category || !selectedProduct.description) {
      alert("All fields are required");
      return;
    }

    await updateProduct(selectedProduct._id, {
      name: selectedProduct.name,
      category: selectedProduct.category,
      description: selectedProduct.description,
      priceJohrabad: parseFloat(selectedProduct.priceJohrabad),
      priceOther: parseFloat(selectedProduct.priceOther),
      inventory: parseInt(selectedProduct.inventory),
      sold: parseInt(selectedProduct.sold),
    });

    closeEditModal();
  };

  const handleDelete = async () => {
    console.log("hahir")
    await deleteProduct(selectedProduct._id);
    closeDeleteModal();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Products</h2>
        <div className="relative w-full sm:w-64 sm:ml-auto">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table view for desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full border-collapse text-left text-sm sm:text-base min-w-[1000px]">
          <thead>
            <tr className="bg-blue-50 text-gray-700 uppercase text-xs sm:text-sm tracking-wider">
              <th className="px-4 sm:px-6 py-2 rounded-tl-lg">#</th>
              <th className="px-4 sm:px-6 py-2">Name</th>
              <th className="px-4 sm:px-6 py-2">Category</th>
              <th className="px-4 sm:px-6 py-2">Price (Johrabad)</th>
              <th className="px-4 sm:px-6 py-2">Price (Other Cities)</th>
              <th className="px-4 sm:px-6 py-2">Stock</th>
              <th className="px-4 sm:px-6 py-2">Sold</th>
              <th className="px-4 sm:px-6 py-2 text-center rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr
                key={product._id}
                className={`border-b hover:bg-blue-50 transition-all ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 sm:px-6 py-2 text-gray-700">{index + 1}</td>
                <td className="px-4 sm:px-6 py-2 font-medium text-gray-800">{product.name}</td>
                <td className="px-4 sm:px-6 py-2 text-gray-600">{product.category}</td>
                <td className="px-4 sm:px-6 py-2 text-gray-600">
                  Rs. {product.price?.johrabad ?? "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-2 text-gray-600">
                  Rs. {product.price?.other ?? "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-2 text-gray-600">{product.inventory}</td>
                <td className="px-4 sm:px-6 py-2 text-gray-600">{product.sold ?? 0}</td>
                <td className="px-2 sm:px-6 py-2 text-center flex justify-center gap-2 sm:gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition-all"
                    onClick={() => openEditModal(product)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition-all"
                    onClick={() => openDeleteModal(product)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{product.name}</span>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800 transition-all"
                  onClick={() => openEditModal(product)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition-all"
                  onClick={() => openDeleteModal(product)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-gray-600 text-sm space-y-1">
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>Price (Johrabad):</strong> Rs. {product.price?.johrabad ?? "N/A"}</div>
              <div><strong>Price (Other):</strong> Rs. {product.price?.other ?? "N/A"}</div>
              <div><strong>Stock:</strong> {product.inventory}</div>
              <div><strong>Sold:</strong> {product.sold ?? 0}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm sm:text-base px-2">
          No products found matching “{searchTerm}”
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={closeEditModal}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Edit Product</Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={selectedProduct?.name || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Category"
              name="category"
              value={selectedProduct?.category || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={selectedProduct?.description || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Price (Johrabad)"
              name="priceJohrabad"
              type="number"
              value={selectedProduct?.priceJohrabad || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Price (Other Cities)"
              name="priceOther"
              type="number"
              value={selectedProduct?.priceOther || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Inventory"
              name="inventory"
              type="number"
              value={selectedProduct?.inventory || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Sold"
              name="sold"
              type="number"
              value={selectedProduct?.sold || 0}
              onChange={handleChange}
              fullWidth
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={closeEditModal}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdate}>Update</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Confirm Delete</Typography>
          <Typography mb={3}>
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={closeDeleteModal}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageProducts;
