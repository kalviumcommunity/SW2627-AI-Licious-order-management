import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrderDetailsPage from './OrderDetailsPage'
import SettingsSection from './SettingsSection'
import InventorySection from './InventorySection'
import OffersSection from './OffersSection'
import OfferDetailsPage from './OfferDetailsPage'
import ProductsSection from './ProductsSection'


import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ScrollText,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Truck,
  Clock,
  CircleDot,
  MoreVertical,
  Download,
  Calendar,
  TrendingUp,
  Check
} from 'lucide-react'
import './DashboardPage.css'

// Import assets
import chickenCurryImg from '../assets/chicken_curry.jpg'
import chickenKebabImg from '../assets/chicken_kebab.jpg'
import rawasFilletImg from '../assets/rawas_fillet.jpg'
import prawnsMediumImg from '../assets/prawns_medium.jpg'
import chickenTikkaImg from '../assets/chicken_tikka.jpg'
import chickenBiryaniImg from '../assets/chicken_biryani.jpg'

// Inline Vector Licious Logo Component
function LiciousLogo({ className = '', invert = false }) {
  const textColor = invert ? '#ffffff' : '#111827'

  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 px-3 py-2.5 shadow-sm ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e32929] shadow-sm">
        <svg className="h-6 w-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="44" height="44" rx="12" fill="#e32929" />
          <path
            d="M8 29C14 35 20 38 24 38C28 38 34 35 40 29"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="24" cy="15" r="4" fill="#ffffff" />
          <path d="M13 18C16 12 20 9 24 9C28 9 32 12 35 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-base font-black tracking-[-0.03em]" style={{ color: textColor }}>
          Licious
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">
          Admin
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage({ user, onLogout, activeTab: propActiveTab, initialActiveTab = 'dashboard' }) {
  const navigate = useNavigate()
  const { id: routeOrderId } = useParams()

  // Keep the dashboard tab selection logic intact.
  const activeTab = propActiveTab || initialActiveTab

  // Navigation & UI States
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeOrderActionId, setActiveOrderActionId] = useState(null)

  // Chart Hover States
  const [hoveredSalesPoint, setHoveredSalesPoint] = useState(null)

  // Mock initial orders data
  const [orders, setOrders] = useState([
    {
      id: 'LICI123456',
      customerName: 'Sanvi sri',
      phone: '9845672312',
      items: [
        { name: 'Chicken curry cut (1 kg)', image: chickenCurryImg, quantity: 1, price: 350 },
        { name: 'Chicken seekh kebab (250 g)', image: chickenKebabImg, quantity: 1, price: 250 }
      ],
      price: 600,
      status: 'New',
      date: '23 July, 2026 11:30 AM',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      address: 'Flat 402, Block A, Prestige Shantiniketan, Whitefield, Bengaluru, Karnataka 560048',
      deliveryInstructions: 'Ring the bell. Leave at the door if no answer.',
      deliveryPartner: { name: 'Ramesh Kumar', phone: '+91 90123 45678', estTime: '20-25 mins', status: 'Assigned' }
    },
    {
      id: 'LICI123457',
      customerName: 'Snihitha',
      phone: '9743212394',
      items: [
        { name: 'Rawas fillet (500 g )', image: rawasFilletImg, quantity: 1, price: 749 },
        { name: 'Prawns medium (500 g)', image: prawnsMediumImg, quantity: 2, price: 250 }
      ],
      price: 1249,
      status: 'Preparing',
      date: '23 July, 2026 11:05 AM',
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      address: 'Villa 15, Adarsh Palm Meadows, Varthur Road, Ramagondanahalli, Bengaluru, Karnataka 560066',
      deliveryInstructions: 'Call upon arrival. Do not horn.',
      deliveryPartner: { name: 'Suresh Raina', phone: '+91 91234 56789', estTime: '15-20 mins', status: 'At Store' }
    },
    {
      id: 'LICI123458',
      customerName: 'Pravin',
      phone: '7658456387',
      items: [
        { name: 'Chicken tikka (500 g)', image: chickenTikkaImg, quantity: 1, price: 380 },
        { name: 'Chicken biriyani (1 kg)', image: chickenBiryaniImg, quantity: 1, price: 370 }
      ],
      price: 750,
      status: 'Preparing',
      date: '23 July, 2026 10:45 AM',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      address: 'Apt 102, Orchid Woods, Kothanur, Hennur Main Road, Bengaluru, Karnataka 560077',
      deliveryInstructions: 'Drop it with the security guard.',
      deliveryPartner: { name: 'Vikram Singh', phone: '+91 92345 67890', estTime: '25-30 mins', status: 'At Store' }
    },
    {
      id: 'LICI123459',
      customerName: 'Aarav Sharma',
      phone: '9812345678',
      items: [
        { name: 'Rawas fillet (500 g )', image: rawasFilletImg, quantity: 1, price: 650 }
      ],
      price: 650,
      status: 'Delivered',
      date: '22 July, 2026 08:15 PM',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Paid',
      address: 'House 44, 4th Cross, Indiranagar 1st Stage, Bengaluru, Karnataka 560038',
      deliveryInstructions: 'No contact delivery. Keep on the shoe rack.',
      deliveryPartner: { name: 'Amit Patel', phone: '+91 93456 78901', estTime: 'Delivered', status: 'Delivered' }
    },
    {
      id: 'LICI123460',
      customerName: 'Kunal Verma',
      phone: '9123456789',
      items: [
        { name: 'Chicken seekh kebab (250 g)', image: chickenKebabImg, quantity: 1, price: 450 }
      ],
      price: 450,
      status: 'Delivered',
      date: '22 July, 2026 07:30 PM',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      address: 'Flat 204, Block C, Sobha Carnation, Sarjapur Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
      deliveryInstructions: '',
      deliveryPartner: { name: 'Vijay Mallya', phone: '+91 94567 89012', estTime: 'Delivered', status: 'Delivered' }
    }
  ])

  // Popular items grid data
  const popularItems = [
    { name: 'Chicken Curry Cut', price: 450, image: chickenCurryImg },
    { name: 'Chicken Seekh Kebab', price: 600, image: chickenKebabImg },
    { name: 'Rawas Fillet', price: 500, image: rawasFilletImg },
    { name: 'Prawns Medium', price: 250, image: prawnsMediumImg },
    { name: 'Chicken Tikka', price: 450, image: chickenTikkaImg },
    { name: 'Chicken Biryani', price: 370, image: chickenBiryaniImg },
  ]

  // Calculate dynamic stats from orders
  const stats = useMemo(() => {
    const totalOrders = orders.length + 1496 // Seed total orders base
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length + 778
    const preparingCount = orders.filter(o => o.status === 'Preparing').length + 287
    const revenueSum = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.price, 0) + 168450 // Seed base revenue

    // format currency to Indian standard (e.g. 1,69,067)
    const formatRupee = (num) => {
      const numStr = num.toString()
      const lastThree = numStr.substring(numStr.length - 3)
      const otherNumbers = numStr.substring(0, numStr.length - 3)
      if (otherNumbers !== '') {
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      }
      return lastThree
    }

    return {
      totalOrders: totalOrders.toLocaleString('en-IN'),
      delivered: deliveredCount.toLocaleString('en-IN'),
      preparing: preparingCount.toLocaleString('en-IN'),
      revenue: `₹ ${formatRupee(revenueSum)}`,
      rawRevenue: revenueSum
    }
  }, [orders])

  // Reports States
  const [reportRange, setReportRange] = useState('Last 7 Days')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [hoveredReportSalesPoint, setHoveredReportSalesPoint] = useState(null)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [csvExportSuccess, setCsvExportSuccess] = useState(false)
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false)

  // Dynamically generate data based on reportRange
  const reportData = useMemo(() => {
    const currentOrdersDeliveredRevenue = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.price, 0)
    const currentOrdersCount = orders.length

    const reportConfig = {
      Today: {
        salesPoints: [
          { date: '09:00 AM', sales: 12000, cx: 40, cy: 160 },
          { date: '12:00 PM', sales: 28000, cx: 150, cy: 110 },
          { date: '03:00 PM', sales: 15000, cx: 260, cy: 150 },
          { date: '06:00 PM', sales: 35000, cx: 370, cy: 80 },
          { date: '09:00 PM', sales: 45000, cx: 460, cy: 50 }
        ],
        totalRevenue: currentOrdersDeliveredRevenue + 135000,
        totalOrdersCount: currentOrdersCount + 124,
        completionRate: 96.8,
        categorySales: [
          { name: 'Chicken', sales: 74250, percentage: 55, color: '#e32929' },
          { name: 'Fish & Seafood', sales: 27000, percentage: 20, color: '#06b6d4' },
          { name: 'Kebabs', sales: 20250, percentage: 15, color: '#f59e0b' },
          { name: 'Ready to Cook', sales: 13500, percentage: 10, color: '#8b5cf6' }
        ]
      },
      'Last 30 Days': {
        salesPoints: [
          { date: 'Week 1', sales: 180000, cx: 40, cy: 150 },
          { date: 'Week 2', sales: 240000, cx: 180, cy: 110 },
          { date: 'Week 3', sales: 310000, cx: 320, cy: 60 },
          { date: 'Week 4', sales: 285000, cx: 460, cy: 80 }
        ],
        totalRevenue: currentOrdersDeliveredRevenue + 1015000,
        totalOrdersCount: currentOrdersCount + 1340,
        completionRate: 93.4,
        categorySales: [
          { name: 'Chicken', sales: 456750, percentage: 45, color: '#e32929' },
          { name: 'Fish & Seafood', sales: 253750, percentage: 25, color: '#06b6d4' },
          { name: 'Kebabs', sales: 203000, percentage: 20, color: '#f59e0b' },
          { name: 'Ready to Cook', sales: 101500, percentage: 10, color: '#8b5cf6' }
        ]
      },
      'This Year': {
        salesPoints: [
          { date: 'Jan-Feb', sales: 850000, cx: 40, cy: 160 },
          { date: 'Mar-Apr', sales: 1200000, cx: 150, cy: 110 },
          { date: 'May-Jun', sales: 1450000, cx: 260, cy: 80 },
          { date: 'Jul-Aug', sales: 1680000, cx: 370, cy: 50 },
          { date: 'Sep-Oct', sales: 1350000, cx: 460, cy: 90 }
        ],
        totalRevenue: currentOrdersDeliveredRevenue + 6530000,
        totalOrdersCount: currentOrdersCount + 8920,
        completionRate: 95.1,
        categorySales: [
          { name: 'Chicken', sales: 2938500, percentage: 45, color: '#e32929' },
          { name: 'Fish & Seafood', sales: 1632500, percentage: 25, color: '#06b6d4' },
          { name: 'Kebabs', sales: 1306000, percentage: 20, color: '#f59e0b' },
          { name: 'Ready to Cook', sales: 653000, percentage: 10, color: '#8b5cf6' }
        ]
      }
    }

    const selectedReport = reportConfig[reportRange] || {
      salesPoints: [
        { date: '22 Jul', sales: 145000, cx: 40, cy: 150 },
        { date: '23 Jul', sales: 162000, cx: 110, cy: 130 },
        { date: '24 Jul', sales: 128000, cx: 180, cy: 160 },
        { date: '25 Jul', sales: 185000, cx: 250, cy: 110 },
        { date: '26 Jul', sales: 195000, cx: 320, cy: 100 },
        { date: '27 Jul', sales: 210000, cx: 390, cy: 80 },
        { date: '28 Jul', sales: 175000, cx: 460, cy: 120 }
      ],
      totalRevenue: currentOrdersDeliveredRevenue + 1200000,
      totalOrdersCount: currentOrdersCount + 1580,
      completionRate: 94.8,
      categorySales: [
        { name: 'Chicken', sales: 540000, percentage: 45, color: '#e32929' },
        { name: 'Fish & Seafood', sales: 300000, percentage: 25, color: '#06b6d4' },
        { name: 'Kebabs', sales: 240000, percentage: 20, color: '#f59e0b' },
        { name: 'Ready to Cook', sales: 120000, percentage: 10, color: '#8b5cf6' }
      ]
    }

    const topProducts = [
      { rank: 1, name: 'Chicken Curry Cut (1 kg)', category: 'Chicken', price: 450, sold: 184, revenue: 82800, stock: 'In Stock' },
      { rank: 2, name: 'Chicken Biryani (1 kg)', category: 'Ready to Cook', price: 370, sold: 142, revenue: 52540, stock: 'In Stock' },
      { rank: 3, name: 'Rawas Fillet (500 g)', category: 'Fish & Seafood', price: 500, sold: 98, revenue: 49000, stock: 'Out of Stock' },
      { rank: 4, name: 'Prawns Medium (500 g)', category: 'Fish & Seafood', price: 250, sold: 156, revenue: 39000, stock: 'In Stock' },
      { rank: 5, name: 'Chicken Seekh Kebab (250 g)', category: 'Kebabs', price: 600, sold: 62, revenue: 37200, stock: 'Low Stock' }
    ]

    return {
      salesPoints: selectedReport.salesPoints,
      totalRevenue: selectedReport.totalRevenue,
      totalOrdersCount: selectedReport.totalOrdersCount,
      aov: Math.round(selectedReport.totalRevenue / selectedReport.totalOrdersCount),
      completionRate: selectedReport.completionRate,
      categorySales: selectedReport.categorySales,
      topProducts
    }
  }, [reportRange, orders])

  const handleExportCsv = () => {
    setIsExportingCsv(true)
    setCsvExportSuccess(false)
    setTimeout(() => {
      setIsExportingCsv(false)
      setCsvExportSuccess(true)
      setTimeout(() => setCsvExportSuccess(false), 3000)
    }, 1500)
  }

  const handleExportPdf = () => {
    setIsExportingPdf(true)
    setPdfExportSuccess(false)
    setTimeout(() => {
      setIsExportingPdf(false)
      setPdfExportSuccess(true)
      setTimeout(() => setPdfExportSuccess(false), 3000)
    }, 1500)
  }

  // Chart Data Setup
  const salesData = [
    { date: '2 Jul', sales: 50000, cx: 40, cy: 160 },
    { date: '3 Jul', sales: 80000, cx: 110, cy: 140 },
    { date: '4 Jul', sales: 100000, cx: 180, cy: 130 },
    { date: '5 Jul', sales: 120000, cx: 250, cy: 110 },
    { date: '6 Jul', sales: 90000, cx: 320, cy: 135 },
    { date: '7 Jul', sales: 160000, cx: 390, cy: 80 },
    { date: '8 Jul', sales: 150000, cx: 460, cy: 95 }
  ]

  // Update order status handler
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    setActiveOrderActionId(null)
  }

  // Filter orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Tab filtering
      if (activeTab === 'live-orders' && (order.status === 'Delivered' || order.status === 'Cancelled')) return false
      if (activeTab === 'completed-orders' && (order.status !== 'Delivered' && order.status !== 'Cancelled')) return false

      // 2. Search query filtering
      if (searchQuery.trim() === '') return true
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      )
    })
  }, [orders, activeTab, searchQuery])

  // Sidebar Menu Items Definition
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders-dropdown', label: 'Orders', icon: ShoppingBag, hasSubmenu: true },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: ScrollText },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // Render Sidebar Component Contents
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-gray-700">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <LiciousLogo />
        <button
          className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 custom-scrollbar">
        {menuItems.map(item => {
          if (item.hasSubmenu) {
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => setIsOrdersDropdownOpen(!isOrdersDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium hover:bg-gray-50 ${
                    activeTab === 'live-orders' || activeTab === 'completed-orders'
                      ? 'text-[#e32929]'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {isOrdersDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isOrdersDropdownOpen && (
                  <div className="pl-12 space-y-1 animate-fade-in-up">
                    <button
                      onClick={() => {
                        navigate('/live-orders')
                        setIsMobileSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-2 py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                        activeTab === 'live-orders'
                          ? 'text-[#e32929] bg-red-50/50'
                          : 'text-gray-600 hover:text-[#e32929] hover:bg-gray-50'
                      }`}
                    >
                      <CircleDot className={`w-1.5 h-1.5 fill-current ${activeTab === 'live-orders' ? 'text-[#e32929]' : 'text-gray-400'}`} />
                      <span>Live orders</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/completed-orders')
                        setIsMobileSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-2 py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                        activeTab === 'completed-orders'
                          ? 'text-[#e32929] bg-red-50/50'
                          : 'text-gray-600 hover:text-[#e32929] hover:bg-gray-50'
                      }`}
                    >
                      <CircleDot className={`w-1.5 h-1.5 fill-current ${activeTab === 'completed-orders' ? 'text-[#e32929]' : 'text-gray-400'}`} />
                      <span>Completed Orders</span>
                    </button>
                  </div>
                )}
              </div>
            )
          }

          const isActive = activeTab === item.id || (item.id === 'offers' && activeTab === 'offer-details')
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id === 'dashboard' ? '/' : `/${item.id}`)
                setIsMobileSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-red-50 text-[#e32929]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout Footer Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#e32929] hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen w-screen bg-gray-50/30 overflow-hidden font-[Inter,sans-serif] text-gray-800">
      {/* ── LEFT DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 bg-white border-r border-gray-150 print:hidden">
        {renderSidebarContent()}
      </aside>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden print:hidden">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-64 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in-up">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* ── TOP HEADER BAR ── */}
        <header className="h-20 bg-white border-b border-gray-150 px-6 flex items-center justify-between flex-shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            {/* Back button removed from header per request */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 capitalize tracking-tight">
              {activeTab === 'dashboard' ? 'DashBoard' : activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-80 focus-within:border-[#e32929] focus-within:ring-1 focus-within:ring-[#e32929] transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers, items..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-5">
            {/* Notification Bell Icon */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all">
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#e32929] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                5
              </span>
            </button>

            {/* Profile Dropdown Badge */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 px-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#e32929] text-white flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800">Admin</p>
                  <p className="max-w-[140px] truncate text-[11px] text-gray-500">{user?.email ?? 'Signed in'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  {/* Invisible backdrop click catcher */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-fade-in-up">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      <p className="font-semibold text-gray-800">{user?.email ?? 'Admin'}</p>
                      <p className="text-xs text-gray-500">Signed in securely</p>
                    </div>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setIsProfileOpen(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Admin Settings</span>
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#e32929] hover:bg-red-50/50 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="md:hidden p-4 bg-white border-b border-gray-150 flex-shrink-0">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers, items..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* ── SCROLLABLE BODY WORKSPACE ── */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 print:p-0 print:overflow-visible">

          {/* ──── VIEW: DASHBOARD TAB ──── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Row 1: Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Total Orders Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-[#e32929] flex-shrink-0">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total orders</span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}</h3>
                    <p className="text-[#e32929] text-[11px] font-semibold mt-1 flex items-center gap-0.5">
                      <span className="text-xs">↑</span> 13.5% <span className="text-gray-400 font-normal">vs yesterday</span>
                    </p>
                  </div>
                </div>

                {/* Delivered Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Delivered</span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.delivered}</h3>
                    <p className="text-green-500 text-[11px] font-semibold mt-1 flex items-center gap-0.5">
                      <span className="text-xs">↑</span> 7.8% <span className="text-gray-400 font-normal">vs yesterday</span>
                    </p>
                  </div>
                </div>

                {/* Preparing Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Preparing</span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.preparing}</h3>
                    <p className="text-amber-500 text-[11px] font-semibold mt-1 flex items-center gap-0.5">
                      <span className="text-xs">↑</span> 4.5% <span className="text-gray-400 font-normal">vs yesterday</span>
                    </p>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white flex-shrink-0 font-bold text-xl">
                    ₹
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.revenue}</h3>
                    <p className="text-green-500 text-[11px] font-semibold mt-1 flex items-center gap-0.5">
                      7.8% <span className="text-gray-400 font-normal">vs yesterday</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Charts Area & Popular items */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 1. Sales Overview Line Chart */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative min-h-[340px]">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                    <h4 className="font-bold text-gray-800 text-sm">Sales Overview</h4>
                    <select className="text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer transition-all">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  
                  {/* Curvy SVG Line Chart */}
                  <div className="relative flex-1 flex items-center justify-center">
                    <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 200">
                      {/* Grids and Axes */}
                      <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="130" x2="480" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
                      
                      {/* Y-Axis Labels */}
                      <text x="30" y="34" className="text-[10px] font-semibold text-gray-400" textAnchor="end">₹2,00,000</text>
                      <text x="30" y="84" className="text-[10px] font-semibold text-gray-400" textAnchor="end">₹1,20,000</text>
                      <text x="30" y="134" className="text-[10px] font-semibold text-gray-400" textAnchor="end">₹80,000</text>
                      <text x="30" y="184" className="text-[10px] font-semibold text-gray-400" textAnchor="end">0</text>

                      {/* Gradients definition */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e32929" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#e32929" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Under the Curve */}
                      <path
                        d="M 40 180 L 40 160 C 75 150, 75 142, 110 140 C 145 138, 145 132, 180 130 C 215 128, 215 112, 250 110 C 285 108, 285 138, 320 135 C 355 132, 355 82, 390 80 C 425 78, 425 98, 460 95 L 460 180 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Smooth Curvy Line */}
                      <path
                        d="M 40 160 C 75 150, 75 142, 110 140 C 145 138, 145 132, 180 130 C 215 128, 215 112, 250 110 C 285 108, 285 138, 320 135 C 355 132, 355 82, 390 80 C 425 78, 425 98, 460 95"
                        fill="none"
                        stroke="#e32929"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="animate-chart-path"
                      />

                      {/* Data Point Markers */}
                      {salesData.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r="5"
                            className="fill-white stroke-[#e32929] stroke-[2.5] cursor-pointer hover:r-7 transition-all"
                            onMouseEnter={() => setHoveredSalesPoint({ ...pt, idx })}
                            onMouseLeave={() => setHoveredSalesPoint(null)}
                          />
                          <text
                            x={pt.cx}
                            y="196"
                            className="text-[10px] font-semibold text-gray-400"
                            textAnchor="middle"
                          >
                            {pt.date}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* Interactive Tooltip popup */}
                    {hoveredSalesPoint && (
                      <div
                        className="absolute bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-xl font-medium pointer-events-none chart-tooltip border border-gray-800"
                        style={{
                          left: `${(hoveredSalesPoint.cx / 500) * 100}%`,
                          top: `${(hoveredSalesPoint.cy / 200) * 100 - 15}%`,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        <p className="text-[10px] text-gray-400 font-normal">{hoveredSalesPoint.date}</p>
                        <p className="font-bold mt-0.5">₹ {hoveredSalesPoint.sales.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Order Overview Donut Chart */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[340px]">
                  <div className="border-b border-gray-50 pb-4">
                    <h4 className="font-bold text-gray-800 text-sm">Order Overview</h4>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 flex-1">
                    {/* SVG Donut */}
                    <div className="relative w-36 h-36 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Math Circle Radius=48, Circumference = 2 * PI * 48 = 301.59 */}
                        {/* Delivered segment - 51.9% (length: 156.52) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="11"
                          strokeDasharray="301.59"
                          strokeDashoffset="0"
                        />
                        {/* Preparing segment - 19.2% (length: 57.90) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="11"
                          strokeDasharray="301.59"
                          strokeDashoffset="-156.52"
                        />
                        {/* Confirmed segment - 13.3% (length: 40.11) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="transparent"
                          stroke="#a855f7"
                          strokeWidth="11"
                          strokeDasharray="301.59"
                          strokeDashoffset="-214.42"
                        />
                        {/* Cancelled segment - 5.3% (length: 15.98) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="11"
                          strokeDasharray="301.59"
                          strokeDashoffset="-254.53"
                        />
                        {/* Returned segment - 10.1% (length: 30.46) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="11"
                          strokeDasharray="301.59"
                          strokeDashoffset="-270.51"
                        />
                      </svg>
                      {/* Center summary texts */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight">1,501</span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</span>
                      </div>
                    </div>

                    {/* Right side Detailed Legends */}
                    <div className="flex-1 space-y-2.5 w-full text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                          <span className="text-gray-500 font-medium">Delivered</span>
                        </div>
                        <span className="font-bold text-gray-800">780 (51.9%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                          <span className="text-gray-500 font-medium">Preparing</span>
                        </div>
                        <span className="font-bold text-gray-800">289 (19.2%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                          <span className="text-gray-500 font-medium">Confirmed</span>
                        </div>
                        <span className="font-bold text-gray-800">200 (13.3%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                          <span className="text-gray-500 font-medium">Cancelled</span>
                        </div>
                        <span className="font-bold text-gray-800">80 (5.3%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                          <span className="text-gray-500 font-medium">Returned</span>
                        </div>
                        <span className="font-bold text-gray-800">152 (10.1%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Total orders popular items grid */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[340px]">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                    <h4 className="font-bold text-gray-800 text-sm">Total orders</h4>
                    <select className="text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg outline-none cursor-pointer transition-all">
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>

                  {/* 2-Column Popular Items Grid */}
                  <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                    {popularItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover bg-[#e32929] shadow-sm"
                          />
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-1">{item.name}</p>
                          <p className="text-sm font-extrabold text-gray-800 mt-0.5">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Recent Orders Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-base">Recent Orders</h4>
                  <button
                    onClick={() => navigate('/live-orders')}
                    className="text-xs font-semibold text-[#e32929] hover:underline"
                  >
                    View All Orders
                  </button>
                </div>

                {/* Recent Orders List */}
                <div className="space-y-3">
                  {filteredOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="bg-white border border-gray-150 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-[#e32929] hover:shadow-md transition-all duration-300 relative cursor-pointer"
                    >
                      {/* Left: Customer Info */}
                      <div className="flex items-center gap-3.5 min-w-[200px]">
                        <div className="w-12 h-12 bg-red-50 text-[#e32929] rounded-xl flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800 text-sm">{order.customerName}</h5>
                          <p className="text-xs font-semibold text-gray-400 mt-0.5">{order.phone}</p>
                        </div>
                      </div>

                      {/* Middle: Items & Photos */}
                      <div className="flex-1 flex items-center gap-4 border-l-0 md:border-l md:border-gray-100 md:pl-6 min-w-0">
                        <div className="flex -space-x-2.5 flex-shrink-0">
                          {order.items.slice(0, 2).map((item, index) => (
                            <img
                              key={index}
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
                            />
                          ))}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-700 truncate">{order.items[0].name}</p>
                          {order.items[1] && (
                            <p className="text-xs font-bold text-gray-700 truncate mt-0.5">{order.items[1].name}</p>
                          )}
                          {order.items.length > 2 && (
                            <span className="text-[10px] text-[#e32929] font-bold block mt-0.5">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle-Right: Price & ID */}
                      <div className="flex flex-col md:items-end justify-center min-w-[120px]">
                        <span className="text-lg font-extrabold text-gray-800">₹{order.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-gray-400 font-semibold mt-0.5">Order ID : {order.id}</span>
                      </div>

                      {/* Right: Actions & Status */}
                      <div className="flex items-center justify-between md:justify-end gap-4 min-w-[160px] border-t md:border-t-0 border-gray-50 pt-3 md:pt-0">
                        {/* Status badge */}
                        <span
                          className={`px-4 py-1.5 rounded-lg text-xs font-extrabold tracking-wide uppercase ${
                            order.status === 'New'
                              ? 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100'
                              : order.status === 'Preparing'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : order.status === 'Ready'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : 'bg-green-50 text-green-600 border border-green-100'
                          }`}
                        >
                          {order.status === 'Ready' ? 'Ready for Pickup' : order.status}
                        </span>

                        {/* Interactive dots context menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveOrderActionId(activeOrderActionId === order.id ? null : order.id)
                            }}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {activeOrderActionId === order.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveOrderActionId(null)} />
                              <div className="absolute right-0 bottom-full md:bottom-auto md:top-full mt-1.5 w-44 bg-white border border-gray-150 rounded-xl shadow-xl py-1.5 z-20 animate-fade-in-up">
                                <p className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold px-3 py-1 border-b border-gray-50 mb-1">Update Status</p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(order.id, 'New')
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-fuchsia-600 hover:bg-fuchsia-50 font-bold transition-all"
                                >
                                  <CircleDot className="w-3.5 h-3.5" />
                                  <span>Mark as New</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(order.id, 'Preparing')
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 font-bold transition-all"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Mark as Preparing</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(order.id, 'Ready')
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-bold transition-all"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Mark as Ready</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(order.id, 'Delivered')
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 font-bold transition-all"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Mark as Delivered</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(order.id, 'Cancelled')
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Cancel Order</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="bg-white border border-gray-150 rounded-2xl p-10 text-center text-gray-400 font-semibold shadow-sm">
                      No matching orders found. Try a different search term!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──── VIEW: LIVE ORDERS OR COMPLETED ORDERS TABS ──── */}
          {(activeTab === 'live-orders' || activeTab === 'completed-orders') && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4.5">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 capitalize">
                    {activeTab === 'live-orders' ? 'Live & Pending Orders' : 'Delivered & Completed Orders'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">
                    {filteredOrders.length} orders total in this category
                  </p>
                </div>
              </div>

              {/* Grid Layout for specific tab orders */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#e32929] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Header info */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-gray-50 mb-3.5">
                        <span className="text-xs font-extrabold text-gray-400">{order.id}</span>
                        <span
                          className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                            order.status === 'New'
                              ? 'bg-fuchsia-50 text-fuchsia-600'
                              : order.status === 'Preparing'
                              ? 'bg-amber-50 text-amber-600'
                              : order.status === 'Ready'
                              ? 'bg-blue-50 text-blue-600'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {order.status === 'Ready' ? 'Ready' : order.status}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-50 text-[#e32929] rounded-xl flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <h6 className="font-bold text-gray-800 text-sm leading-tight">{order.customerName}</h6>
                          <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{order.phone}</p>
                        </div>
                      </div>

                      {/* Items lists */}
                      <div className="space-y-2 mb-5">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-600">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-md object-cover border border-gray-100"
                            />
                            <span className="font-semibold line-clamp-1">{item.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-[10px] text-[#e32929] font-bold pl-10">
                            +{order.items.length - 2} more items in this order
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom row: Pricing & Update status */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Amount</p>
                        <p className="text-base font-extrabold text-gray-800 mt-0.5">₹{order.price.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Dropdown status update selector */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveOrderActionId(activeOrderActionId === order.id ? null : order.id)
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-[#e32929] hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all"
                        >
                          <span>Actions</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {activeOrderActionId === order.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveOrderActionId(null)} />
                            <div className="absolute right-0 bottom-full mt-1.5 w-44 bg-white border border-gray-150 rounded-xl shadow-xl py-1.5 z-20 animate-fade-in-up">
                              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold px-3 py-1 border-b border-gray-50 mb-1">Set Status</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order.id, 'New')
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-fuchsia-600 hover:bg-fuchsia-50 font-bold transition-all"
                              >
                                <CircleDot className="w-3.5 h-3.5" />
                                <span>Mark as New</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order.id, 'Preparing')
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 font-bold transition-all"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Mark as Preparing</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order.id, 'Ready')
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-bold transition-all"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Mark as Ready</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order.id, 'Delivered')
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 font-bold transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Mark as Delivered</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order.id, 'Cancelled')
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel Order</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="col-span-full bg-white border border-gray-150 rounded-2xl p-10 text-center text-gray-400 font-semibold shadow-sm">
                    No orders found in this section.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──── VIEW: ORDER DETAILS TAB ──── */}
          {activeTab === 'order-details' && (
            <OrderDetailsPage
              orderId={routeOrderId}
              orders={orders}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {/* ──── VIEW: REPORTS TAB ──── */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Reports Dashboard Header / Controls */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Performance & Analytics</h2>
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    Real-time sales charts, orders reports, and business insights.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Date range picker dropdown */}
                  <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-[#e32929] transition-all">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <select
                      value={reportRange}
                      onChange={(e) => setReportRange(e.target.value)}
                      className="text-xs font-semibold text-gray-600 bg-transparent outline-none cursor-pointer pr-4"
                    >
                      <option>Today</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Year</option>
                      <option>Custom Range</option>
                    </select>
                  </div>

                  {reportRange === 'Custom Range' && (
                    <div className="flex items-center gap-2 animate-fade-in">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-[#e32929]"
                      />
                      <span className="text-xs text-gray-400 font-semibold">to</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-[#e32929]"
                      />
                    </div>
                  )}

                  {/* Export Options */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCsv}
                      disabled={isExportingCsv}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer ${
                        csvExportSuccess
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {isExportingCsv ? (
                        <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : csvExportSuccess ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{csvExportSuccess ? 'Exported!' : 'Export CSV'}</span>
                    </button>

                    <button
                      onClick={handleExportPdf}
                      disabled={isExportingPdf}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer ${
                        pdfExportSuccess
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {isExportingPdf ? (
                        <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : pdfExportSuccess ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{pdfExportSuccess ? 'PDF Downloaded!' : 'Export PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Revenue Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#e32929]/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#e32929] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Sales</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-0.5">
                      ₹ {reportData.totalRevenue.toLocaleString('en-IN')}
                    </h3>
                    <p className="text-green-500 text-[10px] font-bold mt-1 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +12.4% <span className="text-gray-400 font-normal">vs prev period</span>
                    </p>
                  </div>
                </div>

                {/* 2. Total Orders Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-0.5">
                      {reportData.totalOrdersCount.toLocaleString('en-IN')}
                    </h3>
                    <p className="text-green-500 text-[10px] font-bold mt-1 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +8.6% <span className="text-gray-400 font-normal">vs prev period</span>
                    </p>
                  </div>
                </div>

                {/* 3. AOV Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Avg Order Value</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-0.5">
                      ₹ {reportData.aov.toLocaleString('en-IN')}
                    </h3>
                    <p className="text-green-500 text-[10px] font-bold mt-1 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +3.5% <span className="text-gray-400 font-normal">vs prev period</span>
                    </p>
                  </div>
                </div>

                {/* 4. Completion Rate Card */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group min-h-[92px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Delivery Success Rate</span>
                      <h3 className="text-xl font-bold text-gray-800 mt-0.5">{reportData.completionRate}%</h3>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${reportData.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: Revenue Trend Chart (SVG Line Chart) */}
                <div className="xl:col-span-2 bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[360px]">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Revenue Sales Trend</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Visualizing performance indicators</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#e32929] bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                      {reportRange}
                    </span>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center">
                    <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 200">
                      {/* Grid Lines */}
                      <line x1="40" y1="30" x2="480" y2="30" stroke="#f8fafc" strokeWidth="1" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="#f8fafc" strokeWidth="1" />
                      <line x1="40" y1="110" x2="480" y2="110" stroke="#f8fafc" strokeWidth="1" />
                      <line x1="40" y1="150" x2="480" y2="150" stroke="#f8fafc" strokeWidth="1" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* Y Axis Labels */}
                      <text x="30" y="34" className="text-[9px] font-semibold text-gray-400" textAnchor="end">₹3,00,000</text>
                      <text x="30" y="74" className="text-[9px] font-semibold text-gray-400" textAnchor="end">₹2,00,000</text>
                      <text x="30" y="114" className="text-[9px] font-semibold text-gray-400" textAnchor="end">₹1,00,000</text>
                      <text x="30" y="154" className="text-[9px] font-semibold text-gray-400" textAnchor="end">₹50,000</text>
                      <text x="30" y="184" className="text-[9px] font-semibold text-gray-400" textAnchor="end">0</text>

                      {/* Area Fill Path builder based on dynamic range */}
                      <defs>
                        <linearGradient id="reportChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e32929" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#e32929" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Dynamic SVG Area & Path builder */}
                      {(() => {
                        const pts = reportData.salesPoints
                        if (pts.length === 0) return null
                        
                        let pathD = `M ${pts[0].cx} ${pts[0].cy}`
                        for (let i = 1; i < pts.length; i++) {
                          const prev = pts[i - 1]
                          const curr = pts[i]
                          const cp1x = prev.cx + (curr.cx - prev.cx) / 2
                          const cp1y = prev.cy
                          const cp2x = prev.cx + (curr.cx - prev.cx) / 2
                          const cp2y = curr.cy
                          pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.cx} ${curr.cy}`
                        }
                        
                        const areaD = `${pathD} L ${pts[pts.length - 1].cx} 180 L ${pts[0].cx} 180 Z`
                        
                        return (
                          <>
                            <path d={areaD} fill="url(#reportChartGradient)" />
                            <path d={pathD} fill="none" stroke="#e32929" strokeWidth="3" strokeLinecap="round" className="animate-chart-path" />
                          </>
                        )
                      })()}

                      {/* Data Point Markers */}
                      {reportData.salesPoints.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r="4.5"
                            className="fill-white stroke-[#e32929] stroke-[2.5] cursor-pointer hover:r-6.5 transition-all"
                            onMouseEnter={() => setHoveredReportSalesPoint({ ...pt, idx })}
                            onMouseLeave={() => setHoveredReportSalesPoint(null)}
                          />
                          <text
                            x={pt.cx}
                            y="195"
                            className="text-[9px] font-semibold text-gray-400"
                            textAnchor="middle"
                          >
                            {pt.date}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* Interactive Tooltip popup */}
                    {hoveredReportSalesPoint && (
                      <div
                        className="absolute bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-xl font-medium pointer-events-none chart-tooltip border border-gray-800"
                        style={{
                          left: `${(hoveredReportSalesPoint.cx / 500) * 100}%`,
                          top: `${(hoveredReportSalesPoint.cy / 200) * 100 - 15}%`,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        <p className="text-[9px] text-gray-400 font-normal">{hoveredReportSalesPoint.date}</p>
                        <p className="font-bold mt-0.5">₹ {hoveredReportSalesPoint.sales.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Sales by Category Distribution (Custom list & progress bars) */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[360px]">
                  <div className="border-b border-gray-50 pb-4 mb-4">
                    <h4 className="font-bold text-gray-800 text-sm">Product Sales Distribution</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Revenue break up by food category</p>
                  </div>

                  <div className="space-y-5 flex-1 flex flex-col justify-center">
                    {reportData.categorySales.map((cat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-gray-700">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-800 font-bold">₹{cat.sales.toLocaleString('en-IN')}</span>
                            <span className="text-gray-400 text-[10px] font-bold ml-1.5">({cat.percentage}%)</span>
                          </div>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="w-full bg-gray-50 border border-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-center mt-4">
                    <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                      💡 **Chicken** remains the top driving source, contributing to **{reportData.categorySales[0]?.percentage}%** of total sales this period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Table section: Top Selling Products */}
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Top Performing Products</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Top inventory items ordered by volume</p>
                  </div>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-xs font-bold text-[#e32929] hover:text-[#c41f1f] hover:underline transition-all self-start sm:self-center"
                  >
                    View All Products →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold text-gray-600">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px] font-bold">
                        <th className="px-6 py-3.5 text-center w-16">Rank</th>
                        <th className="px-6 py-3.5">Product Name</th>
                        <th className="px-6 py-3.5">Category</th>
                        <th className="px-6 py-3.5 text-right">Price</th>
                        <th className="px-6 py-3.5 text-center">Units Sold</th>
                        <th className="px-6 py-3.5 text-right">Revenue Generated</th>
                        <th className="px-6 py-3.5 text-center w-32">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {reportData.topProducts.map((product) => (
                        <tr key={product.rank} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                              product.rank === 1
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : product.rank === 2
                                ? 'bg-slate-100 text-slate-700'
                                : product.rank === 3
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {product.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-bold">{product.name}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              product.category === 'Chicken'
                                ? 'bg-red-50 text-[#e32929] border border-red-100'
                                : product.category === 'Fish & Seafood'
                                ? 'bg-cyan-50 text-cyan-700 border border-cyan-100'
                                : product.category === 'Kebabs'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}>
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700 font-bold">₹{product.price}</td>
                          <td className="px-6 py-4 text-center font-bold text-gray-700">{product.sold}</td>
                          <td className="px-6 py-4 text-right text-[#e32929] font-bold">
                            ₹{product.revenue.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                              product.stock === 'In Stock'
                                ? 'bg-green-500'
                                : product.stock === 'Low Stock'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`} title={product.stock} />
                            <span className="text-[10px] text-gray-500 ml-2">{product.stock}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ──── VIEW: OFFERS TAB ──── */}
          {activeTab === 'offers' && (
            <OffersSection />
          )}

          {/* ──── VIEW: OFFER DETAILS TAB ──── */}
          {activeTab === 'offer-details' && (
            <OfferDetailsPage />
          )}

          {/* ──── VIEW: SETTINGS TAB ──── */}
          {activeTab === 'settings' && (
            <SettingsSection user={user} />
          )}

          {activeTab === 'inventory' && (
            <InventorySection />
          )}

          {activeTab === 'products' && (
            <ProductsSection />
          )}

          {/* ──── OTHER NAVIGATION TABS (PLACEHOLDER PAGES) ──── */}
          {activeTab !== 'dashboard' && activeTab !== 'live-orders' && activeTab !== 'completed-orders' && activeTab !== 'inventory' && activeTab !== 'products' && activeTab !== 'order-details' && activeTab !== 'reports' && activeTab !== 'settings' && activeTab !== 'offers' && activeTab !== 'offer-details' && activeTab !== 'users' && (
            <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm animate-fade-in-up space-y-4 max-w-lg mx-auto mt-10">
              <div className="w-16 h-16 bg-red-50 text-[#e32929] rounded-full flex items-center justify-center mx-auto">
                {activeTab === 'products' && <Package className="w-8 h-8" />}
                {activeTab === 'offers' && <Tag className="w-8 h-8" />}
                {activeTab === 'reports' && <BarChart3 className="w-8 h-8" />}
                {activeTab === 'settings' && <Settings className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 capitalize">{activeTab} Section</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto font-medium">
                  Welcome to the {activeTab} control board. This administrative screen is ready for integration with your database API endpoint.
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all inline-block"
              >
                Back to Dashboard
              </button>
            </div>
          )}


        </div>
      </main>

    </div>
  )
}
