const Cooking = require("../Model/CookingVessels_Model")

exports.create = async (req, res) => {
    const { name, image,} = req.body;


    if (!req.body) {
        return res.status(400).json({ error: 'Content Cont Be Empty' });
      }
  
    try {
      const kitchen = new Cooking({name, image });
      const saved = await kitchen.save();


    res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


    //Get method

    exports.getAll = async (req, res) => {
        try {
          const  CookingVessels = await Cooking.find();
      
      
          const formattedItems = CookingVessels.map(item => {
            const { name , image} = item;
         
      
            return {
              Product: {
                _id: item._id,
                name: item.name,
                image: item.image,
            
              },
            };
          });
      
          res.json({  CookingVessels: formattedItems });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      };
      
    
      // Delete method
    
    exports.delete = (req, res) => {
        const id = req.params.id
        Cooking.findByIdAndDelete(id)
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