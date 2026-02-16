  // controllers/adminProducts.controller.js
  import { Product } from "../Models/productSchema.js";

  // ➕ Add a new product
  export const adminAddProducts = async (req, res) => {
    try {
      const { name, category, description, priceJohrabad, priceOther, inventory, batchNo,costPrice , sold = 0 } = req.body;

      if (!name || !category || !description || priceJohrabad == null || priceOther == null || inventory == null) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const product = new Product({
        name,
        category,
        description,
        price: { johrabad: priceJohrabad, other: priceOther },
        inventory,
        batchNo,
        costPrice,
        sold
      });

      await product.save();
      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      console.error("Add Product Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  //  Get all products
  export const gettAllAdminProducts = async (req, res) => {

    let page = req.query.page
    let limit = req.query.limit
    let skip = (page - 1) * limit

    try {

      // Get total count of low stock products
      const totalCount = await Product.countDocuments()

      // Get paginated products
      const products = await Product.find()
        .skip(skip)
        .limit(limit)

        
        
      res.status(200).json({
        totalPages: Math.ceil(totalCount / limit),
        success: true,
        totalCount,
        products,
      })

    } catch (error) {
      console.error("Get Products Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  //  Delete product
  export const deleteOneAdminProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Product not found" });
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete Product Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  //  Update product
  export const updateAdminProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, description, priceJohrabad, priceOther, inventory, sold,batchNo,costPrice } = req.body;

      const updated = await Product.findByIdAndUpdate(
        id,
        {
          name,
          category,
          description,
          price: { johrabad: priceJohrabad, other: priceOther },
          inventory,
          sold,
          costPrice,
          batchNo
        },
        { new: true, runValidators: true }
      );


      if (!updated) return res.status(404).json({ message: "Product not found" });
      res.status(200).json({ message: "Product updated successfully", product: updated });
    } catch (error) {
      console.error("Update Product Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };


  // get low stock products 
  export const getLowStockProducts = async (req, res) => {
    try {
      let page = Number(req.query.page) || 1
      let limit = Number(req.query.limit) || 20
      let skip = (page - 1) * limit 

      // Get total count of low stock products
      const totalCount = await Product.countDocuments({ inventory: { $lt: 10 } })

      // Get paginated products
      const getProducts = await Product.find({ inventory: { $lt: 10 } })
        .skip(skip)
        .limit(limit)

      res.status(200).json({
        success: true,
        getProducts,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),

      })



    } catch (error) {
      console.error("Error fetching low stock products:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }


  //get searched items 

  export const getSearchedItems = async(req,res) => {
    const {q} = req.query;
    console.log(q)
    if(!q) return ([]);


    const items =await Product.find({name:{$regex:q,$options:'i'}}).limit(10)
    res.status(200).json({items})
  }