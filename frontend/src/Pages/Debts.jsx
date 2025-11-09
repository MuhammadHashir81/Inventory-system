import React, { useContext, useState } from "react";
import { DebtsContext } from "../Components/Context/DebtsProvider";

const Debts = () => {
  const { debts, loading, makePayment } = useContext(DebtsContext);
  const [paymentInput, setPaymentInput] = useState({});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading debts...</div>
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">No debts found</div>
      </div>
    );
  }

  const handlePayment = async (id) => {
    const amount = Number(paymentInput[id]);
    if (!amount || amount <= 0) return;

    const res = await makePayment(id, amount);
    if (res.success) {
      alert("Payment updated successfully!");
      setPaymentInput((prev) => ({ ...prev, [id]: "" }));
    } else {
      alert("Failed to update payment!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Debts</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {debts.map((debt) => (
          <div
            key={debt._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">
              Customer: {debt.customerName || "Unknown"}
            </h2>
            <h3 className="text-lg mb-4">
              Product: {debt.productName || "Unknown"}
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>${debt.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span className="text-green-600">${debt.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span>Remaining:</span>
                <span className="text-red-600 font-bold">
                  ${debt.remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {!debt.isCleared && (
              <div className="mt-4">
                <input
                  type="number"
                  placeholder="Enter payment amount"
                  className="border rounded px-2 py-1 w-full mb-2"
                  value={paymentInput[debt._id] || ""}
                  onChange={(e) =>
                    setPaymentInput((prev) => ({
                      ...prev,
                      [debt._id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded w-full"
                  onClick={() => handlePayment(debt._id)}
                >
                  Make Payment
                </button>
              </div>
            )}

            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  debt.isCleared ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {debt.isCleared ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Debts;
