const DownList = require('../Model/TabsList_Model'); // Assuming you have a 'Item' model


// Create Post Method
exports.create =  async (req, res) => {
    try {
      const { Fashion } = req.body.Data;
  
      await DownList.insertMany(Fashion);
  
      res.status(201).json(Fashion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


  exports.getAll = async (req, res) => {
    try {
      // Fetch data from your model (Assuming DownList is your Mongoose model for Fashion)
      const fetchedData = await DownList.find().lean().exec();
  
      const formattedData = fetchedData.map(item => {
        const { _id, name, tab, total_count, content } = item;
  
        // Ensure that content is correctly mapped to HairCare, SkinCare, HygienicCare
        const formattedItem = {
          _id,
          name,
          tab: tab.map(t => ({ type: t.type })),
          total_count,
          content: {
            HairCare: content.HairCare,
            SkinCare: content.SkinCare,
            HygienicCare: content.HygienicCare
          }
        };
  
        return formattedItem;
      });
  
      const responseData = {
        Message: "Tabs fetched successfully",
        Data: {
          Fashions: formattedData
        }
      };
  
      res.status(200).json(responseData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
  
// delete method
exports.delete = (req, res) => {
    const id = req.params.id
    DownList.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(`category not found with ${id}`)
            } else {
                res.send("category deleted successfully")
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
  }

