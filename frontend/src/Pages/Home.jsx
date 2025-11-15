  import toast from "react-hot-toast";
  import { Toaster } from "react-hot-toast";
  import React, { useContext, useState, useMemo } from "react";
  import { AdminProductsContext } from "../Components/Context/AdminProductsProvider";
  import { SoldItemsContext } from "../Components/Context/SoldItemsProvider";
  import { DebtsContext } from "../Components/Context/DebtsProvider";
  import {
    Modal, Box, Typography, TextField, Button,
    ToggleButton, ToggleButtonGroup,
    Card, CardContent, CardActions, Chip,
    Divider, Snackbar, Alert, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions,
    Fade, Grow, IconButton, InputAdornment, Tooltip, Paper,
    Autocomplete
  } from "@mui/material";
  import { Package, ShoppingCart, Users, Store, MapPin, X, AlertCircle, Search, Plus, Trash2 } from "lucide-react";

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
    outline: "none",
    padding: 3
  };

  const Home = () => {
    const { products, sellProducts } = useContext(AdminProductsContext);
    const { fetchSoldItems } = useContext(SoldItemsContext);
    const { fetchDebts } = useContext(DebtsContext);

    // Cart items state - array of products with quantities
    const [cartItems, setCartItems] = useState([]);
    const [saleType, setSaleType] = useState("full");
    const [paidAmount, setPaidAmount] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [shopName, setShopName] = useState("");
    const [city, setCity] = useState("johrabad");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [batchNo, setBatchNo] = useState("");

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", onConfirm: null });

    const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
    const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });
    const showConfirmDialog = (title, message, onConfirm) => setConfirmDialog({ open: true, title, message, onConfirm });
    const closeConfirmDialog = () => setConfirmDialog({ ...confirmDialog, open: false });

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return products;

      const query = searchQuery.toLowerCase();
      return products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }, [products, searchQuery]);

    const openSellModal = (product) => {
      // Initialize cart with selected product
      setCartItems([{ product, quantity: 1 }]);
      setSaleType("full");
      setPaidAmount("");
      setCustomerName("");
      setShopName("");
      setCity("johrabad");
      setBatchNo(product.batchNo || "");
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setTimeout(() => {
        setCartItems([]);
      }, 300);
    };

    const addProductToCart = () => {
      // Add empty slot for user to select product
      setCartItems([...cartItems, { product: null, quantity: 1 }]);
    };

    const removeFromCart = (index) => {
      const newCart = cartItems.filter((_, i) => i !== index);
      setCartItems(newCart);
      if (newCart.length === 0) {
        closeModal();
      }
    };

    const updateCartQuantity = (index, quantity) => {
      const newCart = [...cartItems];
      newCart[index].quantity = Math.max(1, Number(quantity) || 1);
      setCartItems(newCart);
    };

    const selectProductForCart = (index, selectedProduct) => {
      if (!selectedProduct) return;

      // Check if product already in cart
      const alreadyInCart = cartItems.some((item, i) =>
        i !== index && item.product?._id === selectedProduct._id
      );

      if (alreadyInCart) {
        toast.error("Product already in cart");
        return;
      }

      const newCart = [...cartItems];
      newCart[index].product = selectedProduct;
      setCartItems(newCart);
    };

    const getStockStatus = (inventory) => {
      if (inventory > 10) return { label: "In Stock", color: "success", icon: "✓" };
      if (inventory > 0) return { label: "Low Stock", color: "warning", icon: "!" };
      return { label: "Out of Stock", color: "error", icon: "✕" };
    };

    const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
        if (!item.product) return total;
        const unitPrice = city === "johrabad"
          ? item.product.price?.johrabad ?? 0
          : item.product.price?.other ?? 0;
        return total + (unitPrice * item.quantity);
      }, 0);
    };

    const calculateRemaining = () => {
      const total = calculateTotal();
      const paid = Number(paidAmount) || 0;
      return Math.max(0, total - paid);
    };

    const handleSell = async () => {
      // Validate cart
      if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      // Check if all items have products selected
      const hasEmptySlots = cartItems.some(item => !item.product);
      if (hasEmptySlots) {
        toast.error("Please select products for all items");
        return;
      }

      // Validate quantities and inventory
      for (const item of cartItems) {
        if (item.quantity <= 0) {
          toast.error(`Quantity for ${item.product.name} must be at least 1`);
          return;
        }
        if (item.product.inventory < item.quantity) {
          toast.error(`Not enough inventory for ${item.product.name}`);
          return;
        }
      }

      const totalPrice = calculateTotal();

      // Inside handleSell function - FULL PAYMENT section
      if (saleType === "full") {
        if (!customerName) {
          toast.error("Provide customer name");
          return;
        }

        const itemsList = cartItems.map(item =>
          `${item.product.name} (${item.quantity}x)`
        ).join(", ");

        showConfirmDialog(
          "Confirm Full Payment Sale",
          `Sell ${cartItems.length} product(s): ${itemsList} for Rs. ${totalPrice.toLocaleString()} (${city}) to ${customerName}?`,
          async () => {
            const orderData = {
              type: "full",
              items: cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                batchNo: item.product.batchNo || "", // Get from product, not order level
              })),
              paidAmount: totalPrice,
              customerName,
              shopName,
              city,
            };

            const res = await sellProducts(orderData);
            if (res.success) {
              await fetchSoldItems();
              toast.success("Sold successfully!");
              closeModal();
            } else {
              toast.error(res.message || "Error recording sale");
            }
          }
        );
      } else {
        // PARTIAL PAYMENT section
        if (!customerName || paidAmount === "") {
          toast.error("Provide customer name and paid amount");
          return;
        }

        const paid = Number(paidAmount);
        if (paid > totalPrice) {
          toast.error(`Paid cannot exceed Rs. ${totalPrice.toLocaleString()}`);
          return;
        }

        const itemsList = cartItems.map(item =>
          `${item.product.name} (${item.quantity}x)`
        ).join(", ");

        showConfirmDialog(
          "Confirm Partial Payment Sale",
          `Sell ${cartItems.length} product(s): ${itemsList} with Rs. ${paid.toLocaleString()} paid and Rs. ${(totalPrice - paid).toLocaleString()} pending for ${customerName}?`,
          async () => {
            const orderData = {
              type: "partial",
              items: cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                batchNo: item.product.batchNo || "", // Get from product, not order level
              })),
              paidAmount: paid,
              customerName,
              shopName,
              city,
            };

            const res = await sellProducts(orderData);
            if (res.success) {
              await fetchSoldItems();
              fetchDebts();
              toast.success("Partial sale recorded!");
              closeModal();
            } else {
              toast.error(res.message || "Error recording sale");
            }
          }
        );
      }
    };

    const availableProducts = products.filter(p => p.inventory > 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <Toaster />

          {/* Header Section */}
          <Fade in timeout={600}>
            <Typography
              variant="h3"
              className="font-bold pb-2 bg-clip-text text-center text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 "
              sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Products Overview
            </Typography>
          </Fade>

          {/* Search Bar */}
          {products.length > 0 && (
            <Fade in timeout={800}>
              <div className="max-w-2xl mx-auto mb-12">
                <TextField
                  fullWidth
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="w-5 h-5 text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery("")}
                          edge="end"
                        >
                          <X className="w-4 h-4" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
                      }
                    }
                  }}
                />
                {searchQuery && (
                  <Typography variant="body2" className="text-gray-600 mt-3 text-center">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </Typography>
                )}

                {/* Stats Bar */}
                {products.length > 0 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Chip
                      label={`${products.length} Products`}
                      sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'rgb(37, 99, 235)', fontWeight: 600, px: 1, fontSize: '0.875rem' }}
                    />
                    <Chip
                      label={`${products.filter(p => p.inventory > 0).length} In Stock`}
                      sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)', fontWeight: 600, px: 1, fontSize: '0.875rem' }}
                    />
                    <Chip
                      label={`${products.filter(p => p.inventory === 0).length} Out of Stock`}
                      sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(220, 38, 38)', fontWeight: 600, px: 1, fontSize: '0.875rem' }}
                    />
                  </div>
                )}

              </div>

            </Fade>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <Fade in timeout={800}>
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6 shadow-inner">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <Typography variant="h5" className="text-gray-700 mb-2 font-semibold">No Products Available</Typography>
                <Typography variant="body1" className="text-gray-500">Add products to get started with selling</Typography>
              </div>
            </Fade>
          ) : filteredProducts.length === 0 ? (
            <Fade in timeout={800}>
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6 shadow-inner">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <Typography variant="h5" className="text-gray-700 mb-2 font-semibold">No Products Found</Typography>
                <Typography variant="body1" className="text-gray-500">Try searching with different keywords</Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSearchQuery("")}
                  sx={{ mt: 3, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Clear Search
                </Button>
              </div>
            </Fade>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.inventory);
                return (
                  <Grow in timeout={400 + index * 100} key={product._id}>
                    <Card
                      className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                      sx={{ borderRadius: 4, border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', '&:hover': { borderColor: 'rgba(59, 130, 246, 0.3)' } }}
                    >
                      <CardContent className="relative p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 mr-3">
                            <Typography variant="h6" className="!font-bold text-gray-900 mb-2 line-clamp-1" sx={{ fontSize: '1.125rem' }}>
                              {product.name}
                            </Typography>
                          </div>
                          <Tooltip title={`${product.inventory} units available`} arrow>
                            <Chip label={stockStatus.label} color={stockStatus.color} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', height: '24px', '& .MuiChip-label': { px: 1.5 } }} />
                          </Tooltip>
                        </div>
                        <Typography  className="text-gray-600 line-clamp-2 !text-[12px] mb-1">
                          {product.description}
                        </Typography>
                        <div className="inline-flex items-center gap-2 px-2 py-1.5 bg-gray-50 mt-4 mb-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <Typography variant="caption" className="text-gray-700 font-semibold !text-[10px]">
                            {product.inventory} units available
                          </Typography>
                        </div>
                        <div className=" p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md border border-blue-100">
                          <div className="flex items-center justify-between ">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              <Typography variant="caption" className="text-gray-700 font-semibold">
                                Johrabad
                              </Typography>
                            </div>
                            <Typography variant="h6" className="font-bold text-blue-600 !text-xs">
                              Rs. {(product.price?.johrabad ?? 0).toLocaleString()}
                            </Typography>
                          </div>
                          <div className="flex items-center justify-between mb-1 pb-1 border-b border-blue-100">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                              <Typography variant="caption" className="text-gray-700 font-semibold">
                                Other Cities
                              </Typography>
                            </div>
                            <Typography variant="h6" className="font-bold text-indigo-600 !text-xs">
                              Rs. {(product.price?.other ?? 0).toLocaleString()}
                            </Typography>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Typography variant="caption" className="text-gray-700 font-semibold !text-xs">
                                Batch No
                              </Typography>
                            </div>
                            <Typography variant="h6" className="font-bold text-indigo-600 !text-xs">
                              {product.batchNo || 'N/A'}
                            </Typography>
                          </div>
                        </div>
                      </CardContent>
                      <CardActions className="p-4 pt-0">
                        {product.inventory > 0 ? (
                          <Button
                            variant="contained"
                            onClick={() => openSellModal(product)}
                            fullWidth
                            startIcon={<ShoppingCart className="w-4 h-4" />}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '0.95rem',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                              }
                            }}
                          >
                            Sell Product
                          </Button>
                        ) : (
                          <Button variant="outlined" fullWidth disabled sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' }}>
                            Out of Stock
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grow>
                );
              })}
            </div>
          )}
        </div>

          {/* Sell Modal with Cart */}
          <Modal
            open={isModalOpen}
            onClose={closeModal}
            closeAfterTransition
            sx={{
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)'
              }
            }}
          >
            <Fade in={isModalOpen}>
              <Box sx={modalStyle}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                      Create Sale Order
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Add multiple products to the cart
                    </Typography>
                  </div>
                  <IconButton onClick={closeModal} size="small" sx={{ color: 'gray' }}>
                    <X className="w-5 h-5" />
                  </IconButton>
                </div>

                {/* Cart Items */}
                <div className="mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Autocomplete
                            fullWidth
                            size="small"
                            options={availableProducts}
                            getOptionLabel={(option) => `${option.name} (Stock: ${option.inventory})`}
                            value={item.product}
                            onChange={(e, newValue) => selectProductForCart(index, newValue)}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Product" placeholder="Search products..." />
                            )}
                          />
                        </div>
                        <TextField
                          type="number"
                          size="small"
                          label="Qty"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(index, e.target.value)}
                          sx={{ width: 80 }}
                          inputProps={{ min: 1, max: item.product?.inventory || 999 }}
                        />

                        
                        <IconButton
                          onClick={() => removeFromCart(index)}
                          color="error"
                          size="small"
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </div>
                      {item.product && (
                        <div>
                          <Typography variant="caption" className="text-gray-600 mt-2 block">
                            Price: Rs. {(city === "johrabad" ? item.product.price?.johrabad : item.product.price?.other).toLocaleString()} × {item.quantity} = Rs. {((city === "johrabad" ? item.product.price?.johrabad : item.product.price?.other) * item.quantity).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" className="text-gray-600 block mt-1">
                            Batch No: {item.product.batchNo || 'N/A'}
                          </Typography>
                        </div>
                      )}
                    </Paper>
                  ))}
                </div>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={addProductToCart}
                  startIcon={<Plus className="w-4 h-4" />}
                  sx={{ mb: 3, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Add Another Product
                </Button>

                <Divider sx={{ my: 3 }} />

                <ToggleButtonGroup
                  value={saleType}
                  exclusive
                  onChange={(e, value) => value && setSaleType(value)}
                  fullWidth
                  sx={{
                    mb: 3,
                    '& .MuiToggleButton-root': {
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                        }
                      }
                    }
                  }}
                >
                  <ToggleButton value="full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Full Payment
                  </ToggleButton>
                  <ToggleButton value="partial">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Pending Payment
                  </ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  label="City"
                  select
                  fullWidth
                  sx={{ mb: 2.5 }}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  SelectProps={{ native: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin className="w-4 h-4 text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <option value="johrabad">Johrabad</option>
                  <option value="other">Other Cities</option>
                </TextField>

                <TextField
                  label="Customer Name"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Users className="w-4 h-4 text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Shop Name (Optional)"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Store className="w-4 h-4 text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Batch No"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Package className="w-4 h-4 text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />

                {saleType === "partial" && (
                  <Fade in>
                    <TextField
                      label="Paid Amount"
                      type="number"
                      fullWidth
                      sx={{ mb: 2.5 }}
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="body2" className="text-gray-600 font-semibold">
                              Rs.
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Fade>
                )}

                <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="body2" className="text-gray-700 font-medium">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" className="font-bold text-gray-900">
                      Rs. {calculateTotal().toLocaleString()}
                    </Typography>
                  </div>
                  {saleType === "partial" && paidAmount && (
                    <Fade in>
                      <div>
                        <Divider sx={{ my: 1.5 }} />
                        <div className="flex items-center justify-between mb-2">
                          <Typography variant="body2" className="text-green-700 font-medium">
                            Paid Amount
                          </Typography>
                          <Typography variant="body1" className="font-bold text-green-600">
                            Rs. {Number(paidAmount).toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex items-center justify-between">
                          <Typography variant="body2" className="text-red-700 font-medium">
                            Remaining
                          </Typography>
                          <Typography variant="body1" className="font-bold text-red-600">
                            Rs. {calculateRemaining().toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                    </Fade>
                  )}
                </div>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSell}
                  sx={{
                    mt: 3,
                    py: 1.75,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                    }
                  }}
                >
                  Confirm Sale
                </Button>
              </Box>
            </Fade>
          </Modal>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={closeSnackbar} sx={{ borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontWeight: 500 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog open={confirmDialog.open} onClose={closeConfirmDialog} PaperProps={{ sx: { borderRadius: 3, minWidth: '400px', maxWidth: '90%' } }}>
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
            {confirmDialog.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
              {confirmDialog.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={closeConfirmDialog} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button onClick={() => { confirmDialog.onConfirm(); closeConfirmDialog(); }} variant="contained" sx={{
              textTransform: 'none', fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }
            }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  export default Home;