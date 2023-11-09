const HomePage = require("../Model/HomePage_Model")

exports.create = async (req, res) => {
    const { title, image, image1, categories_id} = req.body;


    if (!image || !image1 ) {
        return res.status(400).json({ error: 'Image, Image1 are required fields' });
      }
  
    if (req.files) {
      image = req.files['image'][0]
        ? req.protocol + '://' + req.get('host') + '/uploads/' + req.files['image'][0].filename
        : '';
  
      image1 = req.files['image1'][0]
        ? req.protocol + '://' + req.get('host') + '/uploads/' + req.files['image1'][0].filename
        : '';
    }
  
    try {
      const homepage = new HomePage({ image, image1, title, categories_id });
      const saved = await homepage.save();
  
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

  //get method
exports.getAll = async (req, res) => {
    try {
      const records = await HomePage.find();
      const responseData = {
        message: 'All images upload successfully',
        data: records,
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
  };

  // delete method
exports.delete = (req, res) => {
    const id = req.params.id
    HomePage.findByIdAndDelete(id)
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