import { MessageItem } from './MessageItem'

const dummyMessages = [
  {
    id: '1',
    subject: 'Vacation Request',
    message: 'Requesting days off from March 10 to March 15.',
    date: '2025-03-25',
    fileUrl: 'https://example.com/sample.pdf',
  },
  {
    id: '2',
    subject: 'Equipment Requisition',
    message: 'Need a new laptop for development.',
    date: '2025-03-24',
    fileUrl: '',
  },
]

export const MessageList = () => {
  return (
    <div className="space-y-4">
      {dummyMessages.map(msg => (
        <MessageItem key={msg.id} {...msg} />
      ))}
    </div>
  )
}
