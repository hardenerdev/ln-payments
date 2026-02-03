export const insertInvoice =
  `INSERT INTO invoices (id, created_at, memo, tokens, payment, payment_request) VALUES ($1, $2, $3, $4, $5, $6)`
;

export const insertPayment =
  `INSERT INTO payments (id, confirmed_at, tokens, fee, confirmed, outgoing, preimage) VALUES ($1, $2, $3, $4, $5, $6, $7)`
;

export const getInvoices =
  `SELECT * FROM invoices`
;

export const getPayments =
  `SELECT * FROM payments`
;

export const updatePayment =
  `UPDATE payments SET confirmed_at = $1 WHERE id = $2`
;
