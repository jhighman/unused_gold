// repositories/ItemRepository.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const itemSchema = new mongoose.Schema({
  step: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Step' // Reference to the Step model
  },
  itemIdentifier: String,
  itemName: String,
  startTime: Date,
  finishTime: Date,
  status: String,
});

const Item = mongoose.model('Item', itemSchema);

class ItemRepository {
  async createItem(step, operation) {
    const item = new Item({
      step: step._id, // Associate the item with the specified Step
      itemIdentifier: `${operation}-${Date.now()}`, // Unique item identifier with operation prefix
      itemName: operation, // Set the itemName to the string value of the operation
      startTime: new Date(),
      status: 'started'
    });
    await item.save();
    logger.info(`Item started: ${item.itemName}`);
    return item;
  }

  async updateItem(item, status) {
    if (!item || !status) {
      throw new Error('Item and status are required for updating item finish time');
    }
    item.finishTime = new Date();
    item.status = status;
    await item.save();
    logger.info(`Item finished: ${item.itemIdentifier} with status: ${status}`);
  }
}

module.exports = ItemRepository;
