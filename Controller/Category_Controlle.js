const Category = require('../Model/Category_Model');
const Subcategory = require('../Model/Subcategory_Model');
const Item = require('../Model/Item-Mode');


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

        if (!productData.quantity) {
            return res.status(400).json({ error: 'Quantity is required' });
        }
        // Calculate the total price with the discount applied (decrease of 12%)
        const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));

        const totalQuantity = Number(productData.quantity);


        // Assuming you have a category field in the productData object, you can set categories_id dynamically
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





  /// get method with Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'id name image');
    res.json(categories);
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
                    addToCart: `/add-to-cart/${item._id}` // URL to add a specific item to the cart
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

// MultiPle Add-to-cart
exports.getCartItems = async (req, res) => {
  try {
    const productIds = req.body.productIds; // Assuming the request body contains an array of product IDs

    const products = await Item.find({ _id: { $in: productIds } });

    if (products.length > 0) {
      const cartItems = products.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        offer: product.offer,
        size: product.size,
        subcategory: product.subcategory,
        image: product.image,
        quantity: product.quantity,
        // Include other details as needed
      }));

      res.status(200).json(cartItems);
    } else {
      res.status(404).json({ error: 'No products found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve product details' });
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
  
