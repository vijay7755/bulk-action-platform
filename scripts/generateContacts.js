const faker = require('@faker-js/faker');
const fs = require('fs');

// Number of contacts to generate
const numberOfContacts = 2000;

// Array to store generated contacts
let contacts = [];

// Function to generate a random date within the past year
function getRandomDateWithinPastYear() {
  const now = new Date();
  const pastYear = new Date(now.setFullYear(now.getFullYear() - 1));
  return faker.date.between(pastYear, new Date());
}

// Generate contacts
for (let i = 0; i < numberOfContacts; i++) {
  let contact = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    age: faker.random.number({ min: 18, max: 99 }),
    lastContacted: getRandomDateWithinPastYear(),
    status: 'active',  // Default status
    priority: 'low'    // Default priority
  };
  contacts.push(contact);
}

// Write contacts to a JSON file
fs.writeFileSync('contacts.json', JSON.stringify(contacts, null, 2));

console.log(`Generated ${numberOfContacts} contacts and saved to contacts.json`);
