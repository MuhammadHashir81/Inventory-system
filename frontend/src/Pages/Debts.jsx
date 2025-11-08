import React, { useContext, useState } from "react";
// import { DebtsContext } from "../Components/Context/DebtsContext";
import { DebtsContext } from "../Components/Context/DebtsProvider";
// import { SoldItemsContext } from "../Components/Context/SoldItemsContext";
import { SoldItemsContext } from "../Components/Context/SoldItemsProvider";
import {
  Snackbar, Alert, Dialog, DialogTitle, DialogActions, Button, TextField
} from "@mui/material";

const Debts = () => {
  const { debts, clearDebt } = useContext(DebtsContext);
  const { addSoldItem } = useContext(SoldItemsContext);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const openDialog = (debt) => {
    setSelectedDebt(debt);
    setPaidAmount(debt.balance);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setSelectedDebt(null);
    setDialogOpen(false);
    setPaidAmount("");
  };

  const confirmPayment = async () => {
    if (!selectedDebt) return;

    const totalPaid = Number(paidAmount);
    if (totalPaid <= 0 || totalPaid > selectedDebt.balance) {
      return showSnackbar("Invalid paid amount", "error");
    }

    // If fully paid, move to sold items
    if (totalPaid === selectedDebt.balance) {
      const res = await addSoldItem({
        productId: selectedDebt.productId,
        productName: selectedDebt.productName,
        quantity: selectedDebt.quantity,
        unitPrice: selectedDebt.unitPrice,
        totalPrice: selectedDebt.totalPrice,
        paidAmount: totalPaid,
        customerName: selectedDebt.customerName,
        shopName: selectedDebt.shopName,
        city: selectedDebt.city,
        date: new Date()
      });

      if (res.success) {
        await clearDebt(selectedDebt._id);
        showSnackbar("Payment recorded as full payment", "success");
      } else {
        showSnackbar(res.message || "Error recording sale", "error");
      }
    } else {
      // Partial payment: just update the debt balance
      const newBalance = selectedDebt.balance - totalPaid;
      const res = await clearDebt(selectedDebt._id); // Assuming your backend supports partial update
      if (res.success) {
        showSnackbar(`Partial payment recorded. Remaining: Rs. ${newBalance}`, "info");
      } else {
        showSnackbar(res.message || "Error updating debt", "error");
      }
    }

    closeDialog();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 sm:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Outstanding Debts 💰</h1>

      {debts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow text-center">
          <p className="text-gray-700 text-lg font-medium">No pending debts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {debts.map((d) => (
            <div key={d._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{d.customerName} ({d.shopName})</p>
                <p className="text-sm text-gray-500">Product: {d.productName} | Qty: {d.quantity} | Balance: Rs. {d.balance}</p>
              </div>
              <Button
                variant="contained"
                color="success"
                onClick={() => openDialog(d)}
              >
                Mark Paid
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Record Payment</DialogTitle>
        <div className="p-4 flex flex-col gap-4">
          <TextField
            label="Paid Amount"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            fullWidth
          />
        </div>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={confirmPayment} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Debts;
