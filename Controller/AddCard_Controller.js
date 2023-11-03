const mongoose = require('mongoose');
const AddCard = require('../Model/AddCard_Model');
const { response } = require('express');


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

        const responseData = records.map((record) => {
            // Calculate the offer as an integer (e.g., 4% => 4)
            const offerAsInteger = parseInt(record.offer);

            return {
                product: {
                    image: record.image,
                    itemName: record.itemName,
                    ItemDetails: record.ItemDetails,
                    price: record.price,
                    quantity: record.quantity,
                    offer: offerAsInteger,
                    _id: record._id,
                    __v: record.__v,
                },
                totalPrice: (record.price * record.quantity * (1 - (offerAsInteger / 100))).toFixed(2),
                totalQuantity: record.quantity,
            };
        });
        const totalPrice = responseData.reduce((acc, item) => acc + parseFloat(item.totalPrice),0).toFixed(2);
        const totalQuantity =responseData.reduce((acc, item) => acc + item.totalQuantity, 0)
    

        res.status(200).send({ message: 'All items added successfully',
         data: responseData,
         'Total Price':totalPrice,
         'Total Quantity': totalQuantity,
         });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
};


// getItemById method
exports.getItemById = async (req, res) => {
    const id = req.params.id; 

    try {
        const record = await AddCard.findById(id);

        if (!record) {
            // If the item with the given ID is not found, return a 404 Not Found response
            return res.status(404).json({ message: 'Item not found' });
        }

        // Calculate the offer as an integer (e.g., 4% => 4)
        const offerAsInteger = parseInt(record.offer);

        // Calculate the total price for the item
        const totalPrice = (record.price * record.quantity * (1 - (offerAsInteger / 100))).toFixed(2);

        // Create a response object with the item details and total price
        const responseData = {
            product: {
                image: record.image,
                itemName: record.itemName,
                ItemDetails: record.ItemDetails,
                price: record.price,
                quantity: record.quantity,
                offer: offerAsInteger,
                _id: record._id,
                __v: record.__v,
            },
            totalPrice,
            totalQuantity: record.quantity,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        res.status(500).json({ error: 'Error fetching item by ID', message: error.message });
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


