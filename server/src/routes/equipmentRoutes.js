import { Router } from 'express';
import { getEquipmentList, getEquipmentById } from '../controllers/equipmentController.js';

const router = Router();

router.get('/equipment', getEquipmentList);
router.get('/equipment/:id', getEquipmentById);

export default router;
