import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createUserSlug } from './actions'
import { redirect } from 'next/navigation'

async function handleGenerate() {
  'use server'
  const { slug, ownerKey } = await createUserSlug()
  redirect(`/u/${slug}/owner?key=${ownerKey}`)
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Vouch</CardTitle>
          <CardDescription>
            Generate your personal recommendation link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleGenerate}>
            <Button type="submit" className="w-full">
              Generate my Vouch link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
