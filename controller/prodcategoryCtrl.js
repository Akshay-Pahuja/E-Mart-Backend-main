const Category = require("../models/prodcategoryModel");
const asyncHandler = require("express-async-handler");
const {validateMongoDbId} = require("../utils/validateMongodbId");

exports.createCategory = asyncHandler(async(req,res)=>{
    try{
        const createcategory = await Category.create(req.body);
        res.json(createcategory);
    } catch(error)
    {
        throw new Error(error);
    }
})

exports.getCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getcategory = await Category.findById(id);
        res.json(getcategory);
    } catch(error)
    {
        throw new Error(error);
    }
})

exports.getallCategory = asyncHandler(async(req,res)=>{

    try{
        const getallcategory = await Category.find();
        res.json(getallcategory);
    } catch(error)
    {
        throw new Error(error);
    }
})

exports.updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        
        const updatecategory = await Category.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updatecategory);
    } catch(error)
    {
        throw new Error(error);
    }
})

exports.deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        
        const deletecategory = await Category.findByIdAndDelete(id);
        res.json(deletecategory);
    } catch(error)
    {
        throw new Error(error);
    }
})