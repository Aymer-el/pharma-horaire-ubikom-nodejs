import express from 'express';
import { ControllerData } from './controllerData.js';
const router = express.Router();

//  returning all pharmacies from DB.
router.get('/pharmacies', async function (req, res) {
  const data = await new ControllerData().getPharmacies();
  res.send(data);
})


//  returning the closest pharmacie from a location.
// Casablanca's location is approximatively 33.0, -7.5
router.get('/closest-pharmacie', async function (req, res) {
  const data = await new ControllerData().getNearestPharmacies(req.query)
  res.send(data);
})


//  putting all pharmacies in db.
router.post('/set-pharmacies', async function (req, res) {
  const data = await new ControllerData().sendDataToServer()
  res.send(data);
})

//  returning all pharmacies from data.csv, not from DB
router.get('/check-pharmacies', async function (req, res) {
  const data = await new ControllerData().readCSVtoJSON()
  res.send(data);
})

export default router