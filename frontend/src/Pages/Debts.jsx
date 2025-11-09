import React, { useContext, useState, useMemo } from "react";
import { DebtsContext } from "../Components/Context/DebtsProvider";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Debts = () => {
  const { debts, loading, makePayment } = useContext(DebtsContext);
  const [paymentInput, setPaymentInput] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Filter debts based on search query
  const filteredDebts = useMemo(() => {
    if (!searchQuery.trim()) return debts;
    
    const query = searchQuery.toLowerCase().trim();
    return debts.filter(debt => {
      const customerName = (debt.customerName || "").toLowerCase();
      const productName = (debt.productName || "").toLowerCase();
      
      return customerName.includes(query) || productName.includes(query);
    });
  }, [debts, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse text-lg text-gray-700">Loading debts...</div>
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M5 8h14M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Debts Found</h2>
          <p className="text-gray-500">All customers have cleared their dues.</p>
        </div>
      </div>
    );
  }

  const handlePayment = async (id) => {
    const amount = Number(paymentInput[id]);
    if (!amount || amount <= 0) return;
    const res = await makePayment(id, amount);
    if (res.success) {
      toast.success("Payment updated successfully!");
      setPaymentInput((prev) => ({ ...prev, [id]: "" }));
    } else {
      toast.error("Failed to update payment!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      <div className="container mx-auto max-w-7xl">
        <Toaster/>
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Customer Debts Overview</h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by customer name or product..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Found {filteredDebts.length} result{filteredDebts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {filteredDebts.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h2>
            <p className="text-gray-500 mb-4">Try searching with different keywords</p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDebts.map((debt) => (
              <div
                key={debt._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Customer Name: {debt.customerName || "Unknown"}</h2>
                  <h3 className="text-sm text-gray-600 mt-1">{debt.productName || "Unknown Product"}</h3>
                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      debt.isCleared ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                    }`}
                  >
                    {debt.isCleared ? "✓ Paid" : "⏳ Pending"}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="font-bold text-gray-800">{debt.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Paid</span>
                    <span className="font-semibold text-green-600">{debt.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                    <span className="text-sm text-gray-500">Remaining</span>
                    <span className="font-semibold text-red-600">{debt.remainingAmount.toFixed(2)}</span>
                  </div>

                  {!debt.isCleared && (
                    <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <label className="block text-sm text-gray-600 mb-2">Enter Payment Amount</label>
                      <input
                        type="number"
                        placeholder="e.g. 100"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={paymentInput[debt._id] || ""}
                        onChange={(e) =>
                          setPaymentInput((prev) => ({
                            ...prev,
                            [debt._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                        onClick={() => handlePayment(debt._id)}
                      >
                        Make Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Debts;