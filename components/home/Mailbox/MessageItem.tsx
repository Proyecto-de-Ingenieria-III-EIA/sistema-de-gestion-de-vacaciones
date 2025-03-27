import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const MessageItem = ({
  subject,
  message,
  date,
  fileUrl,
}: {
  subject: string
  message: string
  date: string
  fileUrl: string
}) => {
  const handleAccept = () => {
    console.log('Accepted') // replace with GraphQL mutation
  }

  const handleDeny = () => {
    console.log('Denied') // replace with GraphQL mutation
  }

  return (
    <Card>
      <CardHeader className="text-lg font-medium">{subject}</CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-gray-500">Date: {date}</p>

        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            View Attached File
          </a>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handleDeny}>
            Deny
          </Button>
          <Button onClick={handleAccept}>Accept</Button>
        </div>
      </CardContent>
    </Card>
  )
}
