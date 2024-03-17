const { Category } = require("../model/Category")

exports.createCategory = async (req,res)=>{
    const category=new Category(req.body);

    try{
        const doc=category.save();
        res.status(201).json(doc);
    }catch(err){
        res.status(400).json(err);
    }
};
exports.fetchCategories = async (req, res) => {
    try {
      const categories = await Category.find({}).exec();
      res.status(200).json(categories);
    } catch (err) {
      res.status(400).json(err);
    }
  };