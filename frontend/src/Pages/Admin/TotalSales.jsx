import { useContext } from "react";
import { SoldItemsContext } from "../../Components/Context/SoldItemsProvider";

const TotalSales = () => {
  const { soldItems, fetchSoldItems } = useContext(SoldItemsContext);

  // Calculate totals
  const totalSalesAmount = soldItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalPaidAmount = soldItems.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const totalRemaining = soldItems.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);

  if (soldItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Total Sales</h2>
          <p className="text-gray-500 text-lg">No sales have been recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">Total Sales Overview</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">Total Sales</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{totalSalesAmount.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">Total Paid</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{totalPaidAmount.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">Remaining</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{totalRemaining.toFixed(2)}</p>
          </div>
        </div>

        {/* Sales Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {soldItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 truncate">{item.productName}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.isDebtCleared ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                }`}>
                  {item.isDebtCleared ? "✓ Paid" : "⏳ Pending"}
                </span>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="font-semibold text-gray-800">{item.customerName || "Unknown"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Shop</span>
                  <span className="font-semibold text-gray-800">{item.shopName || "N/A"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">City</span>
                  <span className="font-semibold text-gray-800">{item.city}</span>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Quantity</span>
                    <span className="font-semibold text-gray-800">{item.quantity}</span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Price/Unit</span>
                    <span className="font-semibold text-gray-800">{item.pricePerUnit.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Total Amount</span>
                    <span className="font-bold text-gray-900">{item.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Paid</span>
                    <span className="font-bold text-green-600">{item.paidAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-700">Remaining</span>
                    <span className="font-bold text-red-600">{item.remainingAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalSales;