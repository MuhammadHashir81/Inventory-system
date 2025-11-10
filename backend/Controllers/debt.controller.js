import { Debt } from "../Models/debt.schema.js";
import { SoldItem } from "../Models/soldItem.schema.js";
export const getDebts = async (req, res) => {
  try {
    const debts = await Debt.find()
      .sort({ createdAt: -1 })
      .populate("items.productId", "name");
    
    res.status(200).json({ 
      success: true, 
      debts 
    });
  } catch (error) {
    console.error("Error fetching debts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching debts", 
      error: error.message 
    });
  }
};

// Update payment and auto-delete if fully paid
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    let { payment } = req.body;

    const debt = await Debt.findById(id);
    if (!debt) {
      return res.status(404).json({ 
        success: false, 
        message: "Debt not found" 
      });
    }

    // Cap payment to remaining amount
    if (payment > debt.remainingAmount) {
      payment = debt.remainingAmount;
    }

    debt.paidAmount = parseFloat((debt.paidAmount + payment).toFixed(2));
    debt.remainingAmount = parseFloat((debt.totalAmount - debt.paidAmount).toFixed(2));
    debt.payments.push({ amount: payment });

    // Check if debt is cleared
    if (debt.remainingAmount <= 0.01) {
      debt.remainingAmount = 0;
      debt.isCleared = true;

      // Update corresponding sold item
      if (debt.soldItemId) {
        await SoldItem.findByIdAndUpdate(debt.soldItemId, {
          isDebtCleared: true,
          remainingAmount: 0,
          paidAmount: debt.totalAmount,
        });
      }

      // Delete the debt record
      await Debt.findByIdAndDelete(id);
      
      return res.status(200).json({
        success: true,
        message: "Payment completed & debt removed",
        debt: null,
      });
    } else {
      // Update corresponding sold item
      if (debt.soldItemId) {
        await SoldItem.findByIdAndUpdate(debt.soldItemId, {
          paidAmount: debt.paidAmount,
          remainingAmount: debt.remainingAmount,
        });
      }

      await debt.save();
      
      res.status(200).json({ 
        success: true, 
        message: "Payment updated", 
        debt 
      });
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating payment", 
      error: error.message 
    });
  }
};

// Delete debt manually
export const deleteDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const debt = await Debt.findById(id);
    
    if (!debt) {
      return res.status(404).json({ 
        success: false, 
        message: "Debt not found" 
      });
    }

    // Update corresponding sold item
    if (debt.soldItemId) {
      await SoldItem.findByIdAndUpdate(debt.soldItemId, {
        $unset: { remainingAmount: "", paidAmount: "", isDebtCleared: "" },
      });
    }

    await Debt.findByIdAndDelete(id);
    
    res.status(200).json({ 
      success: true, 
      message: "Debt deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting debt:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting debt", 
      error: error.message 
    });
  }
};