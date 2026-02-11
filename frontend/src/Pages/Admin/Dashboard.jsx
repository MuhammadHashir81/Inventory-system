import React, { useEffect, useMemo, useState } from 'react'
import { Package, TrendingUp, DollarSign, TriangleAlert, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate()

  const [todaySales, setTodaySales] = useState('0')
  const [todaySalesPrice, setTotalSalesPrice] = useState("0.00")
  const [revenue, setRevenue] = useState("0.00")
  const [lastSale, setLastSale] = useState('0')
  const [latestProductPrice, setLatestProductPrice] = useState('0')
  const [latestProductName, setLatestProductName] = useState('no product')
  const [currentPage, setCurrentPage] = useState(1)
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(false)
  const [totalLowStockProducts, setTotalLowStockProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [soldItems, setSoldItems] = useState([]);

  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Fetch low stock products with pagination

  const fetchProducts = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/admin/products/get?page=${page}&limit=${limit}`);
      console.log(res.data.products);
      if (res.data.products) {
        setTotalProducts(res.data.totalCount)
      }
      return res.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, [totalProducts])


  useEffect(() => {
    const fetchLowStockProducts = async () => {
      setIsLoadingLowStock(true)
      try {
        await lowProducts(currentPage, 3)
      } catch (error) {
        console.error("Error fetching low stock products:", error)
      } finally {
        setIsLoadingLowStock(false)
      }
    }

    fetchLowStockProducts()
  }, [currentPage])

  const fetchSoldItems = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/sold-items/get`);
      console.log("sold items are", res.data);
      if (res.data.soldItems) setSoldItems(res.data.soldItems);

      return res.data.soldItems
    } catch (error) {
      console.error("Fetch sold items error:", error);
    }
  };

  useEffect(() => {
    fetchSoldItems
  }, [soldItems])


  useMemo(() => {
    const getTodaySales = soldItems.filter((item) => new Date(item.createdAt) >= startOfDay && new Date(item.createdAt) < endOfDay)

    if (getTodaySales && getTodaySales.length > 0) {
      const saleTime = new Date(getTodaySales[0].createdAt).getTime();
      const timeAtTheMoment = new Date().getTime()
      const timeDifference = timeAtTheMoment - saleTime
      const getTimeDifference = Math.floor(timeDifference / 60000)
      setLastSale(getTimeDifference)
    } else {
      console.log('No sales data available');
    }

    const todayTotalPrice = getTodaySales.reduce((acc, price) => acc + (price.totalAmount), 0)
    setTotalSalesPrice(todayTotalPrice)
    setTodaySales(getTodaySales)
  }, [soldItems])



  useMemo(() => {
    const subTotal = soldItems.reduce((acc, item) => acc + (item.totalAmount - item.remainingAmount), 0)
    setRevenue(subTotal)
  }, [soldItems])

  useEffect(() => {
    if (!soldItems || soldItems.length === 0) return;

    const getTodaySales = soldItems.filter(
      (item) => new Date(item.createdAt) >= startOfDay && new Date(item.createdAt) < endOfDay
    );

    if (getTodaySales && getTodaySales.length > 0) {
      const getPrice = getTodaySales[0].totalAmount;
      setLatestProductPrice(getPrice);

      const intervalId = setInterval(() => {
        const saleTime = new Date(getTodaySales[0].createdAt).getTime();
        const timeAtTheMoment = new Date().getTime();
        const timeDifference = timeAtTheMoment - saleTime;
        const getTimeDifference = Math.floor(timeDifference / 60000);
        setLastSale(getTimeDifference);
      }, 1000);

      // ✅ Cleanup function to clear interval
      return () => clearInterval(intervalId);
    }
  }, [soldItems]);


  // Get low products with pagination
  const lowProducts = async (page = 1, limit = 3) => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/products/low-stock-products?page=${page}&limit=${limit}`);
      setLowStockProducts(response.data.getProducts);
      setTotalPages(response.data.totalPages)
      setTotalLowStockProducts(response.data.totalCount)

      console.log("these are total pages ", totalPages)
      console.log("these are low stock products", response.data.getProducts);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    }
  };

  useEffect(() => {
    lowProducts()
  }, [])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  return (
    <div className=''>
      <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Dashboard Overview</h1>
      <div className='mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

        <div onClick={() => navigate("/admin/sales")} className='flex items-center justify-between bg-gray-50 rounded-xl py-4 w-full px-6'>
          <div className='mt-0.5 flex flex-col gap-1'>
            <p className='text-base sm:text-lg '>Today's Sales</p>
            <h3 className='text-2xl sm:text-3xl font-semibold'>PKR {todaySalesPrice.toLocaleString()}</h3>
            <p className='text-sm sm:text-base'>{todaySales.length} sale{todaySales.length !== 1 ? 's' : ''}</p>
          </div>

          <div className='bg-green-500/20 px-3 py-3 rounded-lg flex-shrink-0'>
            <DollarSign className='text-green-500' size={30} />
          </div>
        </div>

        <div onClick={() => navigate("/admin/products")} className='flex items-center justify-between bg-gray-50 rounded-xl w-full px-6 py-4'>
          <div className='mt-0.5 flex flex-col gap-1'>
            <p className='text-base sm:text-lg '>Total Products</p>
            <h3 className='text-2xl sm:text-3xl font-semibold'>{totalProducts}</h3>
            <p className='text-sm sm:text-base'>{totalLowStockProducts} low stock products</p>
          </div>

          <div className='bg-blue-500/20 px-3 py-3 rounded-lg flex-shrink-0'>
            <Package className='text-blue-500' size={30} />
          </div>
        </div>

        <div className='flex items-center justify-between bg-gray-50 rounded-xl w-full px-6 py-4 sm:col-span-2 lg:col-span-1'>
          <div className='mt-0.5 flex flex-col gap-1'>
            <p className='text-base sm:text-lg '>Total revenue</p>
            <h3 className='text-2xl sm:text-3xl font-semibold'>PKR {revenue.toLocaleString()}</h3>
            <p className='text-sm sm:text-base'>All time</p>
          </div>

          <div className='bg-purple-500/20 px-3 py-3 rounded-lg flex-shrink-0'>
            <TrendingUp className='text-purple-500' size={30} />
          </div>
        </div>

      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 mt-12 sm:mt-16 lg:mt-20 gap-4'>

        <div className='bg-white/70 shadow-sm rounded-xl min-h-[350px] px-4 py-8 flex flex-col'>

          <div className='flex items-center gap-2'>
            <div className=' px-2 py-2 rounded-lg flex-shrink-0'>
              <TriangleAlert className='text-red-500' size={30} />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold'>Low Stock Alert</h2>
          </div>

          <div className='flex-1'>
            {isLoadingLowStock ? (
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500'>Loading...</p>
              </div>
            ) : lowStockProducts.length > 0 ? (
              lowStockProducts.map((item, index) => (
                <div key={index} className='bg-red-500/10 mt-6 px-4 rounded-md py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                  <div>
                    <p className='text-base sm:text-lg font-semibold'>{item.name}</p>
                    <p className='text-sm'>{item.inventory} unit{item.inventory <= 1 ? '' : 's'} left</p>
                  </div>

                  <div className='bg-red-500/10 px-3 rounded-3xl py-1 flex-shrink-0'>
                    <span className='text-red-700 text-sm'>low stock</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500'>No low stock products</p>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-200 '>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
                }`}
            >
              <ChevronLeft size={18} />
              <span className='text-sm font-medium'>Previous</span>
            </button>

            <span className='text-sm text-gray-600'>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
                }`}
            >
              <span className='text-sm font-medium'>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className='bg-white/70 shadow-sm rounded-xl min-h-[350px] px-4 py-8'>

          <div className='flex items-center gap-2'>
            <div className=' px-2 py-2 rounded-lg flex-shrink-0'>
              <TrendingUp className='text-blue-500' size={30} />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold'>Recent Activity</h2>
          </div>

          <div className='bg-blue-100/30 rounded-2xl mt-6 px-4 rounded-md py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
            <div>
              <p className='text-base sm:text-lg font-semibold'>New Sale</p>
              <p className='text-sm'>{lastSale} minute{lastSale <= 1 ? '' : 's'} ago</p>
            </div>

            <div className='bg-blue-500/10 px-3 rounded-3xl py-1 flex-shrink-0'>
              <span className='text-blue-700 text-sm sm:text-base'>{latestProductPrice} PKR</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard