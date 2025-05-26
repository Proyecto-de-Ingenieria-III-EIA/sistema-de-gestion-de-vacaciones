"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Check, Clock, Inbox, MailX, X } from "lucide-react"

import {
  GET_PENDING_REQUESTED_ABSENCES,
} from "@/graphql/connections/mailbox/queries"
import { DECIDE_REQUESTED_ABSENCE } from "@/graphql/connections/mailbox/mutations"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

/* ------------------------------------------------------------------ */
/* Tipado mínimo para mantener autocompletado sin codegen             */
/* ------------------------------------------------------------------ */
type Absence = {
  dbId: string
  startDate: string
  endDate: string
  type: "VACATION" | "SPONTANEOUS" | "INFORMAL"
  colaborator: { id: string; name: string | null }
  justification?: { description?: string | null }
}

export default function MailboxPage() {
  /* Refresh auto*/
  const { data, loading, error, refetch } =
     useQuery(GET_PENDING_REQUESTED_ABSENCES, { fetchPolicy: "network-only"})

  /* 2️⃣  Estado local para las pestañas */
  const [pendingRequests, setPendingRequests] = useState<Absence[]>([])
  const [approvedRequests, setApprovedRequests] = useState<Absence[]>([])
  const [rejectedRequests, setRejectedRequests] = useState<Absence[]>([])

  /* Rellenar pendientes cuando llega la data */
  useEffect(() => {
    if (data?.getPendingRequestedAbsences)
      setPendingRequests(data.getPendingRequestedAbsences)
  }, [data])

  /*Mutación aprobar / rechazar */
  const [decideRequestedAbsence] = useMutation(DECIDE_REQUESTED_ABSENCE, {
    onCompleted: () => refetch(),
    onError: e =>
      toast({ variant: "destructive", title: "Error", description: e.message }),
  })

  async function handleDecision(request: Absence, decision: "APROVED" | "REJECTED") {
    try {
      await decideRequestedAbsence({
        variables: { absenceId: request.dbId, decision },
      })

      setPendingRequests(prev => prev.filter(r => r.dbId !== request.dbId))
      if (decision === "APROVED")
        setApprovedRequests(prev => [...prev, request])
      else
        setRejectedRequests(prev => [...prev, request])

      toast({
        title: `Solicitud ${decision === "APROVED" ? "aprobada" : "rechazada"}`,
      })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message })
    }
  }

  /* 4️⃣ Render de cada tarjeta */
  function renderRequest(request: Absence, actions = true) {
    const { colaborator } = request
    return (
      <Card key={request.dbId} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{colaborator.name}</CardTitle>
              {/* <CardDescription>
                {colaborator.department ?? "NA department"}
              </CardDescription> */}
            </div>
            <Badge
              variant={
                request.type === "VACATION"
                  ? "default"
                  : request.type === "INFORMAL"
                  ? "secondary"
                  : "destructive"
              }
            >
              {request.type === "VACATION"
                ? "Vacaciones"
                : request.type === "SPONTANEOUS"
                ? "Espontánea"
                : "Informal"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {format(parseISO(request.startDate), "PPP", { locale: es })} –{" "}
              {format(parseISO(request.endDate), "PPP", { locale: es })}
            </span>
          </div>

          {request.justification?.description && (
            <p className="text-sm">
              <strong>Motivo:</strong> {request.justification.description}
            </p>
          )}
        </CardContent>

        {actions && (
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecision(request, "REJECTED")}
            >
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
            <Button size="sm" onClick={() => handleDecision(request, "APROVED")}>
              <Check className="mr-2 h-4 w-4" />
              Aprobar
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  /* ------------------------------------------------------------------ */
  /* UI principal                                                       */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Inbox className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Bandeja de Aprobaciones</h1>
        </div>

        {error && <p className="text-red-600 mb-4">{error.message}</p>}

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Pendientes
              {pendingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Aprobadas
              {approvedRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {approvedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center">
              <X className="mr-2 h-4 w-4" />
              Rechazadas
              {rejectedRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {rejectedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ---------- Pendientes ---------- */}
          <TabsContent value="pending">
            <Section
              title="Solicitudes Pendientes"
              loading={loading}
              empty={pendingRequests.length === 0}
            >
              {pendingRequests.map(req => renderRequest(req))}
            </Section>
          </TabsContent>

          {/* ---------- Aprobadas ---------- */}
          <TabsContent value="approved">
            <Section
              title="Solicitudes Aprobadas"
              loading={false}
              empty={approvedRequests.length === 0}
            >
              {approvedRequests.map(req => renderRequest(req, false))}
            </Section>
          </TabsContent>

          {/* ---------- Rechazadas ---------- */}
          <TabsContent value="rejected">
            <Section
              title="Solicitudes Rechazadas"
              loading={false}
              empty={rejectedRequests.length === 0}
            >
              {rejectedRequests.map(req => renderRequest(req, false))}
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-componente reutilizable                                         */
/* ------------------------------------------------------------------ */
function Section({
  title,
  loading,
  empty,
  children,
}: {
  title: string
  loading: boolean
  empty: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <Separator />
      {loading ? (
        <div className="py-8 text-center">
          <p>Cargando solicitudes…</p>
        </div>
      ) : empty ? (
        <div className="py-8 text-center">
          <MailX className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No hay elementos</p>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  )
}
