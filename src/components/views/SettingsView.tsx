import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface SettingsViewProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
}

export function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updated: Settings = {
      restaurantName: formData.get('restaurantName') as string,
      businessType: formData.get('businessType') as 'single' | 'multi-branch',
      currency: formData.get('currency') as string,
      defaultVatPercentage: Number(formData.get('defaultVatPercentage')),
      defaultServiceChargePercentage: Number(formData.get('defaultServiceChargePercentage')),
      enabledPaymentMethods: ['cash', 'bkash', 'nagad', 'rocket', 'card'],
      receiptFooter: formData.get('receiptFooter') as string
    }
    
    onUpdateSettings(updated)
    toast.success('Settings updated successfully')
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Settings</h2>
        <p className="text-muted-foreground">Configure restaurant settings and preferences</p>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Restaurant Information</h3>
            
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                defaultValue={settings.restaurantName}
                placeholder="Enter restaurant name"
              />
            </div>
            
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select name="businessType" defaultValue={settings.businessType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Restaurant</SelectItem>
                  <SelectItem value="multi-branch">Multi-Branch Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                defaultValue={settings.currency}
                placeholder="BDT"
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Charges & Taxes</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultVatPercentage">Default VAT (%)</Label>
                <Input
                  id="defaultVatPercentage"
                  name="defaultVatPercentage"
                  type="number"
                  step="0.1"
                  defaultValue={settings.defaultVatPercentage}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="defaultServiceChargePercentage">Default Service Charge (%)</Label>
                <Input
                  id="defaultServiceChargePercentage"
                  name="defaultServiceChargePercentage"
                  type="number"
                  step="0.1"
                  defaultValue={settings.defaultServiceChargePercentage}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Receipt Settings</h3>
            
            <div>
              <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
              <Textarea
                id="receiptFooter"
                name="receiptFooter"
                defaultValue={settings.receiptFooter}
                placeholder="Thank you for dining with us!"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
