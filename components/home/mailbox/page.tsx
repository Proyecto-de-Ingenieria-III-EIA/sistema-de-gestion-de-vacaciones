'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Inbox, MailX, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import {
  GET_PENDING_REQUESTED_ABSENCES,
  GET_PENDING_SPONT_ABSENCES,
} from '@/graphql/connections/mailbox/queries';
import {
  DECIDE_REQUESTED_ABSENCE,
  DECIDE_SPONTANEOUS_ABSENCE,
} from '@/graphql/connections/mailbox/mutations';

/* ------------------------------------------------------------------ */
type AbsenceType = 'VACATION' | 'INFORMAL' | 'SPONTANEOUS';

type Absence = {
  dbId: string;
  startDate: string;
  endDate: string;
  type: AbsenceType;
  colaborator: { id: string; name: string | null };
  justification?: { description?: string | null } | null;
  comments?: string | null;
};
/* ------------------------------------------------------------------ */

export default function MailboxPage() {
  /* ──────  Queries  ────── */
  const {
    data: reqData,
    loading: reqLoading,
    error: reqError,
    refetch: refetchReq,
  } = useQuery(GET_PENDING_REQUESTED_ABSENCES, { fetchPolicy: 'network-only' });

  const {
    data: spontData,
    loading: spontLoading,
    error: spontError,
    refetch: refetchSpont,
  } = useQuery(GET_PENDING_SPONT_ABSENCES, { fetchPolicy: 'network-only' });

  const loading = reqLoading || spontLoading;
  const error = reqError || spontError;

  /* ──────  Estado local  ────── */
  const [pending, setPending] = useState<Absence[]>([]);
  const [approved, setApproved] = useState<Absence[]>([]);
  const [rejected, setRejected] = useState<Absence[]>([]);

  /* ──────  Sincroniza pendientes al recibir datos  ────── */
  useEffect(() => {
    /*  Aseguramos que las espontáneas lleven type === "SPONTANEOUS"
        por si el back-end aún no lo envía.   */
    const spont = (spontData?.getPendingSpontaneousAbsences ?? []).map(
      (r: any) => ({ ...r, type: 'SPONTANEOUS' as const })
    );

    setPending([...(reqData?.getPendingRequestedAbsences ?? []), ...spont]);
  }, [reqData, spontData]);

  /* ──────  Mutaciones  ────── */
  const [decideReq] = useMutation(DECIDE_REQUESTED_ABSENCE, {
    onCompleted: () => refetchReq(),
    onError: (e) =>
      toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const [decideSpont] = useMutation(DECIDE_SPONTANEOUS_ABSENCE, {
    onCompleted: () => refetchSpont(),
    onError: (e) =>
      toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  /* ──────  Aprobar / Rechazar  ────── */
  async function handleDecision(
    request: Absence,
    decision: 'APROVED' | 'REJECTED'
  ) {
    try {
      if (request.type === 'SPONTANEOUS')
        await decideSpont({ variables: { absenceId: request.dbId, decision } });
      else
        await decideReq({ variables: { absenceId: request.dbId, decision } });

      setPending((p) => p.filter((r) => r.dbId !== request.dbId));
      decision === 'APROVED'
        ? setApproved((a) => [...a, request])
        : setRejected((r) => [...r, request]);

      toast({
        title: `Solicitud ${decision === 'APROVED' ? 'aprobada' : 'rechazada'}`,
      });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  /* ──────  Tarjeta  ────── */
  function RequestCard(req: Absence, withActions = true) {
    return (
      <Card key={req.dbId} className='mb-4'>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <CardTitle className='text-lg'>
              {req.colaborator.name ?? '—'}
            </CardTitle>

            <Badge
              variant={
                req.type === 'VACATION'
                  ? 'default'
                  : req.type === 'INFORMAL'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {req.type === 'VACATION'
                ? 'Vacaciones'
                : req.type === 'SPONTANEOUS'
                  ? 'Espontánea'
                  : 'Informal'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='pb-2 space-y-2'>
          <div className='flex items-center text-sm'>
            <Clock className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>
              {format(parseISO(req.startDate), 'PPP', { locale: es })} –{' '}
              {format(parseISO(req.endDate), 'PPP', { locale: es })}
            </span>
          </div>

          {req.justification?.description && (
            <p className='text-sm'>
              <strong>Motivo:</strong> {req.justification.description}
            </p>
          )}

          {req.type === 'SPONTANEOUS' && req.comments && (
            <p className='text-sm'>
              <strong>Comentario:</strong> {req.comments}
            </p>
          )}
        </CardContent>

        {withActions && (
          <CardFooter className='flex justify-end space-x-2 pt-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleDecision(req, 'REJECTED')}
            >
              <X className='mr-2 h-4 w-4' /> Rechazar
            </Button>
            <Button size='sm' onClick={() => handleDecision(req, 'APROVED')}>
              <Check className='mr-2 h-4 w-4' /> Aprobar
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  /* ──────  UI principal  ────── */
  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center mb-6'>
          <Inbox className='h-6 w-6 mr-2' />
          <h1 className='text-2xl font-bold'>Bandeja de Aprobaciones</h1>
        </div>

        {error && <p className='text-red-600 mb-4'>{error.message}</p>}

        <Tabs defaultValue='pending' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='pending' className='flex items-center'>
              <Clock className='mr-2 h-4 w-4' /> Pendientes
              {!!pending.length && (
                <Badge variant='secondary' className='ml-2'>
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value='approved' className='flex items-center'>
              <Check className='mr-2 h-4 w-4' /> Aprobadas
              {!!approved.length && (
                <Badge variant='secondary' className='ml-2'>
                  {approved.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value='rejected' className='flex items-center'>
              <X className='mr-2 h-4 w-4' /> Rechazadas
              {!!rejected.length && (
                <Badge variant='secondary' className='ml-2'>
                  {rejected.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='pending'>
            <Section
              title='Solicitudes Pendientes'
              loading={loading}
              empty={!pending.length}
            >
              {pending.map((r) => RequestCard(r))}
            </Section>
          </TabsContent>

          <TabsContent value='approved'>
            <Section
              title='Solicitudes Aprobadas'
              loading={false}
              empty={!approved.length}
            >
              {approved.map((r) => RequestCard(r, false))}
            </Section>
          </TabsContent>

          <TabsContent value='rejected'>
            <Section
              title='Solicitudes Rechazadas'
              loading={false}
              empty={!rejected.length}
            >
              {rejected.map((r) => RequestCard(r, false))}
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Section({
  title,
  loading,
  empty,
  children,
}: {
  title: string;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium'>{title}</h2>
      </div>
      <Separator />
      {loading ? (
        <div className='py-8 text-center'>
          <p>Cargando solicitudes…</p>
        </div>
      ) : empty ? (
        <div className='py-8 text-center'>
          <MailX className='mx-auto h-12 w-12 text-muted-foreground' />
          <p className='mt-2 text-muted-foreground'>No hay elementos</p>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
