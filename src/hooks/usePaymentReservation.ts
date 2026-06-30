import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  cancelarReserva,
  confirmarReserva,
  criarReserva,
} from '@/services/fiscaltech/client';
import { getFiscalTechUserMessage } from '@/services/fiscaltech/errors';
import { isPassagePayable, sumPassagesCents } from '@/services/fiscaltech/mappers';
import type {
  MetodoPagamentoFiscal,
  PaymentReservationState,
} from '@/services/fiscaltech/types';
import type { Passage } from '@/data/mock';

function generatePaymentId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `PAG-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generateIdempotencyKey(prefix: string): string {
  return `${prefix}-${generatePaymentId()}`;
}

type UsePaymentReservationOptions = {
  passages: Passage[];
  enabled: boolean;
};

export function usePaymentReservation({ passages, enabled }: UsePaymentReservationOptions) {
  const [reservation, setReservation] = useState<PaymentReservationState | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorAction, setErrorAction] = useState<
    'refresh' | 'retry-reservation' | 'wait-cooldown' | 'go-back' | undefined
  >();
  const confirmKeyRef = useRef<string | null>(null);
  const reservationAttemptRef = useRef(0);
  const confirmedRef = useRef(false);
  const [countdownTick, setCountdownTick] = useState(0);

  const payablePassages = useMemo(
    () => passages.filter(isPassagePayable),
    [passages],
  );

  const valorEsperadoCents = useMemo(
    () => sumPassagesCents(payablePassages),
    [payablePassages],
  );

  useEffect(() => {
    if (!reservation?.expiresAt) return;
    const timer = setInterval(() => setCountdownTick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [reservation?.expiresAt]);

  const secondsRemaining = useMemo(() => {
    if (!reservation?.expiresAt) return null;
    const expiresMs = new Date(reservation.expiresAt).getTime();
    return Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
  }, [reservation?.expiresAt, isReserving, isConfirming, countdownTick]);

  const createReservation = useCallback(async () => {
    if (!enabled || payablePassages.length === 0) return null;

    setIsReserving(true);
    setErrorMessage(null);
    setErrorAction(undefined);

    try {
      const transacaoIds = payablePassages.map((passage) => passage.id);
      const idempotencyKey = generateIdempotencyKey(`reserva-${++reservationAttemptRef.current}`);
      const response = await criarReserva(
        {
          transacaoIds,
          valorEsperado: valorEsperadoCents,
        },
        idempotencyKey,
      );

      const nextReservation: PaymentReservationState = {
        reservaId: response.reservaId,
        expiresAt: response.expiresAt,
        valorTotalCents: response.valorTotal,
        transacaoIds: response.transacaoIds,
      };

      setReservation(nextReservation);
      return nextReservation;
    } catch (error) {
      const mapped = getFiscalTechUserMessage(error);
      setErrorMessage(mapped.message);
      setErrorAction(mapped.action);
      throw error;
    } finally {
      setIsReserving(false);
    }
  }, [enabled, payablePassages, valorEsperadoCents]);

  useEffect(() => {
    if (!enabled || payablePassages.length === 0) return;
    createReservation().catch(() => undefined);
  }, [enabled, payablePassages.map((p) => p.id).join(',')]);

  useEffect(() => {
    return () => {
      if (!enabled || !reservation?.reservaId || confirmedRef.current) return;
      cancelarReserva(reservation.reservaId).catch(() => undefined);
    };
  }, [enabled, reservation?.reservaId]);

  const cancelActiveReservation = useCallback(async () => {
    if (!reservation?.reservaId) return;
    try {
      await cancelarReserva(reservation.reservaId);
    } catch {
      // cancelamento best-effort ao sair da tela
    } finally {
      setReservation(null);
    }
  }, [reservation?.reservaId]);

  const confirmPayment = useCallback(
    async (metodoPagamento: MetodoPagamentoFiscal) => {
      if (!reservation?.reservaId) {
        throw new Error('Reserva não encontrada. Tente novamente.');
      }

      setIsConfirming(true);
      setErrorMessage(null);
      setErrorAction(undefined);

      if (!confirmKeyRef.current) {
        confirmKeyRef.current = generateIdempotencyKey('confirm');
      }

      try {
        const response = await confirmarReserva(
          reservation.reservaId,
          {
            comprovante: {
              identificadorPagamento: generatePaymentId(),
              metodoPagamento,
              valorPago: reservation.valorTotalCents,
            },
          },
          confirmKeyRef.current,
        );

        confirmedRef.current = true;
        return response;
      } catch (error) {
        const mapped = getFiscalTechUserMessage(error);
        setErrorMessage(mapped.message);
        setErrorAction(mapped.action);
        throw error;
      } finally {
        setIsConfirming(false);
      }
    },
    [reservation],
  );

  const resetReservation = useCallback(() => {
    confirmKeyRef.current = null;
    setReservation(null);
    setErrorMessage(null);
    setErrorAction(undefined);
  }, []);

  return {
    reservation,
    payablePassages,
    valorEsperadoCents,
    secondsRemaining,
    isReserving,
    isConfirming,
    errorMessage,
    errorAction,
    createReservation,
    cancelActiveReservation,
    confirmPayment,
    resetReservation,
  };
}
