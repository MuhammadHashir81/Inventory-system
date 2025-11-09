import { useContext } from "react";
import { SoldItemsContext } from "../../Components/Context/SoldItemsProvider";

const TotalSales = () => {
  const { soldItems, fetchSoldItems } = useContext(SoldItemsContext);

  // Calculate totals
  const totalSalesAmount = soldItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalPaidAmount = soldItems.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const totalRemaining = soldItems.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);

  const downloadInvoicePDF = (item) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, canvas.width, 120);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('INVOICE', 50, 70);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 600, 70);

    // Invoice Details
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('CUSTOMER INFORMATION', 50, 170);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Customer: ${item.customerName || 'Unknown'}`, 50, 210);
    ctx.fillText(`Shop: ${item.shopName || 'N/A'}`, 50, 240);
    ctx.fillText(`City: ${item.city}`, 50, 270);

    // Product Details
    ctx.font = 'bold 20px Arial';
    ctx.fillText('PRODUCT DETAILS', 50, 330);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Product: ${item.productName}`, 50, 370);
    ctx.fillText(`Quantity: ${item.quantity}`, 50, 400);
    ctx.fillText(`Price per Unit: $${item.pricePerUnit.toFixed(2)}`, 50, 430);

    // Line separator
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 460);
    ctx.lineTo(750, 460);
    ctx.stroke();

    // Payment Information
    ctx.font = 'bold 20px Arial';
    ctx.fillText('PAYMENT INFORMATION', 50, 510);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Total Amount: $${item.totalAmount.toFixed(2)}`, 50, 550);
    ctx.fillStyle = '#059669';
    ctx.fillText(`Paid Amount: $${item.paidAmount.toFixed(2)}`, 50, 580);
    ctx.fillStyle = '#dc2626';
    ctx.fillText(`Remaining: $${item.remainingAmount.toFixed(2)}`, 50, 610);

    // Status
    ctx.fillStyle = item.isDebtCleared ? '#059669' : '#f59e0b';
    ctx.fillRect(50, 650, 150, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(item.isDebtCleared ? 'PAID' : 'PENDING', 70, 677);

    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.fillText('Thank you for your business!', 50, 900);
    ctx.fillText(`Invoice ID: ${item._id}`, 50, 930);

    // Convert to PDF and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${item.customerName}_${item._id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 truncate">{item.productName}</h3>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.isDebtCleared ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {item.isDebtCleared ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadInvoicePDF(item)}
                    className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-sm transition-all border border-gray-200"
                    title="Download Invoice"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
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