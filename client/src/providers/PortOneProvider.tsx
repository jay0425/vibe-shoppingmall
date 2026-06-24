'use client';

import Script from 'next/script';

type PortOnePaymentResponse = {
  code?: string;
  message?: string;
  paymentId?: string;
  transactionType?: string;
  txId?: string;
};

declare global {
  interface Window {
    PortOne?: {
      requestPayment: (params: {
        storeId: string;
        channelKey: string;
        paymentId: string;
        orderName: string;
        totalAmount: number;
        currency: 'CURRENCY_KRW';
        payMethod: 'CARD';
        customer?: {
          email?: string;
          fullName?: string;
          phoneNumber?: string;
        };
      }) => Promise<PortOnePaymentResponse | undefined>;
    };
  }
}

export function PortOneProvider() {
  return <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="afterInteractive" />;
}
