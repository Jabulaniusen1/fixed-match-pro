'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database'

type AdLinkUpdate = Database['public']['Tables']['ad_links']['Update']
type AdLinkInsert = Database['public']['Tables']['ad_links']['Insert']

interface AdLink {
  id: string
  title: string
  url: string
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AdLinksManagerProps {
  adLinks: AdLink[]
}

export function AdLinksManager({ adLinks: initialAdLinks }: AdLinksManagerProps) {
  const router = useRouter()
  const [adLinks, setAdLinks] = useState<AdLink[]>(initialAdLinks)
  const [loading, setLoading] = useState(false)
  const [editingLink, setEditingLink] = useState<AdLink | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    description: '',
    display_order: 0,
    is_active: true,
  })

  const resetForm = () => {
    setLinkForm({
      title: '',
      url: '',
      description: '',
      display_order: 0,
      is_active: true,
    })
    setEditingLink(null)
  }

  const openAddDialog = () => {
    resetForm()
    setShowDialog(true)
  }

  const openEditDialog = (link: AdLink) => {
    setLinkForm({
      title: link.title,
      url: link.url,
      description: link.description || '',
      display_order: link.display_order,
      is_active: link.is_active,
    })
    setEditingLink(link)
    setShowDialog(true)
  }

  const handleSubmit = async () => {
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      toast.error('Title and URL are required')
      return
    }

    // Validate URL format
    try {
      new URL(linkForm.url)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      if (editingLink) {
        // Update existing link
        const updateData: AdLinkUpdate = {
          title: linkForm.title.trim(),
          url: linkForm.url.trim(),
          description: linkForm.description.trim() || null,
          display_order: linkForm.display_order,
          is_active: linkForm.is_active,
          updated_at: new Date().toISOString(),
        }
        const { error } = await supabase
          .from('ad_links')
          // @ts-expect-error - Supabase type inference issue
          .update(updateData)
          .eq('id', editingLink.id)

        if (error) throw error

        toast.success('Ad link updated successfully!')
      } else {
        // Create new link
        const insertData: AdLinkInsert = {
          title: linkForm.title.trim(),
          url: linkForm.url.trim(),
          description: linkForm.description.trim() || null,
          display_order: linkForm.display_order,
          is_active: linkForm.is_active,
        }
        const { error } = await supabase
          .from('ad_links')
          // @ts-expect-error - Supabase type inference issue
          .insert(insertData)

        if (error) throw error

        toast.success('Ad link created successfully!')
      }

      setShowDialog(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      console.error('Error saving ad link:', error)
      toast.error(error.message || 'Failed to save ad link')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad link?')) {
      return
    }

    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('ad_links')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Ad link deleted successfully!')
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting ad link:', error)
      toast.error(error.message || 'Failed to delete ad link')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (link: AdLink) => {
    try {
      const supabase = createClient()
      const updateData: AdLinkUpdate = {
        is_active: !link.is_active,
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase
        .from('ad_links')
        // @ts-expect-error - Supabase type inference issue
        .update(updateData)
        .eq('id', link.id)

      if (error) throw error

      toast.success(`Ad link ${!link.is_active ? 'activated' : 'deactivated'} successfully!`)
      router.refresh()
    } catch (error: any) {
      console.error('Error toggling ad link status:', error)
      toast.error(error.message || 'Failed to update ad link status')
    }
  }

  const handleMoveOrder = async (link: AdLink, direction: 'up' | 'down') => {
    const currentIndex = adLinks.findIndex(l => l.id === link.id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= adLinks.length) return

    const targetLink = adLinks[newIndex]

    try {
      const supabase = createClient()

      // Swap display orders
      const updateData1: AdLinkUpdate = {
        display_order: targetLink.display_order,
        updated_at: new Date().toISOString()
      }
      await supabase
        .from('ad_links')
        // @ts-expect-error - Supabase type inference issue
        .update(updateData1)
        .eq('id', link.id)

      const updateData2: AdLinkUpdate = {
        display_order: link.display_order,
        updated_at: new Date().toISOString()
      }
      await supabase
        .from('ad_links')
        // @ts-expect-error - Supabase type inference issue
        .update(updateData2)
        .eq('id', targetLink.id)

      toast.success('Display order updated!')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating display order:', error)
      toast.error(error.message || 'Failed to update display order')
    }
  }

  // Sort links by display_order
  const sortedLinks = [...adLinks].sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ad Links</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage links displayed in the navbar dropdown. Active links are visible to all users.
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Ad Link
        </Button>
      </div>

      {sortedLinks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No ad links yet. Create your first one!</p>
            <Button onClick={openAddDialog} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Ad Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedLinks.map((link, index) => (
            <Card key={link.id} className={!link.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{link.title}</h3>
                      <Badge variant={link.is_active ? 'default' : 'secondary'}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Order: {link.display_order}
                      </Badge>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {link.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {link.description && (
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleMoveOrder(link, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleMoveOrder(link, 'down')}
                        disabled={index === sortedLinks.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Switch
                      checked={link.is_active}
                      onCheckedChange={() => handleToggleActive(link)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(link)}
                      className="h-9 w-9"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                      className="h-9 w-9 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLink ? 'Edit Ad Link' : 'Add New Ad Link'}</DialogTitle>
            <DialogDescription>
              {editingLink
                ? 'Update the ad link information below.'
                : 'Fill in the details to create a new ad link that will appear in the navbar dropdown.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={linkForm.title}
                onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                placeholder="e.g., Betting Site A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={linkForm.url}
                onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                placeholder="https://example.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Must include http:// or https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={linkForm.description}
                onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                placeholder="Brief description of the link"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={linkForm.display_order}
                  onChange={(e) => setLinkForm({ ...linkForm, display_order: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    id="is_active"
                    checked={linkForm.is_active}
                    onCheckedChange={(checked) => setLinkForm({ ...linkForm, is_active: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {linkForm.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : editingLink ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
