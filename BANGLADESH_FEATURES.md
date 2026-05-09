# DineDesk BD - Bangladesh-Specific Restaurant Management Features

## Overview
DineDesk BD has been enhanced with Bangladesh-specific restaurant management features to better serve local restaurant owners and operators.

## New Features

### 1. Payment Methods
The system now supports all major Bangladesh payment methods:
- **Cash** - Traditional cash payment
- **bKash** - Popular mobile financial service
- **Nagad** - Government-backed mobile financial service
- **Rocket** - Dutch-Bangla Bank mobile financial service
- **Card** - Credit/Debit card payments
- **Bank Transfer** - Direct bank transfers
- **Foodpanda** - Orders paid through Foodpanda platform
- **Pathao Food** - Orders paid through Pathao Food platform
- **Other** - Any other payment method

### 2. Order Sources
Track where your orders are coming from:
- **Walk-in** - Customers who visit the restaurant directly
- **Phone** - Orders placed via phone call
- **Facebook** - Orders from Facebook page/messages
- **Foodpanda** - Orders from Foodpanda platform
- **Pathao Food** - Orders from Pathao Food platform
- **Website** - Orders from restaurant website
- **Other** - Any other source

### 3. Delivery Management
Complete delivery order tracking with:
- Customer name
- Phone number
- Full delivery address
- Delivery charge (customizable per order)
- Rider name (optional)
- Delivery status tracking:
  - **Pending** - Order received, waiting to be prepared
  - **Preparing** - Kitchen is preparing the food
  - **Out for Delivery** - Rider has picked up the order
  - **Delivered** - Successfully delivered to customer
  - **Cancelled** - Order was cancelled

### 4. Bangladesh-Specific Expense Categories
Better expense tracking with categories suited for Bangladesh restaurants:
- **Rent** - Monthly rent for the premises
- **Staff Salary** - Employee wages and salaries
- **Gas Bill** - Cooking gas expenses
- **Electricity Bill** - Power bills
- **Water Bill** - Water supply expenses
- **Raw Materials** - General raw material purchases
- **Meat Purchase** - Specific tracking for meat purchases
- **Rice Purchase** - Specific tracking for rice purchases
- **Packaging** - Food packaging materials
- **Cleaning** - Cleaning supplies and services
- **Delivery Cost** - Delivery-related expenses
- **Maintenance** - Repairs and maintenance
- **Marketing** - Advertising and promotional expenses
- **Other** - Miscellaneous expenses

### 5. VAT and Service Charge Settings
Flexible VAT and service charge management:
- **VAT Settings:**
  - Enable/disable VAT
  - Set default VAT percentage
  
- **Service Charge Settings:**
  - Enable/disable service charge
  - Set default service charge percentage
  - Option to apply service charge only for dine-in orders
  
This allows you to configure charges according to your business model and customer preferences.

### 6. Receipt Customization
Professional receipt printing with:
- Restaurant name (from settings)
- Branch name (automatically populated)
- Phone number (customizable)
- Full address (customizable)
- BIN/VAT number (for tax compliance)
- Footer message (customizable thank you message)
- All order details including items, charges, and payment method

### 7. Bangla Language Support
Toggle between English and বাংলা (Bangla) for main UI labels:
- Dashboard labels
- Payment method names
- Order source labels
- Delivery status labels
- Expense category names
- Form labels and buttons

The language uses natural Bangladeshi Bangla, not overly formal translations, making it familiar and easy to use for local staff.

## How to Use

### Setting Up Payment Methods and Language
1. Go to **Settings**
2. Configure VAT and Service Charge settings
3. Add receipt information (phone, address, BIN number)
4. Choose your preferred language (English or বাংলা)
5. Save settings

### Creating Orders with Delivery
1. Go to **POS**
2. Select order type as **Delivery**
3. Choose the order source (phone, Facebook, Foodpanda, etc.)
4. Fill in customer information:
   - Customer name
   - Phone number
   - Delivery address
   - Delivery charge
5. Add items to cart
6. Select payment method
7. Complete order

### Tracking Deliveries
Orders with delivery type will include delivery information and can be tracked through different statuses from Pending to Delivered.

### Recording Expenses
1. Go to **Expenses**
2. Select the appropriate Bangladesh-specific category
3. Choose payment method
4. Add amount and notes
5. Save expense

## Technical Details

### Data Types
All new types are defined in `src/lib/types.ts`:
- `PaymentMethod` - Extended to include all Bangladesh payment options
- `OrderSource` - New type for tracking order sources
- `DeliveryStatus` - New type for delivery tracking
- `DeliveryInfo` - Interface for delivery details
- `ExpenseCategory` - Updated with Bangladesh-specific categories
- `Settings` - Enhanced with VAT/service charge controls, receipt info, and language

### Translation System
Bangla translations are available in `src/lib/translations.ts` with helper functions:
- `useTranslation(language)` - Get all translations for a language
- `getPaymentMethodLabel(method, language)` - Get payment method label
- `getOrderSourceLabel(source, language)` - Get order source label
- `getDeliveryStatusLabel(status, language)` - Get delivery status label
- `getExpenseCategoryLabel(category, language)` - Get expense category label

## Benefits

1. **Better Financial Tracking** - Track all major Bangladesh payment methods including mobile financial services
2. **Source Attribution** - Know which channels bring you the most orders
3. **Delivery Management** - Complete delivery workflow from order to delivery
4. **Accurate Expense Tracking** - Categories that match actual Bangladesh restaurant expenses
5. **Tax Compliance** - VAT and BIN number fields for proper receipts
6. **Local Language** - Bangla support for staff comfort
7. **Professional Receipts** - Customizable receipts with all necessary information

## Future Enhancements
Potential additions for future versions:
- Multi-currency support
- Advanced delivery zone mapping
- Rider management system
- Customer database with order history
- SMS/WhatsApp order notifications
- Integration with payment gateways
