// Fills an empty admin panel with starter content; see src/lib/starterContent.ts.
//
//   npm run seed
import { getPayload } from 'payload'

import { seedStarterContent } from '../src/lib/starterContent'
import config from '../src/payload.config'

const payload = await getPayload({ config })
await seedStarterContent(payload)
console.log('Done. Open /admin to review; news posts are drafts until you publish them.')
process.exit(0)
