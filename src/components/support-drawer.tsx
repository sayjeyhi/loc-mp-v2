import { useState } from 'react'
import { apiPostSupportRequest } from '@/services/SupportService'
import { Headphones } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

interface SupportDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportDrawer({ open, onOpenChange }: SupportDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    try {
      setLoading(true)
      const payload = { description: 'LOC: Customer Request: ' + message }
      const result = await apiPostSupportRequest(payload)

      if (result?.status === 200) {
        toast.success('Your support request has been submitted successfully.')
        setMessage('')
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Support request failed:', error)
      toast.error('Failed to submit support request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>Request Support</SheetTitle>
        </SheetHeader>

        <ScrollArea className='flex-1 p-2 pt-0'>
          <div className='space-y-6'>
            {/* Support Request Form */}

            <h3 className='p-2 text-base'>Customer Support Request</h3>
            <div className='space-y-2 p-2'>
              <Label htmlFor='message' className='text-sm font-medium'>
                Your Message:
              </Label>
              <Textarea
                id='message'
                placeholder='Enter Your Message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={20}
                className='h-60 resize-none'
              />
            </div>

            {/* Information Section */}
            <div className='space-y-4 p-2'>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                <strong className='text-gray-700 dark:text-gray-300'>
                  Customer Support:
                </strong>{' '}
                A Customer Support Request will be posted to your account. A
                representative will call you using the cellphone number attached
                to your account as soon as they have gathered the information to
                answer your questions.
              </p>
              <Separator />
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Every effort will be made to respond as quickly as possible, but
                for urgent matters please call{' '}
                <strong className='text-foreground'>1300 922 223</strong> and a
                member of our support team will be happy to assist you.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Submit Button */}
        <div className='border-t p-4'>
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <>
                <Headphones className='mr-2 h-4 w-4 animate-pulse' />
                Submitting...
              </>
            ) : (
              <>
                <Headphones className='mr-2 h-4 w-4' />
                Submit
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
