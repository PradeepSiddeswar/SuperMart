const express = require('express');
const router = express.Router();
const categoryController = require('../Controller/Category_Controlle');


// Create Method with Post APi
router.post('/categories', categoryController.createCategory);
router.post('/subcategories', categoryController.createSubcategory);
router.post('/items', categoryController.createItem);
router.post('/productDetails',categoryController.createProductDetails)


// Get Method with Api
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryDetails);
router.get('/categories/:categoryId/subcategories/:subcategoryId', categoryController.getSubcategoryItems);
router.get('/categories/:categoryId/subcategories/:subcategoryId/productDetails/:productId', categoryController.getProductsDetails);

router.delete('/:entityType/:id', categoryController.delete);
router.get('/add-multiple-to-cart', categoryController.addMultipleToCart);

// Delete a specific category by ID
router.delete('/categories/:id', categoryController.delete);


module.exports = router;
