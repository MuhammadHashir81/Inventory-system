import React, { useState, useContext } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { AdminProductsContext } from "../../Components/Context/AdminProductsProvider";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

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
  const { products, deleteProduct, updateProduct } = useContext(AdminProductsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Modals ---
  const openEditModal = (product) => {
    setSelectedProduct(product);
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
    await updateProduct(selectedProduct._id, {
      name: selectedProduct.name,
      category: selectedProduct.category,
      description: selectedProduct.description,
      price: parseFloat(selectedProduct.price),
      inventory: parseInt(selectedProduct.inventory),
    });
    closeEditModal();
  };

  const handleDelete = async () => {
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

      {/* Table for md+ screens */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full border-collapse text-left text-sm sm:text-base min-w-[600px]">
          <thead>
            <tr className="bg-blue-50 text-gray-700 uppercase text-xs sm:text-sm tracking-wider">
              <th className="px-4 sm:px-6 py-2 rounded-tl-lg">ID</th>
              <th className="px-4 sm:px-6 py-2">Name</th>
              <th className="px-4 sm:px-6 py-2">Category</th>
              <th className="px-4 sm:px-6 py-2">Price</th>
              <th className="px-4 sm:px-6 py-2">Stock</th>
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
                <td className="px-4 sm:px-6 py-2 text-gray-600">Rs. {product.price}</td>
                <td className="px-4 sm:px-6 py-2 text-gray-600">{product.inventory}</td>
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
        {filteredProducts.map((product, index) => (
          <div key={product._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
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
              <div><strong>Price:</strong> Rs. {product.price}</div>
              <div><strong>Stock:</strong> {product.inventory}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm sm:text-base px-2">
          No products found matching “{searchTerm}”
        </div>
      )}

      {/* --- Edit Modal --- */}
      <Modal open={isEditModalOpen} onClose={closeEditModal}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Edit Product
          </Typography>
          {selectedProduct && (
            <Stack spacing={2}>
              <TextField
                label="Name"
                name="name"
                value={selectedProduct.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Category"
                name="category"
                value={selectedProduct.category}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={selectedProduct.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={selectedProduct.price}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Inventory"
                name="inventory"
                type="number"
                value={selectedProduct.inventory}
                onChange={handleChange}
                fullWidth
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button variant="outlined" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdate} color="primary">
                  Save
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Modal>

      {/* --- Delete Modal --- */}
      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Confirm Delete
          </Typography>
          {selectedProduct && (
            <>
              <Typography mb={3}>
                Are you sure you want to delete <strong>{selectedProduct.name}</strong>?
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={closeDeleteModal}>
                  Cancel
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ManageProducts;
