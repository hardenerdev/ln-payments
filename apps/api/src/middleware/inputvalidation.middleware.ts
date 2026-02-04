import {
  body,
  param,
  validationResult,
} from 'express-validator';
import {
  Request,
  Response,
  NextFunction
} from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

export const validateGenerateInvoice = [
  body('amount')
    .isInt({min: 1})
    .withMessage('Amount > 0'),
  body('memo')
    .isString()
    .trim()
    .withMessage('Memo is a description string'),
  handleValidationErrors,
];

export const validateTransactionByHash = [
  param('payment_hash')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Transaction hash cannot be empty string'),
  handleValidationErrors,
];

export const validatePayment = [
  body('paymentRequest')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Payment request cannot be empty string'),
  handleValidationErrors,
];
