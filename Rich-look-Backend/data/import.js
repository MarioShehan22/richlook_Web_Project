const { MongoClient } = require('mongodb');
const fs = require('fs');

(async () => {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db   = client.db('richlookDb');
    const coll = db.collection('products');
    const docs = JSON.parse(fs.readFileSync('woman.json', 'utf8'));
    await coll.insertMany(docs);
    console.log('Inserted', docs.length, 'documents');
    await client.close();
})();