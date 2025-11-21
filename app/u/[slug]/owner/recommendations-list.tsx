'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toggleTried, deleteRecommendation } from '@/app/actions'
import { useState } from 'react'

interface Recommendation {
  id: string
  body: string
  name: string | null
  contact: string | null
  is_tried: boolean
  created_at: string
}

export function RecommendationsList({
  recommendations: initialRecommendations,
  slug,
  ownerKey,
}: {
  recommendations: Recommendation[]
  slug: string
  ownerKey: string
}) {
  const [recommendations, setRecommendations] = useState(initialRecommendations)

  async function handleToggleTried(id: string, currentValue: boolean) {
    await toggleTried(id, slug, ownerKey, !currentValue)
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, is_tried: !currentValue } : rec
      )
    )
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this recommendation?')) {
      return
    }
    await deleteRecommendation(id, slug, ownerKey)
    setRecommendations(prev => prev.filter(rec => rec.id !== id))
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recommendation</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Tried</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell className="max-w-md">
                <p className="text-sm">{rec.body}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(rec.created_at).toLocaleDateString()}
                </p>
              </TableCell>
              <TableCell>{rec.name || '-'}</TableCell>
              <TableCell>{rec.contact || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rec.is_tried}
                    onCheckedChange={() => handleToggleTried(rec.id, rec.is_tried)}
                  />
                  {rec.is_tried && (
                    <Badge variant="secondary">Tried</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(rec.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

