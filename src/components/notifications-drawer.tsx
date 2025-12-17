import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  useNotificationsStore,
  type NotificationItem,
} from '@/store/notificationsStore'
import { Bell } from 'lucide-react'
import { apiGetLatestUserNotificationData } from '@/lib/services/LOC-Admin/NotificationService'
import { formatDate } from '@/lib/utils/dateFormatter'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { debugLog } from '@/lib/utils/debug'

interface NotificationsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsDrawer({
  open,
  onOpenChange,
}: NotificationsDrawerProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const { notifications, setNotifications } = useNotificationsStore()

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await apiGetLatestUserNotificationData<{
        data: NotificationItem[]
      }>({
        userId: user?.username || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      setNotifications(result?.data?.data || [])
    } catch (error) {
      debugLog('danger', 'Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setNotifications, user?.username])

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open, fetchNotifications])

  const hasNotifications =
    notifications && Array.isArray(notifications) && notifications.length > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{getLocalizedValue('NOTIFICATIONS_DRAWER_TITLE_LABEL')}</SheetTitle>
        </SheetHeader>

        <div className='mt-6 h-full'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground text-sm'>
                {getLocalizedValue('NOTIFICATIONS_DRAWER_LOADING_NOTIFICATIONS_LABEL')}
              </div>
            </div>
          ) : !hasNotifications ? (
            <div className='flex h-full flex-col items-center justify-center py-12'>
              <Bell className='text-muted-foreground mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-semibold'>
                {getLocalizedValue('NOTIFICATIONS_DRAWER_NO_NOTIFICATIONS_FOUND_LABEL')}
              </h3>
              <p className='text-muted-foreground text-center text-sm'>
                {getLocalizedValue('NOTIFICATIONS_DRAWER_WHEN_YOU_RECEIVE_NOTIFICATIONS_LABEL')}
              </p>
            </div>
          ) : (
            <ScrollArea className='h-[calc(100vh-8rem)]'>
              <Card>
                <CardContent className='p-0'>
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div className='p-4'>
                        <h4 className='mb-2 text-base font-medium'>
                          {notification.title}
                        </h4>
                        {notification.description && (
                          <p className='text-muted-foreground mb-2 text-sm'>
                            {notification.description}
                          </p>
                        )}
                        <p className='text-muted-foreground text-right text-xs opacity-80'>
                          {formatDate(notification._ts, 'MMM DD, YYYY h:mm A')}
                        </p>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
