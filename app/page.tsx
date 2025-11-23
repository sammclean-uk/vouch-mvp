import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createRequest, getRequests } from './actions'
import { formatDateShort } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { RequestsList } from './requests-list'

async function handleCreateRequest(formData: FormData) {
  'use server'
  const data = await createRequest(formData)
  redirect(`/request/${data.id}`)
}

export default async function Home() {
  const requests = await getRequests()

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vouch</h1>
        <p className="text-muted-foreground">
          Request and share business recommendations
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create Request</CardTitle>
          <CardDescription>
            Ask for recommendations for a business in a specific location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleCreateRequest} className="space-y-4">
            <div>
              <label htmlFor="location" className="text-sm font-medium mb-1 block">
                Location <span className="text-destructive">*</span>
              </label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>
            <div>
              <label htmlFor="business_type" className="text-sm font-medium mb-1 block">
                Business Type <span className="text-destructive">*</span>
              </label>
              <Input
                id="business_type"
                name="business_type"
                placeholder="e.g., Restaurant, Hair Salon, Gym"
                required
              />
            </div>
            <div>
              <label htmlFor="comment" className="text-sm font-medium mb-1 block">
                Comment (optional)
              </label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Any additional details..."
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Create Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="mb-6" />

      <RequestsList requests={requests} />
    </div>
  )
}
