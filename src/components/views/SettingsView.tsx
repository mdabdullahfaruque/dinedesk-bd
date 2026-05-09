import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface SettingsViewProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
}

export function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const [vatEnabled, setVatEnabled] = useState(settings.vatEnabled)
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(settings.serviceChargeEnabled)
  const [applyOnlyForDineIn, setApplyOnlyForDineIn] = useState(settings.applyServiceChargeOnlyForDineIn)
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updated: Settings = {
      restaurantName: formData.get('restaurantName') as string,
      businessType: formData.get('businessType') as 'single' | 'multi-branch',
      currency: formData.get('currency') as string,
      vatEnabled,
      defaultVatPercentage: Number(formData.get('defaultVatPercentage')),
      serviceChargeEnabled,
      defaultServiceChargePercentage: Number(formData.get('defaultServiceChargePercentage')),
      applyServiceChargeOnlyForDineIn: applyOnlyForDineIn,
      enabledPaymentMethods: ['cash', 'bkash', 'nagad', 'rocket', 'card', 'bank-transfer', 'foodpanda', 'pathao-food', 'other'],
      receiptFooter: formData.get('receiptFooter') as string,
      receiptPhone: formData.get('receiptPhone') as string,
      receiptAddress: formData.get('receiptAddress') as string,
      receiptBinNumber: formData.get('receiptBinNumber') as string,
      language: formData.get('language') as 'en' | 'bn'
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
            <h3 className="text-lg font-semibold">VAT Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vatEnabled" 
                checked={vatEnabled}
                onCheckedChange={(checked) => setVatEnabled(checked as boolean)}
              />
              <Label htmlFor="vatEnabled" className="font-normal cursor-pointer">
                Enable VAT
              </Label>
            </div>
            
            <div>
              <Label htmlFor="defaultVatPercentage">Default VAT Percentage (%)</Label>
              <Input
                id="defaultVatPercentage"
                name="defaultVatPercentage"
                type="number"
                step="0.1"
                defaultValue={settings.defaultVatPercentage}
                placeholder="0"
                disabled={!vatEnabled}
              />
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Service Charge Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="serviceChargeEnabled" 
                checked={serviceChargeEnabled}
                onCheckedChange={(checked) => setServiceChargeEnabled(checked as boolean)}
              />
              <Label htmlFor="serviceChargeEnabled" className="font-normal cursor-pointer">
                Enable Service Charge
              </Label>
            </div>
            
            <div>
              <Label htmlFor="defaultServiceChargePercentage">Default Service Charge Percentage (%)</Label>
              <Input
                id="defaultServiceChargePercentage"
                name="defaultServiceChargePercentage"
                type="number"
                step="0.1"
                defaultValue={settings.defaultServiceChargePercentage}
                placeholder="0"
                disabled={!serviceChargeEnabled}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="applyOnlyForDineIn" 
                checked={applyOnlyForDineIn}
                onCheckedChange={(checked) => setApplyOnlyForDineIn(checked as boolean)}
                disabled={!serviceChargeEnabled}
              />
              <Label htmlFor="applyOnlyForDineIn" className="font-normal cursor-pointer">
                Apply service charge only for dine-in orders
              </Label>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Receipt Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiptPhone">Receipt Phone Number</Label>
                <Input
                  id="receiptPhone"
                  name="receiptPhone"
                  type="tel"
                  defaultValue={settings.receiptPhone}
                  placeholder="+880 1712-345678"
                />
              </div>
              
              <div>
                <Label htmlFor="receiptBinNumber">BIN/VAT Number</Label>
                <Input
                  id="receiptBinNumber"
                  name="receiptBinNumber"
                  defaultValue={settings.receiptBinNumber}
                  placeholder="000000000000"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="receiptAddress">Receipt Address</Label>
              <Input
                id="receiptAddress"
                name="receiptAddress"
                defaultValue={settings.receiptAddress}
                placeholder="Enter address for receipt"
              />
            </div>
            
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
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Language</h3>
            
            <div>
              <Label htmlFor="language">Interface Language</Label>
              <Select name="language" defaultValue={settings.language}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Change the language for labels and buttons
              </p>
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
