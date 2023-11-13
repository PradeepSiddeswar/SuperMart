const express = require('express');
const router = express.Router();
const categoryController = require('../Controller/Category_Controlle');

router.post('/categories', categoryController.createCategory);
router.post('/subcategories', categoryController.createSubcategory);
router.post('/items', categoryController.createItem);

router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryDetails);
router.get('/categories/:categoryId/subcategories/:subcategoryId', categoryController.getSubcategoryItems);
router.get('/product/:productId', categoryController.getCartItems);
router.delete('/:entityType/:id', categoryController.delete);
// router.post('/add-to-cart/:itemId', categoryController.addToCart);

// Delete a specific category by ID
router.delete('/categories/:id', categoryController.delete);

// // Delete a specific subcategory by ID
// router.delete('/subcategories/:subcategoryId', categoryController.delete);

// // Delete a specific item by ID
// router.delete('/items/:itemId', categoryController.delete);
module.exports = router;
