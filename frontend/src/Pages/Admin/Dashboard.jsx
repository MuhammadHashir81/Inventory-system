import React, { useEffect, useMemo, useState } from 'react'
import { Package, TrendingUp, DollarSign, TriangleAlert } from 'lucide-react'
import { useContext } from 'react'
import { AdminProductsContext } from '../../Components/Context/AdminProductsProvider'
import { SoldItemsContext } from '../../Components/Context/SoldItemsProvider'

const Dashboard = () => {
  const { fetchProducts,products } = useContext(AdminProductsContext)
  const [todaySales,setTodaySales] = useState('0')
  const [todaySalesPrice,setTotalSalesPrice] = useState("0.00")
  const {soldItems,fetchSoldItems } = useContext(SoldItemsContext)
  const [revenue,setRevenue]  = useState("0.00")
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [lastSale,setLastSale] = useState('0')
  const [latestProductPrice,setLatestProductPrice] = useState('0')
  const [latestProductName,setLatestProductName] = useState('no product')
  
 const today = new Date()

  const startOfDay = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
   


  useMemo(()=>{

  const getTodaySales = soldItems.filter((item)=> new Date(item.createdAt) >= startOfDay && new Date(item.createdAt)  < endOfDay )       


// Check if array has items before accessing
if (getTodaySales && getTodaySales.length > 0) {
  const saleTime = new Date(getTodaySales[0].createdAt).getTime();



  console.log("these are the minutes",saleTime)
  const timeAtTheMoment = new Date().getTime()

  const timeDifference = timeAtTheMoment - saleTime 
  const getTimeDifference = Math.floor(timeDifference / 60000)
  setLastSale(getTimeDifference)

} else {
  console.log('No sales data available');
}


  const todayTotalPrice = getTodaySales.reduce((acc,price)=> acc + (price.totalAmount),0 )
  setTotalSalesPrice(todayTotalPrice)

  setTodaySales(getTodaySales)
  },[soldItems])




  
  useEffect(() => {

       const loadProducts = async () => {
      const data = await fetchProducts(); // array of objects

      const lowStock = data.filter(item => item.inventory < 10);
      setLowStockProducts(lowStock);
    };

    loadProducts();
  }, []);



  useMemo(()=>{
    const subTotal = soldItems.reduce((acc,item)=> acc + (item.totalAmount - item.remainingAmount),0 )
    console.log(subTotal)

    setRevenue(subTotal)


  },[soldItems])


  // when was the last sale happened


  useEffect(()=>{

      const getTodaySales = soldItems.filter((item)=> new Date(item.createdAt) >= startOfDay && new Date(item.createdAt)  < endOfDay )   
      


  
  // Check if array has items before accessing
  if (getTodaySales && getTodaySales.length > 0) {

    
  const getPrice = getTodaySales[0].totalAmount
  console.log("this is total amount of the product",getPrice)



  setLatestProductPrice(getPrice)


  setInterval(() => {

  const saleTime = new Date(getTodaySales[0].createdAt).getTime();

  const timeAtTheMoment = new Date().getTime()

  const timeDifference = timeAtTheMoment - saleTime 
  const getTimeDifference = Math.floor(timeDifference / 60000)
  setLastSale(getTimeDifference)
}, 1000);

} else {
  console.log('No sales data available');
}


  },[soldItems])
   
    

  return (
    <div>
      <h1 className='font-bold text-4xl'>Dashboard Overview</h1>
      <div className='mt-14 grid grid-cols-3 gap-4 '>

        <div className='flex items-center justify-between shadow-md rounded-xl  bg-white/70  py-4 w-[300px] px-6'>
          <div className='mt-0.5 flex flex-col gap-1 '>
            <p className='text-lg '> Today's Sales</p>

            <h3 className='text-3xl font-semibold'>PKR {todaySalesPrice.toLocaleString()}</h3>
            <p>{todaySales.length} sale{todaySales.length !== 1? 's' : ''}</p>
          </div>


          <div className='bg-green-500/20  px-3 py-3 rounded-lg'>
            <DollarSign className='text-green-500' size={30} />
          </div>

        </div>


        <div className='flex items-center justify-between shadow-md rounded-xl  bg-white/70   w-[300px] px-6 py-4'>
          <div className='mt-0.5 flex flex-col gap-1 '>
            <p className='text-lg '> Total Products</p>

            <h3 className='text-3xl font-semibold'>{products.length}</h3>
            <p>{lowStockProducts.length} low stock products</p>
          </div>


          <div className='bg-blue-500/20  px-3 py-3 rounded-lg'>
            <Package className='text-blue-500' size={30} />

          </div>

        </div>

        <div className='flex items-center justify-between  shadow-md rounded-xl  bg-white/70   w-[300px] px-6 py-4'>
          <div className='mt-0.5 flex flex-col gap-1 '>
            <p className='text-lg '> Total revenue</p>

            <h3 className='text-3xl font-semibold'>PKR {revenue.toLocaleString()} </h3>
            <p>All time</p>
          </div>


          <div className='bg-purple-500/20  px-3 py-3 rounded-lg'>
            <TrendingUp className='text-purple-500' size={30} />
          </div>

        </div>

      </div>


      {/*   information about stocks */}

      <div className='grid grid-cols-2 mt-20 gap-4'>

        <div className='bg-white/70 shadow-sm rounded-xl min-h-[350px] px-4 py-8 '>

          <div className='flex items-center gap-2'>
            <div className='bg-red-500/20 px-2 py-2 rounded-lg'>

              <TriangleAlert className='text-red-500' size={30} />
            </div>
            <h2 className='text-xl font-semibold'>Low Stock Alert</h2>
          </div>

          {
            lowStockProducts.map((item)=>(
              <div className='bg-red-500/10 mt-6 px-4 rounded-md py-2 flex items-center justify-between'>
            <div>

              <p className='text-lg font-semibold'>{item.name}  </p>
              <p className='text-sm'>{item.inventory} unit{item.inventory <= 1 ? '' : 's'} left</p>
            </div>

            <div className='bg-red-500/10 px-3 rounded-3xl py-1'>
              <span className='text-red-700'>low stock</span>
            </div>



          </div> 

            ))
          }

          
        </div>

{/* last sale */}


        <div className='bg-white/70 shadow-sm rounded-xl min-h-[350px] px-4 py-8 '>

          <div className='flex items-center gap-2'>
            <div className='bg-blue-500/20 px-2 py-2 rounded-lg'>

              <TrendingUp className='text-blue-500' size={30} />
            </div>
            <h2 className='text-xl font-semibold'>Recent Activity</h2>
          </div>

          <div className='bg-blue-500/10 mt-6 px-4 rounded-md py-2 flex items-center justify-between'>
            <div>

              <p className='text-lg font-semibold'>New Sale</p>
              <p className='text-sm'>{lastSale} minute{lastSale <= 1 ? '' : 's'} ago</p>
            </div>

            <div className='bg-blue-500/10 px-3 rounded-3xl py-1'>
              <span className='text-blue-700'>{latestProductPrice} PKR</span>
            </div>



          </div>
        </div>


      </div>


    </div>
  )
}

export default Dashboard
