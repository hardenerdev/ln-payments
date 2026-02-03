import {
  Request,
  Response,
} from 'express';
import {
  createInvoice,
  decodePaymentRequest,
  getInvoice,
  getPayment,
  pay,
  PayResult,
  subscribeToInvoices,
} from 'lightning';
import {
  nodes
} from '../services/lnd.services';
import pool from '../db/postgres';
import {
  insertInvoice,
  insertPayment,
  getInvoices,
  getPayments,
  updatePayment,
} from '../db/queries/postgres.queries';

const invoicesUpdate = subscribeToInvoices({
  lnd: nodes.receiver.lnd,
});

invoicesUpdate.on('invoice_updated', async (invoice) => {
  await pool.query(updatePayment, [
    invoice.created_at,
    invoice.id,
  ]);
});

export const generateInvoice = async (req: Request, res: Response) => {
  const { amount, memo } = req.body;

  try {
    const invoice = await createInvoice({
      lnd: nodes.receiver.lnd,
      tokens: amount,
      description: memo,
    });

    const decodedPayment = await decodePaymentRequest({
      request: invoice.request,
      lnd: nodes.receiver.lnd
    });
    
    await pool.query(insertInvoice, [
      invoice.id,
      invoice.created_at,
      invoice.description,
      invoice.tokens,
      invoice.payment,
      invoice.request,
    ]);

    res.json({
      amount: decodedPayment.tokens,
      description: decodedPayment.description,
      hash: decodedPayment.id,
      expiry: decodedPayment.expires_at,
      paymentRequest: invoice.request,
    });
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const getInvoiceByHash = async (req: Request, res: Response) => {
  try {
    const invoice = await getInvoice({
      id: req.params.payment_hash,
      lnd: nodes.receiver.lnd,
    });

    res.json({ invoice });
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const payment = async (req: Request, res: Response) => {
  const { paymentRequest } = req.body;

  try {
    const payment: PayResult = await pay({
      lnd: nodes.sender.lnd,
      request: paymentRequest,
    });

    await pool.query(insertPayment, [
      payment.id,
      payment.confirmed_at,
      payment.tokens,
      payment.fee,
      payment.is_confirmed,
      payment.is_outgoing,
      payment.secret,
    ]);

    res.json({
      fee: payment.fee,
      preimage: payment.secret,
      hash: payment.id,
    });
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const getPaymentByHash = async (req: Request, res: Response) => {
  try {
    const payment = await getPayment({
      id: req.params.payment_hash,
      lnd: nodes.sender.lnd,
    });

    res.json({ payment });
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const invoices = await pool.query(getInvoices);
    const payments = await pool.query(getPayments);

    res.json({
      invoices: invoices.rows,
      payments: payments.rows,
    });
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};
