const Beautyproducts = require("../Model/BeautyProducts_Model")

exports.create = async (req, res) => {
    const { name, price, offer, size, quantity, image,} = req.body;


    if (!req.body) {
        return res.status(400).json({ error: 'Content Cont Be Empty' });
      }
  
    try {
      const kitchen = new Beautyproducts({name, price, offer, size, quantity, image });
      const saved = await kitchen.save();


    res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


    //Get method

    exports.getAll = async (req, res) => {
        try {
          const  BeautypPoducts = await Beautyproducts.find();
      
      
          const formattedItems = BeautypPoducts.map(item => {
            const { quantity, price, offer } = item;
            const totalAmount = price * quantity * (1 - offer / 100);
            const status = quantity > 0 ? 'in stock' : 'out of stock';
      
            return {
              Product: {
                _id: item._id,
                name: item.name,
                price: item.price,
                offer: item.offer,
                size: item.size,
                image: item.image,
                quantity: item.quantity,
                status: status
              },
              totalAmount: totalAmount.toFixed(2), // Calculated total amount
              totalQuantity: item.quantity, // Using the existing quantity
            };
          });
      
          res.json({  BeautypPoducts: formattedItems });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      };
      
    
      // Delete method
    
    exports.delete = (req, res) => {
        const id = req.params.id
        Beautyproducts.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(400).send(` Product not found with ${id}`)
                } else {
                    res.send(" Product Deleted successfully")
                }
            })
            .catch(error => {
                res.status(500).send(error)
            })
      }