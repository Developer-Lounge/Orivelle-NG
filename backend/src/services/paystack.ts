import axios from 'axios';
import { env } from '../config/env.js';

const PAYSTACK_BASE = 'https://api.paystack.co';

if (!env.PAYSTACK_SECRET_KEY) {
  console.warn('PAYSTACK_SECRET_KEY is not set. Paystack calls will fail.');
}

export async function initializeTransaction({
  email,
  amount, // in Naira (float)
  callback_url,
  metadata,
}: {
  email: string;
  amount: number;
  callback_url: string;
  metadata?: Record<string, any>;
}) {
  const url = `${PAYSTACK_BASE}/transaction/initialize`;

  const payload = {
    email,
    amount: Math.round(amount * 100), // convert to kobo
    callback_url,
    metadata: metadata || {},
  };

  const headers = {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  const resp = await axios.post(url, payload, { headers });
  return resp.data; // caller will handle data.status / data.data
}

export async function verifyTransaction(reference: string) {
  const url = `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`;
  const headers = { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` };
  const resp = await axios.get(url, { headers });
  return resp.data;
}

export default { initializeTransaction, verifyTransaction };
