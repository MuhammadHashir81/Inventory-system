import { useContext, useState, useMemo } from "react";
import { SoldItemsContext } from "../../Components/Context/SoldItemsProvider";

const TotalSales = () => {
  const { soldItems, fetchSoldItems } = useContext(SoldItemsContext);
  console.log(soldItems)
  const [expandedSale, setExpandedSale] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Calculate monthly profits
  const monthlyProfits = useMemo(() => {
    const profits = {};
    
    soldItems.forEach(item => {
      // Assuming each item has a createdAt or date field
      const date = new Date(item.createdAt || item.date || Date.now());
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!profits[monthYear]) {
        profits[monthYear] = {
          totalSales: 0,
          totalPaid: 0,
          totalRemaining: 0,
          count: 0
        };
      }
      
      profits[monthYear].totalSales += item.totalAmount || 0;
      profits[monthYear].totalPaid += item.paidAmount || 0;
      profits[monthYear].totalRemaining += item.remainingAmount || 0;
      profits[monthYear].count += 1;
    });
    
    return profits;
  }, [soldItems]);

  // Get sorted month list
  const sortedMonths = useMemo(() => {
    return Object.keys(monthlyProfits).sort().reverse();
  }, [monthlyProfits]);

  // Calculate totals
  const totalSalesAmount = soldItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalPaidAmount = soldItems.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const totalRemaining = soldItems.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);

  // Filter sales by selected month
  const filteredSales = useMemo(() => {
    if (selectedMonth === "all") return soldItems;
    
    return soldItems.filter(item => {
      const date = new Date(item.createdAt || item.date || Date.now());
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthYear === selectedMonth;
    });
  }, [soldItems, selectedMonth]);

  const toggleExpand = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const downloadInvoicePDF = (item) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 140);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 140);

    // Draw Logo (Pharmacy Cross Symbol)
    ctx.fillStyle = '#ffffff';
    // Vertical bar of cross
    ctx.fillRect(50, 30, 25, 80);
    // Horizontal bar of cross
    ctx.fillRect(30, 55, 65, 30);
    
    // Add circle around cross
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(62.5, 70, 50, 0, 2 * Math.PI);
    ctx.stroke();

    // Pharmacy Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Arial';
    ctx.fillText('CITY PHARMACY', 140, 65);
    
    ctx.font = '16px Arial';
    ctx.fillText('Your Trusted Healthcare Partner', 140, 95);
    ctx.fillText('Contact: +92 300 8706962 | citypharmacy@example.com', 140, 118);
    
    // Invoice Title
    ctx.font = 'bold 24px Arial';
    ctx.fillText('INVOICE', 650, 60);
    
    ctx.font = '14px Arial';
    const invoiceDate = new Date(item.createdAt || item.date || Date.now());
    ctx.fillText(`Date: ${invoiceDate.toLocaleDateString()}`, 615, 90);
    ctx.fillText(`Badge No: ${item.batchNo}`, 565, 105);
    ctx.fillText(`Invoice #: ${item._id.slice(-8).toUpperCase()}`, 565, 120);

    // Decorative line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 145);
    ctx.lineTo(canvas.width, 145);
    ctx.stroke();

    // Customer Information Box
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(30, 170, 740, 120);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('BILL TO:', 50, 200);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Customer: ${item.customerName || 'Unknown'}`, 50, 230);
    ctx.fillText(`Shop: ${item.shopName || 'N/A'}`, 50, 255);
    ctx.fillText(`City: ${item.city || 'N/A'}`, 50, 280);

    // Products Table Header
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(30, 320, 740, 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('PRODUCT', 50, 345);
    ctx.fillText('QTY', 400, 345);
    ctx.fillText('PRICE', 500, 345);
    ctx.fillText('TOTAL', 650, 345);

    // Products Table Content
    let yPosition = 385;
    ctx.fillStyle = '#1f2937';
    ctx.font = '15px Arial';
    
    if (item.items && item.items.length > 0) {
      item.items.forEach((product, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          ctx.fillStyle = '#f9fafb';
          ctx.fillRect(30, yPosition - 25, 740, 35);
        }
        
        ctx.fillStyle = '#1f2937';
        // Truncate long product names
        const productName = product.productName.length > 30 
          ? product.productName.substring(0, 30) + '...' 
          : product.productName;
        ctx.fillText(productName, 50, yPosition);
        ctx.fillText(`${product.quantity}`, 400, yPosition);
        ctx.fillText(`Rs. ${product.pricePerUnit.toFixed(2)}`, 500, yPosition);
        ctx.fillText(`Rs. ${product.itemTotal.toFixed(2)}`, 650, yPosition);
        
        yPosition += 40;
      });
    }

    // Summary Section
    const summaryY = yPosition + 30;
    
    // Line separator
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(450, summaryY);
    ctx.lineTo(770, summaryY);
    ctx.stroke();

    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.fillText('Subtotal:', 500, summaryY + 35);
    ctx.fillText(`Rs. ${item.totalAmount.toFixed(2)}`, 650, summaryY + 35);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Paid Amount:', 500, summaryY + 65);
    ctx.fillText(`Rs. ${item.paidAmount.toFixed(2)}`, 650, summaryY + 65);

    // Bold line before remaining
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(450, summaryY + 80);
    ctx.lineTo(770, summaryY + 80);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Amount Due:', 500, summaryY + 110);
    ctx.fillText(`Rs. ${item.remainingAmount.toFixed(2)}`, 650, summaryY + 110);

    // Payment Status Badge
    const badgeY = summaryY + 150;
    ctx.fillStyle = item.isDebtCleared ? '#059669' : '#f59e0b';
    ctx.fillRect(480, badgeY, 180, 45);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    const statusText = item.isDebtCleared ? 'PAID IN FULL' : 'PAYMENT DUE';
    ctx.fillText(statusText, 500, badgeY + 30);

    // Footer
    const footerY = canvas.height - 100;
    
    // Footer background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, footerY, canvas.width, 100);
    
    // Decorative top border for footer
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, footerY, canvas.width, 4);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Thank you for your business!', 50, footerY + 35);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.fillText('CITY PHARMACY - Serving the community with care', 50, footerY + 65);
    ctx.fillText('This is a computer generated invoice', 450, footerY + 65);

    // Convert to image and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CityPharmacy_Invoice_${item.customerName}_${item._id.slice(-6)}.png`;
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

        {/* Month Filter */}
        <div className="max-w-md mx-auto mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white shadow-sm"
          >
            <option value="all">All Months</option>
            {sortedMonths.map(month => (
              <option key={month} value={month}>
                {formatMonthYear(month)} ({monthlyProfits[month].count} sales)
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Profit Summary */}
        {selectedMonth !== "all" && monthlyProfits[selectedMonth] && (
          <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {formatMonthYear(selectedMonth)} Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-blue-700">
                  Rs. {monthlyProfits[selectedMonth].totalSales.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-600 font-medium">Total Collected</p>
                <p className="text-2xl font-bold text-green-700">
                  Rs. {monthlyProfits[selectedMonth].totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-red-600 font-medium">Remaining</p>
                <p className="text-2xl font-bold text-red-700">
                  Rs. {monthlyProfits[selectedMonth].totalRemaining.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Months Profit Overview */}
        {selectedMonth === "all" && sortedMonths.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Monthly Profit Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedMonths.map(month => (
                <div key={month} className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-800">{formatMonthYear(month)}</h4>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {monthlyProfits[month].count} sales
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sales:</span>
                      <span className="font-semibold text-blue-600">Rs. {monthlyProfits[month].totalSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Collected:</span>
                      <span className="font-semibold text-green-600">Rs. {monthlyProfits[month].totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="font-semibold text-red-600">Rs. {monthlyProfits[month].totalRemaining.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">Total Sales</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">Rs. {totalSalesAmount.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">Total Collected</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">Rs. {totalPaidAmount.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">Remaining</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">Rs. {totalRemaining.toFixed(2)}</p>
          </div>
        </div>

        {/* Sales Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSales.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{item.customerName || "Unknown"}</h3>
                    {item.shopName && (
                      <p className="text-sm text-gray-600 mt-1">Shop: {item.shopName}</p>
                    )}
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.isDebtCleared ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {item.isDebtCleared ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadInvoicePDF(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg shadow-md transition-all transform hover:scale-105"
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
                  <span className="text-sm text-gray-500">City</span>
                  <span className="font-semibold text-gray-800">{item.city}</span>
                </div>

                {/* Products List - Expandable */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(item._id)}
                  >
                    <h3 className="text-sm font-semibold text-gray-700">
                      Products ({item.items?.length || 0})
                    </h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSale === item._id ? "rotate-180" : ""
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {expandedSale === item._id && (
                    <div className="mt-3 space-y-2">
                      {item.items?.map((product, index) => (
                        <div key={index} className="bg-white rounded p-2 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800">{product.productName}</span>
                            <span className="text-gray-600">×{product.quantity}</span>
                            
                          </div>
                          <div className="flex justify-between mt-1 text-gray-500">
                            <span>Rs. {product.pricePerUnit.toFixed(2)} each</span>
                            <span className="font-semibold">Rs. {product.itemTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="font-bold text-gray-800">Rs. {item.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Paid</span>
                    <span className="font-bold text-green-600">Rs. {item.paidAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-700">Remaining</span>
                    <span className="font-bold text-red-600">Rs. {item.remainingAmount.toFixed(2)}</span>
                    
                  </div>
                            <span className="font-medium text-gray-800">batch number: {item.batchNo}</span>
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