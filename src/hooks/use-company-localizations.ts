import { type LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants.ts'
import { useCompanySettings } from './use-company-settings'

export const sharedLocalizations = {
  TRANSACTION_HISTORY_TABLE_NO_TRANSACTIONS_FOUND_LABEL:
    'No transactions found.',
  PAYMENT_HISTORY_TABLE_UPDATING_LABEL: 'Updating...',
  PAYMENT_CALENDAR_TABLE_UPDATING_LABEL: 'Updating...',
  PAYMENT_HISTORY_TABLE_NO_PAYMENTS_FOUND_LABEL: 'No payments found.',
  PAYMENT_CALENDAR_TABLE_NO_PAYMENTS_FOUND_LABEL: 'No payments found.',
  PROFILE_PAGE_TITLE_LABEL: 'Account Profile',
  PROFILE_PAGE_DESCRIPTION_LABEL: 'User profile details and settings.',
  NOTIFICATIONS_DRAWER_TITLE_LABEL: 'Notifications',
  NOTIFICATIONS_DRAWER_NO_NOTIFICATIONS_FOUND_LABEL: 'No notifications found.',
  NOTIFICATIONS_DRAWER_WHEN_YOU_RECEIVE_NOTIFICATIONS_LABEL:
    'When you receive notifications, they will appear here',
  NOTIFICATIONS_DRAWER_LOADING_NOTIFICATIONS_LABEL: 'Loading notifications...',
  SIDE_BAR_MENU_ITEM_CONTRACTS: 'Contracts',
  SIDE_BAR_MENU_ITEM_ACTIVITY: 'Activity',
  SIDE_BAR_MENU_ITEM_PAYMENTS: 'Payments',
  SIDE_BAR_MENU_ITEM_PROFILE: 'Profile',
  // shared
  SHARED_BTN_EXPORT: 'Export',
  SHARED_BTN_DISMISS: 'Dismiss',
  SHARED_BTN_CASH_DRAW: 'Cash Draw',
  SHARED_BTN_THIRD_PARTY_DISBURSEMENT: 'Third Party Disbursement',
  SHARED_BTN_SUBMIT: 'Submit',
  SHARED_BTN_CANCEL: 'Cancel',
  SHARED_BTN_WITHDRAW: 'Withdraw',
  SHARED_BTN_OKAY: 'Okay',
  SHARED_BTN_CLOSE: 'Close',
  SHARED_BTN_PREPAY: 'Prepay Contracts',
  SHARED_BTN_KEEP_SIGN_IN: 'Continue',
  SHARED_BTN_ADD: 'Add',
  SHARED_BTN_PUBLISH: 'Publish',
  SHARED_BTN_LOG_OUT: 'Sign out',
}

export const useCompanyLocalizations = () => {
  const settings = useCompanySettings()
  const localizations = settings?.localizations || []

  const getLocalizedValue = (key: LOCALIZATION_CONSTANT_KEYS): string => {
    const item = localizations?.find(
      (item: { key: string; value: null | string; defaultValue: string }) =>
        item.key === key
    )

    if (!item && key in sharedLocalizations) {
      return sharedLocalizations[key as keyof typeof sharedLocalizations]
    }
    if (item) {
      return item.value ?? item.defaultValue
    }
    return key
  }

  return {
    getLocalizedValue,
  }
}
