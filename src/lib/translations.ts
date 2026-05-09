export type Language = 'en' | 'bn'

export const translations = {
  en: {
    dashboard: 'Dashboard',
    pos: 'POS',
    orders: 'Orders',
    branches: 'Branches',
    menu: 'Menu',
    inventory: 'Inventory',
    expenses: 'Expenses',
    staff: 'Staff',
    reports: 'Reports',
    settings: 'Settings',
    
    todaySales: "Today's Sales",
    todayOrders: "Today's Orders",
    avgOrderValue: 'Avg Order Value',
    cashCollected: 'Cash Collected',
    digitalPayment: 'Digital Payment',
    todayExpenses: "Today's Expenses",
    estimatedProfit: 'Estimated Profit',
    
    allBranches: 'All Branches',
    selectBranch: 'Select Branch',
    
    orderType: 'Order Type',
    dineIn: 'Dine-in',
    takeaway: 'Takeaway',
    delivery: 'Delivery',
    
    orderSource: 'Order Source',
    walkIn: 'Walk-in',
    phone: 'Phone',
    facebook: 'Facebook',
    foodpanda: 'Foodpanda',
    pathaoFood: 'Pathao Food',
    website: 'Website',
    other: 'Other',
    
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    card: 'Card',
    bankTransfer: 'Bank Transfer',
    
    deliveryStatus: 'Delivery Status',
    pending: 'Pending',
    preparing: 'Preparing',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    customerName: 'Customer Name',
    phoneNumber: 'Phone Number',
    deliveryAddress: 'Delivery Address',
    deliveryCharge: 'Delivery Charge',
    riderName: 'Rider Name',
    
    expenseCategory: 'Expense Category',
    rent: 'Rent',
    staffSalary: 'Staff Salary',
    gasBill: 'Gas Bill',
    electricityBill: 'Electricity Bill',
    waterBill: 'Water Bill',
    rawMaterials: 'Raw Materials',
    meatPurchase: 'Meat Purchase',
    ricePurchase: 'Rice Purchase',
    packaging: 'Packaging',
    cleaning: 'Cleaning',
    deliveryCost: 'Delivery Cost',
    maintenance: 'Maintenance',
    marketing: 'Marketing',
    
    subtotal: 'Subtotal',
    discount: 'Discount',
    serviceCharge: 'Service Charge',
    vat: 'VAT',
    total: 'Total',
    paid: 'Paid',
    change: 'Change',
    
    restaurantName: 'Restaurant Name',
    branchName: 'Branch Name',
    address: 'Address',
    binNumber: 'BIN/VAT Number',
    receiptFooter: 'Receipt Footer',
    
    language: 'Language',
    english: 'English',
    bangla: 'বাংলা',
    
    vatSettings: 'VAT Settings',
    vatEnabled: 'VAT Enabled',
    vatPercentage: 'VAT Percentage',
    serviceChargeSettings: 'Service Charge Settings',
    serviceChargeEnabled: 'Service Charge Enabled',
    serviceChargePercentage: 'Service Charge Percentage',
    applyOnlyForDineIn: 'Apply only for dine-in',
    
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    print: 'Print',
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    pos: 'পস',
    orders: 'অর্ডার',
    branches: 'শাখা',
    menu: 'মেনু',
    inventory: 'স্টক',
    expenses: 'খরচ',
    staff: 'স্টাফ',
    reports: 'রিপোর্ট',
    settings: 'সেটিংস',
    
    todaySales: 'আজকের বিক্রয়',
    todayOrders: 'আজকের অর্ডার',
    avgOrderValue: 'গড় অর্ডার মূল্য',
    cashCollected: 'ক্যাশ আদায়',
    digitalPayment: 'ডিজিটাল পেমেন্ট',
    todayExpenses: 'আজকের খরচ',
    estimatedProfit: 'আনুমানিক লাভ',
    
    allBranches: 'সব শাখা',
    selectBranch: 'শাখা সিলেক্ট করুন',
    
    orderType: 'অর্ডারের ধরন',
    dineIn: 'ডাইন-ইন',
    takeaway: 'টেকঅ্যাওয়ে',
    delivery: 'ডেলিভারি',
    
    orderSource: 'অর্ডার সোর্স',
    walkIn: 'ওয়াক-ইন',
    phone: 'ফোন',
    facebook: 'ফেসবুক',
    foodpanda: 'ফুডপান্ডা',
    pathaoFood: 'পাঠাও ফুড',
    website: 'ওয়েবসাইট',
    other: 'অন্যান্য',
    
    paymentMethod: 'পেমেন্ট মেথড',
    cash: 'ক্যাশ',
    bkash: 'বিকাশ',
    nagad: 'নগদ',
    rocket: 'রকেট',
    card: 'কার্ড',
    bankTransfer: 'ব্যাংক ট্রান্সফার',
    
    deliveryStatus: 'ডেলিভারি স্ট্যাটাস',
    pending: 'পেন্ডিং',
    preparing: 'তৈরি হচ্ছে',
    outForDelivery: 'ডেলিভারিতে গেছে',
    delivered: 'ডেলিভারি হয়েছে',
    cancelled: 'ক্যানসেল',
    
    customerName: 'কাস্টমারের নাম',
    phoneNumber: 'ফোন নম্বর',
    deliveryAddress: 'ডেলিভারি ঠিকানা',
    deliveryCharge: 'ডেলিভারি চার্জ',
    riderName: 'রাইডারের নাম',
    
    expenseCategory: 'খরচের ক্যাটাগরি',
    rent: 'ভাড়া',
    staffSalary: 'স্টাফ বেতন',
    gasBill: 'গ্যাস বিল',
    electricityBill: 'বিদ্যুৎ বিল',
    waterBill: 'পানির বিল',
    rawMaterials: 'কাঁচামাল',
    meatPurchase: 'মাংস ক্রয়',
    ricePurchase: 'চাল ক্রয়',
    packaging: 'প্যাকেজিং',
    cleaning: 'পরিষ্কার',
    deliveryCost: 'ডেলিভারি খরচ',
    maintenance: 'মেইন্টেনেন্স',
    marketing: 'মার্কেটিং',
    
    subtotal: 'সাবটোটাল',
    discount: 'ডিসকাউন্ট',
    serviceCharge: 'সার্ভিস চার্জ',
    vat: 'ভ্যাট',
    total: 'মোট',
    paid: 'পেইড',
    change: 'খুচরা',
    
    restaurantName: 'রেস্টুরেন্টের নাম',
    branchName: 'শাখার নাম',
    address: 'ঠিকানা',
    binNumber: 'বিআইএন/ভ্যাট নম্বর',
    receiptFooter: 'রিসিট ফুটার',
    
    language: 'ভাষা',
    english: 'English',
    bangla: 'বাংলা',
    
    vatSettings: 'ভ্যাট সেটিংস',
    vatEnabled: 'ভ্যাট চালু',
    vatPercentage: 'ভ্যাট শতাংশ',
    serviceChargeSettings: 'সার্ভিস চার্জ সেটিংস',
    serviceChargeEnabled: 'সার্ভিস চার্জ চালু',
    serviceChargePercentage: 'সার্ভিস চার্জ শতাংশ',
    applyOnlyForDineIn: 'শুধু ডাইন-ইনে প্রয়োগ',
    
    save: 'সেভ',
    cancel: 'ক্যানসেল',
    add: 'যোগ করুন',
    edit: 'এডিট',
    delete: 'ডিলিট',
    search: 'খুঁজুন',
    filter: 'ফিল্টার',
    export: 'এক্সপোর্ট',
    print: 'প্রিন্ট',
  }
}

export function useTranslation(language: Language) {
  return translations[language]
}

export function getPaymentMethodLabel(method: string, language: Language): string {
  const labels: Record<string, { en: string; bn: string }> = {
    cash: { en: 'Cash', bn: 'ক্যাশ' },
    bkash: { en: 'bKash', bn: 'বিকাশ' },
    nagad: { en: 'Nagad', bn: 'নগদ' },
    rocket: { en: 'Rocket', bn: 'রকেট' },
    card: { en: 'Card', bn: 'কার্ড' },
    'bank-transfer': { en: 'Bank Transfer', bn: 'ব্যাংক ট্রান্সফার' },
    foodpanda: { en: 'Foodpanda', bn: 'ফুডপান্ডা' },
    'pathao-food': { en: 'Pathao Food', bn: 'পাঠাও ফুড' },
    other: { en: 'Other', bn: 'অন্যান্য' },
  }
  return labels[method]?.[language] || method
}

export function getOrderSourceLabel(source: string, language: Language): string {
  const labels: Record<string, { en: string; bn: string }> = {
    'walk-in': { en: 'Walk-in', bn: 'ওয়াক-ইন' },
    phone: { en: 'Phone', bn: 'ফোন' },
    facebook: { en: 'Facebook', bn: 'ফেসবুক' },
    foodpanda: { en: 'Foodpanda', bn: 'ফুডপান্ডা' },
    'pathao-food': { en: 'Pathao Food', bn: 'পাঠাও ফুড' },
    website: { en: 'Website', bn: 'ওয়েবসাইট' },
    other: { en: 'Other', bn: 'অন্যান্য' },
  }
  return labels[source]?.[language] || source
}

export function getDeliveryStatusLabel(status: string, language: Language): string {
  const labels: Record<string, { en: string; bn: string }> = {
    pending: { en: 'Pending', bn: 'পেন্ডিং' },
    preparing: { en: 'Preparing', bn: 'তৈরি হচ্ছে' },
    'out-for-delivery': { en: 'Out for Delivery', bn: 'ডেলিভারিতে গেছে' },
    delivered: { en: 'Delivered', bn: 'ডেলিভারি হয়েছে' },
    cancelled: { en: 'Cancelled', bn: 'ক্যানসেল' },
  }
  return labels[status]?.[language] || status
}

export function getExpenseCategoryLabel(category: string, language: Language): string {
  const labels: Record<string, { en: string; bn: string }> = {
    rent: { en: 'Rent', bn: 'ভাড়া' },
    'staff-salary': { en: 'Staff Salary', bn: 'স্টাফ বেতন' },
    'gas-bill': { en: 'Gas Bill', bn: 'গ্যাস বিল' },
    'electricity-bill': { en: 'Electricity Bill', bn: 'বিদ্যুৎ বিল' },
    'water-bill': { en: 'Water Bill', bn: 'পানির বিল' },
    'raw-materials': { en: 'Raw Materials', bn: 'কাঁচামাল' },
    'meat-purchase': { en: 'Meat Purchase', bn: 'মাংস ক্রয়' },
    'rice-purchase': { en: 'Rice Purchase', bn: 'চাল ক্রয়' },
    packaging: { en: 'Packaging', bn: 'প্যাকেজিং' },
    cleaning: { en: 'Cleaning', bn: 'পরিষ্কার' },
    'delivery-cost': { en: 'Delivery Cost', bn: 'ডেলিভারি খরচ' },
    maintenance: { en: 'Maintenance', bn: 'মেইন্টেনেন্স' },
    marketing: { en: 'Marketing', bn: 'মার্কেটিং' },
    other: { en: 'Other', bn: 'অন্যান্য' },
  }
  return labels[category]?.[language] || category
}
