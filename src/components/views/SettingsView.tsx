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
import { useTranslation } from '@/lib/translations'

interface SettingsViewProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
}

export function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const t = useTranslation(settings.language)
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
    toast.success(t.settingsUpdated)
  }
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">{t.settings}</h2>
        <p className="text-muted-foreground">{t.configureSettings}</p>
      </div>
      
      <Card className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.restaurantInfo}</h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="restaurantName">{t.restaurantName}</Label>
                <Input
                  id="restaurantName"
                  name="restaurantName"
                  defaultValue={settings.restaurantName}
                  placeholder={t.enterValue}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="businessType">{t.businessType}</Label>
                <Select name="businessType" defaultValue={settings.businessType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{t.singleRestaurant}</SelectItem>
                    <SelectItem value="multi-branch">{t.multiBranchChain}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="currency">{t.currency}</Label>
                <Input
                  id="currency"
                  name="currency"
                  defaultValue={settings.currency}
                  placeholder="BDT"
                  disabled
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">{t.vatSettings}</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vatEnabled" 
                checked={vatEnabled}
                onCheckedChange={(checked) => setVatEnabled(checked as boolean)}
              />
              <Label htmlFor="vatEnabled" className="font-normal cursor-pointer">
                {t.vatEnabled}
              </Label>
            </div>
            
            <div>
              <Label htmlFor="defaultVatPercentage">{t.vatPercentage} (%)</Label>
              <Input
                id="defaultVatPercentage"
                name="defaultVatPercentage"
                type="number"
                step="0.1"
                defaultValue={settings.defaultVatPercentage}
                placeholder="0"
                disabled={!vatEnabled}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">{t.serviceChargeSettings}</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="serviceChargeEnabled" 
                checked={serviceChargeEnabled}
                onCheckedChange={(checked) => setServiceChargeEnabled(checked as boolean)}
              />
              <Label htmlFor="serviceChargeEnabled" className="font-normal cursor-pointer">
                {t.serviceChargeEnabled}
              </Label>
            </div>
            
            <div>
              <Label htmlFor="defaultServiceChargePercentage">{t.serviceChargePercentage} (%)</Label>
              <Input
                id="defaultServiceChargePercentage"
                name="defaultServiceChargePercentage"
                type="number"
                step="0.1"
                defaultValue={settings.defaultServiceChargePercentage}
                placeholder="0"
                disabled={!serviceChargeEnabled}
                className="mt-1"
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
                {t.applyOnlyForDineIn}
              </Label>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">{t.receiptSettings}</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiptPhone">{t.receiptPhone}</Label>
                <Input
                  id="receiptPhone"
                  name="receiptPhone"
                  type="tel"
                  defaultValue={settings.receiptPhone}
                  placeholder="+880 1712-345678"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="receiptBinNumber">{t.binNumber}</Label>
                <Input
                  id="receiptBinNumber"
                  name="receiptBinNumber"
                  defaultValue={settings.receiptBinNumber}
                  placeholder="000000000000"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="receiptAddress">{t.receiptAddress}</Label>
              <Input
                id="receiptAddress"
                name="receiptAddress"
                defaultValue={settings.receiptAddress}
                placeholder={t.enterValue}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="receiptFooter">{t.receiptFooter}</Label>
              <Textarea
                id="receiptFooter"
                name="receiptFooter"
                defaultValue={settings.receiptFooter}
                placeholder={t.enterValue}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">{t.language}</h3>
            
            <div>
              <Label htmlFor="language">{t.interfaceLanguage}</Label>
              <Select name="language" defaultValue={settings.language}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t.english}</SelectItem>
                  <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                {t.changeLanguageDesc}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              {t.saveSettings}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
