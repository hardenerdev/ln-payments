import request from 'supertest';
import app from '../../src/app';
import * as lightningController from '../../src/controllers/lightning.controller';

jest.mock('../../src/controllers/lightning.controller');
jest.mock('../../src/db/postgres');

const mockedGenerateInvoice = lightningController.generateInvoice as jest.MockedFunction<typeof lightningController.generateInvoice>;
const mockedGetInvoiceByHash = lightningController.getInvoiceByHash as jest.MockedFunction<typeof lightningController.getInvoiceByHash>;
const mockedPayment = lightningController.payment as jest.MockedFunction<typeof lightningController.payment>;
const mockedGetPaymentByHash = lightningController.getPaymentByHash as jest.MockedFunction<typeof lightningController.getPaymentByHash>;
const mockedGetTransactions = lightningController.getTransactions as jest.MockedFunction<typeof lightningController.getTransactions>;

describe('Lightning routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/invoice', () => {
    it('should generate an invoice successfully', async () => {
      const mockInvoiceData = {
        amount: 1000,
        description: 'Test invoice',
        hash: 'test_hash_123',
        expiry: '2026-02-04T12:00:00.000Z',
        paymentRequest: 'lnbc1000n1...',
      };

      mockedGenerateInvoice.mockImplementation(async (req, res) => {
        res.status(200).json(mockInvoiceData);
      });

      const response = await request(app)
        .post('/api/invoice')
        .send({
          amount: 1000,
          memo: 'Test invoice',
          nodeUrl: 'Node URL',
          nodeCert: 'Node cert',
          nodeMacaroon: 'Node macaroon',
        })
        .expect(200);

      expect(response.body).toEqual(mockInvoiceData);
      expect(mockedGenerateInvoice).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when generating invoice fails', async () => {
      const mockError = { error: 'Failed to generate invoice' };

      mockedGenerateInvoice.mockImplementation(async (req, res) => {
        res.status(500).json(mockError);
      });

      const response = await request(app)
        .post('/api/invoice')
        .send({
          amount: 1000,
          memo: 'Test invoice',
          nodeUrl: 'Node URL',
          nodeCert: 'Node cert',
          nodeMacaroon: 'Node macaroon',
        })
        .expect(500);

      expect(response.body).toEqual(mockError);
    });

    it('should handle missing request body parameters', async () => {
      mockedGenerateInvoice.mockImplementation(async (req, res) => {
        res.status(200).json({});
      });

      const response = await request(app)
        .post('/api/invoice')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors[0]).toMatchObject({
        msg: 'Amount > 0',
      });
    });
  });

  describe('GET /api/invoice/:payment_hash', () => {
    it('should retrieve an invoice by payment hash', async () => {
      const mockInvoice = {
        invoice: {
          id: 'test_hash_123',
          tokens: 1000,
          description: 'Test invoice',
          is_confirmed: false,
        },
      };

      mockedGetInvoiceByHash.mockImplementation(async (req, res) => {
        res.status(200).json(mockInvoice);
      });

      const response = await request(app)
        .get('/api/invoice/test_hash_123')
        .expect(200);

      expect(response.body).toEqual(mockInvoice);
      expect(mockedGetInvoiceByHash).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when invoice not found', async () => {
      const mockError = { error: 'Invoice not found' };

      mockedGetInvoiceByHash.mockImplementation(async (req, res) => {
        res.status(500).json(mockError);
      });

      const response = await request(app)
        .get('/api/invoice/nonexistent_hash')
        .expect(500);

      expect(response.body).toEqual(mockError);
    });
  });

  describe('POST /api/payment', () => {
    it('should process a payment successfully', async () => {
      const mockPaymentData = {
        fee: 1,
        preimage: 'preimage_secret_123',
        hash: 'payment_hash_123',
      };

      mockedPayment.mockImplementation(async (req, res) => {
        res.status(200).json(mockPaymentData);
      });

      const response = await request(app)
        .post('/api/payment')
        .send({
          paymentRequest: 'lnbc1000n1...',
          nodeUrl: 'Node URL',
          nodeCert: 'Node cert',
          nodeMacaroon: 'Node macaroon',
        })
        .expect(200);

      expect(response.body).toEqual(mockPaymentData);
      expect(mockedPayment).toHaveBeenCalledTimes(1);
    });

    it('should handle payment errors', async () => {
      const mockError = { error: 'Payment failed' };

      mockedPayment.mockImplementation(async (req, res) => {
        res.status(500).json(mockError);
      });

      const response = await request(app)
        .post('/api/payment')
        .send({
          paymentRequest: 'invalid_request',
          nodeUrl: 'Node URL',
          nodeCert: 'Node cert',
          nodeMacaroon: 'Node macaroon',
        })
        .expect(500);

      expect(response.body).toEqual(mockError);
    });

    it('should handle missing payment request', async () => {
      mockedPayment.mockImplementation(async (req, res) => {
        res.status(200).json({});
      });

      const response = await request(app)
        .post('/api/payment')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors[1]).toMatchObject({
        msg: 'Payment request cannot be empty string',
      });
    });
  });

  describe('GET /api/payment/:payment_hash', () => {
    it('should retrieve a payment by payment hash', async () => {
      const mockPayment = {
        payment: {
          id: 'payment_hash_123',
          tokens: 1000,
          fee: 1,
          is_confirmed: true,
        },
      };

      mockedGetPaymentByHash.mockImplementation(async (req, res) => {
        res.status(200).json(mockPayment);
      });

      const response = await request(app)
        .get('/api/payment/payment_hash_123')
        .expect(200);

      expect(response.body).toEqual(mockPayment);
      expect(mockedGetPaymentByHash).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when payment not found', async () => {
      const mockError = { error: 'Payment not found' };

      mockedGetPaymentByHash.mockImplementation(async (req, res) => {
        res.status(500).json(mockError);
      });

      const response = await request(app)
        .get('/api/payment/nonexistent_hash')
        .expect(500);

      expect(response.body).toEqual(mockError);
    });
  });

  describe('GET /api/transactions', () => {
    it('should retrieve all transactions', async () => {
      const mockTransactions = {
        invoices: [
          {
            id: 'invoice_1',
            tokens: 1000,
            description: 'Invoice 1',
          },
        ],
        payments: [
          {
            id: 'payment_1',
            tokens: 500,
            fee: 1,
          },
        ],
      };

      mockedGetTransactions.mockImplementation(async (req, res) => {
        res.status(200).json(mockTransactions);
      });

      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      expect(response.body).toEqual(mockTransactions);
      expect(mockedGetTransactions).toHaveBeenCalledTimes(1);
    });

    it('should handle empty transaction lists', async () => {
      const mockEmptyTransactions = {
        invoices: [],
        payments: [],
      };

      mockedGetTransactions.mockImplementation(async (req, res) => {
        res.status(200).json(mockEmptyTransactions);
      });

      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      expect(response.body).toEqual(mockEmptyTransactions);
    });

    it('should handle errors when retrieving transactions', async () => {
      const mockError = { error: 'Failed to retrieve transactions' };

      mockedGetTransactions.mockImplementation(async (req, res) => {
        res.status(500).json(mockError);
      });

      const response = await request(app)
        .get('/api/transactions')
        .expect(500);

      expect(response.body).toEqual(mockError);
    });
  });
});
