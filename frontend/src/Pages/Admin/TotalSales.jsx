import  { useContext,useEffect } from "react";
import { SoldItemsContext } from "../../Components/Context/SoldItemsProvider";

const TotalSales = () => {
  const { soldItems } = useContext(SoldItemsContext);
  console.log(soldItems)


  

  // Calculate total sales amount
  const totalSalesAmount = soldItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalPaidAmount = soldItems.reduce((sum, item) => sum + item.paidAmount, 0);
  const totalRemaining = soldItems.reduce((sum, item) => sum + item.remainingAmount, 0);

  if (soldItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Total Sales</h2>
        <p className="text-gray-700 text-lg">No sales have been recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Total Sales</h2>

      <div className="mb-6 flex justify-between bg-gray-100 p-4 rounded shadow">
        <div>Total Sales Amount: <span className="font-semibold">{totalSalesAmount.toFixed(2)}</span></div>
        <div>Total Paid Amount: <span className="font-semibold text-green-600">{totalPaidAmount.toFixed(2)}</span></div>
        <div>Total Remaining: <span className="font-semibold text-red-600">{totalRemaining.toFixed(2)}</span></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {soldItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">{item.productName}</h3>
            <p><span className="font-medium">Customer:</span> {item.customerName || "Unknown"}</p>
            <p><span className="font-medium">Shop:</span> {item.shopName || "N/A"}</p>
            <p><span className="font-medium">City:</span> {item.city}</p>
            <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
            <p><span className="font-medium">Price per Unit:</span>  {item.pricePerUnit.toFixed(2)} </p>
            <p><span className="font-medium">Total Amount:</span> {item.totalAmount.toFixed(2)}</p>
            <p><span className="font-medium text-green-600">Paid:</span> {item.paidAmount.toFixed(2)}</p>
            <p><span className="font-medium text-red-600">Remaining:</span> {item.remainingAmount.toFixed(2)}</p>
            <p className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                item.isDebtCleared ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {item.isDebtCleared ? "Paid" : "Pending"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalSales;
