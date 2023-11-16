const express = require('express');
const router = express.Router();
const categoryController = require('../Controller/Category_Controlle');


// Create Method with Post Api
router.post('/categories', categoryController.createCategory);
router.post('/subcategories', categoryController.createSubcategory);
router.post('/items', categoryController.createItem);
router.post('/productDetails',categoryController.createProductDetails)
router.post('/similarProducts', categoryController.createSimilarProducts)
router.post('/add-to-cart', categoryController.createaddToCart)


// Get Method with Api
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryDetails);
router.get('/categories/:categoryId/subcategories/:subcategoryId', categoryController.getSubcategoryItems);
router.get('/categories/:categoryId/subcategories/:subcategoryId/productDetails/:productId', categoryController.getProductsDetails);
router.get('/similarProducts/:productId', categoryController.getSimilarProducts);

// Add-to-cart Api
router.get('/allitemsIncart', categoryController.getAllItemsInCart);

// Delete Method with All Products
router.delete('/:entityType/:id', categoryController.delete);


module.exports = router;
