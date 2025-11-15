import { useContext, useState, useMemo } from "react";
import { SoldItemsContext } from "../../Components/Context/SoldItemsProvider";

const TotalSales = () => {
  const { soldItems, fetchSoldItems } = useContext(SoldItemsContext);
  console.log(soldItems)
  const [expandedSale, setExpandedSale] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceData, setInvoiceData] = useState({});

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

  const openEditInvoice = (item) => {
    setEditingInvoice(item._id);
    setInvoiceData({
      ...item,
      items: item.items?.map(p => ({...p})) || []
    });
  };

  const closeEditInvoice = () => {
    setEditingInvoice(null);
    setInvoiceData({});
  };

  const handleInvoiceFieldChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items?.map((item, i) => 
        i === index ? {...item, [field]: field === 'quantity' || field === 'pricePerUnit' ? parseFloat(value) || 0 : value} : item
      )
    }));
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `INV${timestamp}${random}`.slice(0, 12);
  };

  const downloadInvoiceWord = (item) => {
    const dataToUse = editingInvoice === item._id ? invoiceData : item;
    const invoiceNumber = generateInvoiceNumber();
    const invoiceDate = new Date(dataToUse.createdAt || dataToUse.date || Date.now());

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #1f2937;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
        }
        .pharmacy-name {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin: 10px 0;
        }
        .tagline {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0;
        }
        .contact {
          font-size: 12px;
          color: #6b7280;
        }
        .invoice-title {
          font-size: 20px;
          font-weight: bold;
          text-align: right;
          margin-bottom: 10px;
        }
        .invoice-details {
          text-align: right;
          font-size: 12px;
          margin-bottom: 20px;
        }
        .bill-to {
          margin-bottom: 30px;
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 5px;
        }
        .bill-to-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .customer-info {
          font-size: 12px;
          line-height: 1.8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #3b82f6;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          font-size: 13px;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .summary {
          margin-left: auto;
          width: 40%;
          margin-bottom: 30px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
        }
        .summary-row.total {
          border-bottom: 3px solid #1f2937;
          font-weight: bold;
          font-size: 14px;
        }
        .summary-row.amount-due {
          color: #dc2626;
          font-weight: bold;
          font-size: 14px;
          border-bottom: none;
          margin-top: 10px;
        }
        .paid-section {
          color: #059669;
          font-weight: bold;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #6b7280;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 15px;
          font-size: 12px;
        }
        .status-paid {
          background-color: #059669;
          color: white;
        }
        .status-pending {
          background-color: #f59e0b;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="pharmacy-name">CITY PHARMACY</div>
        <div class="tagline">Your Trusted Healthcare Partner</div>
        <div class="contact">Contact: +92 300 8706962</div>
      </div>

      <div class="invoice-title">INVOICE</div>
      <div class="invoice-details">
        <div>Date: ${invoiceDate.toLocaleDateString()}</div>
        <div>Invoice #: ${invoiceNumber}</div>
      </div>

      <div class="bill-to">
        <div class="bill-to-title">BILL TO:</div>
        <div class="customer-info">
          <div><strong>Customer:</strong> ${dataToUse.customerName || 'Unknown'}</div>
          <div><strong>Shop:</strong> ${dataToUse.shopName || 'N/A'}</div>
          <div><strong>City:</strong> ${dataToUse.city || 'N/A'}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>BATCH NO</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${dataToUse.items?.map(product => `
            <tr>
              <td>${product.productName}</td>
              <td>${product.batchNo}</td>
              <td>${product.quantity}</td>
              <td>Rs. ${product.pricePerUnit.toFixed(2)}</td>
              <td>Rs. ${(product.quantity * product.pricePerUnit).toFixed(2)}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>Rs. ${dataToUse.totalAmount.toFixed(2)}</span>
        </div>
        <div class="summary-row paid-section">
          <span>Paid Amount:</span>
          <span>Rs. ${dataToUse.paidAmount.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Amount Due:</span>
          <span>Rs. ${dataToUse.remainingAmount.toFixed(2)}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <div class="status-badge ${dataToUse.isDebtCleared ? 'status-paid' : 'status-pending'}">
          ${dataToUse.isDebtCleared ? 'PAID IN FULL' : 'PAYMENT DUE'}
        </div>
      </div>

      <div class="footer">
        <div style="margin-bottom: 10px;"><strong>Thank you for your business!</strong></div>
        <div>CITY PHARMACY - Serving the community with care</div>
        <div>This is a computer generated invoice</div>
      </div>
    </body>
    </html>
    `;

    const element = document.createElement('a');
    const file = new Blob([html], { type: 'application/msword' });
    element.href = URL.createObjectURL(file);
    element.download = `CityPharmacy_Invoice_${dataToUse.customerName}_${invoiceNumber}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
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

  // Invoice Edit Modal
  if (editingInvoice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Edit Invoice</h2>
            <button
              onClick={closeEditInvoice}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition"
            >
              ✕
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)] space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={invoiceData.customerName || ''}
                  onChange={(e) => handleInvoiceFieldChange('customerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  value={invoiceData.shopName || ''}
                  onChange={(e) => handleInvoiceFieldChange('shopName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={invoiceData.city || ''}
                  onChange={(e) => handleInvoiceFieldChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Products</h3>
              <div className="space-y-3">
                {invoiceData.items?.map((product, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-2">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Product Name</label>
                        <input
                          type="text"
                          value={product.productName || ''}
                          onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Batch No</label>
                        <input
                          type="text"
                          value={product.batchNo || ''}
                          onChange={(e) => handleItemChange(index, 'batchNo', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Quantity</label>
                        <input
                          type="number"
                          value={product.quantity || 0}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Price Per Unit</label>
                        <input
                          type="number"
                          value={product.pricePerUnit || 0}
                          onChange={(e) => handleItemChange(index, 'pricePerUnit', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Total</label>
                        <div className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-semibold text-blue-600">
                          Rs. {((product.quantity || 0) * (product.pricePerUnit || 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  value={invoiceData.totalAmount || 0}
                  onChange={(e) => handleInvoiceFieldChange('totalAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                <input
                  type="number"
                  value={invoiceData.paidAmount || 0}
                  onChange={(e) => handleInvoiceFieldChange('paidAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Amount</label>
                <input
                  type="number"
                  value={invoiceData.remainingAmount || 0}
                  onChange={(e) => handleInvoiceFieldChange('remainingAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-4 border-t rounded-b-2xl">
            <button
              onClick={closeEditInvoice}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                downloadInvoiceWord(invoiceData);
                closeEditInvoice();
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Download Invoice
            </button>
          </div>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditInvoice(item)}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-lg shadow-md transition-all transform hover:scale-105"
                      title="Edit Invoice"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => downloadInvoiceWord(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg shadow-md transition-all transform hover:scale-105"
                      title="Download Invoice"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
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
                            <span className="font-semibold">Batch: {product.batchNo}</span>
                            
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