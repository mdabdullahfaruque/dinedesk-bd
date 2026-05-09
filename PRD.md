# Planning Guide

A comprehensive restaurant management and POS dashboard designed specifically for Bangladeshi restaurant owners, supporting both single restaurants and multi-branch food chains with role-based access for owners, admins, managers, and cashiers.

**Experience Qualities**:
1. **Professional** - Clean, business-focused interface that instills confidence and trust in restaurant owners managing their daily operations
2. **Practical** - No-nonsense functionality prioritizing speed, clarity, and ease of use for non-technical users in fast-paced restaurant environments
3. **Adaptable** - Seamlessly scales from single restaurant to multi-branch chain without overwhelming users with unnecessary complexity

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a full-featured SaaS dashboard with 10+ interconnected modules including POS, inventory management, staff tracking, expense reporting, multi-branch operations, and comprehensive analytics requiring multiple views and sophisticated state management.

## Essential Features

### Dashboard Overview
- **Functionality**: Central hub displaying real-time business metrics including today's sales, orders, average order value, cash/digital payments, expenses, estimated profit, top selling items, low stock alerts, and branch performance
- **Purpose**: Provides owners instant visibility into business health and critical alerts requiring immediate attention
- **Trigger**: User logs in or navigates to home
- **Progression**: Login → Dashboard loads with today's metrics → Owner reviews key figures → Clicks specific metric to drill down → Navigates to relevant module
- **Success criteria**: All metrics display accurately within 500ms, low stock alerts are visible, multi-branch data shows branch comparison

### POS (Point of Sale)
- **Functionality**: Fast order entry system with branch selection, order type (dine-in/takeaway/delivery), menu browsing by category, cart management, discount/VAT/service charge application, payment method selection, and receipt generation
- **Purpose**: Enables cashiers to process customer orders quickly and accurately during peak restaurant hours
- **Trigger**: Cashier clicks POS module or starts new order
- **Progression**: Select branch → Choose order type → Select table (if dine-in) → Browse menu categories → Add items to cart → Adjust quantities → Apply discount/charges → Select payment method → Complete order → Print/view receipt
- **Success criteria**: Order can be completed in under 60 seconds, receipt displays correctly, cart calculates totals accurately including BDT currency

### Orders Management
- **Functionality**: Comprehensive order history with search, filtering by branch/payment/type/date/status, order detail viewing, and cancellation with reason tracking
- **Purpose**: Allows managers to review historical orders, identify issues, process refunds, and analyze ordering patterns
- **Trigger**: User navigates to Orders module
- **Progression**: View order list → Apply filters (branch/date/payment/status) → Search by order number → Click order → View full details → Mark as cancelled/refunded (if needed) → Save changes
- **Success criteria**: Orders load with pagination, filters work correctly, cancelled orders show reason, search returns accurate results

### Kitchen Display System (KDS)
- **Functionality**: Real-time order tracking interface showing active orders with visual status indicators (new/preparing/ready/served), elapsed time tracking, branch filtering, and quick action buttons for status updates
- **Purpose**: Enables kitchen staff to efficiently manage order preparation workflow, prioritize orders by time, and communicate order readiness to service staff
- **Trigger**: Kitchen staff navigates to Kitchen module or receives new order notification
- **Progression**: View active orders → Filter by status (new/preparing/ready) → Accept new order → Order moves to preparing → Mark ready when complete → Service staff marks as served → Order removes from display
- **Success criteria**: Orders appear immediately after POS creation, elapsed time updates every second with color warnings, status changes sync in real-time, orders auto-sort by priority and age

### Branch Management
- **Functionality**: Add/edit/view branches with details including name, location, phone, manager, operating hours, active status, and performance summary showing sales/orders/expenses/profit
- **Purpose**: Enables chain owners to manage multiple locations and monitor individual branch performance
- **Trigger**: User navigates to Branches module or adds new branch
- **Progression**: View branch list → Click add/edit → Enter branch details → Set operating hours → Assign manager → Save → View branch summary card → Compare branch metrics
- **Success criteria**: Branches save correctly, single-branch users see simplified UI, multi-branch users see comparison views

### Menu Management
- **Functionality**: Organize food items by category with pricing, estimated costs, branch availability, active/inactive status, and popular item badges
- **Purpose**: Centralizes menu control allowing owners to update prices, manage availability across branches, and track profitability per item
- **Trigger**: User navigates to Menu module
- **Progression**: View categories → Select category → View items → Add/edit item → Set name/price/cost → Select available branches → Set active status → Save → View in POS
- **Success criteria**: Menu items appear in POS immediately, branch-specific availability works, popular badges display correctly

### Inventory Tracking
- **Functionality**: Track stock items by branch with units (kg/litre/piece/packet), opening/purchased/used/wastage/current stock, low stock thresholds, and status indicators
- **Purpose**: Prevents stockouts and reduces wastage by providing visibility into inventory levels and consumption patterns
- **Trigger**: User navigates to Inventory or receives low stock alert
- **Progression**: View inventory list → Filter by branch → Check stock status → Add purchase → Record usage/wastage → Update stock → Set threshold → View alerts on dashboard
- **Success criteria**: Low stock alerts appear on dashboard, calculations are accurate, branch-specific inventory tracked separately

### Expense Management
- **Functionality**: Record and categorize expenses (rent/salary/utility/raw materials/packaging/delivery/maintenance/other) by branch with date, amount, payment method, and notes
- **Purpose**: Tracks all business costs enabling profit calculation and expense pattern analysis across branches and categories
- **Trigger**: User navigates to Expenses or records new expense
- **Progression**: View expenses → Add expense → Select branch/category → Enter amount → Choose payment method → Add note → Save → View summary by branch/category
- **Success criteria**: Expenses reflect in profit calculations, category summaries accurate, payment method breakdown correct

### Staff Management
- **Functionality**: Manage staff with name, phone, role (owner/admin/manager/cashier/waiter), assigned branch, active status, orders handled, and sales tracked
- **Purpose**: Organizes workforce, assigns responsibilities, and monitors individual performance metrics
- **Trigger**: User navigates to Staff module
- **Progression**: View staff list → Add staff → Enter details → Select role → Assign branch → Set active status → Save → View performance metrics → Update as needed
- **Success criteria**: Role assignments work, branch assignments filter correctly, performance metrics calculate accurately

### Reports & Analytics
- **Functionality**: Comprehensive reporting including sales summary, branch comparison, payment method breakdown, top selling items, expense summary, profit report, cash vs digital analysis, and staff performance
- **Purpose**: Provides business intelligence for strategic decision-making and performance optimization
- **Trigger**: User navigates to Reports module
- **Progression**: Select report type → Choose date range → Filter by branch → View charts/tables → Analyze trends → Export/print (future enhancement) → Take action based on insights
- **Success criteria**: All reports render correctly, data matches source modules, multi-branch comparisons work, charts display properly

### Daily Cash Closing
- **Functionality**: End-of-day reconciliation showing opening cash, cash sales, digital sales, expenses from cash, expected vs actual cash, difference calculation, and closing notes
- **Purpose**: Ensures cash accountability, identifies discrepancies, and maintains financial integrity
- **Trigger**: Manager initiates daily closing process
- **Progression**: Select branch/date → Enter opening cash → System calculates expected cash → Enter actual cash → Review difference → Add closing note → Submit → Mark as closed
- **Success criteria**: Calculations accurate, shortage/excess clearly indicated, historical closings viewable, cannot close same day twice

### Settings & Configuration
- **Functionality**: Configure restaurant name, business type (single/multi-branch), currency (BDT), default VAT/service charge percentages, enabled payment methods, and receipt footer message
- **Purpose**: Customizes system to match business requirements and regulatory needs
- **Trigger**: User navigates to Settings
- **Progression**: View current settings → Update restaurant name → Set business type → Configure tax rates → Enable payment methods → Customize receipt → Save changes → System applies globally
- **Success criteria**: Settings persist across sessions, changes reflect immediately in POS/receipts, business type affects UI complexity

## Edge Case Handling

- **No Branches Configured**: Display onboarding wizard prompting user to create first branch before accessing other modules
- **Single Branch Only**: Automatically simplify UI by hiding branch comparison charts and removing branch selectors where not needed
- **Empty Menu**: Show helpful empty state in POS with link to Menu module to add items
- **Low/No Stock Items**: Display warning in POS when item selected, allow override for service-only items
- **Negative Cash Difference**: Highlight in red with "Shortage" label, require manager approval before closing
- **Cancelled Orders**: Preserve in order history with strike-through, exclude from sales metrics but track refund amount
- **Inactive Staff/Branches**: Show in lists but greyed out, prevent assignment of new orders/items
- **Split Payments**: Allow multiple payment methods per order with amount allocation for each method
- **Offline Mode**: Show warning banner, queue operations, sync when connection restored (future enhancement)

## Design Direction

The design should evoke trust, efficiency, and clarity - a professional business tool that restaurant owners rely on daily. It should feel modern yet approachable, data-rich without overwhelming, and fast to navigate during busy service hours. The interface must work equally well for tech-savvy chain owners and small restaurant operators new to digital systems.

## Color Selection

A professional SaaS theme centered around trust (blue) and energy (orange) representing the 24/7 nature of restaurant operations.

- **Primary Color**: Deep blue (oklch(0.45 0.15 250)) - Conveys trust, stability, and professionalism. Used for primary actions, navigation active states, and key metrics.
- **Secondary Colors**: 
  - Neutral slate (oklch(0.95 0.01 250)) for backgrounds and subtle UI elements
  - Warm grey (oklch(0.55 0.02 250)) for secondary text and dividers
- **Accent Color**: Vibrant orange (oklch(0.68 0.18 40)) - Energetic and attention-grabbing for CTAs, alerts, and important actions like "Complete Order" or "Save Changes"
- **Foreground/Background Pairings**:
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent Orange (oklch(0.68 0.18 40)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Background (oklch(0.98 0.005 250)): Dark text (oklch(0.20 0.02 250)) - Ratio 14.1:1 ✓
  - Muted background (oklch(0.95 0.01 250)): Medium text (oklch(0.40 0.03 250)) - Ratio 7.8:1 ✓

## Font Selection

Typography should be highly legible at small sizes (for data tables), professional, and efficient - maximizing information density without sacrificing readability.

- **Primary Typeface**: Inter for UI elements - A versatile sans-serif optimized for screen reading with excellent number differentiation (critical for financial data)
- **Accent Typeface**: Manrope for headings - Slightly rounded terminals add approachability while maintaining professionalism

- **Typographic Hierarchy**:
  - H1 (Page Titles): Manrope Bold/32px/tight letter spacing/-0.02em
  - H2 (Section Headers): Manrope Semibold/24px/tight letter spacing/-0.01em  
  - H3 (Card Titles): Manrope Semibold/18px/normal letter spacing
  - Body (Primary): Inter Regular/14px/1.5 line height/normal spacing
  - Body Small (Table data): Inter Regular/13px/1.4 line height/normal spacing
  - Labels: Inter Medium/12px/1.3 line height/0.01em spacing/uppercase
  - Numbers (Metrics): Inter Semibold/20-28px/tabular numbers/tight spacing

## Animations

Animations should be minimal and purposeful, never delaying user actions in a time-sensitive restaurant environment. Focus on micro-interactions that provide feedback rather than decorative motion.

Use subtle transitions for state changes (150-200ms), hover feedback on interactive elements (100ms), and smooth panel slides for dialogs/drawers (250ms). Avoid page transition animations entirely. Toast notifications should slide in quickly (200ms) with auto-dismiss. Data updates should use subtle fade transitions (150ms) rather than abrupt changes.

## Component Selection

- **Components**:
  - Sidebar: Left navigation with collapsible menu items and active state indicators
  - Card: Primary container for dashboard metrics, branch summaries, and content sections
  - Table: Order lists, inventory, staff, and expense tables with sorting and filtering
  - Dialog: Add/edit forms for branches, menu items, staff, and settings
  - Sheet: Side drawer for POS cart and order details
  - Badge: Status indicators (Active/Inactive, Good/Low Stock, Completed/Cancelled)
  - Button: Primary (accent orange), Secondary (outline), Destructive (red for delete/cancel)
  - Input: Text fields for forms with clear labels
  - Select: Dropdown for branch, category, payment method selection
  - Tabs: Menu categories in POS, report type switching
  - Separator: Dividing sections within cards
  - Alert: Low stock warnings, cash shortage notifications
  - Popover: Quick actions menu, filter dropdowns
  - Tooltip: Icon explanations, truncated text expansion

- **Customizations**:
  - Custom POS menu grid with image placeholders and quick-add buttons
  - Custom receipt preview component with print-friendly styling
  - Custom metric cards with large numbers, trend indicators, and drill-down links
  - Custom branch comparison table with sparkline charts (using recharts)
  - Custom daily closing calculator showing expected vs actual with color-coded difference

- **States**:
  - Buttons: Default state with solid colors, hover with slight brightness increase (110%), active with subtle scale (98%), disabled with reduced opacity (50%)
  - Inputs: Default with border, focus with blue ring and border color shift, error with red border and icon, success with green checkmark
  - Cards: Default flat, hover with subtle shadow lift for clickable cards
  - Badges: Color-coded by status type (green=active/good, yellow=warning/low, red=inactive/error, grey=neutral)

- **Icon Selection**:
  - Dashboard: ChartBar
  - POS: ShoppingCart
  - Orders: Receipt
  - Branches: Buildings
  - Menu: BookOpen
  - Inventory: Package
  - Expenses: CurrencyDollar (representing BDT)
  - Staff: Users
  - Reports: ChartLine
  - Settings: Gear
  - Plus/Minus for quantity adjustments
  - Trash for deletions
  - MagnifyingGlass for search
  - FunnelSimple for filters
  - Check/X for status indicators

- **Spacing**:
  - Page padding: p-6
  - Card padding: p-6
  - Card gap: gap-6
  - Section spacing: space-y-6
  - Form field spacing: space-y-4
  - Button padding: px-4 py-2 (default), px-6 py-3 (large)
  - Table cell padding: px-4 py-3
  - Consistent 24px (gap-6) between major sections

- **Mobile**:
  - Sidebar collapses to hamburger menu with slide-out drawer
  - Dashboard cards stack vertically with full width
  - Tables scroll horizontally with sticky first column
  - POS switches to full-screen cart overlay instead of side panel
  - Two-column layouts become single column below 768px
  - Touch-friendly button sizes (minimum 44px height)
  - Branch selector moves to dropdown at top of page
  - Reduce page padding to p-4 on mobile
