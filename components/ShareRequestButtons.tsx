'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, MessageCircle } from 'lucide-react'

interface ShareRequestButtonsProps {
  requestId: string
  businessType: string
  location: string
}

export function ShareRequestButtons({
  requestId,
  businessType,
  location,
}: ShareRequestButtonsProps) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/request/${requestId}`
    : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleWhatsAppShare = () => {
    const message = `Can anyone recommend a ${businessType} in ${location}? Add it here: ${url}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground break-all">
        {url}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex-1"
        >
          <Copy className="mr-2 h-4 w-4" />
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          className="flex-1"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </Button>
      </div>
      {copied && (
        <Alert>
          <AlertDescription>Link copied to clipboard!</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

