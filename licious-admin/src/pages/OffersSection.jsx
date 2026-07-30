import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Tag,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Percent,
  Edit2,
  Trash2,
  Copy,
  Eye,
  MoreVertical,
  X,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

// Available mock categories and products
const AVAILABLE_CATEGORIES = ['Chicken', 'Kebabs', 'Fish & Seafood', 'Ready to Cook', 'Mutton', 'Eggs']

const AVAILABLE_PRODUCTS = [
  { id: 'prod-1', name: 'Chicken Curry Cut (1 kg)', category: 'Chicken' },
  { id: 'prod-2', name: 'Chicken Seekh Kebab (250 g)', category: 'Kebabs' },
  { id: 'prod-3', name: 'Rawas Fillet (500 g)', category: 'Fish & Seafood' },
  { id: 'prod-4', name: 'Prawns Medium (500 g)', category: 'Fish & Seafood' },
  { id: 'prod-5', name: 'Chicken Tikka (500 g)', category: 'Chicken' },
  { id: 'prod-6', name: 'Chicken Biryani (1 kg)', category: 'Ready to Cook' },
  { id: 'prod-7', name: 'Mutton Curry Cut (1 kg)', category: 'Mutton' },
  { id: 'prod-8', name: 'Eggs (pack of 6)', category: 'Eggs' }
]

const INITIAL_OFFERS = [
  {
    id: 'off-1',
    title: '20% OFF on Chicken Products',
    code: 'CHICKEN20',
    type: 'Percentage',
    discountType: 'Percentage',
    discountValue: 20,
    maxDiscount: 200,
    minOrderValue: 0,
    startDate: '2026-07-25',
    endDate: '2026-08-15',
    usageLimit: 500,
    usageCount: 248,
    applicableCategories: ['Chicken'],
    applicableProducts: [],
    applyToAllProducts: false,
    disabled: false,
    revenueGenerated: 34500,
    customersBenefited: 180,
    createdAt: '2026-07-25T10:00:00.000Z'
  },
  {
    id: 'off-2',
    title: '₹150 OFF on Orders above ₹999',
    code: 'SAVE150',
    type: 'Flat',
    discountType: 'Flat',
    discountValue: 150,
    maxDiscount: 150,
    minOrderValue: 999,
    startDate: '2026-07-20',
    endDate: '2026-08-10',
    usageLimit: 300,
    usageCount: 180,
    applicableCategories: [],
    applicableProducts: [],
    applyToAllProducts: true,
    disabled: false,
    revenueGenerated: 54000,
    customersBenefited: 150,
    createdAt: '2026-07-20T11:00:00.000Z'
  },
  {
    id: 'off-3',
    title: '10% OFF on Seafood',
    code: 'SEAFOOD10',
    type: 'Percentage',
    discountType: 'Percentage',
    discountValue: 10,
    maxDiscount: 150,
    minOrderValue: 0,
    startDate: '2026-07-18',
    endDate: '2026-08-05',
    usageLimit: 200,
    usageCount: 96,
    applicableCategories: ['Fish & Seafood'],
    applicableProducts: [],
    applyToAllProducts: false,
    disabled: false,
    revenueGenerated: 16200,
    customersBenefited: 84,
    createdAt: '2026-07-18T09:00:00.000Z'
  },
  {
    id: 'off-4',
    title: '₹200 OFF on First Order',
    code: 'WELCOME200',
    type: 'Flat',
    discountType: 'Flat',
    discountValue: 200,
    maxDiscount: 200,
    minOrderValue: 799,
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    usageLimit: 500,
    usageCount: 120,
    applicableCategories: [],
    applicableProducts: [],
    applyToAllProducts: true,
    disabled: false,
    revenueGenerated: 0,
    customersBenefited: 0,
    createdAt: '2026-07-29T14:00:00.000Z'
  },
  {
    id: 'off-5',
    title: 'Free Delivery on all orders',
    code: 'FREEDEL',
    type: 'Delivery',
    discountType: 'Free Delivery',
    discountValue: 0,
    maxDiscount: 0,
    minOrderValue: 0,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    usageLimit: 1000,
    usageCount: 0,
    applicableCategories: [],
    applicableProducts: [],
    applyToAllProducts: true,
    disabled: false,
    revenueGenerated: 0,
    customersBenefited: 0,
    createdAt: '2026-07-28T08:00:00.000Z'
  },
  {
    id: 'off-6',
    title: '15% OFF on Ready to Cook',
    code: 'RTC15',
    type: 'Percentage',
    discountType: 'Percentage',
    discountValue: 15,
    maxDiscount: 250,
    minOrderValue: 0,
    startDate: '2026-07-10',
    endDate: '2026-07-25',
    usageLimit: 320,
    usageCount: 200,
    applicableCategories: ['Ready to Cook'],
    applicableProducts: [],
    applyToAllProducts: false,
    disabled: false,
    revenueGenerated: 19800,
    customersBenefited: 228,
    createdAt: '2026-07-10T12:00:00.000Z'
  }
]

export default function OffersSection() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const formRef = useRef(null)

  // Offers Data state with localStorage persistence
  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('licious_offers')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved offers:', e)
      }
    }
    return INITIAL_OFFERS
  })

  useEffect(() => {
    localStorage.setItem('licious_offers', JSON.stringify(offers))
  }, [offers])

  // UI States
  const [activeTab, setActiveTab] = useState('all') // all, active, scheduled, expired
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, discount-high, discount-low, usage-high
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState('all') // all, Percentage, Flat, Delivery
  const [openDropdownId, setOpenDropdownId] = useState(null)
  
  // Dialog / Toast states
  const [toasts, setToasts] = useState([])
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [editOfferId, setEditOfferId] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    type: 'Percentage',
    discountValue: '',
    maxDiscount: '',
    minOrderValue: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    applyToAllProducts: true,
    applicableCategories: [],
    applicableProducts: []
  })

  // Check URL query parameters for editing an offer (e.g. ?edit=off-1)
  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      const offerToEdit = offers.find(o => o.id === editId)
      if (offerToEdit) {
        setEditOfferId(editId)
        setIsEditing(true)
        setFormData({
          title: offerToEdit.title,
          code: offerToEdit.code || '',
          type: offerToEdit.type,
          discountValue: offerToEdit.discountValue || '',
          maxDiscount: offerToEdit.maxDiscount || '',
          minOrderValue: offerToEdit.minOrderValue || '',
          startDate: offerToEdit.startDate || '',
          endDate: offerToEdit.endDate || '',
          usageLimit: offerToEdit.usageLimit || '',
          applyToAllProducts: offerToEdit.applyToAllProducts,
          applicableCategories: offerToEdit.applicableCategories || [],
          applicableProducts: offerToEdit.applicableProducts || []
        })
        
        // Clear param so it doesn't trigger on reload
        setSearchParams({})
        
        // Scroll to form
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        showToast('Loaded offer details for editing', 'info')
      }
    }
  }, [searchParams, offers, setSearchParams])

  // Helper to show toasts
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  // Calculate status of an offer based on dates and usage
  const getStatus = (offer) => {
    if (offer.disabled) return 'Expired'
    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)
    
    now.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return 'Expired'
    }
    if (now < start) {
      return 'Scheduled'
    }
    if (now > end) {
      return 'Expired'
    }
    return 'Active'
  }

  // Statistics calculation for dynamic Summary Cards
  const stats = useMemo(() => {
    const total = offers.length
    let active = 0
    let scheduled = 0
    let expired = 0
    let revenue = 0

    offers.forEach(o => {
      const status = getStatus(o)
      if (status === 'Active') active++
      else if (status === 'Scheduled') scheduled++
      else if (status === 'Expired') expired++
      
      revenue += (o.revenueGenerated || 0)
    })

    return { total, active, scheduled, expired, revenue }
  }, [offers])

  // Donut chart segments based on redemption usage count
  const donutData = useMemo(() => {
    let activeUsage = 0
    let scheduledUsage = 0
    let expiredUsage = 0

    offers.forEach(o => {
      const status = getStatus(o)
      const usage = o.usageCount || 0
      if (status === 'Active') activeUsage += usage
      else if (status === 'Scheduled') scheduledUsage += usage
      else if (status === 'Expired') expiredUsage += usage
    })

    const totalUsage = activeUsage + scheduledUsage + expiredUsage
    return { activeUsage, scheduledUsage, expiredUsage, totalUsage }
  }, [offers])

  // Filter & Sort offers list
  const filteredAndSortedOffers = useMemo(() => {
    let list = [...offers]

    // 1. Search Query filter (matches Title or Code)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      list = list.filter(o => 
        o.title.toLowerCase().includes(query) || 
        (o.code && o.code.toLowerCase().includes(query))
      )
    }

    // 2. Tab filter
    if (activeTab === 'active') {
      list = list.filter(o => getStatus(o) === 'Active')
    } else if (activeTab === 'scheduled') {
      list = list.filter(o => getStatus(o) === 'Scheduled')
    } else if (activeTab === 'expired') {
      list = list.filter(o => getStatus(o) === 'Expired')
    }

    // 3. Dropdown Type Filter
    if (filterType !== 'all') {
      list = list.filter(o => o.type === filterType)
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      }
      if (sortBy === 'discount-high') {
        return (b.discountValue || 0) - (a.discountValue || 0)
      }
      if (sortBy === 'discount-low') {
        return (a.discountValue || 0) - (b.discountValue || 0)
      }
      if (sortBy === 'usage-high') {
        return (b.usageCount || 0) - (a.usageCount || 0)
      }
      return 0
    })

    return list
  }, [offers, searchQuery, activeTab, filterType, sortBy])

  // Format Price in INR
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Format dates for display (e.g. 25 Jul 2025)
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear validation error when editing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Toggle Category selection
  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const current = prev.applicableCategories
      const updated = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category]
      
      // Auto deselect products that don't belong to selected categories anymore
      let updatedProducts = prev.applicableProducts
      if (updated.length > 0) {
        updatedProducts = updatedProducts.filter(prodId => {
          const prod = AVAILABLE_PRODUCTS.find(p => p.id === prodId)
          return prod && updated.includes(prod.category)
        })
      }

      return {
        ...prev,
        applicableCategories: updated,
        applicableProducts: updatedProducts
      }
    })

    if (formErrors.applicableCategories) {
      setFormErrors(prev => ({ ...prev, applicableCategories: null }))
    }
  }

  // Toggle Product selection
  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const current = prev.applicableProducts
      const updated = current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId]
      return {
        ...prev,
        applicableProducts: updated
      }
    })
  }

  // Form Validation
  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Offer title is required'
    else if (formData.title.length < 3) errors.title = 'Title must be at least 3 characters'

    if (formData.code.trim()) {
      if (!/^[A-Z0-9]+$/.test(formData.code)) {
        errors.code = 'Coupon code must be uppercase alphanumeric only'
      }
    }

    if (formData.type !== 'Delivery') {
      const val = parseFloat(formData.discountValue)
      if (isNaN(val) || val <= 0) {
        errors.discountValue = 'Please enter a valid positive discount'
      } else if (formData.type === 'Percentage' && val > 100) {
        errors.discountValue = 'Percentage discount cannot exceed 100%'
      }
    }

    if (formData.minOrderValue !== '') {
      const val = parseFloat(formData.minOrderValue)
      if (isNaN(val) || val < 0) {
        errors.minOrderValue = 'Minimum order value must be a positive number'
      }
    }

    if (!formData.startDate) errors.startDate = 'Start date is required'
    if (!formData.endDate) errors.endDate = 'End date is required'

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end < start) {
        errors.endDate = 'End date cannot be before start date'
      }
    }

    if (formData.usageLimit !== '') {
      const val = parseInt(formData.usageLimit, 10)
      if (isNaN(val) || val <= 0) {
        errors.usageLimit = 'Usage limit must be a positive integer'
      }
    }

    if (!formData.applyToAllProducts && formData.applicableCategories.length === 0 && formData.applicableProducts.length === 0) {
      errors.applicableCategories = 'Please select at least one category, specific products, or apply to all'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Form Submission (Create or Edit)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      showToast('Please correct validation errors in the form', 'error')
      return
    }

    const discountVal = formData.type === 'Delivery' ? 0 : parseFloat(formData.discountValue)
    const minOrderVal = formData.minOrderValue === '' ? 0 : parseFloat(formData.minOrderValue)
    const maxDiscountVal = formData.type === 'Percentage' 
      ? (formData.maxDiscount === '' ? discountVal * 10 : parseFloat(formData.maxDiscount)) 
      : discountVal
    
    if (isEditing) {
      // Edit offer
      setOffers(prev => prev.map(o => {
        if (o.id === editOfferId) {
          return {
            ...o,
            title: formData.title.trim(),
            code: formData.code.trim().toUpperCase() || null,
            type: formData.type,
            discountType: formData.type,
            discountValue: discountVal,
            maxDiscount: maxDiscountVal,
            minOrderValue: minOrderVal,
            startDate: formData.startDate,
            endDate: formData.endDate,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
            applyToAllProducts: formData.applyToAllProducts,
            applicableCategories: formData.applyToAllProducts ? [] : formData.applicableCategories,
            applicableProducts: formData.applyToAllProducts ? [] : formData.applicableProducts
          }
        }
        return o
      }))
      showToast(`Offer "${formData.title}" updated successfully`, 'success')
      resetForm()
    } else {
      // Create offer
      const newOffer = {
        id: `off-${Date.now()}`,
        title: formData.title.trim(),
        code: formData.code.trim().toUpperCase() || `LICI-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        type: formData.type,
        discountType: formData.type,
        discountValue: discountVal,
        maxDiscount: maxDiscountVal,
        minOrderValue: minOrderVal,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        usageCount: 0,
        applicableCategories: formData.applyToAllProducts ? [] : formData.applicableCategories,
        applicableProducts: formData.applyToAllProducts ? [] : formData.applicableProducts,
        applyToAllProducts: formData.applyToAllProducts,
        disabled: false,
        revenueGenerated: 0,
        customersBenefited: 0,
        createdAt: new Date().toISOString()
      }

      setOffers(prev => [newOffer, ...prev])
      showToast(`Offer "${newOffer.title}" created successfully!`, 'success')
      resetForm()
    }
  }

  // Reset form back to initial state
  const resetForm = () => {
    setIsEditing(false)
    setEditOfferId(null)
    setFormData({
      title: '',
      code: '',
      type: 'Percentage',
      discountValue: '',
      maxDiscount: '',
      minOrderValue: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      applyToAllProducts: true,
      applicableCategories: [],
      applicableProducts: []
    })
    setFormErrors({})
  }

  // Action: Edit Click
  const handleEditClick = (offer) => {
    setEditOfferId(offer.id)
    setIsEditing(true)
    setFormData({
      title: offer.title,
      code: offer.code || '',
      type: offer.type,
      discountValue: offer.discountValue || '',
      maxDiscount: offer.maxDiscount || '',
      minOrderValue: offer.minOrderValue || '',
      startDate: offer.startDate || '',
      endDate: offer.endDate || '',
      usageLimit: offer.usageLimit || '',
      applyToAllProducts: offer.applyToAllProducts,
      applicableCategories: offer.applicableCategories || [],
      applicableProducts: offer.applicableProducts || []
    })
    setOpenDropdownId(null)
    
    // Smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    
    showToast('Editing offer details', 'info')
  }

  // Action: Duplicate Click
  const handleDuplicate = (offer) => {
    setIsEditing(false)
    setEditOfferId(null)
    setFormData({
      title: `Copy of ${offer.title}`,
      code: offer.code ? `${offer.code}COPY` : '',
      type: offer.type,
      discountValue: offer.discountValue || '',
      maxDiscount: offer.maxDiscount || '',
      minOrderValue: offer.minOrderValue || '',
      startDate: offer.startDate || '',
      endDate: offer.endDate || '',
      usageLimit: offer.usageLimit || '',
      applyToAllProducts: offer.applyToAllProducts,
      applicableCategories: offer.applicableCategories || [],
      applicableProducts: offer.applicableProducts || []
    })
    setOpenDropdownId(null)
    
    // Smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    
    showToast('Duplicated settings. Modify and save.', 'info')
  }

  // Action: Delete Confirm
  const handleDeleteConfirm = () => {
    const offerToDelete = offers.find(o => o.id === deleteConfirmId)
    setOffers(prev => prev.filter(o => o.id !== deleteConfirmId))
    showToast(`Deleted offer: ${offerToDelete ? offerToDelete.title : ''}`, 'success')
    setDeleteConfirmId(null)
    
    // Reset form if we were editing the deleted offer
    if (editOfferId === deleteConfirmId) {
      resetForm()
    }
  }

  // Filter products based on selected categories
  const filteredProducts = useMemo(() => {
    if (formData.applicableCategories.length === 0) return AVAILABLE_PRODUCTS
    return AVAILABLE_PRODUCTS.filter(p => formData.applicableCategories.includes(p.category))
  }, [formData.applicableCategories])

  // Donut SVG Mathematics
  const { activeUsage, scheduledUsage, expiredUsage, totalUsage } = donutData
  const activeShare = totalUsage > 0 ? activeUsage / totalUsage : 0
  const scheduledShare = totalUsage > 0 ? scheduledUsage / totalUsage : 0
  const expiredShare = totalUsage > 0 ? expiredUsage / totalUsage : 0

  const r = 36
  const circ = 2 * Math.PI * r
  const activeDash = activeShare * circ
  const scheduledDash = scheduledShare * circ
  const expiredDash = expiredShare * circ

  // Close drop down click outside helper
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdownId(null)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Toast Notification Layer */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-fade-in transition-all duration-305 max-w-sm pointer-events-auto ${
              t.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
              t.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-100' :
              'bg-blue-50 text-blue-800 border-blue-100'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            {t.type === 'info' && <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />}
            <span>{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="text-gray-400 hover:text-gray-600 ml-auto flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-150 animate-scale-up space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Are you sure you want to delete this offer? This action is permanent and cannot be undone. All usage history and statistics will be lost.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Delete Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4.5">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Offers
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-semibold">
            Manage and track all offers and promotions
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            formRef.current?.querySelector('input')?.focus()
            showToast('Fill the form below to create an offer', 'info')
          }}
          className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Row 2: Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Offers */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#e32929] flex-shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Offers</p>
            <h4 className="text-2xl font-black text-gray-800 mt-0.5">{stats.total}</h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">All time offers</p>
          </div>
        </div>

        {/* Active Offers */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Offers</p>
            <h4 className="text-2xl font-black text-gray-800 mt-0.5">{stats.active}</h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Currently running</p>
          </div>
        </div>

        {/* Scheduled Offers */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheduled</p>
            <h4 className="text-2xl font-black text-gray-800 mt-0.5">{stats.scheduled}</h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Upcoming offers</p>
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue Impact</p>
            <h4 className="text-2xl font-black text-gray-800 mt-0.5">{formatPrice(stats.revenue)}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">+12.5%</span>
              <span className="text-[10px] text-gray-400 font-semibold">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Tab Navigation + Toolbar Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Tab Items */}
        <div className="flex border-b border-gray-100 p-0.5 gap-2 self-start">
          {[
            { id: 'all', label: 'All Offers' },
            { id: 'active', label: 'Active Offers' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'expired', label: 'Expired Offers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#e32929] text-[#e32929] bg-red-50/30'
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting bar */}
        <div className="flex items-center gap-3 self-end lg:self-auto w-full lg:w-auto justify-end">
          {/* Custom Search bar */}
          <div className="relative flex-1 sm:w-60 lg:w-64 max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code or title..."
              className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-xs font-medium placeholder-gray-400 focus:outline-none focus:border-[#e32929] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3.5 py-2.5 bg-white border rounded-xl text-xs font-bold transition-all shadow-2xs ${
                filterType !== 'all' || showFilters
                  ? 'border-[#e32929] text-[#e32929] bg-red-50/10'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {filterType !== 'all' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#e32929] ml-0.5" />
              )}
            </button>

            {showFilters && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-xl shadow-lg p-3.5 z-20 space-y-2 animate-scale-up">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Offer Type</p>
                  {['all', 'Percentage', 'Flat', 'Delivery'].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type)
                        setShowFilters(false)
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        filterType === type
                          ? 'bg-red-50 text-[#e32929]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pr-9 pl-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 focus:outline-none shadow-2xs transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="discount-high">Discount: High to Low</option>
              <option value="discount-low">Discount: Low to High</option>
              <option value="usage-high">Usage: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 4: Offers Table Card */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-4.5 px-6">Offer Details</th>
                <th className="py-4.5 px-4">Type</th>
                <th className="py-4.5 px-4">Discount</th>
                <th className="py-4.5 px-4">Validity</th>
                <th className="py-4.5 px-4">Status</th>
                <th className="py-4.5 px-4">Performance</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
              {filteredAndSortedOffers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-medium space-y-2">
                    <Tag className="w-10 h-10 mx-auto opacity-30 text-[#e32929]" />
                    <p className="text-sm font-bold text-gray-600">No Offers Found</p>
                    <p className="text-xs max-w-xs mx-auto text-gray-400 font-semibold">
                      Try adjusting your filters, search term, or create a brand new offer template.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedOffers.map(offer => {
                  const status = getStatus(offer)
                  const percentageUsed = offer.usageLimit 
                    ? Math.min(Math.round((offer.usageCount / offer.usageLimit) * 100), 100) 
                    : 0
                  
                  return (
                    <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name Details Column */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3.5">
                          {/* Circle Avatar badge */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black tracking-tighter ${
                            offer.type === 'Percentage' ? 'bg-red-50 text-[#e32929]' :
                            offer.type === 'Flat' ? 'bg-amber-50 text-amber-600' :
                            'bg-purple-50 text-purple-600'
                          }`}>
                            {offer.type === 'Percentage' ? `${offer.discountValue}%` :
                             offer.type === 'Flat' ? `₹${offer.discountValue}` :
                             'FREE'}
                          </div>
                          <div>
                            <span className="block font-bold text-gray-800 text-sm hover:text-[#e32929] cursor-pointer" onClick={() => navigate(`/offers/${offer.id}`)}>
                              {offer.title}
                            </span>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider font-mono">
                              {offer.code || 'NO CODE'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="py-4.5 px-4 font-bold text-gray-500">
                        {offer.type}
                      </td>

                      {/* Discount Detail Column */}
                      <td className="py-4.5 px-4">
                        {offer.type === 'Percentage' && (
                          <div className="space-y-0.5">
                            <span className="block text-[#e32929] font-black">{offer.discountValue}% OFF</span>
                            <span className="block text-[10px] text-gray-400 font-semibold">Max ₹{offer.maxDiscount}</span>
                          </div>
                        )}
                        {offer.type === 'Flat' && (
                          <div className="space-y-0.5">
                            <span className="block text-rose-600 font-black">₹{offer.discountValue} OFF</span>
                            <span className="block text-[10px] text-gray-400 font-semibold">Min. Order ₹{offer.minOrderValue}</span>
                          </div>
                        )}
                        {offer.type === 'Delivery' && (
                          <span className="text-purple-600 font-black">Free Delivery</span>
                        )}
                      </td>

                      {/* Validity Column */}
                      <td className="py-4.5 px-4">
                        <div className="text-[11px] text-gray-600 space-y-0.5 font-semibold">
                          <div className="flex items-center gap-1 text-gray-800">
                            <span>{formatDate(offer.startDate)}</span>
                          </div>
                          <div className="text-gray-400 font-semibold text-[10px] pl-1">to {formatDate(offer.endDate)}</div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            status === 'Active' ? 'bg-emerald-500' :
                            status === 'Scheduled' ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`} />
                          {status}
                        </span>
                      </td>

                      {/* Performance Column */}
                      <td className="py-4.5 px-4 w-40">
                        {offer.usageLimit ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-gray-800">{offer.usageCount} used</span>
                              <span className="text-gray-400">/ {offer.usageLimit}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  status === 'Expired' ? 'bg-rose-500' :
                                  status === 'Scheduled' ? 'bg-amber-500' :
                                  percentageUsed >= 90 ? 'bg-rose-500' :
                                  percentageUsed >= 70 ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${percentageUsed}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 font-semibold font-mono">Unlimited</div>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5 relative">
                          <button
                            onClick={() => handleEditClick(offer)}
                            title="Quick Edit"
                            className="p-2 border border-gray-150 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-[#e32929] transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* More Options Dropdown Toggle */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenDropdownId(openDropdownId === offer.id ? null : offer.id)
                              }}
                              className="p-2 border border-gray-150 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {openDropdownId === offer.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-20 text-left animate-scale-up">
                                  <button
                                    onClick={() => navigate(`/offers/${offer.id}`)}
                                    className="w-full px-4 py-2 hover:bg-gray-50 text-gray-600 hover:text-gray-800 flex items-center gap-2 text-xs font-bold cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                    <span>View Details</span>
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(offer)}
                                    className="w-full px-4 py-2 hover:bg-gray-50 text-gray-600 hover:text-gray-800 flex items-center gap-2 text-xs font-bold cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Duplicate</span>
                                  </button>
                                  <div className="h-px bg-gray-100 my-1" />
                                  <button
                                    onClick={() => {
                                      setDeleteConfirmId(offer.id)
                                      setOpenDropdownId(null)
                                    }}
                                    className="w-full px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-xs font-bold cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Split screen - Create Form & Analytics */}
      <div ref={formRef} className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        
        {/* Create/Edit Form Container */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="text-base font-bold text-gray-800">
              {isEditing ? `Edit Offer Details` : 'Create New Offer'}
            </h4>
            <p className="text-xs text-gray-400 mt-1 font-semibold">
              {isEditing ? 'Modify promotion criteria and configurations' : 'Publish a new discount or delivery promotion'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Offer Title */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Offer Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. 20% OFF on Chicken Products"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium placeholder-gray-350 focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                  formErrors.title ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                }`}
              />
              {formErrors.title && (
                <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.title}</p>
              )}
            </div>

            {/* Side-by-Side: Offer Type & Coupon Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Offer Type</label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        type: newType,
                        discountValue: newType === 'Delivery' ? '' : prev.discountValue
                      }))
                      if (formErrors.discountValue) {
                        setFormErrors(prev => ({ ...prev, discountValue: null }))
                      }
                    }}
                    className="w-full pr-9 pl-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-gray-50/30 hover:bg-gray-100/30 focus:outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount (₹)</option>
                    <option value="Delivery">Free Delivery</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Coupon Code (Optional)</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g. CHICKEN20"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold placeholder-gray-350 focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                    formErrors.code ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                  }`}
                />
                {formErrors.code && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.code}</p>
                )}
              </div>
            </div>

            {/* Discount configurations: Value & Maximum Discount */}
            {formData.type !== 'Delivery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Discount Value {formData.type === 'Percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={formData.type === 'Percentage' ? 'e.g. 20' : 'e.g. 150'}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                      formErrors.discountValue ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.discountValue && (
                    <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.discountValue}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {formData.type === 'Percentage' ? 'Max Discount Limit (₹)' : 'Not Applicable'}
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    disabled={formData.type !== 'Percentage'}
                    value={formData.type === 'Percentage' ? formData.maxDiscount : ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 200 (Optional)"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Minimum Order Value & Usage Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Min. Order Value (Optional)</label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleInputChange}
                  placeholder="e.g. 999"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                    formErrors.minOrderValue ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                  }`}
                />
                {formErrors.minOrderValue && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.minOrderValue}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Usage Limit (Total Uses)</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  placeholder="e.g. 500 (Leave blank for unlimited)"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                    formErrors.usageLimit ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                  }`}
                />
                {formErrors.usageLimit && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.usageLimit}</p>
                )}
              </div>
            </div>

            {/* Valid From & Valid To Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Valid From</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                    formErrors.startDate ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                  }`}
                />
                {formErrors.startDate && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.startDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Valid To</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#e32929] transition-all bg-gray-50/30 ${
                    formErrors.endDate ? 'border-rose-400 focus:border-rose-450' : 'border-gray-200'
                  }`}
                />
                {formErrors.endDate && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.endDate}</p>
                )}
              </div>
            </div>

            {/* Applicable Targets (Categories & Products Selector) */}
            <div className="space-y-3.5 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Products Scope</label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="applyToAllProducts"
                    checked={formData.applyToAllProducts}
                    onChange={handleInputChange}
                    className="accent-[#e32929] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-600">Apply to All Products</span>
                </label>
              </div>

              {!formData.applyToAllProducts && (
                <div className="space-y-3 animate-fade-in-up">
                  {/* Custom category pill selector */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Categories</span>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_CATEGORIES.map(category => {
                        const selected = formData.applicableCategories.includes(category)
                        return (
                          <button
                            type="button"
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                              selected
                                ? 'bg-red-50 text-[#e32929] border-[#e32929]'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Custom Product items Checklist */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Specific Products</span>
                    <div className="border border-gray-200 rounded-xl max-h-40 overflow-y-auto p-2 bg-gray-50/20 custom-scrollbar space-y-1">
                      {filteredProducts.map(prod => {
                        const selected = formData.applicableProducts.includes(prod.id)
                        return (
                          <button
                            type="button"
                            key={prod.id}
                            onClick={() => handleProductToggle(prod.id)}
                            className={`w-full flex items-center justify-between text-left p-2 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                              selected 
                                ? 'bg-red-50/50 text-[#e32929]' 
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <span>{prod.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase bg-white border border-gray-150 px-2 py-0.5 rounded-md">
                              {prod.category}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {formErrors.applicableCategories && (
                    <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.applicableCategories}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                {isEditing ? 'Update Offer' : 'Create Offer'}
              </button>
            </div>

          </form>
        </div>

        {/* Analytics Container */}
        <div className="space-y-6">
          
          {/* Performance Overview Donut card */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-gray-800">Offer Performance Overview</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Distribution of offer redemptions by status</p>
              </div>
              <div className="relative">
                <select className="appearance-none pr-8 pl-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 focus:outline-none cursor-pointer">
                  <option>This Month</option>
                  <option>Last Quarter</option>
                  <option>All Time</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              {/* Donut SVG */}
              <div className="md:col-span-6 flex justify-center">
                <div className="relative w-36 h-36">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r={r} fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                    
                    {/* Active (Green) */}
                    {activeDash > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={`${activeDash} ${circ}`}
                        strokeDashoffset="0"
                      />
                    )}
                    
                    {/* Scheduled (Orange) */}
                    {scheduledDash > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        stroke="#f97316"
                        strokeWidth="8"
                        strokeDasharray={`${scheduledDash} ${circ}`}
                        strokeDashoffset={-activeDash}
                      />
                    )}
                    
                    {/* Expired (Red) */}
                    {expiredDash > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray={`${expiredDash} ${circ}`}
                        strokeDashoffset={-(activeDash + scheduledDash)}
                      />
                    )}
                  </svg>
                  
                  {/* Inside Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Total Usage</span>
                    <span className="text-lg font-black text-gray-800">{totalUsage}</span>
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="md:col-span-6 space-y-3.5">
                {/* Active */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="font-bold text-gray-600">Active Offers</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-black text-gray-800 block">{activeUsage}</span>
                    <span className="text-[10px] font-bold text-gray-400 block">{Math.round(activeShare * 100) || 0}%</span>
                  </div>
                </div>

                {/* Scheduled */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="font-bold text-gray-600">Scheduled Offers</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-black text-gray-800 block">{scheduledUsage}</span>
                    <span className="text-[10px] font-bold text-gray-400 block">{Math.round(scheduledShare * 100) || 0}%</span>
                  </div>
                </div>

                {/* Expired */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="font-bold text-gray-600">Expired Offers</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-black text-gray-800 block">{expiredUsage}</span>
                    <span className="text-[10px] font-bold text-gray-400 block">{Math.round(expiredShare * 100) || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sparkline stats analytics card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Total Revenue card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm space-y-2 hover:shadow-md transition-all duration-300">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue Impact</span>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-lg font-black text-gray-800">{formatPrice(stats.revenue)}</h4>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> +12.5% vs last month
                  </span>
                </div>
                {/* SVG sparkline */}
                <svg width="65" height="26" viewBox="0 0 65 26" className="text-emerald-500 select-none">
                  <path
                    d="M 2 24 Q 15 15, 30 18 T 63 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Total Users card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm space-y-2 hover:shadow-md transition-all duration-300">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Users Benefited</span>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-lg font-black text-gray-800">642</h4>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> +8.2% vs last month
                  </span>
                </div>
                {/* SVG sparkline */}
                <svg width="65" height="26" viewBox="0 0 65 26" className="text-emerald-500 select-none">
                  <path
                    d="M 2 22 L 15 18 L 30 20 L 45 10 L 63 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Total Orders card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm space-y-2 hover:shadow-md transition-all duration-300">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Orders with Offers</span>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-lg font-black text-gray-800">{totalUsage}</h4>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> +15.3% vs last month
                  </span>
                </div>
                {/* SVG sparkline */}
                <svg width="65" height="26" viewBox="0 0 65 26" className="text-emerald-500 select-none">
                  <path
                    d="M 2 25 L 18 20 L 35 15 L 50 10 L 63 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Average Discount card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm space-y-2 hover:shadow-md transition-all duration-300">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Average Discount Given</span>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-lg font-black text-gray-800">₹147</h4>
                  <span className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingDown className="w-3 h-3" /> -2.1% vs last month
                  </span>
                </div>
                {/* SVG sparkline (downward) */}
                <svg width="65" height="26" viewBox="0 0 65 26" className="text-rose-500 select-none">
                  <path
                    d="M 2 4 L 18 10 L 35 8 L 50 16 L 63 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
