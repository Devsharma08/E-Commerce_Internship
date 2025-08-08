const Category = require('../model/categorySchema');

// create cat
const CreateCategory = async (req, res) => {
  const { name } = req.body; 

  // console.log(name);

  if (!name) {
    return res.status(400).json({ "msg": "Enter name of category" });
  }

  let existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(409).json({ "msg": "Category already exists" });
  }

  const newCategory = await Category.create({ name });

  return res.status(201).json({ "msg": "Success", newCategory });
};

// update cat
const UpdateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ "msg": "Category not found" });
    }

    return res.status(200).json({ "msg": "Category updated", updatedCategory });
  } catch (error) {
    return res.status(500).json({ "msg": "Server error", error: error.message });
  }
};

// del cat
const deleteCategory = async(req,res)=>{
  const { id } = req.params;
  try{
  // console.log(id);
  const deletedCategory = await Category.findOneAndDelete({_id:id});
  if(!deletedCategory){
    return res.status(401).json({"msg":"deletion falied"})
  }
  return res.status(200).json({"msg":`successful user id: ${deletedCategory._id}`})
  } catch(error){
    return res.status(500).json({error,"message":err.message})
  }
  
}

const getAllCategory = async(req,res)=>{
  const allCategoriesList = await Category.find({})
  if(allCategoriesList){
    return res.status(200).json({"msg":"get all categories",allCategoriesList})
  }
}

const getSingleCategory = async(req,res)=>{
  const {id} = req.params;
  try {
  const user = await Category.findOne({"_id":id});
  if(!user){
    res.status(401).json({"msg":"Category ID not registered"})
  }

  return res.status(200).json({
    "msg":"success",
    "user":user
  })
  } catch (error) {
    return res.status(500).json({"msg":"server error",error})
  }
  
}

module.exports = { CreateCategory,UpdateCategory, deleteCategory,getAllCategory,getSingleCategory };
