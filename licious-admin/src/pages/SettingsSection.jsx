import { useState } from 'react'
import {
  User,
  Store,
  Bell,
  ShoppingBag,
  ScrollText,
  Lock,
  History,
  Camera,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  X,
  ChevronRight,
  Smartphone,
  Laptop
} from 'lucide-react'

// Mock initial data
const initialProfile = {
  storeName: 'Licious Whitefield Hub',
  adminName: 'Admin User',
  email: 'admin@licious.com',
  phone: '+91 9876543210',
  address: 'Flat 402, Block A, Prestige Shantiniketan, Whitefield, Bengaluru, Karnataka 560048'
}

const initialShopInfo = {
  shopName: 'Licious Whitefield Hub',
  businessEmail: 'whitefield@licious.com',
  contactNumber: '+91 8088877766',
  gstNumber: '29AAAAA0000A1Z5',
  storeAddress: 'Flat 402, Block A, Prestige Shantiniketan, Whitefield, Bengaluru, Karnataka 560048',
  businessHours: '07:00 AM - 10:00 PM'
}

const initialUsers = [
  { id: 1, name: 'Rohan Verma', role: 'Super Admin', email: 'rohan@licious.com', status: 'Active' },
  { id: 2, name: 'Aisha Sen', role: 'Manager', email: 'aisha@licious.com', status: 'Active' },
  { id: 3, name: 'Kabir Singh', role: 'Cashier', email: 'kabir@licious.com', status: 'Inactive' }
]

const initialNotifications = {
  newOrders: true,
  completedOrders: false,
  inventoryAlerts: true,
  emailNotifications: true,
  smsNotifications: false
}

const initialOrderPrefs = {
  defaultStatus: 'New',
  autoAccept: 'Yes',
  refreshInterval: '1m'
}

const initialInventoryPrefs = {
  lowStockThreshold: 10,
  autoUpdate: true,
  enableAlerts: true
}

const initialSessions = [
  { id: 1, device: 'Chrome on Windows 11', location: 'Bengaluru, India', ip: '192.168.1.45', time: 'Active Now', current: true },
  { id: 2, device: 'Safari on iPhone 15', location: 'Mumbai, India', ip: '103.88.22.11', time: '2 hours ago', current: false }
]

const initialLogs = [
  { id: 1, action: 'Admin Login', dateTime: '28 July 2026, 11:30 AM', adminName: 'Admin User' },
  { id: 2, action: 'Order LICI123456 Status Updated to Preparing', dateTime: '28 July 2026, 10:45 AM', adminName: 'Aisha Sen' },
  { id: 3, action: 'Inventory "Rawas Fillet" Stock Adjusted', dateTime: '28 July 2026, 09:15 AM', adminName: 'Rohan Verma' },
  { id: 4, action: 'User "Kabir Singh" Added', dateTime: '27 July 2026, 04:30 PM', adminName: 'Admin User' },
  { id: 5, action: 'Store Contact Number Updated', dateTime: '27 July 2026, 12:00 PM', adminName: 'Admin User' }
]

export default function SettingsSection() {
  // Active Settings Navigation Section Tab
  const [activeSubTab, setActiveSubTab] = useState('profile')

  // Notification / Toast Stack State
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  // --- STATE FOR ALL SECTIONS ---
  const [profile, setProfile] = useState(initialProfile)
  const [shopInfo, setShopInfo] = useState(initialShopInfo)
  const [users, setUsers] = useState(initialUsers)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [orderPrefs, setOrderPrefs] = useState(initialOrderPrefs)
  const [inventoryPrefs, setInventoryPrefs] = useState(initialInventoryPrefs)
  const [sessions, setSessions] = useState(initialSessions)
  const [logs, setLogs] = useState(initialLogs)

  // Security Tfa state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  // Password fields state
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false
  })

  // User Modals states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  const [userForm, setUserForm] = useState({
    name: '',
    role: 'Manager',
    email: '',
    status: 'Active'
  })

  const logActivity = (actionText) => {
    const now = new Date()
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    const dateTimeStr = now.toLocaleDateString('en-GB', options).replace(' at ', ', ')
    const newLog = {
      id: Date.now(),
      action: actionText,
      dateTime: dateTimeStr,
      adminName: profile.adminName || 'Admin User'
    }
    setLogs(prev => [newLog, ...prev])
  }

  // --- ACTIONS & SUBMITS ---
  
  // Profile Section Submit
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    if (!profile.storeName.trim() || !profile.adminName.trim() || !profile.email.trim() || !profile.phone.trim() || !profile.address.trim()) {
      addToast('All profile fields are required.', 'error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profile.email)) {
      addToast('Please enter a valid email address.', 'error')
      return
    }
    addToast('Profile changes saved successfully!')
    logActivity('Profile configuration updated')
  }

  // Shop Information Submit
  const handleShopSubmit = (e) => {
    e.preventDefault()
    if (!shopInfo.shopName.trim() || !shopInfo.businessEmail.trim() || !shopInfo.contactNumber.trim() || !shopInfo.gstNumber.trim() || !shopInfo.storeAddress.trim() || !shopInfo.businessHours.trim()) {
      addToast('All shop details are required.', 'error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shopInfo.businessEmail)) {
      addToast('Please enter a valid business email address.', 'error')
      return
    }
    // GST validation - 15 chars alpha-numeric
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    if (!gstRegex.test(shopInfo.gstNumber.toUpperCase())) {
      addToast('Invalid GSTIN format. E.g. 29AAAAA0000A1Z5', 'error')
      return
    }

    addToast('Shop information updated successfully!')
    logActivity('Shop settings updated')
  }

  // CRUD: Add User
  const handleAddUser = (e) => {
    e.preventDefault()
    if (!userForm.name.trim() || !userForm.email.trim()) {
      addToast('Name and Email are required.', 'error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userForm.email)) {
      addToast('Please enter a valid email address.', 'error')
      return
    }
    // check duplicate email
    if (users.some(u => u.email.toLowerCase() === userForm.email.toLowerCase())) {
      addToast('A user with this email already exists.', 'error')
      return
    }

    const newUser = {
      id: Date.now(),
      name: userForm.name,
      role: userForm.role,
      email: userForm.email,
      status: userForm.status
    }
    setUsers(prev => [...prev, newUser])
    setIsAddUserOpen(false)
    setUserForm({ name: '', role: 'Manager', email: '', status: 'Active' })
    addToast(`User ${newUser.name} added successfully.`)
    logActivity(`Added new user: ${newUser.name} (${newUser.role})`)
  }

  // CRUD: Open Edit User Modal
  const openEditModal = (usr) => {
    setSelectedUser(usr)
    setUserForm({
      name: usr.name,
      role: usr.role,
      email: usr.email,
      status: usr.status
    })
    setIsEditUserOpen(true)
  }

  // CRUD: Save Edit User
  const handleEditUser = (e) => {
    e.preventDefault()
    if (!userForm.name.trim() || !userForm.email.trim()) {
      addToast('Name and Email are required.', 'error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userForm.email)) {
      addToast('Please enter a valid email address.', 'error')
      return
    }
    // check duplicate email (excluding currently editing user)
    if (users.some(u => u.id !== selectedUser.id && u.email.toLowerCase() === userForm.email.toLowerCase())) {
      addToast('A user with this email already exists.', 'error')
      return
    }

    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...userForm } : u))
    setIsEditUserOpen(false)
    setSelectedUser(null)
    setUserForm({ name: '', role: 'Manager', email: '', status: 'Active' })
    addToast('User details updated successfully.')
    logActivity(`Updated user account: ${userForm.name}`)
  }

  // CRUD: Remove User
  const handleRemoveUser = (userId) => {
    const targetUser = users.find(u => u.id === userId)
    if (!targetUser) return
    if (window.confirm(`Are you sure you want to remove user "${targetUser.name}"?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId))
      addToast(`User ${targetUser.name} has been removed.`)
      logActivity(`Removed user: ${targetUser.name}`)
    }
  }

  // Save Notification Preferences
  const handleNotificationsSave = () => {
    addToast('Notification preferences updated successfully!')
    logActivity('Notification alerts updated')
  }

  // Save Order Preferences
  const handleOrderPrefsSave = () => {
    addToast('Order processing preferences saved.')
    logActivity(`Order preferences updated (Auto Refresh: ${orderPrefs.refreshInterval})`)
  }

  // Save Inventory Preferences
  const handleInventoryPrefsSave = () => {
    if (inventoryPrefs.lowStockThreshold === '' || isNaN(inventoryPrefs.lowStockThreshold) || parseInt(inventoryPrefs.lowStockThreshold) < 0) {
      addToast('Please enter a valid low stock threshold.', 'error')
      return
    }
    addToast('Inventory management preferences saved.')
    logActivity(`Inventory preferences saved (Threshold: ${inventoryPrefs.lowStockThreshold})`)
  }

  // Update Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      addToast('All password fields are required.', 'error')
      return
    }
    if (passwords.newPass.length < 6) {
      addToast('New password must be at least 6 characters long.', 'error')
      return
    }
    if (passwords.newPass !== passwords.confirm) {
      addToast('New password and Confirm password do not match.', 'error')
      return
    }
    // Mock current password check
    if (passwords.current !== '123456' && passwords.current !== 'password') {
      // Allow it but trigger success. Let's make it accept whatever, or add a warning if it's very wrong, or mock accept.
    }
    addToast('Password updated successfully!')
    setPasswords({ current: '', newPass: '', confirm: '' })
    logActivity('Admin credentials modified')
  }

  // Toggle Two-Factor Authentication
  const handleTfaToggle = () => {
    const nextState = !twoFactorEnabled
    setTwoFactorEnabled(nextState)
    addToast(nextState ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.', 'warning')
    logActivity(nextState ? '2FA Security Enabled' : '2FA Security Disabled')
  }

  // Logout All Devices
  const handleLogoutAllDevices = () => {
    if (window.confirm('Are you sure you want to log out all other active sessions?')) {
      setSessions(prev => prev.filter(s => s.current))
      addToast('Successfully logged out of all other devices.')
      logActivity('Terminated other login sessions')
    }
  }

  // Left side settings navigation links
  const subTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'shop-info', label: 'Shop Information', icon: Store },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'order-prefs', label: 'Order Preferences', icon: ShoppingBag },
    { id: 'inventory-prefs', label: 'Inventory Preferences', icon: ScrollText },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'logs', label: 'Activity Logs', icon: History }
  ]

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="border-b border-gray-100 pb-4.5">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h2>
        <p className="text-xs text-gray-400 mt-1 font-semibold">
          Manage your account and preferences.
        </p>
      </div>

      {/* MAIN TWO-COLUMN SPLIT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT SETTINGS SUB-NAVIGATION */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden p-2 space-y-1">
            {subTabs.map(tab => {
              const IconComp = tab.icon
              const isActive = activeSubTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-semibold text-left cursor-pointer ${
                    isActive
                      ? 'bg-red-50 text-[#e32929] border-l-4 border-[#e32929] rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <IconComp className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#e32929]' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 lg:opacity-40 group-hover:opacity-100" />
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT SETTINGS PANEL VIEW */}
        <div className="lg:col-span-3 space-y-6">

          {/* VIEW: PROFILE PANEL */}
          {activeSubTab === 'profile' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Profile Information</h3>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                
                {/* Store/Admin Logo Circle Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-gray-50">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-[#f3f7fb] border border-gray-200 flex items-center justify-center shadow-inner overflow-hidden">
                      <span className="text-[#e32929] font-black text-2xl tracking-tighter uppercase">Licious</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="text-xs font-bold text-gray-800">Store / Admin Logo</h4>
                    <p className="text-[10px] text-gray-400 font-medium">PNG or JPG. Max size 1MB.</p>
                    <button
                      type="button"
                      onClick={() => addToast('Logo upload dialog triggered (Mocked).')}
                      className="mt-2 inline-block px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-[10px] font-bold text-gray-600 transition-all"
                    >
                      Change Logo
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 text-xs font-semibold text-gray-600">
                  <div>
                    <label className="block mb-1.5">Store Name</label>
                    <input
                      type="text"
                      value={profile.storeName}
                      onChange={e => setProfile(prev => ({ ...prev, storeName: e.target.value }))}
                      placeholder="e.g. Licious Whitefield"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Admin Name</label>
                    <input
                      type="text"
                      value={profile.adminName}
                      onChange={e => setProfile(prev => ({ ...prev, adminName: e.target.value }))}
                      placeholder="e.g. Rohit Kumar"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. admin@licious.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. +91 9876543210"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1.5">Store Address</label>
                    <textarea
                      value={profile.address}
                      onChange={e => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full physical address..."
                      rows="3"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                  <button
                    type="submit"
                    className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: SHOP INFORMATION PANEL */}
          {activeSubTab === 'shop-info' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Shop Information</h3>

              <form onSubmit={handleShopSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 text-xs font-semibold text-gray-600">
                  <div>
                    <label className="block mb-1.5">Shop Name</label>
                    <input
                      type="text"
                      value={shopInfo.shopName}
                      onChange={e => setShopInfo(prev => ({ ...prev, shopName: e.target.value }))}
                      placeholder="e.g. Licious Whitefield Hub"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Business Email</label>
                    <input
                      type="email"
                      value={shopInfo.businessEmail}
                      onChange={e => setShopInfo(prev => ({ ...prev, businessEmail: e.target.value }))}
                      placeholder="e.g. business@licious.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Contact Number</label>
                    <input
                      type="text"
                      value={shopInfo.contactNumber}
                      onChange={e => setShopInfo(prev => ({ ...prev, contactNumber: e.target.value }))}
                      placeholder="e.g. +91 8088877766"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">GST Number</label>
                    <input
                      type="text"
                      value={shopInfo.gstNumber}
                      onChange={e => setShopInfo(prev => ({ ...prev, gstNumber: e.target.value.toUpperCase() }))}
                      placeholder="e.g. 29AAAAA0000A1Z5"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none uppercase transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Business Hours</label>
                    <input
                      type="text"
                      value={shopInfo.businessHours}
                      onChange={e => setShopInfo(prev => ({ ...prev, businessHours: e.target.value }))}
                      placeholder="e.g. 07:00 AM - 10:00 PM"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1.5">Store Address</label>
                    <textarea
                      value={shopInfo.storeAddress}
                      onChange={e => setShopInfo(prev => ({ ...prev, storeAddress: e.target.value }))}
                      placeholder="Enter physical business address..."
                      rows="3"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                  <button
                    type="submit"
                    className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: USERS & PERMISSIONS PANEL */}
          {activeSubTab === 'users' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="text-sm font-bold text-gray-900">Users & Permissions</h3>
                <button
                  onClick={() => {
                    setUserForm({ name: '', role: 'Manager', email: '', status: 'Active' })
                    setIsAddUserOpen(true)
                  }}
                  className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      <th className="py-3 px-4">User Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                    {users.map(usr => (
                      <tr key={usr.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 text-gray-800 font-bold">{usr.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{usr.role}</td>
                        <td className="py-3.5 px-4 text-gray-500 font-normal">{usr.email}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${
                            usr.status === 'Active'
                              ? 'bg-green-50 text-green-600 border border-green-100'
                              : 'bg-gray-50 text-gray-400 border border-gray-150'
                          }`}>
                            {usr.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(usr)}
                              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                              title="Edit User"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveUser(usr.id)}
                              className="p-1 text-gray-400 hover:text-[#e32929] hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Remove User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-400">
                          No users configured. Click 'Add User' to register.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: NOTIFICATION PREFERENCES PANEL */}
          {activeSubTab === 'notifications' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Notification Preferences</h3>

              <div className="space-y-5">
                
                {/* New Orders Toggle */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-800">New Orders</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Notify immediately upon receiving a new customer order.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, newOrders: !prev.newOrders }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                      notifications.newOrders ? 'bg-[#e32929]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.newOrders ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Completed Orders Toggle */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-800">Completed Orders</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Trigger notification when dispatch completes and order arrives.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, completedOrders: !prev.completedOrders }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                      notifications.completedOrders ? 'bg-[#e32929]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.completedOrders ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Inventory Alerts Toggle */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-800">Inventory Alerts</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Alert when stock falls below threshold or depletes.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, inventoryAlerts: !prev.inventoryAlerts }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                      notifications.inventoryAlerts ? 'bg-[#e32929]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.inventoryAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-800">Email Notifications</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Send summary audits and warnings directly to shop email.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                      notifications.emailNotifications ? 'bg-[#e32929]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* SMS Notifications Toggle */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-800">SMS Notifications</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Receive urgent operations updates on contact number.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                      notifications.smsNotifications ? 'bg-[#e32929]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={handleNotificationsSave}
                  className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* VIEW: ORDER PREFERENCES PANEL */}
          {activeSubTab === 'order-prefs' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Order Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1.5">Default Order Status</label>
                  <select
                    value={orderPrefs.defaultStatus}
                    onChange={e => setOrderPrefs(prev => ({ ...prev, defaultStatus: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option>New</option>
                    <option>Preparing</option>
                    <option>Ready</option>
                    <option>Delivered</option>
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Starting step for newly fetched store transactions.</p>
                </div>

                <div>
                  <label className="block mb-1.5">Auto Accept Orders</label>
                  <select
                    value={orderPrefs.autoAccept}
                    onChange={e => setOrderPrefs(prev => ({ ...prev, autoAccept: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Automatically confirm orders to skip manual approval.</p>
                </div>

                <div>
                  <label className="block mb-1.5">Auto Refresh Interval</label>
                  <select
                    value={orderPrefs.refreshInterval}
                    onChange={e => setOrderPrefs(prev => ({ ...prev, refreshInterval: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option value="30s">30 Seconds</option>
                    <option value="1m">1 Minute</option>
                    <option value="2m">2 Minutes</option>
                    <option value="5m">5 Minutes</option>
                    <option value="Off">Disable Auto-Refresh</option>
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Frequency of sync with Licious customer checkout servers.</p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={handleOrderPrefsSave}
                  className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* VIEW: INVENTORY PREFERENCES PANEL */}
          {activeSubTab === 'inventory-prefs' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Inventory Preferences</h3>

              <div className="space-y-6">
                
                {/* Low Stock Threshold Field */}
                <div className="max-w-xs text-xs font-semibold text-gray-600">
                  <label className="block mb-1.5">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={inventoryPrefs.lowStockThreshold}
                    onChange={e => setInventoryPrefs(prev => ({ ...prev, lowStockThreshold: e.target.value === '' ? '' : parseInt(e.target.value) }))}
                    placeholder="e.g. 10"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                  />
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Triggers low status warning if product count dips below this value.</p>
                </div>

                <div className="space-y-5 border-t border-gray-50 pt-5">
                  
                  {/* Auto Update Toggle */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-800">Auto Update Inventory</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Instantly deduct item count upon successful checkout transactions.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInventoryPrefs(prev => ({ ...prev, autoUpdate: !prev.autoUpdate }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                        inventoryPrefs.autoUpdate ? 'bg-[#e32929]' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        inventoryPrefs.autoUpdate ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Enable Inventory Alerts Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-800">Enable Inventory Alerts</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Display yellow and red notification badges in the dashboard inventory grid.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInventoryPrefs(prev => ({ ...prev, enableAlerts: !prev.enableAlerts }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                        inventoryPrefs.enableAlerts ? 'bg-[#e32929]' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        inventoryPrefs.enableAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                </div>

              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={handleInventoryPrefsSave}
                  className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* VIEW: SECURITY PANEL */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              
              {/* Change Password Card */}
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Change Password</h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 text-xs font-semibold text-gray-600">
                    
                    {/* Current Password Field */}
                    <div className="relative">
                      <label className="block mb-1.5">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          placeholder="Enter current password"
                          className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none cursor-pointer"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password Field */}
                    <div className="relative">
                      <label className="block mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.newPass ? 'text' : 'password'}
                          value={passwords.newPass}
                          onChange={e => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
                          placeholder="Min 6 characters"
                          className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, newPass: !prev.newPass }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none cursor-pointer"
                        >
                          {showPasswords.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password Field */}
                    <div className="relative">
                      <label className="block mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwords.confirm}
                          onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                          placeholder="Re-enter new password"
                          className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none cursor-pointer"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-gray-50">
                    <button
                      type="submit"
                      className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication Card */}
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Add an extra layer of security to your admin account via SMS/Auth apps.</p>
                </div>
                <button
                  type="button"
                  onClick={handleTfaToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                    twoFactorEnabled ? 'bg-[#e32929]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Login Session Information Card */}
              <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Login Session Information</h3>
                  {sessions.length > 1 && (
                    <button
                      onClick={handleLogoutAllDevices}
                      className="text-[#e32929] border border-red-100 hover:bg-red-50 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Logout All Devices
                    </button>
                  )}
                </div>

                <div className="space-y-3.5">
                  {sessions.map(sess => (
                    <div key={sess.id} className="flex items-start gap-3.5 py-1">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                        {sess.device.includes('iPhone') || sess.device.includes('Mobile') ? (
                          <Smartphone className="w-5 h-5" />
                        ) : (
                          <Laptop className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-800 truncate">{sess.device}</p>
                          {sess.current && (
                            <span className="bg-green-50 border border-green-100 text-green-600 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                              This Device
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {sess.location} • IP: {sess.ip} • <span className="font-bold">{sess.time}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW: ACTIVITY LOGS PANEL */}
          {activeSubTab === 'logs' && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="text-sm font-bold text-gray-900">Activity Logs</h3>
                <span className="text-[10px] font-extrabold text-[#e32929] bg-red-50 px-2.5 py-0.5 rounded-full">
                  Live Audit Trail
                </span>
              </div>

              {/* Logs Timeline List */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1.5 custom-scrollbar">
                {logs.map((lg, index) => (
                  <div key={lg.id || index} className="border-l-2 border-red-100 pl-3 py-1 space-y-1.5 hover:border-[#e32929] transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                        {lg.action}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">{lg.dateTime}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Performed by: <span className="text-gray-500 font-bold">{lg.adminName}</span>
                    </p>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-6">No recent actions logged.</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* --- ADD USER MODAL --- */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in animate-duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
              <h4 className="text-sm font-bold text-gray-900">Add New User</h4>
              <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600 outline-none cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4 text-xs font-semibold text-gray-600">
              <div>
                <label className="block mb-1.5">User Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kabir Singh"
                  value={userForm.name}
                  onChange={e => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kabir@licious.com"
                  value={userForm.email}
                  onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Role Permission</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option>Super Admin</option>
                    <option>Manager</option>
                    <option>Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Status</label>
                  <select
                    value={userForm.status}
                    onChange={e => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#e32929] hover:bg-[#c41f1f] text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT USER MODAL --- */}
      {isEditUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in animate-duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-100 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
              <h4 className="text-sm font-bold text-gray-900">Edit User Account</h4>
              <button onClick={() => { setIsEditUserOpen(false); setSelectedUser(null); }} className="text-gray-400 hover:text-gray-600 outline-none cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="space-y-4 text-xs font-semibold text-gray-600">
              <div>
                <label className="block mb-1.5">User Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kabir Singh"
                  value={userForm.name}
                  onChange={e => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kabir@licious.com"
                  value={userForm.email}
                  onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Role Permission</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option>Super Admin</option>
                    <option>Manager</option>
                    <option>Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Status</label>
                  <select
                    value={userForm.status}
                    onChange={e => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#e32929] focus:ring-1 focus:ring-[#e32929]/20 outline-none cursor-pointer"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => { setIsEditUserOpen(false); setSelectedUser(null); }}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#e32929] hover:bg-[#c41f1f] text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATION CORNER PANEL STACK --- */}
      <div className="fixed top-6 right-6 z-55 space-y-3.5 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4.5 py-3.5 rounded-2xl shadow-xl border text-xs font-semibold transition-all duration-300 pointer-events-auto transform translate-y-0 opacity-100 ${
              t.type === 'success'
                ? 'bg-white border-green-100 text-gray-800 fill-green-500 shadow-green-500/5'
                : t.type === 'warning'
                ? 'bg-white border-amber-100 text-gray-800 fill-amber-500 shadow-amber-500/5'
                : 'bg-white border-red-100 text-[#e32929] fill-[#e32929] shadow-red-500/5'
            }`}
          >
            {t.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            ) : t.type === 'warning' ? (
              <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[#e32929] flex-shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            )}
            <p className="flex-1">{t.message}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
