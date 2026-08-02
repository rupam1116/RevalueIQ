import { Router } from 'express';
import { searchRepairShops, searchDonationCentres } from '../controllers/maps.controller';

const router = Router();

router.get('/repair-shops/search', searchRepairShops);
router.get('/donation-centres/search', searchDonationCentres);

export default router;
