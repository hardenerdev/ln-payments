import { Router } from 'express';
import {
  generateInvoice,
  getInvoiceByHash,
  getPaymentByHash,
  getTransactions,
  payment
} from '../controllers/lightning.controller';
import {
  validateGenerateInvoice,
  validatePayment,
  validateTransactionByHash,
} from '../middleware/inputvalidation.middleware';

const lightningRouter: Router = Router();

lightningRouter.post('/api/invoice', validateGenerateInvoice, generateInvoice);
lightningRouter.get('/api/invoice/:payment_hash', validateTransactionByHash, getInvoiceByHash);
lightningRouter.post('/api/payment', validatePayment, payment);
lightningRouter.get('/api/payment/:payment_hash', validateTransactionByHash, getPaymentByHash);
lightningRouter.get('/api/transactions', getTransactions);
// lightningRouter.get('/api/balance', getBalance);

export default lightningRouter;
