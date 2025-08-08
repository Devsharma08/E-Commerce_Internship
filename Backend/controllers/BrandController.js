const  Brand = require('../model/brand')

// create cat
const CreateBrand = async (req, res) => {
  const { name } = req.body; 

  // console.log(name);

  if (!name) {
    return res.status(400).json({ "msg": "Enter name of Brand" });
  }

  let existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    return res.status(409).json({ "msg": "Brand already exists" });
  }

  const newBrand = await Brand.create({ name });

  return res.status(201).json({ "msg": "Success", newBrand });
};

// update cat
const UpdateBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ "msg": "Brand not found" });
    }

    return res.status(200).json({ "msg": "Brand updated", updatedBrand });
  } catch (error) {
    return res.status(500).json({ "msg": "Server error", error: error.message });
  }
};

// del cat
const deleteBrand = async(req,res)=>{
  const { id } = req.params;
  try{
  // console.log(id);
  const deletedBrand = await Brand.findOneAndDelete({_id:id});
  if(!deletedBrand){
    return res.status(401).json({"msg":"deletion falied"})
  }
  return res.status(200).json({"msg":`successful user id: ${deletedBrand._id}`})
  } catch(error){
    return res.status(500).json({error,"message":err.message})
  }
  
}

const getAllBrand = async(req,res)=>{
  const allBrandList = await Brand.find({});
  if(allBrandList){
    return res.status(200).json({"msg":"get all brands",allBrandList})
  }
}

const getSingleBrand = async(req,res)=>{
  const {id} = req.params;
  try {
  const user = await Brand.findOne({"_id":id});
  if(!user){
    res.status(401).json({"msg":"Brand ID not registered"})
  }

  return res.status(200).json({
    "msg":"success",
    "user":user
  })
  } catch (error) {
    return res.status(500).json({"msg":"server error",error})
  }
  
}

module.exports = { CreateBrand,UpdateBrand, deleteBrand,getAllBrand,getSingleBrand };
