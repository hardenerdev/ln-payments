import { Router } from 'express';
import {
  generateInvoice,
  getInvoiceByHash,
  getPaymentByHash,
  payment
} from '../controllers/lightning.controller';

const lightningRouter: Router = Router();

lightningRouter.post('/api/invoice', generateInvoice);
lightningRouter.get('/api/invoice/:payment_hash', getInvoiceByHash);
lightningRouter.post('/api/pay', payment);
lightningRouter.get('/api/payment/:payment_hash', getPaymentByHash);

export default lightningRouter;
