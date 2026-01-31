import {
  Request,
  Response,
} from 'express';
import {
  createInvoice,
  getInvoice,
  getPayment,
  pay,
} from "lightning";
import {
  nodes
} from "../services/lnd.services";

export const generateInvoice = async (req: Request, res: Response) => {
  const { amount, memo } = req.body;

  try {
    const invoice = await createInvoice({
      lnd: nodes.receiver.lnd,
      tokens: amount,
      description: memo,
    });

    res.json({
      paymentRequest: invoice.request,
      hash: invoice.id
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
  console.log(paymentRequest)
  try {
    const payment = await pay({
      lnd: nodes.sender.lnd,
      request: paymentRequest,
    });

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
