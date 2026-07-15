import { useState, useMemo } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
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
  TrendingUp,
  Edit2,
  CheckCircle2,
  Trash2
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
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className="h-10 w-auto"
        viewBox="0 0 160 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="10"
          y="35"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="30"
          letterSpacing="-1"
          fill={invert ? "#ffffff" : "#374151"}
        >
          Licious
        </text>
        <path
          d="M12 38C40 45 110 45 138 38C110 49 40 49 12 38Z"
          fill="#e32929"
        />
        <circle cx="106.5" cy="14" r="3.5" fill="#e32929" />
      </svg>
    </div>
  )
}

export default function DashboardPage({ onLogout }) {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'live-orders', 'completed-orders', etc.
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
        { name: 'Chicken curry cut (1 kg)', image: chickenCurryImg },
        { name: 'Chicken seekh kebab (250 g)', image: chickenKebabImg }
      ],
      moreItemsCount: 1,
      price: 600,
      status: 'New',
    },
    {
      id: 'LICI123457',
      customerName: 'Snihitha',
      phone: '9743212394',
      items: [
        { name: 'Rawas fillet (500 g )', image: rawasFilletImg },
        { name: 'Praws medium (500 g)', image: prawnsMediumImg }
      ],
      moreItemsCount: 1,
      price: 1249,
      status: 'Preparing',
    },
    {
      id: 'LICI123458',
      customerName: 'Pravin',
      phone: '7658456387',
      items: [
        { name: 'Chicken tikka (500 g)', image: chickenTikkaImg },
        { name: 'Chicken biriyani (1 kg)', image: chickenBiryaniImg }
      ],
      moreItemsCount: 1,
      price: 750,
      status: 'Preparing',
    },
    {
      id: 'LICI123459',
      customerName: 'Aarav Sharma',
      phone: '9812345678',
      items: [
        { name: 'Rawas fillet (500 g )', image: rawasFilletImg }
      ],
      moreItemsCount: 0,
      price: 650,
      status: 'Delivered',
    },
    {
      id: 'LICI123460',
      customerName: 'Kunal Verma',
      phone: '9123456789',
      items: [
        { name: 'Chicken seekh kebab (250 g)', image: chickenKebabImg }
      ],
      moreItemsCount: 0,
      price: 450,
      status: 'Delivered',
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
      if (activeTab === 'live-orders' && order.status === 'Delivered') return false
      if (activeTab === 'completed-orders' && order.status !== 'Delivered') return false

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
    { id: 'users', label: 'Users', icon: Users },
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
                        setActiveTab('live-orders')
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
                        setActiveTab('completed-orders')
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

          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
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
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 bg-white border-r border-gray-150">
        {renderSidebarContent()}
      </aside>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
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
        <header className="h-20 bg-white border-b border-gray-150 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
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

          {/* Search bar inside Header */}
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
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  {/* Invisible backdrop click catcher */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-fade-in-up">
                    <button
                      onClick={() => {
                        setActiveTab('settings')
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

        {/* Search bar for Mobile screens */}
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
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">

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
                          className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
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
                    onClick={() => setActiveTab('live-orders')}
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
                      className="bg-white border border-gray-150 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-[#e32929] transition-all duration-300 relative"
                    >
                      {/* Left: Customer Info */}
                      <div className="flex items-center gap-3.5 min-w-[200px]">
                        <div className="w-12 h-12 bg-red-50 text-[#e32929] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Users className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800 text-sm">{order.customerName}</h5>
                          <p className="text-xs font-semibold text-gray-400 mt-0.5">{order.phone}</p>
                        </div>
                      </div>

                      {/* Middle: Items & Photos */}
                      <div className="flex-1 flex items-center gap-4 border-l-0 md:border-l md:border-gray-100 md:pl-6 min-w-0">
                        <div className="flex -space-x-2.5 flex-shrink-0">
                          {order.items.map((item, index) => (
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
                          {order.moreItemsCount > 0 && (
                            <span className="text-[10px] text-[#e32929] font-bold block mt-0.5">
                              +{order.moreItemsCount} more
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
                              : 'bg-green-50 text-green-600 border border-green-100'
                          }`}
                        >
                          {order.status}
                        </span>

                        {/* Interactive dots context menu */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveOrderActionId(activeOrderActionId === order.id ? null : order.id)}
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
                                  onClick={() => handleUpdateStatus(order.id, 'New')}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-fuchsia-600 hover:bg-fuchsia-50 font-bold transition-all"
                                >
                                  <CircleDot className="w-3.5 h-3.5" />
                                  <span>Mark as New</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 font-bold transition-all"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Mark as Preparing</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 font-bold transition-all"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Mark as Delivered</span>
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
                    className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
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
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-50 text-[#e32929] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h6 className="font-bold text-gray-800 text-sm leading-tight">{order.customerName}</h6>
                          <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{order.phone}</p>
                        </div>
                      </div>

                      {/* Items lists */}
                      <div className="space-y-2 mb-5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-600">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-md object-cover border border-gray-100"
                            />
                            <span className="font-semibold line-clamp-1">{item.name}</span>
                          </div>
                        ))}
                        {order.moreItemsCount > 0 && (
                          <p className="text-[10px] text-[#e32929] font-bold pl-10">
                            +{order.moreItemsCount} more items in this order
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
                          onClick={() => setActiveOrderActionId(activeOrderActionId === order.id ? null : order.id)}
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
                                onClick={() => handleUpdateStatus(order.id, 'New')}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-fuchsia-600 hover:bg-fuchsia-50 font-bold transition-all"
                              >
                                <CircleDot className="w-3.5 h-3.5" />
                                <span>Mark as New</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 font-bold transition-all"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Mark as Preparing</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 font-bold transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Mark as Delivered</span>
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

          {/* ──── OTHER NAVIGATION TABS (PLACEHOLDER PAGES) ──── */}
          {activeTab !== 'dashboard' && activeTab !== 'live-orders' && activeTab !== 'completed-orders' && (
            <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm animate-fade-in-up space-y-4 max-w-lg mx-auto mt-10">
              <div className="w-16 h-16 bg-red-50 text-[#e32929] rounded-full flex items-center justify-center mx-auto">
                {activeTab === 'users' && <Users className="w-8 h-8" />}
                {activeTab === 'products' && <Package className="w-8 h-8" />}
                {activeTab === 'inventory' && <ScrollText className="w-8 h-8" />}
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
                onClick={() => setActiveTab('dashboard')}
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
