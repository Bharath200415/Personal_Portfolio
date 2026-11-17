import DodoPayments from 'dodopayments'

let client: DodoPayments | null = null

/** Server-only Dodo Payments client. Throws if the API key is missing. */
export function getDodo(): DodoPayments {
  if (client) return client

  const bearerToken = process.env.DODO_PAYMENTS_API_KEY
  if (!bearerToken) throw new Error('DODO_PAYMENTS_API_KEY is not set')

  client = new DodoPayments({
    bearerToken,
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode',
  })
  return client
}

/** Key used to tie a Dodo payment back to the pending sponsor tile. */
export const SPONSOR_SLOT_METADATA_KEY = 'sponsor_slot_id'
