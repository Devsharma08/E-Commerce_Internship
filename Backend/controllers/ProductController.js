const Product = require('../model/productSchema')
const Category = require('../model/categorySchema')
const main  = require('./AIDescriptor')

const generateDescription = async(req,res) =>{
  const {name,productId} = req.body;
  if(!name || !productId){
    return res.status(400).json({
      success:false,
      message:'no name and productId provided',
      data:null
    })
  } 
  try {
  const descriptionText = await main(name);

  //if no description 
  if(!descriptionText){
    return res.status(404).json({
      error:'description not found , some error has occured'
    })
  } else {
    const product = await Product.findOne({_id:productId});
    if(!product){
      return res.status(400).json({
        success:false,
        data:null,
        message:`no such product found`
      })
    }
    product.description = descriptionText;
    await product.save();
    return res.status(201).json({
      success:true,
      message:`description created successfully`,
      data: product.description
    })
  }
  } catch (error) {
    return res.status(500).json({
      error:error.message
    })
  }
}

// create cat
const CreateProduct = async (req, res) => {
  const { name,shortDescription,description,price,discount,images,categoryId,brandId, isFeaturedProduct = false,isNewProduct = false } = req.body; 

  // console.log(name);

  if ( !name || !shortDescription || !description || !price || !discount || !images || !categoryId ||!brandId ) {
    return res.status(400).json({ " msg ": " Enter All Details " });
  }

  let existingProduct = await Product.findOne({ name });

  if (existingProduct) {
    return res.status(409).json({ "msg": " Product already exists " });
  }

  const newProduct = await Product.create({ name,shortDescription,description,price,discount,images,categoryId,brandId,isFeaturedProduct,isNewProduct });

  return res.status(201).json({ "msg": " Success ", newProduct });
};

// update cat
const UpdateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ "msg": "Product not found" });
    }

    return res.status(200).json({ "msg": "Product updated", updatedProduct });
  } catch (error) {
    return res.status(500).json({ "msg": "Server error", error: error.message });
  }
};

// del pro
const deleteProduct = async(req,res)=>{
  const { id } = req.params;
  try{
  // console.log(id);
  const deletedProduct = await Product.findOneAndDelete({_id:id});
  if(!deletedProduct){
    return res.status(401).json({"msg":"deletion falied"})
  }
  return res.status(200).json({"msg":`Successfully deleted user id: ${deletedProduct._id} `})
  } catch(error){
    return res.status(500).json({error,"message":err.message})
  }
  
}

const getAllProduct = async(req,res)=>{
  const allProductList = await Product.find({});
  if(allProductList){
    return res.status(200).json({"msg":"get all products",allProductList})
  }
}

const getSingleProduct = async(req,res)=>{
  const {id} = req.params;
  try {
  const user = await Product.findOne({"_id":id});
  if(!user){
    res.status(401).json({"msg":"Product ID not registered"})
  }

  return res.status(200).json({
    "msg":"success",
    "user":user
  })

  } catch (error) {
    return res.status(500).json({"msg":"server error",error})
  }  
}


const getSameCategoryProduct = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const excludeId = req.query.excludeId; 
    if (!categoryId) {
      return res.status(400).json({ msg: "Missing categoryId" });
    }

    const query = { categoryId };

    if (excludeId) {
      query._id = { $ne: excludeId }; 
    }

    const products = await Product.find(query);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching same category products:', error.message);
    return res.status(500).json({ error: error.message });
  }
};


const getNewProducts = async(req,res)=>{
  const newProduct = await Product.find({isNewProduct:true});
  res.status(200).json({msg:"new product","count":newProduct.length || 0,newProduct});
}

const getFeaturedProducts = async(req,res)=>{
  const featuredProduct = await Product.find({isFeaturedProduct:true});
  res.status(200).json({msg:"featured product","count":featuredProduct.length || 0,featuredProduct});
}

const getCategoryName = async (req, res) => {
  try {
    const categoryNameList = await Category.find({}, 'name'); // Only fetch the 'name' field

    return res.status(200).json({ categoryNameList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getListedProduct = async (req, res) => {
  try {
    const {
      categoryId,
      brandId,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = -1,
    } = req.query;

    const numericPage = parseInt(page);
    const numericLimit = parseInt(limit);

    let filter = {};

    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (brandId) {
      filter.brandId = brandId;
    }

    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { shortDescription: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const totalItems = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit);

    return res.status(200).json({
      totalItems,
      currentPage: numericPage,
      totalPages: Math.ceil(totalItems / numericLimit),
      products,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = { CreateProduct,UpdateProduct, deleteProduct,getAllProduct,getSingleProduct,getFeaturedProducts,getNewProducts,getCategoryName,getListedProduct,getSameCategoryProduct,generateDescription };
