import {
  Request,
  Response,
} from 'express';
import {
  authenticatedLndGrpc,
  createInvoice,
  decodePaymentRequest,
  getInvoice,
  getPayment,
  pay,
  PayResult,
  subscribeToInvoice,
} from 'lightning';
import pool from '../db/postgres';
import {
  insertInvoice,
  insertPayment,
  getInvoices,
  getPayments,
  updatePayment,
  selectPaymentByHash,
  selectInvoiceByHash,
} from '../db/queries/postgres.queries';
import SocketService from '../services/socket.service';

const socket = SocketService.getInstance();

export const generateInvoice = async (req: Request, res: Response) => {
  const { amount, memo, nodeUrl, nodeCert, nodeMacaroon } = req.body;

  try {
    const { lnd } = authenticatedLndGrpc({
      socket: nodeUrl,
      cert: nodeCert,
      macaroon: nodeMacaroon,
    });

    const invoice = await createInvoice({
      lnd: lnd,
      tokens: amount,
      description: memo,
    });

    const decodedPayment = await decodePaymentRequest({
      request: invoice.request,
      lnd: lnd,
    });

    const invoicesUpdate = subscribeToInvoice({
      id: invoice.id,
      lnd: lnd,
    });

    invoicesUpdate.on('invoice_updated', async (invoice) => {
      await pool.query(updatePayment, [
        invoice.confirmed_at,
        invoice.id,
      ]);

      // emit after writing to database to ensure data consistency
      socket.emitEvent('invoice:updated', {
        id: invoice.id,
        confirmed: invoice.confirmed_at,
      });
    });
    
    await pool.query(insertInvoice, [
      invoice.id,
      invoice.created_at,
      invoice.description,
      invoice.tokens,
      invoice.payment,
      invoice.request,
    ]);

    const response = {
      amount: decodedPayment.tokens,
      description: decodedPayment.description,
      hash: decodedPayment.id,
      expiry: decodedPayment.expires_at,
      paymentRequest: invoice.request,
    };

    // emit after writing to database to ensure data consistency
    socket.emitEvent('invoice:created', response);

    res.json(response);
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const getInvoiceByHash = async (req: Request, res: Response) => {
  try {
    const invoice = await pool.query(selectInvoiceByHash, [
      req.params.payment_hash
    ]);

    res.json(invoice.rows);
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const payment = async (req: Request, res: Response) => {
  const { paymentRequest, nodeUrl, nodeCert, nodeMacaroon } = req.body;

  try {
    const { lnd } = authenticatedLndGrpc({
      socket: nodeUrl,
      cert: nodeCert,
      macaroon: nodeMacaroon,
    });

    const decodedPayment = await decodePaymentRequest({
      request: paymentRequest,
      lnd: lnd
    });

    const payment: PayResult = await pay({
      lnd: lnd,
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

    const response = {
      fee: payment.fee,
      preimage: payment.secret,
      hash: payment.id,
    };

    // emit after writing to database to ensure data consistency
    socket.emitEvent('invoice:paid', response);

    res.json(response);
  } catch (e) {
    res.status(500).json({
      error: e
    })
  }
};

export const getPaymentByHash = async (req: Request, res: Response) => {
  try {
    const payment = await pool.query(selectPaymentByHash, [
      req.params.payment_hash
    ]);

    res.json(payment.rows);
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
