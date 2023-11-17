const Fruit = require("../Model/FruitVeggies_Model")

exports.create = async (req, res) => {
    const { name, offer, image,} = req.body;


    if (!req.body) {
        return res.status(400).json({ error: 'Content Cont Be Empty' });
      }
  
    try {
      const kitchen = new Fruit({name, offer, image });
      const saved = await kitchen.save();


    res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


    //Get method

    exports.getAll = async (req, res) => {
        try {
          const  FruitsAndVeggies = await Fruit.find();
      
      
          const formattedItems = FruitsAndVeggies.map(item => {
            const { name , image} = item;
         
      
            return {
              Product: {
                _id: item._id,
                name: item.name,
                offer: item.offer,
                image: item.image,
            
              },
            };
          });
      
          res.json({  FruitsAndVeggies: formattedItems });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      };
      
    
      // Delete method
    
    exports.delete = (req, res) => {
        const id = req.params.id
        Fruit.findByIdAndDelete(id)
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