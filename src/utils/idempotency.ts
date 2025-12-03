/**
 * Generates a unique idempotency key for API requests
 * @returns A UUID v4 string to be used as idempotency key
 */
export const generateIdempotencyKey = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Creates an idempotency key manager for a specific form/action
 * This ensures the same key is used for multiple submissions of the same action
 */
export class IdempotencyKeyManager {
  private key: string | null = null
  private actionType: string

  constructor(actionType: string) {
    this.actionType = actionType
  }

  /**
   * Gets the current idempotency key, generating a new one if none exists
   */
  getKey(): string {
    if (!this.key) {
      this.key = generateIdempotencyKey()
    }
    return `${this.actionType}-${this.key}`
  }

  /**
   * Resets the idempotency key (call this when starting a new action)
   */
  resetKey(): void {
    this.key = null
  }

  /**
   * Gets the current key without generating a new one
   */
  getCurrentKey(): string | null {
    return this.key
  }
}

/**
 * Global idempotency key managers for different actions
 */
export const idempotencyManagers = {
  drawCreate: new IdempotencyKeyManager('draw-create'),
  prepaymentCreate: new IdempotencyKeyManager('prepayment-create'),
  payoffCreate: new IdempotencyKeyManager('payoff-create'),
}

/**
 * Checks if an error response indicates an idempotency conflict
 * @param error - The error object from API response
 * @returns true if the error is related to idempotency conflicts
 */
export const isIdempotencyError = (error: any): boolean => {
  if (!error?.response?.data) {
    return false
  }

  const responseData = error.response.data

  // Check for 409 status code (Conflict)
  if (error.response.status === 409) {
    return true
  }

  // Check for idempotency-related error messages in various response structures
  const errorMessage =
    responseData.dataReason ||
    responseData.message ||
    (responseData.errors && responseData.errors[0]) ||
    ''

  return (
    errorMessage.includes('idempotencyKey') ||
    errorMessage.includes('idempotency') ||
    errorMessage.includes('concurrent request') ||
    errorMessage.includes('already been successfully completed')
  )
}
