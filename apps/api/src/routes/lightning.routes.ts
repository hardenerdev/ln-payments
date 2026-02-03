import { Router } from 'express';
import {
  generateInvoice,
  getInvoiceByHash,
  getPaymentByHash,
  getTransactions,
  payment
} from '../controllers/lightning.controller';

const lightningRouter: Router = Router();

lightningRouter.post('/api/invoice', generateInvoice);
lightningRouter.get('/api/invoice/:payment_hash', getInvoiceByHash);
lightningRouter.post('/api/payment', payment);
lightningRouter.get('/api/payment/:payment_hash', getPaymentByHash);
lightningRouter.get('/api/transactions', getTransactions);
// lightningRouter.get('/api/balance', getBalance);

export default lightningRouter;
