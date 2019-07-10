const express = require("express");
const router = express.Router();

const esHandler = require("../lib/esHandler");
esHandler.createIndices();

async function initializeId() {
  id = (await esHandler.getCount()) + 1;
  console.log(id);
}

let id = 0;
initializeId();

router.get("/contact", async (req, res, next) => {
  const result = await esHandler.searchContact(
    req.query.pageSize ? req.query.pageSize : 10000,
    req.query.page ? req.query.page : 0,
    {
      match_all: {}
    }
  );
  res.send(result);
});

router.get("/contact/:name", async (req, res, next) => {
  const result = await esHandler.searchContact(
    req.query.pageSize ? req.query.pageSize : 10000,
    req.query.page ? req.query.page : 0,
    {
      match: {
        name: String(req.params.name)
      }
    }
  );
  res.send(result);
});

router.post("/contact", async (req, res, next) => {
  const contact = {
    name: req.body.name,
    number: req.body.number,
    address: req.body.address,
    email: req.body.email
  };
  const result = await esHandler.insertContact(++id, contact);
  res.send(result);
});

router.put("/contact/:name", async (req, res, next) => {
  let result = await esHandler.searchContact(1, 0, {
    match: { name: String(req.params.name) }
  });
  if (result.length === 0) {
    res.send("contact not found");
    return;
  }
  const contact = {
    name: req.body.name ? req.body.name : result[0]._source.name,
    number: req.body.number ? req.body.number : result[0]._source.number,
    address: req.body.address ? req.body.address : result[0]._source.address,
    email: req.body.email ? req.body.email : result[0]._source.email
  };
  result = await esHandler.insertContact(result[0]._id, contact);
  res.send(result);
});

router.delete("/contact/:name", async (req, res, next) => {
  let result = await esHandler.searchContact(1, 0, {
    match: { name: String(req.params.name) }
  });
  if (result.length === 0) {
    res.send("contact not found");
    return;
  }
  result = await esHandler.deleteContact(result[0]._id);
  res.send(result);
});

module.exports = router;
