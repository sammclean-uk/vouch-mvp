'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
  requests: Request[]
}

export function RequestsList({ requests }: RequestsListProps) {
  const router = useRouter()
  const [locationFilter, setLocationFilter] = useState('')
  const [businessTypeFilter, setBusinessTypeFilter] = useState('')

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesLocation = !locationFilter || 
        request.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchesBusinessType = !businessTypeFilter || 
        request.business_type.toLowerCase().includes(businessTypeFilter.toLowerCase())
      return matchesLocation && matchesBusinessType
    })
  }, [requests, locationFilter, businessTypeFilter])

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
              onChange={(e) => setLocationFilter(e.target.value)}
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
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
            />
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {requests.length === 0 
              ? 'No requests found. Create one above!'
              : 'No requests match your filters.'}
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
                {filteredRequests.map((request) => (
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

