const Category = require('../Model/Category_Model');
const Subcategory = require('../Model/Subcategory_Model');
const Item = require('../Model/Item-Mode');
const ProductDetails = require('../Model/AboutProductDetails_Model')

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

    // Check if quantity is provided and if it's less than or equal to 0
    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    // Calculate the total price with the discount applied (decrease of 12%)
    const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));
    const totalQuantity = Number(productData.quantity);

    const categories_id = productData.categoryId; // Adjust the property name as needed

    const product = new Item(productData);
    await product.save();

    // Create a response object
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

    const productId = productData.productId; // Get productId from the request body

    const product = new ProductDetails(productData);
    await product.save();

    // Create a response object with product details and related products
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




/// get method with Categories

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'id name image');

    // Prepare the desired response structure
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
          status: status // Add the status field to the product object
          // addToCart: `/add-to-cart/${item._id}` // URL to add a specific item to the cart
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
      return res.status(404).json({ message: 'Products not found' });
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
        image: item.image.map(imageUrl => ({ url: imageUrl })), // Restructuring the image URLs
        Description: item.Description,
        quantity: item.quantity,
        status: status // Add the status field to the product object
        // addToCart: `/add-to-cart/${item._id}` // URL to add a specific item to the cart
      };

      return {
        productDetails,
        totalAmount: totalAmount.toFixed(2), // Calculated total amount
        totalQuantity: item.quantity, // Using the existing quantity
      };
    });

    // Return the first item in the formattedItems array (assuming only one product is fetched)
    res.json(formattedItems[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// MultiPle Add-to-cart
exports.addMultipleToCart = async (req, res) => {
  try {
    const productIds = req.query.productIds.split(',');

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const cartItems = [];
    let totalAmount = 0;
    let totalQuantity = 0;

    for (const productId of productIds) {
      const product = await Item.findById(productId);

      if (!product) {
        cartItems.push({ message: `Item with ID ${productId} not found` });
        continue;
      }

      const itemTotalAmount = product.price * product.quantity * (1 - product.offer / 100);
      totalAmount += itemTotalAmount;
      totalQuantity += product.quantity;

      const item = {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          offer: product.offer,
          size: product.size,
          subcategory: product.subcategory,
          image: product.image,
          quantity: product.quantity,
        },
        totalAmount: itemTotalAmount.toFixed(2),
        totalQuantity: product.quantity
      };

      cartItems.push({ message: 'Item added to cart', item });
    }

    res.status(200).json({
      message: 'Items added to the cart successfully',
      cartItems,
      totalAmount: totalAmount.toFixed(2),
      totalQuantity
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not add items to the cart' });
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

    res.send(`${entityType} deleted successfully`);
  } catch (error) {
    res.status(500).send(error);
  }
};

