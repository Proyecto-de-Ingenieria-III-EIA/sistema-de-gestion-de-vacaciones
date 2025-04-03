'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export type Request = {
  id: string
  subject: string
  message: string
  date: string
  fileUrl?: string
}

export const RequestCard = ({ request }: { request: Request }) => {
  const handleAccept = () => {
    console.log('Accepted request:', request.id)
  }

  const handleDeny = () => {
    console.log('Denied request:', request.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <h3 className="text-lg font-semibold">{request.subject}</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{request.message}</p>
          <p className="text-xs text-gray-500">Date: {request.date}</p>

          {request.fileUrl && (
            <a
              href={request.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              View Attachment
            </a>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleDeny}>
              Deny
            </Button>
            <Button onClick={handleAccept}>Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
