import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getRequestById, getResponsesByRequestId } from '@/app/actions'
import { formatDateLong } from '@/lib/utils'
import { ShareRequestButtons } from '@/components/ShareRequestButtons'
import { ResponseForm } from './response-form'
import { ResponsesList } from './responses-list'

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getRequestById(id)

  if (!request) {
    notFound()
  }

  const responses = await getResponsesByRequestId(id)

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            Make a recommendation for a {request.business_type} in {request.location}
          </CardTitle>
          {request.comment && (
            <CardDescription className="text-base mt-2">
              {request.comment}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Share this Request</CardTitle>
          <CardDescription>
            Share this link with others to get recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShareRequestButtons
            requestId={request.id}
            businessType={request.business_type}
            location={request.location}
          />
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit a Recommendation</CardTitle>
          <CardDescription>
            Know a great {request.business_type} in {request.location}? Share it!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponseForm requestId={request.id} />
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            {responses.length === 0
              ? 'No recommendations yet. Be the first!'
              : `${responses.length} recommendation${responses.length === 1 ? '' : 's'}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsesList initialResponses={responses} />
        </CardContent>
      </Card>
    </div>
  )
}

