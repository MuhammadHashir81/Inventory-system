import { useContext, useState, useMemo, React } from "react";
import { SoldItemsContext } from "../../Components/Context/SoldItemsProvider";
import { Calendar, ChevronDown, Clock, DollarSign, Download, Edit, TrendingUp, Search, X } from "lucide-react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const TotalSales = () => {
  const { soldItems, fetchSoldItems, deleteSoldItems } = useContext(SoldItemsContext);
  console.log(soldItems)
  const [expandedSale, setExpandedSale] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceData, setInvoiceData] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchType, setSearchType] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [shopSearchInput, setShopSearchInput] = useState("");
  const [productSearchInput, setProductSearchInput] = useState("");

  const handleClickOpen = () => { 
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setDeleteOpen(false);
  };

  const monthlyProfits = useMemo(() => {
    const profits = {};
    
    soldItems.forEach(item => {
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

  const sortedMonths = useMemo(() => {
    return Object.keys(monthlyProfits).sort().reverse();
  }, [monthlyProfits]);

  const totalSalesAmount = soldItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalPaidAmount = soldItems.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const totalRemaining = soldItems.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);

  const filteredSales = useMemo(() => {
    let filtered = selectedMonth === "all" ? soldItems : soldItems.filter(item => {
      const date = new Date(item.createdAt || item.date || Date.now());
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthYear === selectedMonth;
    });

    if (searchType === "shop" && searchQuery) {
      filtered = filtered.filter(item => 
        item.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === "product" && searchQuery) {
      filtered = filtered.filter(item =>
        item.items?.some(product => 
          product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filtered;
  }, [soldItems, selectedMonth, searchType, searchQuery]);

  const uniqueShops = useMemo(() => {
    const shops = new Set();
    soldItems.forEach(item => {
      if (item.shopName) shops.add(item.shopName);
    });
    return Array.from(shops).sort();
  }, [soldItems]);

  const uniqueProducts = useMemo(() => {
    const products = new Set();
    soldItems.forEach(item => {
      item.items?.forEach(product => {
        if (product.productName) products.add(product.productName);
      });
    });
    return Array.from(products).sort();
  }, [soldItems]);

  const getShopOrderCount = (shopName) => {
    return soldItems.filter(item => item.shopName?.toLowerCase() === shopName.toLowerCase()).length;
  };

  const getProductOrderCount = (productName) => {
    return soldItems.filter(item =>
      item.items?.some(product => product.productName?.toLowerCase() === productName.toLowerCase())
    ).length;
  };

  const getProductTotalQuantity = (productName) => {
    let totalQty = 0;
    soldItems.forEach(item => {
      item.items?.forEach(product => {
        if (product.productName?.toLowerCase() === productName.toLowerCase()) {
          totalQty += product.quantity || 0;
        }
      });
    });
    return totalQty;
  };

  const filteredShops = useMemo(() => {
    if (!shopSearchInput) return [];
    return uniqueShops.filter(shop => 
      shop.toLowerCase().includes(shopSearchInput.toLowerCase())
    );
  }, [shopSearchInput, uniqueShops]);

  const filteredProducts = useMemo(() => {
    if (!productSearchInput) return [];
    return uniqueProducts.filter(product => 
      product.toLowerCase().includes(productSearchInput.toLowerCase())
    );
  }, [productSearchInput, uniqueProducts]);

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

  const handleDeleteSoldItem = async (id) => {
    await deleteSoldItems(id);
    fetchSoldItems();
  }

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
          <div>
        <Dialog
          open={deleteOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Use Google's location service?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>cancel</Button>
            <Button onClick={handleClose} autoFocus>
              delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>

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

  if (editingInvoice) {
    return (
      <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-auto">
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
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Sales Overview
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Track and manage all your sales transactions
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative max-w-md">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base appearance-none cursor-pointer"
              >
                <option value="all">All Months</option>
                {sortedMonths.map(month => (
                  <option key={month} value={month}>
                    {formatMonthYear(month)} ({monthlyProfits[month].count} sales)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search size={20} className="text-blue-600" />
            Search Orders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shop Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Shop</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type shop name..."
                  value={searchType === "shop" ? searchQuery : shopSearchInput}
                  onChange={(e) => {
                    setShopSearchInput(e.target.value);
                    if (searchType === "shop") {
                      setSearchQuery(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {searchType === "shop" && searchQuery && (
                  <button
                    onClick={() => {
                      setSearchType("none");
                      setSearchQuery("");
                      setShopSearchInput("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              {searchType === "shop" && searchQuery && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium">
                    Found <span className="font-bold text-lg">{filteredSales.length}</span> order(s) for <span className="font-bold">"{searchQuery}"</span>
                  </p>
                </div>
              )}
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {filteredShops.length > 0 && filteredShops.map(shop => (
                  <button
                    key={shop}
                    onClick={() => {
                      setSearchType("shop");
                      setSearchQuery(shop);
                      setShopSearchInput(shop);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-100 rounded-lg text-sm text-gray-700 transition flex justify-between"
                  >
                    <span>{shop}</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{getShopOrderCount(shop)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Product</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type product name..."
                  value={searchType === "product" ? searchQuery : productSearchInput}
                  onChange={(e) => {
                    setProductSearchInput(e.target.value);
                    if (searchType === "product") {
                      setSearchQuery(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {searchType === "product" && searchQuery && (
                  <button
                    onClick={() => {
                      setSearchType("none");
                      setSearchQuery("");
                      setProductSearchInput("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              {searchType === "product" && searchQuery && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900 font-medium">
                    Found <span className="font-bold text-lg">{filteredSales.length}</span> order(s) with <span className="font-bold">"{searchQuery}"</span>
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    Total Quantity: <span className="font-bold text-lg">{getProductTotalQuantity(searchQuery)}</span> units
                  </p>
                </div>
              )}
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {filteredProducts.length > 0 && filteredProducts.map(product => (
                  <button
                    key={product}
                    onClick={() => {
                      setSearchType("product");
                      setSearchQuery(product);
                      setProductSearchInput(product);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-green-100 rounded-lg text-sm text-gray-700 transition flex justify-between items-center"
                  >
                    <span>{product}</span>
                    <div className="flex gap-2">
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">{getProductOrderCount(product)} orders</span>
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{getProductTotalQuantity(product)} qty</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Total Sales</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  Rs. {totalSalesAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs opacity-75">{filteredSales.length} transactions</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Total Collected</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  Rs. {totalPaidAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs opacity-75">
              {((totalPaidAmount / totalSalesAmount) * 100).toFixed(1)}% collected
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">Pending Amount</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  Rs. {totalRemaining.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs opacity-75">
              {filteredSales.filter(s => !s.isDebtCleared).length} pending payments
            </p>
          </div>
        </div>

        {/* Monthly Summary Card */}
        {selectedMonth !== "all" && monthlyProfits[selectedMonth] && (
          <div className="mb-6 sm:mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-blue-600" size={20} />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {formatMonthYear(selectedMonth)} Summary
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Total Sales</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  Rs. {monthlyProfits[selectedMonth].totalSales.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-green-700 font-medium mb-1">Collected</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">
                  Rs. {monthlyProfits[selectedMonth].totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-orange-700 font-medium mb-1">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-900">
                  Rs. {monthlyProfits[selectedMonth].totalRemaining.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Months Overview */}
        {selectedMonth === "all" && sortedMonths.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Monthly Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortedMonths.map(month => (
                <div key={month} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">
                      {formatMonthYear(month)}
                    </h4>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {monthlyProfits[month].count}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sales:</span>
                      <span className="font-semibold text-gray-900">
                        Rs. {monthlyProfits[month].totalSales.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Collected:</span>
                      <span className="font-semibold text-green-600">
                        Rs. {monthlyProfits[month].totalPaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending:</span>
                      <span className="font-semibold text-orange-600">
                        Rs. {monthlyProfits[month].totalRemaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sales Items Grid */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Sales Transactions</h3>
          
          {filteredSales.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600">No sales found for this period</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredSales.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {item.customerName || "Unknown"}
                        </h3>
                        {item.shopName && (
                          <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                            {item.shopName}
                          </p>
                        )}
                        <span className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isDebtCleared 
                            ? "bg-green-100 text-green-700" 
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {item.isDebtCleared ? "✓ Paid" : "⏳ Pending"}
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => openEditInvoice(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                          aria-label="Edit Invoice"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => downloadInvoiceWord(item)}
                          className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg transition-colors"
                          aria-label="Download Invoice"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-semibold text-gray-900">{item.city}</span>
                    </div>

                    {/* Products List - Expandable */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200">
                      <button
                        onClick={() => toggleExpand(item._id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors rounded-xl"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">
                          Products ({item.items?.length || 0})
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform ${
                            expandedSale === item._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {expandedSale === item._id && (
                        <div className="px-3 pb-3 space-y-2">
                          {item.items?.map((product, index) => (
                            <div key={index} className="bg-white rounded-lg p-2.5 border border-gray-100">
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <span className="text-xs sm:text-sm font-medium text-gray-900 flex-1">
                                  {product.productName}
                                </span>
                                <span className="text-xs text-gray-600 flex-shrink-0">
                                  ×{product.quantity}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Rs. {product.pricePerUnit.toLocaleString()}/unit</span>
                                <span className="font-semibold text-gray-900">
                                  Rs. {product.itemTotal.toLocaleString()}
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                Batch: {product.batchNo}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-700 font-medium">Total Amount</span>
                        <span className="font-bold text-gray-900">
                          Rs. {item.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-green-700 font-medium">Paid</span>
                        <span className="font-bold text-green-600">
                          Rs. {item.paidAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm pt-2 border-t border-gray-300">
                        <span className="text-orange-700 font-medium">Remaining</span>
                        <span className="font-bold text-orange-600">
                          Rs. {item.remainingAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2">
                        <button onClick={() => handleDeleteSoldItem(item._id)} className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition">delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalSales;