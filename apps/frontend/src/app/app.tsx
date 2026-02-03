import { useState } from "react";
import { createInvoice, payInvoice } from "./api";
import { QR } from "../components/qr";

export function App() {
  const [amount, setAmount] = useState(1000);
  const [memo, setMemo] = useState('Test payment');
  const [invoice, setInvoice] = useState({
    amount: '',
    description: '',
    hash: '',
    expiry: '',
    paymentRequest: '',
  });
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateInvoice = async () => {
    setLoading(true);
    const invoice = await createInvoice(amount, memo);
    setInvoice(invoice);
    setLoading(false);
  };
  const handlePayInvoice = async () => {
    setLoading(true);
    const payment = await payInvoice(invoice.paymentRequest);
    setPayment(payment);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>⚡ Lightning payments</h1>

      <section>
        <h2>Create Invoice</h2>

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          placeholder="Sats"
        />
        <input
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="Memo"
        />

        <button onClick={handleCreateInvoice} disabled={loading}>
          Create invoice
        </button>
      </section>

      {invoice.paymentRequest != '' && (
        <section>
          <h2>Invoice</h2>
          <pre>{JSON.stringify(invoice, null, 2)}</pre>
          <QR invoice={invoice.paymentRequest} />
          <button onClick={handlePayInvoice} disabled={loading}>
            Pay invoice
          </button>
        </section>
      )}

      {payment && (
        <section>
          <h2>Payment Result</h2>
          <pre>{JSON.stringify(payment, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}

export default App;
