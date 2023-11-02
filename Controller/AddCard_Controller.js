const mongoose = require('mongoose');
const AddCard = require('../Model/AddCard_Model');


exports.create = async (req, res) => {
    try {
        const productData = req.body;

        if (!productData.quantity) {
            return res.status(400).json({ error: 'Quantity is required' });
        }

        // Calculate the total price with the discount applied (decrease of 12%)
        const totalPrice = Number(productData.price) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));

        const totalQuantity = Number(productData.quantity);

        const product = new AddCard(productData);
        await product.save();

        // Create a response object
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

//get method
exports.getAll = async (req, res) => {
    try {
        const records = await AddCard.find();

        const responseData = {
            message: 'All items added successfully',
            data: records.map((record) => {
                const itemTotalPrice = record.price * record.quantity * (1 - record.offer);
                const itemTotalQuantity = record.quantity;

                // Parse the "offer" string to a float (number)
                const offerAsNumber = parseFloat(record.offer);

                return {
                    ...record._doc,
                    offer: offerAsNumber, // Store "offer" as a number
                    totalPrice: itemTotalPrice.toFixed(2),
                    totalQuantity: itemTotalQuantity,
                };
            }),
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
};


/// getItemById 
exports.getItemById = async (req, res) => {
    try {
        const itemId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            console.error('Invalid Item ID');
            return res.status(400).json({ message: "Invalid Item ID" });
        }

        const item = await AddCard.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Calculate total price and total quantity for the specific item
        const itemTotalPrice = item.price * item.quantity * (1 - item.offer);
        const itemTotalQuantity = item.quantity;

        // Include "totalPrice" and "totalQuantity" in the response
        const response = {
            ...item._doc,
            totalPrice: itemTotalPrice.toFixed(2),
            totalQuantity: itemTotalQuantity,
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// delete method
exports.delete = (req, res) => {
    const id = req.params.id
    AddCard.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(`category products not found with ${id}`)
            } else {
                res.send(
                    {
                        message: "Products Deleted Successfully"
                    }
                )
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
}


