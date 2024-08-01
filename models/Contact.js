const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      age: {
        type: Number,
        required: true
      },
      lastContacted: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
      }
    // companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Contact', contactSchema);
