const OrderDetails = require("../Model/OrderDetaills_Model")


exports.create = async (req, res) => {
    try {
      const orderdetailsData = req.body;
  
      if (!orderdetailsData.quantity) {
        return res.status(400).json({ error: 'Quantity is required' });
      }
  
      // Calculate the total amount and total quantity
      const totalAmount = Number(orderdetailsData.amount) * Number(orderdetailsData.quantity); // Fix variable name
      const totalQuantity = Number(orderdetailsData.quantity);
  
      const orderdetails = new OrderDetails(orderdetailsData);
      await orderdetails.save();
  
      // Create a response object
      const response = {
        message: 'Payment is successfully',
        Data: orderdetails,
        totalAmount: totalAmount.toFixed(2),
        totalQuantity,
      };
  
      res.status(201).json(response);
    } catch (error) {
      console.error('Error saving OrderDetails to the database:', error);
      res.status(500).json({ error: 'Could not save the OrderDetails to the database' });
    }
};

  //get method
exports.getAll = async (req, res) => {
    try {
        
        const records = await OrderDetails.find();

        const responseData = records.map((record) => {
            // Calculate the offer as an integer (e.g., 4% => 4)

            return {
                Data: {
                    itemName: record.itemName,
                    quantity: record.quantity,
                    amount: record.amount,
                    paymentStatus: record.paymentStatus,
                    paymentmethod: record.paymentmethod,
                    locationInfo: record.locationInfo,
                    _id: record._id,
                    __v: record.__v,
                },
                totalAmount: (record.amount * record.quantity).toFixed(2),
                totalQuantity: record.quantity,
            };
        });
        const totalAmount = responseData.reduce((acc, item) => acc + parseFloat(item.totalAmount),0).toFixed(2);
        const totalQuantity =responseData.reduce((acc, item) => acc + item.totalQuantity, 0)
    

        res.status(200).send({ message: 'All items Payment added successfully',
          responseData,
        //  'Total Amount':totalAmount,
        //  'Total Quantity': totalQuantity,
         });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
};