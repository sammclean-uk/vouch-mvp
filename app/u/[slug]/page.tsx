import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { submitRecommendationWithRedirect } from '@/app/actions'
import Link from 'next/link'

export default async function VouchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ submitted?: string }>
}) {
  const slug = await params
  const search = await searchParams
  const submitted = search.submitted === 'true'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Share a Recommendation</CardTitle>
          <CardDescription>
            Help someone discover something great
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Thank you for your recommendation!
                </AlertDescription>
              </Alert>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Get your own Vouch link
                </Button>
              </Link>
            </div>
          ) : (
            <VouchForm slug={slug.slug} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VouchForm({ slug }: { slug: string }) {
  async function handleSubmit(formData: FormData) {
    'use server'
    await submitRecommendationWithRedirect(slug, formData)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium">
          Recommendation <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="body"
          name="body"
          placeholder="What do you recommend?"
          required
          rows={4}
          className="resize-none"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Your Name (optional)
        </label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact" className="text-sm font-medium">
          Contact (optional)
        </label>
        <Input
          id="contact"
          name="contact"
          placeholder="Email or phone"
          type="text"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Recommendation
      </Button>
    </form>
  )
}

