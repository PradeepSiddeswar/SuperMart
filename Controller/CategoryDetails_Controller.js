const CategoryDetails = require('../Model/CategoryDetails_Model')


exports.create = async (req, res) => {
    try {
      const requestData = req.body;
  
      const newCategoryDetails = new CategoryDetails(requestData);
  
      const savedCategoryDetails = await newCategoryDetails.save();
  
      res.status(201).json(savedCategoryDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  // get method 
  exports.getAll = async (req, res) => {
    try {
      const records = await CategoryDetails.find().select('-__v');
      const responseData = {
        message: 'All Category Added successfully',
         Data: records,
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
    CategoryDetails.findByIdAndDelete(id)
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