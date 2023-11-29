const Category = require('../Model/Category_Model');
const Subcategory = require('../Model/Subcategory_Model');
const Item = require('../Model/Item-Mode');
const ProductDetails = require('../Model/AboutProductDetails_Model')
const SimilarProducts = require('../Model/SimilarProduct_Model');



// category create method

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Subcategory Create Method

exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = new Subcategory(req.body);
    const newSubcategory = await subcategory.save();
    res.json(newSubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Item Create Method

exports.createItem = async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));
    const totalQuantity = Number(productData.quantity);

    const categories_id = productData.categoryId;

    const product = new Item(productData);
    await product.save();

    const response = {
      product,
      totalPrice: totalPrice.toFixed(2),
      totalQuantity,
      categories_id,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error saving product to the database:', error);
    res.status(500).json({ error: 'Could not save the product to the database' });
  }
};


// Create ProductDetails method

exports.createProductDetails = async (req, res) => {
  try {
    const productData = req.body;

    // Check if quantity is provided and if it's less than or equal to 0
    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    // Calculate the total price with the discount applied (decrease of 12%)
    const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));
    const totalQuantity = Number(productData.quantity);

    const productId = productData.productId;


    const product = new ProductDetails(productData);
    await product.save();

    const response = {
      product,
      totalPrice: totalPrice.toFixed(2),
      totalQuantity,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error saving product to the database:', error);
    res.status(500).json({ error: 'Could not save the product to the database' });
  }
};

// Create SimilarProducts Method

exports.createSimilarProducts = async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));
    const totalQuantity = Number(productData.quantity);

    const productId = productData.productId;

    const product = new SimilarProducts(productData);
    await product.save();

    const response = {
      product,
      totalPrice: totalPrice.toFixed(2),
      totalQuantity,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error saving product to the database:', error);
    res.status(500).json({ error: 'Could not save the product to the database' });
  }
};

// Create Add-to-Cart Method
let cart = [];

exports.createaddToCart = async (req, res) => {
  try {
    const { productIds } = req.body;

    // Check if productIds is an array or a single ID
    if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Convert a single ID to an array if needed
    const idsToAdd = Array.isArray(productIds) ? productIds : [productIds];

    cart.push(...idsToAdd);

    return res.status(200).json({ message: 'Items added to the cart successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Could not add items to the cart' });
  }
};



/// get method with Categories

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'id name image');


    const responseData = {
      message: 'All Categories added successfully',
      data: categories
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get Method CategoryDetails

exports.getCategoryDetails = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const subcategories = await Subcategory.find({ category: req.params.id }, 'id name image');
    res.json({ id: category.id, name: category.name, subcategories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get Method SubcateoryItems

exports.getSubcategoryItems = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.subcategoryId);
    const items = await Item.find({ subcategory: req.params.subcategoryId });


    const formattedItems = items.map(item => {
      const { quantity, price, offer } = item;
      const totalAmount = price * quantity * (1 - offer / 100);
      const status = quantity > 0 ? 'in stock' : 'out of stock';

      return {
        product: {
          _id: item._id,
          name: item.name,
          price: item.price,
          offer: item.offer,
          size: item.size,
          subcategory: item.subcategory,
          image: item.image,
          quantity: item.quantity,
          status: status
        },
        totalAmount: totalAmount.toFixed(2), // Calculated total amount
        totalQuantity: item.quantity, // Using the existing quantity
      };
    });

    res.json({ id: subcategory.id, name: subcategory.name, items: formattedItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get method with ProductDetails
exports.getProductsDetails = async (req, res) => {
  try {
    const products = await ProductDetails.find({ productId: req.params.productId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'ProductsDetails is not available' });
    }

    const formattedItems = products.map(item => {
      const { quantity, price, offer } = item;
      const totalAmount = price * quantity * (1 - offer / 100);
      const status = quantity > 0 ? 'in stock' : 'out of stock';

      const productDetails = {
        _id: item._id,
        name: item.name,
        price: item.price,
        offer: item.offer,
        size: item.size,
        image: item.image.map(imageUrl => ({ url: imageUrl })),
        Description: item.Description,
        quantity: item.quantity,
        status: status
      };

      return {
        message: 'All ProductsDetails is available',
        productDetails,
        totalAmount: totalAmount.toFixed(2), // Calculated total amount
        totalQuantity: item.quantity, // Using the existing quantity
      };
    });

    res.json(formattedItems[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get method with SimilarProducts

exports.getSimilarProducts = async (req, res) => {
  try {
    const limitCount = 10;

    const products = await SimilarProducts
      .find({ productId: req.params.productId })
      .limit(limitCount);

    if (products.length === 0) {
      return res.status(404).json({ message: 'SimilarProducts is not available' });
    }

    const similarProducts = products.map(item => ({
      product: {
        _id: item._id,
        name: item.name,
        price: item.price,
        offer: item.offer,
        size: item.size,
        image: item.image,
        quantity: item.quantity,
        status: item.quantity > 0 ? 'in stock' : 'out of stock'
      },
      totalAmount: (item.price * item.quantity * (1 - (item.offer / 100))).toFixed(2),
      totalQuantity: item.quantity
    }));

    // Return the formatted response
    res.json({
      message: 'All SimilarProducts is available',
      similarProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Multiple Add-to-cart
exports.getAllItemsInCart = async (req, res) => {
  try {
    const itemCartItems = await Item.find({ _id: { $in: cart } });
    const similarProductCartItems = await SimilarProducts.find({ _id: { $in: cart } });

    const cartItems = [...itemCartItems, ...similarProductCartItems];

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: 'No items found in the cart' });
    }

    let totalQuantity = 0;
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalQuantity += item.quantity;
      totalAmount += item.price * item.quantity * (1 - item.offer / 100);
    });

    const response = {
      cartItems: cartItems.map((item) => ({
        product: item,
        totalAmount: (item.price * item.quantity * (1 - item.offer / 100)).toFixed(2),
        totalQuantity: item.quantity,
      })),
      totalAmount: totalAmount.toFixed(2),
      totalQuantity,
    };

    return res.status(200).json({
      message: 'All Items Added-To-Cart Successfully',
      ...response,
    });
  } catch (error) {
    console.error('Error retrieving items:', error);
    return res.status(500).json({ error: 'Could not retrieve items from the cart' });
  }
};


// Delete Method with FromCart

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the index of the item with the given ID in the cart array
    const indexToRemove = cart.findIndex((productId) => productId === itemId);

    if (indexToRemove === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    // Remove the item from the cart array
    cart.splice(indexToRemove, 1);

    return res.status(200).json({ message: 'Item removed from the cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ error: 'Could not remove item from the cart' });
  }
};










// Delete method for all entities
exports.delete = async (req, res) => {
  const { entityType, id } = req.params;

  try {
    let result;
    switch (entityType) {
      case 'category':
        result = await Category.findByIdAndDelete(id);
        break;
      case 'subcategory':
        result = await Subcategory.findByIdAndDelete(id);
        break;
      case 'item':
        result = await Item.findByIdAndDelete(id);
        break;
      case 'productDetails':
        result = await ProductDetails.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).send('Invalid entity type');
    }

    if (!result) {
      return res.status(404).send(`${entityType} not found with ID: ${id}`);
    }

    res.send(`${entityType} Deleted successfully`);
  } catch (error) {
    res.status(500).send(error);
  }
};

