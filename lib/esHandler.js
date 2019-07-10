const { node } = require("../lib/properties");
const { indexName } = require("../lib/properties");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: node });

async function getCount() {
  try {
    const result = await client.count({ index: indexName });
    id = result.body.count;
    return result.body.count;
  } catch (error) {
    return 0;
  }
}

async function createIndices() {
  try {
    const result = await client.indices.create({ index: indexName });
    console.log(result.body.acknowledged);
  } catch (error) {
    console.log(error.meta.body.error.reason);
  }
}

async function searchContact(pageSize, page, query) {
  const body = {
    size: pageSize,
    from: page,
    query: query
  };
  try {
    const result = await client.search({ index: indexName, body: body });
    return result.body.hits.hits;
  } catch (error) {
    return [];
  }
}

async function insertContact(id, contact) {
  try {
    const result = await client.index({
      index: indexName,
      id: id,
      body: contact
    });
    return result.body.result;
  } catch (error) {
    return error.meta.body.error.reason;
  }
}

async function deleteContact(id) {
  try {
    const result = await client.delete({
      index: indexName,
      id: id
    });
    return result.body.result;
  } catch (error) {
    return error.meta.body.error.reason;
  }
}

module.exports.client = client;
module.exports.getCount = getCount;
module.exports.createIndices = createIndices;
module.exports.searchContact = searchContact;
module.exports.insertContact = insertContact;
module.exports.deleteContact = deleteContact;
