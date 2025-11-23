'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDateLong } from '@/lib/utils'
import { Mail, Instagram, Globe } from 'lucide-react'

interface Response {
  id: string
  business: string
  email: string | null
  instagram: string | null
  website: string | null
  notes: string | null
  created_at: string
}

interface ResponsesListProps {
  initialResponses: Response[]
}

export function ResponsesList({ initialResponses }: ResponsesListProps) {
  if (initialResponses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recommendations yet. Be the first to recommend a business!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {initialResponses.map((response, index) => (
        <div key={response.id}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{response.business}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDateLong(response.created_at)}
                  </p>
                </div>

                {(response.email || response.instagram || response.website) && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    {response.email && (
                      <a
                        href={`mailto:${response.email}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {response.email}
                      </a>
                    )}
                    {response.instagram && (
                      <a
                        href={`https://instagram.com/${response.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Instagram className="h-4 w-4" />
                        {response.instagram}
                      </a>
                    )}
                    {response.website && (
                      <a
                        href={response.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                )}

                {response.notes && (
                  <div className="pt-2">
                    <p className="text-sm">{response.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {index < initialResponses.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  )
}

