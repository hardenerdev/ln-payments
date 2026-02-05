import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { createInvoice, payInvoice } from "./api";
import { QR } from "../components/qr";
import appConfig from "../config/app.config";

export function App() {
  const [amount, setAmount] = useState(1000);
  const [memo, setMemo] = useState('Test payment');
  const [emitterUrl, setEmitterUrl] = useState(appConfig.emitterUrl);
  const [emitterCert, setEmitterCert] = useState(appConfig.emitterCert);
  const [emitterMacaroon, setEmitterMacaroon] = useState(appConfig.emitterMacaroon);
  const [payerUrl, setPayerUrl] = useState(appConfig.payerUrl);
  const [payerCert, setPayerCert] = useState(appConfig.payerCert);
  const [payerMacaroon, setPayerMacaroon] = useState(appConfig.payerMacaroon);
  const [invoice, setInvoice] = useState({
    amount: '',
    description: '',
    hash: '',
    expiry: '',
    paymentRequest: '',
  });
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [payed, setPayed] = useState('☠️ Invoice not payed');

  useEffect(() => {
    const socket = io(appConfig.apiUrl);

    socket.on('invoice:paid', () => {
      setPayed('⚡ Congrats, invoice payed!');
    });
  });

  const handleCreateInvoice = async () => {
    setLoading(true);
    const invoice = await createInvoice(
      amount,
      memo,
      emitterUrl,
      emitterCert,
      emitterMacaroon,
    );
    setInvoice(invoice);
    setLoading(false);
    setPayed('☠️ Invoice not payed');
  };
  const handlePayInvoice = async () => {
    setLoading(true);
    const payment = await payInvoice(
      invoice.paymentRequest,
      payerUrl,
      payerCert,
      payerMacaroon
    );
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
        <input
          value={emitterUrl}
          onChange={e => setEmitterUrl(e.target.value)}
          placeholder="Node URL"
        />
        <input
          value={emitterCert}
          onChange={e => setEmitterCert(e.target.value)}
          placeholder="HEX encoded node TLC certificate"
        />
        <input
          value={emitterMacaroon}
          onChange={e => setEmitterMacaroon(e.target.value)}
          placeholder="HEX encoded node macaroon"
        />

        <button onClick={handleCreateInvoice} disabled={loading}>
          Create invoice
        </button>
      </section>

      <section>
        <h2>{payed}</h2>
      </section>

      {invoice.paymentRequest != '' && (
        <section>
          <h2>Invoice</h2>
          <pre>{JSON.stringify(invoice, null, 2)}</pre>
          <QR invoice={invoice.paymentRequest} />
          <input
            value={payerUrl}
            onChange={e => setPayerUrl(e.target.value)}
            placeholder="Node URL"
          />
          <input
            value={payerCert}
            onChange={e => setPayerCert(e.target.value)}
            placeholder="HEX encoded node TLC certificate"
          />
          <input
            value={payerMacaroon}
            onChange={e => setPayerMacaroon(e.target.value)}
            placeholder="HEX encoded node macaroon"
          />
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
