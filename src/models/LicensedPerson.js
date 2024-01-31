// models/LicensedPerson.js

const mongoose = require('mongoose');

const LicensedPersonSchema = new mongoose.Schema({
  // PII Fields
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  // License Fields
  license: {
    type: { type: String, required: true },
    issuingBody: { type: String, required: true },
    identifier: { type: String, required: true },
    identifierType: { type: String, required: true },
    expirationMonth: { type: Number, required: true, min: 1, max: 12 },
    expirationYear: { type: Number, required: true }
  }
});

module.exports = mongoose.model('LicensedPerson', LicensedPersonSchema);
