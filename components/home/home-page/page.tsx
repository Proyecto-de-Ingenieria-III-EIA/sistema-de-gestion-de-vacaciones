import { Briefcase, Calendar, BarChart3, Inbox } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/30'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-3xl mx-auto space-y-12'>
          <div className='space-y-4 text-center'>
            <h1 className='text-4xl font-bold tracking-tight'>
              Sistema de Gestión de Ausencias
            </h1>
            <p className='text-muted-foreground text-lg'>
              Gestione las ausencias de su equipo de forma eficiente y
              profesional
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Link href='/calendar' className='block'>
              <Card className='h-full transition-all hover:shadow-md'>
                <CardHeader>
                  <Calendar className='h-8 w-8 mb-2 text-primary' />
                  <CardTitle>Calendario de Ausencias</CardTitle>
                  <CardDescription>
                    Visualice las ausencias de todo el equipo en un calendario
                    mensual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Vea las ausencias por vacaciones, informales y espontáneas
                    de todos los colaboradores en un formato de calendario
                    intuitivo.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Ver Calendario
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            <Link href='/request-abs-page' className='block'>
              <Card className='h-full transition-all hover:shadow-md'>
                <CardHeader>
                  <Briefcase className='h-8 w-8 mb-2 text-primary' />
                  <CardTitle>Solicitar Ausencia</CardTitle>
                  <CardDescription>
                    Envíe una solicitud de ausencia para aprobación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Complete un formulario simple para solicitar vacaciones,
                    permisos o reportar ausencias espontáneas.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Solicitar
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            <Link href='/dashboard' className='block'>
              <Card className='h-full transition-all hover:shadow-md'>
                <CardHeader>
                  <BarChart3 className='h-8 w-8 mb-2 text-primary' />
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>
                    Estadísticas y análisis de ausencias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Visualice tendencias, promedios y distribución de ausencias
                    para tomar decisiones informadas.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Ver Estadísticas
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            <Link href='/mailbox' className='block'>
              <Card className='h-full transition-all hover:shadow-md'>
                <CardHeader>
                  <Inbox className='h-8 w-8 mb-2 text-primary' />
                  <CardTitle>Bandeja de Aprobaciones</CardTitle>
                  <CardDescription>
                    Gestione las solicitudes pendientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Revise, apruebe o rechace las solicitudes de ausencia de su
                    equipo de forma rápida y eficiente.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    Ver Solicitudes
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
