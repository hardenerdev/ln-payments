import appConfig from '../config/app.config';

const API_URL = appConfig.apiUrl;

export async function createInvoice(amount: number, memo: string, nodeUrl: string, nodeCert: string, nodeMacaroon: string) {
  const res = await fetch(`${API_URL}/api/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount, memo, nodeUrl, nodeCert, nodeMacaroon }),
  });

  return res.json();
}

export async function payInvoice(paymentRequest: string, nodeUrl: string, nodeCert: string, nodeMacaroon: string) {
  const res = await fetch(`${API_URL}/api/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ paymentRequest, nodeUrl, nodeCert, nodeMacaroon }),
  });

  return res.json();
}

export async function getTransactions() {
  const res = await fetch(`${API_URL}/api/transactions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return res.json();
}
