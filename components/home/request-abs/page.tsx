/* components/home/request-abs/page.tsx */
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, UploadCloud } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import {
  GET_USERS,
  GET_ME, // para fijar colaboradorId automáticamente
} from "@/graphql/connections/post_request_abs/queries"


import { CREATE_REQUESTED_ABSENCE_FOR_POST } from "@/graphql/connections/post_request_abs/mutations"
import { CREATE_SPONTANEOUS_ABSENCE_FOR_POST } from "@/graphql/connections/post_request_abs/mutations"

/* ------------------------------------------------------------------ */
/* 1️⃣  Esquema de validación (Zod)                                   */
/* ------------------------------------------------------------------ */
const formSchema = z
  .object({
    collaboratorId: z.string({
      required_error: "Por favor seleccione un colaborador",
    }),
    type: z.enum(["VACATION", "SPONTANEOUS", "INFORMAL"], {
      required_error: "Seleccione un tipo de ausencia",
    }),
    startDate: z.date({
      required_error: "Seleccione la fecha de inicio",
    }),
    endDate: z.date({
      required_error: "Seleccione la fecha de fin",
    }),
    reason: z
      .string()
      .min(5, { message: "El motivo debe tener al menos 5 caracteres" }),
    file: z
      .instanceof(File)
      .optional()
      .or(z.literal(null)), // para permitir no adjuntar
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    path: ["endDate"],
  })

type FormValues = z.infer<typeof formSchema>

/* ------------------------------------------------------------------ */
/* 2️⃣  Componente principal                                          */
/* ------------------------------------------------------------------ */
export default function RequestAbsencePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* --- 2.1  Query de usuarios (para el select) --- */
  /*     Si prefieres NO mostrar el select y usar el propio userId,   */
  /*     puedes omitir GET_USERS y tomar 'me.id' de GET_ME.           */
  const { data: usersData, loading: usersLoading, error: usersError } =
    useQuery(GET_USERS)

  const { data: meData } = useQuery(GET_ME) // opcional
  
  const collaborators = usersData?.getUsers ?? []

  /* --- 2.2  Mutaciones --- */
  const [createRequestedAbsence] = useMutation(CREATE_REQUESTED_ABSENCE_FOR_POST, {
    /* refetch la bandeja del boss si la tienes en caché */
    refetchQueries: ["GetPendingRequestedAbsences"],
  })

  const [createSpontaneousAbsence] = useMutation(CREATE_SPONTANEOUS_ABSENCE_FOR_POST, {
    refetchQueries: ["GetPendingRequestedAbsences"],
  })

  /* --- 2.3  Form Hook --- */
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaboratorId: meData?.me?.id ?? "", // autoselecciona si quieres
      reason: "",
      file: null,
    },
  })

  /* ---------------------------------------------------------------- */
  /* 3️⃣  onSubmit – decide qué mutación llamar                        */
  /* ---------------------------------------------------------------- */
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      if (values.type === "SPONTANEOUS") {
        /* ------------ 3A · Ausencia espontánea ------------ */
        await createSpontaneousAbsence({
          variables: {
            inputs: {
              colaboratorId: values.collaboratorId,
              startDate: values.startDate.toISOString(),
              endDate: values.endDate.toISOString(),
              comments: values.reason,
            },
          },
        })
      } else {
        /* ------------ 3B · Requested (vacaciones o informal) ------------ */
        /* Si es INFORMAL, enviamos descripción + media; si no, solo flag */
        let mediaUrl: string | null = null
        if (values.file && values.type === "INFORMAL") {
          /* Sube el archivo a tu storage y obtén la URL;            */
          /* para demo, lo dejamos null. Implementa tu upload aquí. */
          mediaUrl = null
        }

        await createRequestedAbsence({
          variables: {
            inputs: {
              colaboratorId: values.collaboratorId,
              startDate: values.startDate.toISOString(),
              endDate: values.endDate.toISOString(),
              isVacation: values.type === "VACATION",
              description:
                values.type === "INFORMAL" ? values.reason : undefined,
              mediaUrl,
            },
          },
        })
      }

      toast({
        title: "Solicitud enviada",
        description: "Tu ausencia ha sido registrada y pasará a revisión.",
      })
      form.reset()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------------------------------------------------------------- */
  /* 4️⃣  Render                                                       */
  /* ---------------------------------------------------------------- */
  if (usersLoading) return <p>Cargando colaboradores…</p>
  if (usersError) return <p>Error cargando colaboradores</p>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Ausencia</CardTitle>
            <CardDescription>
              Complete el formulario. Su solicitud será enviada para aprobación.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* -------- 4.1  Selección de colaborador -------- */}
                <FormField
                  control={form.control}
                  name="collaboratorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colaborador</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un colaborador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {collaborators.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* -------- 4.2  Tipo de ausencia -------- */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Ausencia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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

                {/* -------- 4.3  Fechas -------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fecha inicio */}
                  <DatePicker
                    control={form.control}
                    name="startDate"
                    label="Fecha de Inicio"
                    minDate={new Date()}
                  />
                  {/* Fecha fin */}
                  <DatePicker
                    control={form.control}
                    name="endDate"
                    label="Fecha de Fin"
                    /* Solo deja elegir >= startDate */
                    minDate={form.watch("startDate") ?? new Date()}
                  />
                </div>

                {/* -------- 4.4  Motivo -------- */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el motivo de su ausencia"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Proporcione detalles (requerido para ausencias
                        informales y espontáneas).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* -------- 4.5  Evidencia (solo INFORMAL) -------- */}
                {form.watch("type") === "INFORMAL" && (
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidencia opcional (imagen / PDF)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0] ?? null)
                            }}
                          />
                        </FormControl>
                        {field.value && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <UploadCloud size={14} />
                            {field.value.name}
                          </p>
                        )}
                        <FormDescription>
                          Adjunte justificante si lo considera necesario.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* -------- 4.6  Botón de envío -------- */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando…" : "Enviar Solicitud"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Las solicitudes suelen revisarse en un plazo de 24-48 h.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5️⃣  Sub-componente DatePicker reutilizable                         */
/* ------------------------------------------------------------------ */
import type { Control } from "react-hook-form"

function DatePicker({
  control,
  name,
  label,
  minDate,
}: {
  control: Control<FormValues>
  name: "startDate" | "endDate"
  label: string
  minDate: Date
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
                <Button
                  variant="outline"
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? format(field.value, "PPP", { locale: es })
                    : "Seleccione una fecha"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < minDate}
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
