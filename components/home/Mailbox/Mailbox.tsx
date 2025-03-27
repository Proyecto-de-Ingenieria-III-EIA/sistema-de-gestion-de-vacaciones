'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MessageList } from './MessageList'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export const ManagerMailbox = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-xl bg-red-600 text-white hover:bg-red-700"
          onClick={() => setOpen(true)}
        >
          <Mail className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 space-y-4"
        >
          <h2 className="text-xl font-semibold">Manager Mailbox</h2>
          <MessageList />
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
