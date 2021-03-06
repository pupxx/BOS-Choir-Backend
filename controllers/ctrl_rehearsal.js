const rehearsal = require('../models/mdl_rehearsal.js');

async function getAllRehearsals(req, res, next) {
  try {
    const rehearsals = await rehearsal.getAllRehearsals();
    res.send(rehearsals);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllRehearsals };
