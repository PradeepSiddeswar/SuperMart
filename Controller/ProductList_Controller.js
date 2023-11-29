const ProductList = require('../Model/ProductList_Model');
const mongoose = require('mongoose');
const uuid = require('uuid'); // Import the uuid library

exports.create = async (req, res) => {
    try {
        const productData = req.body;

        if (!productData.quantity) {
            return res.status(400).json({ error: 'Quantity is required' });
        }

        // Generate a new UUID (UUIDv4)
        const newUuid = uuid.v4();

        // Calculate the total price with the discount applied (decrease of 12%)
        const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));

        const totalQuantity = Number(productData.quantity);

        productData.uuid = newUuid;

        const categories_id = productData.categoryId; 

        const product = new ProductList(productData);
        await product.save();

        // Create a response object
        const response = {
            product,
            totalPrice: totalPrice.toFixed(2),
            totalQuantity,
            newUuid,
            categories_id,

        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error saving product to the database:', error);
        res.status(500).json({ error: 'Could not save the product to the database' });
    }
};


exports.getAll = async (req, res) => {
    try {
        const records = await ProductList.find();

        let categories_id = ''; // Initialize categories_id as an empty string

        if (records.length > 0) {
            // Set categories_id based on the category of the first product
            categories_id = records[0].categories_id; 
        }

        const responseData = records.map((record) => {
            const offerAsInteger = parseInt(record.offer);

            return {
                product: {
                    image: record.image,
                    itemName: record.itemName,
                    size: record.size,
                    price: record.price,
                    quantity: record.quantity,
                    offer: offerAsInteger,
                    _id: record._id,
                    __v: record.__v,
                    uuid: record.uuid,
                },
                totalPrice: (record.price * record.quantity * (1 - (offerAsInteger / 100))).toFixed(2),
                totalQuantity: record.quantity,
            };
        });

        const totalPrice = responseData.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2);
        const totalQuantity = responseData.reduce((acc, item) => acc + item.totalQuantity, 0);

        const response = {
            message: 'All items added successfully',
            categories_id,
            data: responseData,
            'Total Price': totalPrice,
            'Total Quantity': totalQuantity,
        };

        res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
};







// getItemById method for retrieving an item by ID

exports.getItemById = async (req, res) => {
    const id = req.params.id;

    try {
        const record = await ProductList.findById(id);

        if (!record) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Calculate the offer as an integer (e.g., 4% => 4)
        const offerAsInteger = parseInt(record.offer);

        // Calculate the total price for the item
        const totalPrice = (record.price * record.quantity * (1 - (offerAsInteger / 100))).toFixed(2);

        // Generate a new UUID
        const newUuid = uuid.v4();

        const responseData = {
            product: {
                image: record.image,
                itemName: record.itemName,
                size: record.size,
                price: record.price,
                quantity: record.quantity,
                offer: offerAsInteger,
                _id: record._id,
                __v: record.__v,
            },
            totalPrice,
            totalQuantity: record.quantity,
            newUuid,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        res.status(500).json({ error: 'Error fetching item by ID', message: error.message });
    }
};



// Delete Item by newUuid method
exports.delete = (req, res) => {
    const newUuid = req.params.newUuid; 

    try {
        ProductList.findOneAndDelete({ newUuid })
            .then(data => {
                if (!data) {
                    res.status(404).json({ message: 'Item not found' });
                } else {
                    res.status(200).json({ message: 'Item Deleted Successfully' });
                }
            })
            .catch(error => {
                res.status(500).json({ error: 'Error deleting item', message: error.message });
            });
    } catch (error) {
        res.status(400).json({ error: 'Invalid newUuid', message: error.message });
    }
}


exports.getAllItems = async (req, res) => {
    try {
        // Fetch all items from your database
        const allItems = await ProductList.find();

        const responseData = allItems.map((record) => {
            return {
                product: {
                    image: record.image,
                    itemName: record.itemName,
                    size: record.size,
                    price: record.price,
                    quantity: record.quantity,
                    offer: record.offer,
                    _id: record._id,
                    __v: record.__v,
                },
            };
        });

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching all items:', error);
        res.status(500).json({ error: 'Error fetching all items', message: error.message });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        const specificCategoryId = req.params.categories_id; 

        if (!specificCategoryId) {
            return res.status(400).json({ error: 'Missing categories_id parameter' });
        }

        // Fetch records for the specific category
        const records = await ProductList.find({ categories_id: specificCategoryId });

        const responseData = records.map((record) => {
            const offerAsInteger = parseInt(record.offer);

            return {
                product: {
                    image: record.image,
                    itemName: record.itemName,
                    size: record.size,
                    price: record.price,
                    quantity: record.quantity,
                    offer: offerAsInteger,
                    _id: record._id,
                    __v: record.__v,
                    uuid: record.uuid,
                },
                totalPrice: (record.price * record.quantity * (1 - (offerAsInteger / 100))).toFixed(2),
                totalQuantity: record.quantity,
            };
        });

        const totalPrice = responseData.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2);
        const totalQuantity = responseData.reduce((acc, item) => acc + item.totalQuantity, 0);

        const response = {
            message: 'Specific items for the specified category added successfully',
            categories_id: specificCategoryId,
            data: responseData,
            'Total Price': totalPrice,
            'Total Quantity': totalQuantity,
        };

        res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching specific items:', error);
        res.status(500).json({ error: 'Error fetching specific items', message: error.message });
    }
};
