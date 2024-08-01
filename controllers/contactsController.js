const Contact = require('../models/Contact');


exports.addContacts = async (req, res) => {
    try {
        console.log(req.body)
        const actions = await Contact.insertMany(req.body);
        res.status(201).json(actions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};