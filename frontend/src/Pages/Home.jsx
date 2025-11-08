import React, { useContext, useState } from "react";
import { AdminProductsContext } from "../Components/Context/AdminProductsProvider";
import { SoldItemsContext } from "../Components/Context/SoldItemsProvider";
import { DebtsContext } from "../Components/Context/DebtsProvider";
import {
  Modal, Box, Typography, TextField, Button,
  ToggleButton, ToggleButtonGroup,
  Card, CardContent, CardActions, Chip,
  Divider, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  Fade, Grow, IconButton, InputAdornment, Tooltip
} from "@mui/material";
import { Package, TrendingUp, ShoppingCart, Users, Store, MapPin, X, AlertCircle } from "lucide-react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  maxWidth: "95%",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
  outline: "none",
};

const Home = () => {
  const { products, sellProduct } = useContext(AdminProductsContext);
  const { fetchSoldItems } = useContext(SoldItemsContext);
  const { fetchDebts } = useContext(DebtsContext);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleType, setSaleType] = useState("full");
  const [quantity, setQuantity] = useState(1);
  const [paidAmount, setPaidAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("johrabad");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", onConfirm: null });

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showConfirmDialog = (title, message, onConfirm) => setConfirmDialog({ open: true, title, message, onConfirm });
  const closeConfirmDialog = () => setConfirmDialog({ ...confirmDialog, open: false });

  const openSellModal = (product) => {
    setSelectedProduct(product);
    setSaleType("full");
    setQuantity(1);
    setPaidAmount("");
    setCustomerName("");
    setShopName("");
    setCity("johrabad");
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setSelectedProduct(null); };

  const getStockStatus = (inventory) => {
    if (inventory > 10) return { label: "In Stock", color: "success", icon: "✓" };
    if (inventory > 0) return { label: "Low Stock", color: "warning", icon: "!" };
    return { label: "Out of Stock", color: "error", icon: "✕" };
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const unitPrice = city === "johrabad" ? selectedProduct.price?.johrabad ?? 0 : selectedProduct.price?.other ?? 0;
    return unitPrice * (Number(quantity) || 1);
  };

  const calculateRemaining = () => {
    const total = calculateTotal();
    const paid = Number(paidAmount) || 0;
    return Math.max(0, total - paid);
  };

  const handleSell = async () => {
    if (!selectedProduct) return;
    const qty = Number(quantity) || 1;
    if (qty <= 0) return showSnackbar("Quantity must be at least 1", "error");
    if (selectedProduct.inventory < qty) return showSnackbar("Not enough inventory", "error");

    const unitPrice = city === "johrabad" ? selectedProduct.price?.johrabad ?? 0 : selectedProduct.price?.other ?? 0;
    const totalPrice = unitPrice * qty;

    if (saleType === "full") {
      showConfirmDialog(
        "Confirm Full Payment Sale",
        `Sell ${qty} unit(s) for Rs. ${totalPrice.toLocaleString()} (${city})?`,
        async () => {
          const res = await sellProduct(selectedProduct._id, { type: "full", quantity: qty, paidAmount: totalPrice, city });
          if (res.success) {
            await fetchSoldItems();
            showSnackbar("Sold successfully!", "success");
            closeModal();
          } else showSnackbar(res.message || "Error recording sale", "error");
        }
      );
    } else {
      if (!customerName || paidAmount === "") return showSnackbar("Provide customer name and paid amount", "warning");
      const paid = Number(paidAmount);
      if (paid > totalPrice) return showSnackbar(`Paid cannot exceed Rs. ${totalPrice.toLocaleString()}`, "error");

      showConfirmDialog(
        "Confirm Partial Payment Sale",
        `Sell ${qty} unit(s) with Rs. ${paid.toLocaleString()} paid and Rs. ${(totalPrice - paid).toLocaleString()} pending for ${customerName}?`,
        async () => {
          const res = await sellProduct(selectedProduct._id, {
            type: "partial", quantity: qty, paidAmount: paid, customerName, shopName, city,
          });
          if (res.success) {
            await fetchDebts();
            await fetchSoldItems();
            showSnackbar("Partial sale recorded!", "success");
            closeModal();
          } else showSnackbar(res.message || "Error recording sale", "error");
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Header Section */}
        <Fade in timeout={600}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-xl transform hover:scale-105 transition-transform">
              <Package className="w-10 h-10 text-white" />
            </div>
            <Typography 
              variant="h3" 
              className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 mb-3"
              sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Products Overview
            </Typography>
            
            {/* Stats Bar */}
            {products.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Chip 
                  label={`${products.length} Products`} 
                  sx={{ 
                    bgcolor: 'rgba(59, 130, 246, 0.1)', 
                    color: 'rgb(37, 99, 235)', 
                    fontWeight: 600,
                    px: 1,
                    fontSize: '0.875rem'
                  }} 
                />
                <Chip 
                  label={`${products.filter(p => p.inventory > 0).length} In Stock`} 
                  sx={{ 
                    bgcolor: 'rgba(34, 197, 94, 0.1)', 
                    color: 'rgb(22, 163, 74)', 
                    fontWeight: 600,
                    px: 1,
                    fontSize: '0.875rem'
                  }} 
                />
                <Chip 
                  label={`${products.filter(p => p.inventory === 0).length} Out of Stock`} 
                  sx={{ 
                    bgcolor: 'rgba(239, 68, 68, 0.1)', 
                    color: 'rgb(220, 38, 38)', 
                    fontWeight: 600,
                    px: 1,
                    fontSize: '0.875rem'
                  }} 
                />
              </div>
            )}
          </div>
        </Fade>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Fade in timeout={800}>
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6 shadow-inner">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <Typography variant="h5" className="text-gray-700 mb-2 font-semibold">No Products Available</Typography>
              <Typography variant="body1" className="text-gray-500">Add products to get started with selling</Typography>
            </div>
          </Fade>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.inventory);
              return (
                <Grow in timeout={400 + index * 100} key={product._id}>
                  <Card 
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" 
                    sx={{ 
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'rgba(0,0,0,0.06)',
                      '&:hover': {
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                      }
                    }}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />
                    
                    <CardContent className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 mr-3">
                          <Typography 
                            variant="h6" 
                            className="font-bold text-gray-900 mb-2 line-clamp-1"
                            sx={{ fontSize: '1.125rem' }}
                          >
                            {product.name}
                          </Typography>
                          {/* <Chip 
                            label={product.category} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(59, 130, 246, 0.08)', 
                              color: 'rgb(37, 99, 235)', 
                              fontWeight: 600, 
                              fontSize: '0.7rem',
                              height: '24px'
                            }} 
                          /> */}
                        </div>
                        <Tooltip title={`${product.inventory} units available`} arrow>
                          <Chip 
                            label={stockStatus.label} 
                            color={stockStatus.color} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: '24px',
                              '& .MuiChip-label': {
                                px: 1.5
                              }
                            }} 
                          />
                        </Tooltip>
                      </div>

                      {/* Description */}
                      <Typography 
                        variant="body2" 
                        className="text-gray-600 mb-4 line-clamp-2"
                        sx={{ minHeight: '40px', lineHeight: 1.5 }}
                      >
                        {product.description}
                      </Typography>

                      {/* Inventory Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg mb-4">
                        <Package className="w-4 h-4 text-gray-500" />
                        <Typography variant="caption" className="text-gray-700 font-semibold">
                          {product.inventory} units available
                        </Typography>
                      </div>

                      <Divider sx={{ my: 2 }} />

                      {/* Pricing Section */}
                      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-100">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <Typography variant="caption" className="text-gray-700 font-semibold">
                              Johrabad
                            </Typography>
                          </div>
                          <Typography variant="h6" className="font-bold text-blue-600" sx={{ fontSize: '1rem' }}>
                            Rs. {(product.price?.johrabad ?? 0).toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            <Typography variant="caption" className="text-gray-700 font-semibold">
                              Other Cities
                            </Typography>
                          </div>
                          <Typography variant="h6" className="font-bold text-indigo-600" sx={{ fontSize: '1rem' }}>
                            Rs. {(product.price?.other ?? 0).toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>

                    {/* Action Button */}
                    <CardActions className="p-4 pt-0">
                      {product.inventory > 0 ? (
                        <Button 
                          variant="contained" 
                          onClick={() => openSellModal(product)} 
                          fullWidth
                          startIcon={<ShoppingCart className="w-4 h-4" />}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
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
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          disabled
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem'
                          }}
                        >
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

      {/* Sell Modal */}
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
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                  Sell Product
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {selectedProduct?.name}
                </Typography>
              </div>
              <IconButton onClick={closeModal} size="small" sx={{ color: 'gray' }}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Payment Type Toggle */}
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

            {/* Form Fields */}
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              sx={{ mb: 2.5 }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Package className="w-4 h-4 text-gray-500" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="City"
              select
              fullWidth
              sx={{ mb: 2.5 }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              SelectProps={{
                native: true,
              }}
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

            {saleType === "partial" && (
              <Fade in>
                <div>
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
                </div>
              </Fade>
            )}

            {/* Summary Section */}
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

            {/* Action Button */}
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

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={closeSnackbar}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontWeight: 500
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirm Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={closeConfirmDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: '400px',
            maxWidth: '90%'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button 
            onClick={closeConfirmDialog}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirmDialog();
            }} 
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;