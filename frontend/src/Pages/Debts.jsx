import React, { useContext, useState, useMemo } from "react";
import { DebtsContext } from "../Components/Context/DebtsProvider";
import {
  Card, CardContent, Typography, Button, Chip, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Box, Divider, IconButton, InputAdornment,
  Fade, Grow, Avatar, CircularProgress, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import {
  CreditCard, User, Store, MapPin, Calendar, DollarSign,
  CheckCircle, AlertCircle, Trash2, Search, Package, TrendingUp, Filter
} from "lucide-react";

const Debts = () => {
  const { debts, loading, clearDebt, makePartialPayment, deleteDebt } = useContext(DebtsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", debt: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => 
    setSnackbar({ open: true, message, severity });

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Filter and search debts
  const filteredDebts = useMemo(() => {
    let filtered = debts;

    // Filter by status
    if (filterStatus === "pending") {
      filtered = filtered.filter(d => !d.isCleared);
    } else if (filterStatus === "cleared") {
      filtered = filtered.filter(d => d.isCleared);
    }

    // Search by customer name or shop name
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [debts, searchQuery, filterStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const pending = debts.filter(d => !d.isCleared).length;
    const cleared = debts.filter(d => d.isCleared).length;
    return { total, pending, cleared };
  }, [debts]);

  const handleClearDebt = async (debtId) => {
    const res = await clearDebt(debtId);
    if (res.success) {
      showSnackbar("Debt cleared successfully!", "success");
    } else {
      showSnackbar(res.message || "Failed to clear debt", "error");
    }
    setConfirmDialog({ open: false, type: "", debt: null });
  };

  const handlePartialPayment = async () => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      return showSnackbar("Please enter a valid amount", "error");
    }
    if (amount > selectedDebt.remainingAmount) {
      return showSnackbar(`Amount exceeds remaining balance (Rs. ${selectedDebt.remainingAmount})`, "error");
    }

    const res = await makePartialPayment(selectedDebt._id, amount);
    if (res.success) {
      showSnackbar("Payment recorded successfully!", "success");
      setPaymentDialog(false);
      setPaymentAmount("");
      setSelectedDebt(null);
    } else {
      showSnackbar(res.message || "Failed to record payment", "error");
    }
  };

  const handleDeleteDebt = async (debtId) => {
    const res = await deleteDebt(debtId);
    if (res.success) {
      showSnackbar("Debt deleted successfully!", "success");
    } else {
      showSnackbar(res.message || "Failed to delete debt", "error");
    }
    setConfirmDialog({ open: false, type: "", debt: null });
  };

  const openPaymentDialog = (debt) => {
    setSelectedDebt(debt);
    setPaymentAmount("");
    setPaymentDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Header */}
        <Fade in timeout={600}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl mb-6 shadow-xl">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <Typography 
              variant="h3" 
              className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-red-900 to-pink-900 mb-3"
              sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Debt Management
            </Typography>
            <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
              Track and manage customer debts and pending payments
            </Typography>
          </div>
        </Fade>

        {/* Statistics Cards */}
        <Fade in timeout={800}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      Total Outstanding
                    </Typography>
                    <Typography variant="h4" className="font-bold text-red-600">
                      Rs. {stats.total.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      Pending Debts
                    </Typography>
                    <Typography variant="h4" className="font-bold text-orange-600">
                      {stats.pending}
                    </Typography>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      Cleared Debts
                    </Typography>
                    <Typography variant="h4" className="font-bold text-green-600">
                      {stats.cleared}
                    </Typography>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Fade>

        {/* Filters and Search */}
        <Fade in timeout={1000}>
          <Card sx={{ borderRadius: 4, mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <TextField
                  placeholder="Search by customer, shop, or product..."
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="w-5 h-5 text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: 3 }
                  }}
                />
                <ToggleButtonGroup
                  value={filterStatus}
                  exclusive
                  onChange={(e, value) => value && setFilterStatus(value)}
                  sx={{ 
                    minWidth: '300px',
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      px: 3
                    }
                  }}
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="pending">Pending</ToggleButton>
                  <ToggleButton value="cleared">Cleared</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </CardContent>
          </Card>
        </Fade>

        {/* Debts List */}
        {filteredDebts.length === 0 ? (
          <Fade in timeout={1200}>
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <Typography variant="h5" className="text-gray-700 mb-2 font-semibold">
                {searchQuery || filterStatus !== "all" ? "No debts match your filters" : "No Debts Found"}
              </Typography>
              <Typography variant="body1" className="text-gray-500">
                {searchQuery || filterStatus !== "all" ? "Try adjusting your search or filters" : "All customer payments are up to date"}
              </Typography>
            </div>
          </Fade>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredDebts.map((debt, index) => (
              <Grow in timeout={400 + index * 100} key={debt._id}>
                <Card 
                  className="group hover:shadow-2xl transition-all duration-300"
                  sx={{ 
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: debt.isCleared ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Status Indicator */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      debt.isCleared ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                  />

                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Left Section - Customer Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar 
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            bgcolor: debt.isCleared ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: debt.isCleared ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
                          }}
                        >
                          <User className="w-7 h-7" />
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Typography variant="h6" className="font-bold text-gray-900">
                              {debt.customerName}
                            </Typography>
                            <Chip 
                              label={debt.isCleared ? "Cleared" : "Pending"} 
                              size="small"
                              color={debt.isCleared ? "success" : "error"}
                              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <Typography variant="body2" className="text-gray-700">
                                <span className="font-semibold">{debt.productName}</span> × {debt.quantity}
                              </Typography>
                            </div>
                            
                            {debt.shopName && (
                              <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-gray-500" />
                                <Typography variant="body2" className="text-gray-700">
                                  {debt.shopName}
                                </Typography>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <Typography variant="body2" className="text-gray-700 capitalize">
                                {debt.city === "johrabad" ? "Johrabad" : "Other Cities"}
                              </Typography>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <Typography variant="body2" className="text-gray-700">
                                {new Date(debt.createdAt).toLocaleDateString()}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Financial Info */}
                      <div className="flex flex-col gap-4 lg:min-w-[280px]">
                        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <Typography variant="caption" className="text-gray-600 font-medium">
                              Total Amount
                            </Typography>
                            <Typography variant="body1" className="font-bold text-gray-900">
                              Rs. {debt.totalAmount.toLocaleString()}
                            </Typography>
                          </div>
                          <Divider sx={{ my: 1 }} />
                          <div className="flex justify-between items-center mb-2">
                            <Typography variant="caption" className="text-green-600 font-medium">
                              Paid
                            </Typography>
                            <Typography variant="body1" className="font-bold text-green-600">
                              Rs. {debt.paidAmount.toLocaleString()}
                            </Typography>
                          </div>
                          <Divider sx={{ my: 1 }} />
                          <div className="flex justify-between items-center">
                            <Typography variant="caption" className="text-red-600 font-medium">
                              Balance
                            </Typography>
                            <Typography variant="h6" className="font-bold text-red-600">
                              Rs. {debt.remainingAmount.toLocaleString()}
                            </Typography>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {!debt.isCleared && (
                          <div className="flex gap-2">
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => openPaymentDialog(debt)}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                }
                              }}
                            >
                              Add Payment
                            </Button>
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => setConfirmDialog({ 
                                open: true, 
                                type: "clear", 
                                debt 
                              })}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                minWidth: 'auto',
                                px: 2
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        
                        {debt.isCleared && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => setConfirmDialog({ 
                              open: true, 
                              type: "delete", 
                              debt 
                            })}
                            startIcon={<Trash2 className="w-4 h-4" />}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Delete Record
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialog} 
        onClose={() => setPaymentDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: '400px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Record Payment</DialogTitle>
        <DialogContent>
          {selectedDebt && (
            <>
              <Typography variant="body2" className="text-gray-600 mb-4">
                Customer: <span className="font-semibold text-gray-900">{selectedDebt.customerName}</span>
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-4">
                Remaining Balance: <span className="font-bold text-red-600">Rs. {selectedDebt.remainingAmount.toLocaleString()}</span>
              </Typography>
              <TextField
                label="Payment Amount"
                type="number"
                fullWidth
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body2" className="font-semibold">Rs.</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setPaymentDialog(false)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handlePartialPayment}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            }}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, type: "", debt: null })}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {confirmDialog.type === "clear" ? "Clear Debt" : "Delete Debt Record"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="text-gray-700">
            {confirmDialog.type === "clear" 
              ? `Are you sure you want to mark this debt as fully paid for ${confirmDialog.debt?.customerName}?`
              : `Are you sure you want to delete this debt record for ${confirmDialog.debt?.customerName}? This action cannot be undone.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setConfirmDialog({ open: false, type: "", debt: null })}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            color={confirmDialog.type === "clear" ? "success" : "error"}
            onClick={() => {
              if (confirmDialog.type === "clear") {
                handleClearDebt(confirmDialog.debt._id);
              } else {
                handleDeleteDebt(confirmDialog.debt._id);
              }
            }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {confirmDialog.type === "clear" ? "Clear Debt" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default Debts;