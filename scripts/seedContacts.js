const mongoose = require("mongoose");
const Contact = require("./../models/Contact");

async function seedContacts() {
  await mongoose.connect("mongodb://localhost:27017/bulk-action-platform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const contacts = require("../resources/contacts.json");

  await Contact.insertMany(contacts);
  console.log("contacts seeded!");
  mongoose.disconnect();
}

seedContacts();
