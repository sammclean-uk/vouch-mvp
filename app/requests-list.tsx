'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateShort } from '@/lib/utils'

interface Request {
  id: string
  location: string
  business_type: string
  comment: string | null
  created_at: string
}

interface RequestsListProps {
  initialRequests: Request[]
  initialLocationFilter: string
  initialBusinessTypeFilter: string
}

export function RequestsList({
  initialRequests,
  initialLocationFilter,
  initialBusinessTypeFilter,
}: RequestsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [locationFilter, setLocationFilter] = useState(initialLocationFilter)
  const [businessTypeFilter, setBusinessTypeFilter] = useState(initialBusinessTypeFilter)

  const handleFilterChange = (type: 'location' | 'business_type', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (type === 'location') {
      setLocationFilter(value)
      if (value) {
        params.set('location', value)
      } else {
        params.delete('location')
      }
    } else {
      setBusinessTypeFilter(value)
      if (value) {
        params.set('business_type', value)
      } else {
        params.delete('business_type')
      }
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Requests</CardTitle>
        <CardDescription>
          Browse and filter requests for business recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="filter-location" className="text-sm font-medium mb-1 block">
              Filter by Location
            </label>
            <Input
              id="filter-location"
              placeholder="Search location..."
              value={locationFilter}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <label htmlFor="filter-business-type" className="text-sm font-medium mb-1 block">
              Filter by Business Type
            </label>
            <Input
              id="filter-business-type"
              placeholder="Search business type..."
              value={businessTypeFilter}
              onChange={(e) => handleFilterChange('business_type', e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        {initialRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No requests found. Create one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/request/${request.id}`)}
                  >
                    <TableCell className="font-medium">
                      {request.business_type}
                    </TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell className="text-muted-foreground">
                      asked {formatDateShort(request.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

