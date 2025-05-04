"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Check, Clock, Inbox, MailX, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getPendingRequests, getCollaboratorById, type Absence } from "@/lib/mock-data"
import { toast } from "@/hooks/use-toast"

export default function MailboxPage() {
  const [pendingRequests, setPendingRequests] = useState<Absence[]>([])
  const [loading, setLoading] = useState(true)
  const [approvedRequests, setApprovedRequests] = useState<Absence[]>([])
  const [rejectedRequests, setRejectedRequests] = useState<Absence[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        const data = await getPendingRequests()
        setPendingRequests(data)
      } catch (error) {
        console.error("Error fetching pending requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleApprove = (request: Absence) => {
    // Actualizar estado local (en una app real, esto sería una llamada a la API)
    const updatedRequest = { ...request, status: "APPROVED" as const }
    setPendingRequests(pendingRequests.filter((r) => r.id !== request.id))
    setApprovedRequests([...approvedRequests, updatedRequest])

    toast({
      title: "Solicitud aprobada",
      description: "La solicitud ha sido aprobada exitosamente.",
    })
  }

  const handleReject = (request: Absence) => {
    // Actualizar estado local (en una app real, esto sería una llamada a la API)
    const updatedRequest = { ...request, status: "REJECTED" as const }
    setPendingRequests(pendingRequests.filter((r) => r.id !== request.id))
    setRejectedRequests([...rejectedRequests, updatedRequest])

    toast({
      title: "Solicitud rechazada",
      description: "La solicitud ha sido rechazada.",
    })
  }

  // Función para obtener el texto del tipo de ausencia
  const getAbsenceTypeText = (type: string) => {
    switch (type) {
      case "VACATION":
        return "Vacaciones"
      case "SPONTANEOUS":
        return "Espontánea"
      case "INFORMAL":
        return "Informal"
      default:
        return type
    }
  }

  // Función para renderizar una solicitud
  const renderRequest = (request: Absence, actions = true) => {
    const collaborator = getCollaboratorById(request.collaboratorId)

    if (!collaborator) return null

    return (
      <Card key={request.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{collaborator.name}</CardTitle>
              <CardDescription>{collaborator.department}</CardDescription>
            </div>
            <Badge
              variant={
                request.type === "VACATION" ? "default" : request.type === "INFORMAL" ? "secondary" : "destructive"
              }
            >
              {getAbsenceTypeText(request.type)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {format(parseISO(request.startDate), "PPP", { locale: es })} -{" "}
                {format(parseISO(request.endDate), "PPP", { locale: es })}
              </span>
            </div>
            <div className="text-sm">
              <strong>Motivo:</strong> {request.reason}
            </div>
          </div>
        </CardContent>
        {actions && (
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => handleReject(request)}>
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
            <Button size="sm" onClick={() => handleApprove(request)}>
              <Check className="mr-2 h-4 w-4" />
              Aprobar
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Inbox className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Bandeja de Aprobaciones</h1>
        </div>

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

          <TabsContent value="pending">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Solicitudes Pendientes</h2>
              </div>
              <Separator />

              {loading ? (
                <div className="py-8 text-center">
                  <p>Cargando solicitudes...</p>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="py-8 text-center">
                  <MailX className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No hay solicitudes pendientes</p>
                </div>
              ) : (
                <div>{pendingRequests.map((request) => renderRequest(request))}</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Solicitudes Aprobadas</h2>
              </div>
              <Separator />

              {approvedRequests.length === 0 ? (
                <div className="py-8 text-center">
                  <MailX className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No hay solicitudes aprobadas</p>
                </div>
              ) : (
                <div>{approvedRequests.map((request) => renderRequest(request, false))}</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Solicitudes Rechazadas</h2>
              </div>
              <Separator />

              {rejectedRequests.length === 0 ? (
                <div className="py-8 text-center">
                  <MailX className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No hay solicitudes rechazadas</p>
                </div>
              ) : (
                <div>{rejectedRequests.map((request) => renderRequest(request, false))}</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
