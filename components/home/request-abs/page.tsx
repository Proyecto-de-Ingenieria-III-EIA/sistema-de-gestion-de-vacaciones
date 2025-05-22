// components/home/request-abs/page.tsx
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { GET_USERS } from "@/graphql/connections/post_request_abs/queries"
import {
  CREATE_REQUESTED_ABSENCE,
  CREATE_SPONTANEOUS_ABSENCE,
} from "@/graphql/connections/post_request_abs/mutations"

const formSchema = z
  .object({
    collaboratorId: z.string({
      required_error: "Por favor seleccione un colaborador",
    }),
    type: z.enum(["VACATION", "SPONTANEOUS", "INFORMAL"], {
      required_error: "Por favor seleccione un tipo de ausencia",
    }),
    startDate: z.date({
      required_error: "Por favor seleccione una fecha de inicio",
    }),
    endDate: z.date({
      required_error: "Por favor seleccione una fecha de fin",
    }),
    reason: z.string().min(5, {
      message: "El motivo debe tener al menos 5 caracteres",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    path: ["endDate"],
  })

export default function RequestAbsencePage() {
  // 1️⃣ Estado local
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 2️⃣ Hook de formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { reason: "" },
  })

  // 3️⃣ Mutaciones
  const [createRequestedAbsence, { loading: reqLoading, error: reqError }] =
    useMutation(CREATE_REQUESTED_ABSENCE)
  const [createSpontaneousAbsence, { loading: spontLoading, error: spontError }] =
    useMutation(CREATE_SPONTANEOUS_ABSENCE)

  // 4️⃣ Query de usuarios (siempre después de los hooks anteriores)
  const { data, loading: usersLoading, error: usersError } = useQuery(GET_USERS)
  const collaborators = data?.getUsers ?? []

  // 5️⃣ Early returns (ya no alteran el orden de hooks)
  if (usersLoading) return <p>Cargando colaboradores…</p>
  if (usersError) return <p>Error cargando colaboradores</p>

  // 6️⃣ Función onSubmit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      if (values.type === "SPONTANEOUS") {
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
        await createRequestedAbsence({
          variables: {
            inputs: {
              colaboratorId: values.collaboratorId,
              startDate: values.startDate.toISOString(),
              endDate: values.endDate.toISOString(),
              isVacation: values.type === "VACATION",
              description: values.type === "INFORMAL" ? values.reason : undefined,
              mediaUrl: null,
            },
          },
        })
      }

      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud ha sido enviada para aprobación.",
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

  // 7️⃣ Renderizado
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Ausencia</CardTitle>
            <CardDescription>
              Complete el formulario para solicitar una ausencia. Su solicitud será
              enviada para aprobación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Colaborador */}
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
                          {collaborators.map((c) => (
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

                {/* Tipo de ausencia */}
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
                      <FormDescription>
                        Seleccione el tipo de ausencia que desea solicitar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fecha de Inicio */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Inicio</FormLabel>
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
                              disabled={(date) => date < new Date()}
                              initialFocus
                              locale={es}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha de Fin */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Fin</FormLabel>
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
                              disabled={(date) =>
                                date < new Date() ||
                                (form.getValues().startDate &&
                                  date < form.getValues().startDate)
                              }
                              initialFocus
                              locale={es}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Motivo */}
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
                        Proporcione detalles sobre el motivo de su ausencia.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botón de envío */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || reqLoading || spontLoading}
                >
                  {isSubmitting || reqLoading || spontLoading
                    ? "Enviando..."
                    : "Enviar Solicitud"}
                </Button>

                {/* Errores de mutación */}
                {(reqError || spontError) && (
                  <p className="text-red-600 mt-2">
                    {(reqError || spontError)?.message}
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Las solicitudes son revisadas generalmente en un plazo de 24-48 horas.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
