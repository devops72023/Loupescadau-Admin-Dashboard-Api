import Category from '../Models/category.js';
import errorHandler from './../helpers/dbErrorHandler.js';

const findCategoryById = async (req, res, next, id) => {
    const category = await Category.findById(id);
    if (!category) {
        res.status(400).json({
            error: `Category with ID ${id} not found`
        })
    } else {
        req.category = category;
    }
    next();
};

const create = async (req, res) => {
    try {
        if (
            !req.body.name 
            || !req.body.descTitle 
            || !req.body.description 
            || req.body.image == 'null' 
        ){
            return res.status(200).json({type: 'error', message: 'Tous les champ sont requis!'});
        }
        let newCategory = { 
            name: req.body.name,
            title: req.body.descTitle,
            description: req.body.description,
            image: req.body.image
            }
    
        const category = await new Category(newCategory);
        await category.save();
        res.status(200).json({message: "new category created successfully"})
    
      } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong creating the category', err: err.messages}); 
      }
};

const read = (req, res) => {
    let category = req.category

    if (category) {
        return res.json({
            category
        });
    }
};

const list = async (req, res) => {
    const categories = await Category.find()
    if (!categories) {
        res.status(400).json({error: 'Categories not found'})
    } else {
        res.json(categories)
    }
};

const update = async (req, res) => {

    try {
        let newCategory = { 
          name: req.body.name,
          title: req.body.descTitle,
          description: req.body.description,
          }
        if(req.body.image!='null'){
          newCategory.image = req.body.image
        }
    
        const category = await Category.findOneAndUpdate(
                                  {_id : req.category._id},
                                  { $set: newCategory },
                                  { new: true }
                                );
    
        res.status(200).json(category);
      } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong creating the category', err: err.messages}); 
      }
};

const remove = async (req, res) => {
    var category = req.category;

    try {
      const category = req.category;
      const daletedCategory = await Category.deleteOne({ _id : category._id })
      try {
        const categories = await Category.find()
        if (!categories){
          return res.status(200).json([]);
        }
        res.status(200).json({
          // deletedProduct,
          message: "Category successfully deleted",
          categories: categories
        });
    
      }catch (err){
        console.log(err)
        res.status(500).json({ error: "Une erreur s'est produite." });
      }
    
      
    } catch (err) {
      console.log(err)
      res.status(400).json({
        error: errorHandler(err),
      });
    }
};


export {create, read, list, update, remove, findCategoryById}