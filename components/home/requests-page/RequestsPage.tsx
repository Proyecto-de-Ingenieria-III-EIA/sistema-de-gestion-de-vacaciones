'use client'

import { RequestCard, Request } from './RequestCard'
import { motion } from 'framer-motion'

const dummyData: Request[] = [
  {
    id: '1',
    subject: 'Time off request',
    message: 'Requesting time off from April 10 to April 15.',
    date: '2025-03-26',
    fileUrl: 'https://example.com/file.pdf',
  },
  {
    id: '2',
    subject: 'Equipment Request',
    message: 'Need a standing desk for my workspace.',
    date: '2025-03-25',
  },
]

export const RequestsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">All Requests</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {dummyData.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </motion.div>
  )
}
