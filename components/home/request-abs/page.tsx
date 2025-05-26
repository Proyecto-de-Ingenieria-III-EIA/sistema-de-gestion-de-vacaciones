"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Link } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form, FormField, FormItem, FormLabel, FormMessage,
  FormControl, FormDescription,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import { GET_USERS, GET_ME } from "@/graphql/connections/post_request_abs/queries"
import {
  CREATE_REQUESTED_ABSENCE_FOR_POST,
  CREATE_SPONTANEOUS_ABSENCE_FOR_POST,
} from "@/graphql/connections/post_request_abs/mutations"

/* ---------- esquema ---------- */
const formSchema = z.object({
  collaboratorId: z.string({ required_error: "Seleccione un colaborador" }),
  type: z.enum(["VACATION", "SPONTANEOUS", "INFORMAL"]),
  startDate: z.date({ required_error: "Seleccione la fecha de inicio" }),
  endDate:   z.date({ required_error: "Seleccione la fecha de fin" }),
  reason: z.string().min(5, { message: "El motivo debe tener al menos 5 caracteres" }),
  mediaUrl: z.string().url("Debe ser URL válida").optional().or(z.literal("")),
}).refine(d => d.endDate >= d.startDate, {
  path: ["endDate"], message: "La fecha de fin debe ser posterior o igual",
})

type FormValues = z.infer<typeof formSchema>

/* ---------- componente ---------- */
export default function RequestAbsencePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* datos de sesión y usuarios */
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS)
  const { data: meData } = useQuery(GET_ME)
  const isAdmin = meData?.getCurrentUser?.role?.name === "ADMIN"
  const collaborators = usersData?.getUsers ?? []

  /* mutaciones */
  const [createRequestedAbsence] = useMutation(CREATE_REQUESTED_ABSENCE_FOR_POST, {
    refetchQueries: ["GetPendingRequestedAbsences"],
  })
  const [createSpontaneousAbsence] = useMutation(CREATE_SPONTANEOUS_ABSENCE_FOR_POST, {
    refetchQueries: ["GetPendingRequestedAbsences"],
  })

  /* formulario */
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaboratorId: "",      // se rellenará en el useEffect
      mediaUrl: "",
    },
  })

  /* ↙️ Rellenamos el id cuando llegue getCurrentUser (solo USER) */
  useEffect(() => {
    if (!isAdmin && meData?.getCurrentUser?.id) {
      form.setValue("collaboratorId", meData.getCurrentUser.id, {
        shouldValidate: true,
      })
    }
  }, [isAdmin, meData, form])

  /* submit */
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    const targetId = isAdmin ? values.collaboratorId : meData?.getCurrentUser?.id

    try {
      if (values.type === "SPONTANEOUS") {
        await createSpontaneousAbsence({
          variables: {
            inputs: {
              colaboratorId: targetId,
              startDate: values.startDate.toISOString(),
              endDate:   values.endDate.toISOString(),
              comments:  values.reason,
            },
          },
        })
      } else {
        await createRequestedAbsence({
          variables: {
            inputs: {
              colaboratorId: targetId,
              startDate: values.startDate.toISOString(),
              endDate:   values.endDate.toISOString(),
              isVacation: values.type === "VACATION",
              description: values.reason,
              mediaUrl:
                values.type === "INFORMAL" && values.mediaUrl ? values.mediaUrl : null,
            },
          },
        })
      }

      toast({ title: "Solicitud enviada", description: "Pasará a revisión." })
      form.reset()
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* render */
  if (usersLoading) return <p>Cargando colaboradores…</p>
  if (usersError)  return <p>Error cargando colaboradores</p>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Ausencia</CardTitle>
            <CardDescription>Completa el formulario y será enviado para aprobación.</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* --- colaborador --- */}
                {isAdmin ? (
                  <FormField
                    control={form.control}
                    name="collaboratorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colaborador</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un colaborador" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {collaborators.map((c: any) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="collaboratorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colaborador</FormLabel>
                        <Input value={meData?.getCurrentUser?.name ?? ""} disabled />
                        {/* mantiene el valor real en el form */}
                        <input type="hidden" {...field} />
                      </FormItem>
                    )}
                  />
                )}

                {/* --- tipo --- */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de ausencia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VACATION">Vacaciones</SelectItem>
                          <SelectItem value="SPONTANEOUS">Espontánea</SelectItem>
                          <SelectItem value="INFORMAL">Informal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- fechas --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePicker control={form.control} name="startDate" label="Fecha de inicio" minDate={new Date()} />
                  <DatePicker control={form.control} name="endDate"   label="Fecha de fin"    minDate={form.watch("startDate") ?? new Date()} />
                </div>

                {/* --- motivo --- */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe el motivo" className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>Campo obligatorio.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- evidencia --- */}
                {form.watch("type") === "INFORMAL" && (
                  <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidencia (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://ejemplo.com/documento.pdf" {...field} />
                        </FormControl>
                        <FormDescription>Puedes adjuntar imagen, video o PDF.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando…" : "Enviar Solicitud"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="border-t pt-6">
            <p className="text-sm text-muted-foreground">Las solicitudes suelen revisarse en 24-48 h.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

/* ---------- DatePicker ---------- */
import type { Control } from "react-hook-form"
function DatePicker({ control, name, label, minDate }:{
  control: Control<FormValues>; name:"startDate"|"endDate";
  label:string; minDate:Date;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                  {field.value ? format(field.value, "PPP", { locale: es }) : "Seleccione una fecha"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={date => date < minDate}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
