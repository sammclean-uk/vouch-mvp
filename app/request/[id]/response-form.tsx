'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { submitResponse } from '@/app/actions'
import { CheckCircle2 } from 'lucide-react'

interface ResponseFormProps {
  requestId: string
}

export function ResponseForm({ requestId }: ResponseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        await submitResponse(requestId, formData)
        setSuccess(true)
        // Reset form
        const form = document.getElementById('response-form') as HTMLFormElement
        form?.reset()
        // Refresh the page to show new response
        router.refresh()
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit response')
      }
    })
  }

  return (
    <form id="response-form" action={handleSubmit} className="space-y-4">
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Recommendation submitted successfully!
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div>
        <label htmlFor="business" className="text-sm font-medium mb-1 block">
          Business Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="business"
          name="business"
          placeholder="e.g., Joe's Pizza"
          required
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium mb-1 block">
          Email (optional)
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="contact@business.com"
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="instagram" className="text-sm font-medium mb-1 block">
          Instagram (optional)
        </label>
        <Input
          id="instagram"
          name="instagram"
          placeholder="@businesshandle"
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="website" className="text-sm font-medium mb-1 block">
          Website (optional)
        </label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="https://business.com"
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="notes" className="text-sm font-medium mb-1 block">
          Notes (optional)
        </label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Why do you recommend this place?"
          rows={3}
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? 'Submitting...' : 'Submit Recommendation'}
      </Button>
    </form>
  )
}

