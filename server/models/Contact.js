const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        trim: true,
    },
    serviceType: {
        type: String,
        enum: ['installation', 'maintenance', 'repair', 'consultation', 'other'],
        default: 'other',
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'completed', 'cancelled'],
        default: 'new',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Contact', contactSchema);