import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getRecommendationsByUser } from '@/app/actions'
import { RecommendationsList } from './recommendations-list'

export default async function OwnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ key?: string }>
}) {
  const slug = await params
  const search = await searchParams
  const ownerKey = search.key

  if (!ownerKey) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>Owner key is required</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const recommendations = await getRecommendationsByUser(slug.slug, ownerKey)

  if (recommendations === null) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>Invalid owner key</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Your Recommendations</CardTitle>
          <CardDescription>
            Manage your recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recommendations yet. Share your link to get started!
            </p>
          ) : (
            <RecommendationsList
              recommendations={recommendations}
              slug={slug.slug}
              ownerKey={ownerKey}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

