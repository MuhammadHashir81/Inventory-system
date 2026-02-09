import React, { useEffect, useMemo, useState } from 'react'
import { Package, TrendingUp, DollarSign, TriangleAlert, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContext } from 'react'
import { AdminProductsContext } from '../../Components/Context/AdminProductsProvider'
import { SoldItemsContext } from '../../Components/Context/SoldItemsProvider'

const Dashboard = () => {
  const { fetchProducts, products, getLowStockProducts, lowProducts,totalPages,totalProducts,totalLowStockProducts } = useContext(AdminProductsContext)
  const { soldItems } = useContext(SoldItemsContext)

  const [todaySales, setTodaySales] = useState('0')
  const [todaySalesPrice, setTotalSalesPrice] = useState("0.00")
  const [revenue, setRevenue] = useState("0.00")
  const [lastSale, setLastSale] = useState('0')
  const [latestProductPrice, setLatestProductPrice] = useState('0')
  const [latestProductName, setLatestProductName] = useState('no product')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(false)

  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Fetch low stock products with pagination
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

  useEffect(() => {
    const fetchingProducts = async()=>{

      const data = await fetchProducts();
    }
    fetchingProducts()

  }, []);

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
    <div className='px-4 sm:px-6 lg:px-8'>
      <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Dashboard Overview</h1>
      <div className='mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

        <div className='flex items-center justify-between shadow-md rounded-xl bg-white/70 py-4 w-full px-6'>
          <div className='mt-0.5 flex flex-col gap-1'>
            <p className='text-base sm:text-lg'>Today's Sales</p>
            <h3 className='text-2xl sm:text-3xl font-semibold'>PKR {todaySalesPrice.toLocaleString()}</h3>
            <p className='text-sm sm:text-base'>{todaySales.length} sale{todaySales.length !== 1 ? 's' : ''}</p>
          </div>

          <div className='bg-green-500/20 px-3 py-3 rounded-lg flex-shrink-0'>
            <DollarSign className='text-green-500' size={30} />
          </div>
        </div>

        <div className='flex items-center justify-between shadow-md rounded-xl bg-white/70 w-full px-6 py-4'>
          <div className='mt-0.5 flex flex-col gap-1'>
            <p className='text-base sm:text-lg'>Total Products</p>
            <h3 className='text-2xl sm:text-3xl font-semibold'>{totalProducts}</h3>
            <p className='text-sm sm:text-base'>{totalLowStockProducts} low stock products</p>
          </div>

          <div className='bg-blue-500/20 px-3 py-3 rounded-lg flex-shrink-0'>
            <Package className='text-blue-500' size={30} />
          </div>
        </div>

        <div className='flex items-center justify-between shadow-md rounded-xl bg-white/70 w-full px-6 py-4 sm:col-span-2 lg:col-span-1'>
          <div className='mt-0.5 flex flex-col gap-1'>
            <p className='text-base sm:text-lg'>Total revenue</p>
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
            <div className='bg-red-500/20 px-2 py-2 rounded-lg flex-shrink-0'>
              <TriangleAlert className='text-red-500' size={30} />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold'>Low Stock Alert</h2>
          </div>

          <div className='flex-1'>
            {isLoadingLowStock ? (  
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500'>Loading...</p>
              </div>
            ) : getLowStockProducts.length > 0 ? (
              getLowStockProducts.map((item, index) => (
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
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 1
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
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
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
            <div className='bg-blue-500/20 px-2 py-2 rounded-lg flex-shrink-0'>
              <TrendingUp className='text-blue-500' size={30} />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold'>Recent Activity</h2>
          </div>

          <div className='bg-blue-500/10 mt-6 px-4 rounded-md py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
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