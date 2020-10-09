import express from 'express';
import { ControllerData } from './controllerData.js';
const router = express.Router();

//  returning all pharmacies.
router.get('/pharmacies', async function (req, res) {
  const data = await new ControllerData().getPharmacies()
  res.send(data);
})

//  returning all pharmacies.
router.post('/set-pharmacies', async function (req, res) {
  const data = await new ControllerData().sendDataToServer()
  res.send(data);
})

export default router