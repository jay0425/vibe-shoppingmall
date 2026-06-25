import { env } from '../config/env.js';
import { HttpError } from '../utils/index.js';

type PortonePayment = {
  id: string;
  status: string;
  transactionId?: string;
  storeId?: string;
  amount?: {
    total?: number;
  };
  currency?: string;
};

type VerifyPaymentPayload = {
  paymentKey: string;
  expectedAmount: number;
};

const PORTONE_API_BASE_URL = 'https://api.portone.io';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parsePortonePayment = (value: unknown): PortonePayment => {
  if (!isRecord(value)) {
    throw new HttpError(502, '결제 검증 응답이 올바르지 않습니다.');
  }

  const amount = isRecord(value.amount) ? value.amount : undefined;

  // 포트원 응답에서 주문 검증에 필요한 필드만 안전하게 추림
  return {
    id: typeof value.id === 'string' ? value.id : '',
    status: typeof value.status === 'string' ? value.status : '',
    transactionId: typeof value.transactionId === 'string' ? value.transactionId : undefined,
    storeId: typeof value.storeId === 'string' ? value.storeId : undefined,
    amount: {
      total: typeof amount?.total === 'number' ? amount.total : undefined,
    },
    currency: typeof value.currency === 'string' ? value.currency : undefined,
  };
};

export const verifyPortonePayment = async ({
  paymentKey,
  expectedAmount,
}: VerifyPaymentPayload) => {
  // 결제 키로 포트원 결제 단건 조회 API 호출함
  const response = await fetch(
    `${PORTONE_API_BASE_URL}/payments/${encodeURIComponent(paymentKey)}`,
    {
      headers: {
        Authorization: `PortOne ${env.portoneApiSecret}`,
      },
    },
  );

  if (!response.ok) {
    // 사용자가 보내온 결제 키 자체가 없는 경우임
    if (response.status === 404) {
      throw new HttpError(400, '결제 내역을 찾을 수 없습니다.');
    }

    // API Secret이 틀렸거나 상점 권한이 없는 서버 설정 오류임
    if (response.status === 401 || response.status === 403) {
      throw new HttpError(502, '결제 검증 인증에 실패했습니다.');
    }

    throw new HttpError(502, '결제 검증에 실패했습니다.');
  }

  const payment = parsePortonePayment(await response.json());

  // 조회한 결제 건이 요청 결제 키와 같은 건인지 확인함
  if (payment.id !== paymentKey) {
    throw new HttpError(400, '결제 키가 일치하지 않습니다.');
  }

  // 다른 상점 결제 건으로 주문 생성하는 상황 차단함
  if (payment.storeId && payment.storeId !== env.portoneStoreId) {
    throw new HttpError(400, '결제 상점 정보가 일치하지 않습니다.');
  }

  // 실제 결제가 완료된 건만 주문 생성 허용함
  if (payment.status !== 'PAID') {
    throw new HttpError(400, '완료되지 않은 결제입니다.');
  }

  // 현재 주문 금액 계산은 원화 기준이라 다른 통화는 차단함
  if (payment.currency && payment.currency !== 'KRW') {
    throw new HttpError(400, '지원하지 않는 결제 통화입니다.');
  }

  // 포트원에 기록된 실제 결제 금액과 서버 계산 주문 금액 비교함
  if (payment.amount?.total !== expectedAmount) {
    throw new HttpError(400, '결제 금액이 주문 금액과 일치하지 않습니다.');
  }

  // DB에 저장할 검증 완료 결제 정보만 반환함
  return {
    paymentKey: payment.id,
    paymentAmount: payment.amount.total,
    paymentTransactionId: payment.transactionId,
  };
};
