import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { getExecutiveProtectionData, ExecutiveProtectionData } from '../utils/executiveProtectionGenerator'
import { useTheme } from '../context/ThemeContext'
import { PieChart } from '../components/PieChart'
import { BarChart } from '../components/BarChart'

interface CustomerIntelligenceProps {
  onNavigate: (page: string) => void
}

export function CustomerIntelligence({ onNavigate }: CustomerIntelligenceProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const [data, setData] = useState<ExecutiveProtectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModule, setActiveModule] = useState<'module1' | 'module2' | 'module3'>('module1')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const generatedData = getExecutiveProtectionData()
      setData(generatedData)
      setLoading(false)
    }, 500)
  }, [])

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }, [data, currentPage, itemsPerPage])

  // Graph Data Calculations
  const graphData = useMemo(() => {
    // 1. Risk Exposure Category Distribution
    const riskCategoryData = data.reduce((acc, row) => {
      const category = row.riskExposureCategory || 'Unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const riskCategoryChart = Object.entries(riskCategoryData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // 2. Types of Threats Faced (breakdown by individual threat types)
    const threatTypesData: Record<string, number> = {}
    data.forEach(row => {
      if (row.typesOfThreatsFaced) {
        // Split by comma and process each threat type
        const threats = row.typesOfThreatsFaced.split(',').map(t => t.trim())
        threats.forEach(threat => {
          threatTypesData[threat] = (threatTypesData[threat] || 0) + 1
        })
      }
    })

    const threatsChart = Object.entries(threatTypesData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 threat types

    // 3. Individual vs Corporate Distribution
    const individualCorporateData = data.reduce((acc, row) => {
      // Categorize based on designation role and type of business
      const designation = (row.designationRole || '').toLowerCase()
      const businessType = (row.typeOfBusiness || '').toLowerCase()
      const companyName = (row.companyName || '').toLowerCase()
      
      // Check if it's an individual/family office
      const isIndividual = 
        designation.includes('family office') ||
        designation.includes('personal') ||
        businessType.includes('family office') ||
        companyName.includes('family office') ||
        designation.includes('private') ||
        businessType.includes('private')
      
      const category = isIndividual ? 'Individual' : 'Corporate'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const individualCorporateChart = Object.entries(individualCorporateData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return {
      riskCategory: riskCategoryChart,
      threatTypes: threatsChart,
      individualCorporate: individualCorporateChart
    }
  }, [data])

  const exportToCSV = () => {
    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof ExecutiveProtectionData] || ''
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `executive_protection_module_${activeModule}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading customer intelligence data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('Home')}
          className="flex items-center gap-2 px-5 py-2.5 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          <Download size={20} />
          Export CSV
        </motion.button>
      </div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
          EMEA and Asia Pacific Premium Executive Protection<br />
          and Threat Mitigation Services Market - Customer Database
        </h1>
        <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark">
          Verified directory and insight on customers
        </p>
        <p className="text-lg text-electric-blue dark:text-cyan-accent mt-2">
          Total Customers: {data.length} (100-120 customers)
        </p>
      </motion.div>

      {/* Graphs Section */}
      <div className="space-y-6 mb-8">
        {/* Graph 1: Risk Exposure Category Distribution */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Risk Exposure Category Distribution
          </h3>
          <div className="h-[400px]">
            <PieChart
              data={graphData.riskCategory}
              dataKey="value"
              nameKey="name"
              colors={['#EF4444', '#F59E0B', '#10B981']}
            />
          </div>
        </div>

        {/* Graph 2: Demand Scenario - Individual vs Corporate */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Demand Scenario of Premium Executive Protection and Threat Mitigation Services
          </h3>
          <div className="h-[400px]">
            <PieChart
              data={graphData.individualCorporate}
              dataKey="value"
              nameKey="name"
              colors={['#0075FF', '#00C49F']}
            />
          </div>
        </div>

        {/* Graph 3: Types of Threats Faced */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Top Threat Types Faced
          </h3>
          <div className="h-[400px]">
            <BarChart
              data={graphData.threatTypes}
              dataKey="value"
              nameKey="name"
              color="#8B5CF6"
              xAxisLabel="Threat Type"
              yAxisLabel="Number of Users"
            />
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <div className={`p-6 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveModule('module1')
              setCurrentPage(1)
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'module1'
                ? 'bg-electric-blue text-white shadow-lg'
                : isDark
                ? 'bg-navy-dark text-text-secondary-dark hover:bg-navy-light'
                : 'bg-gray-100 text-text-secondary-light hover:bg-gray-200'
            }`}
          >
            Module 1 - Standard
            <span className="block text-xs mt-1 opacity-80">(list of 100-120 Customer)</span>
          </button>
          <button
            onClick={() => {
              setActiveModule('module2')
              setCurrentPage(1)
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'module2'
                ? 'bg-electric-blue text-white shadow-lg'
                : isDark
                ? 'bg-navy-dark text-text-secondary-dark hover:bg-navy-light'
                : 'bg-gray-100 text-text-secondary-light hover:bg-gray-200'
            }`}
          >
            Module 2 - Advance
            <span className="block text-xs mt-1 opacity-80">(list of 100-120 Customer)</span>
          </button>
          <button
            onClick={() => {
              setActiveModule('module3')
              setCurrentPage(1)
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeModule === 'module3'
                ? 'bg-electric-blue text-white shadow-lg'
                : isDark
                ? 'bg-navy-dark text-text-secondary-dark hover:bg-navy-light'
                : 'bg-gray-100 text-text-secondary-light hover:bg-gray-200'
            }`}
          >
            Module 3 - Premium
            <span className="block text-xs mt-1 opacity-80">(list of 100-120 Customer)</span>
          </button>
        </div>
      </div>

      {/* Module 1 Table */}
      {activeModule === 'module1' && (
        <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Module 1 - Customer Information & Contact Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th rowSpan={2} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-navy-dark' : 'bg-gray-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    S.No.
                  </th>
                  <th colSpan={7} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Information
                  </th>
                  <th colSpan={6} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark`}>
                    Contact Details
                  </th>
                </tr>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Name
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Company Name
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Type of Business
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Risk Involved Specific to Protection
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Risk Exposure Category
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Number/Count of Person Required Protection Service
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Other Key Insights
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Key Contact Person
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Designation/Role
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Email Address
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Phone/WhatsApp Number
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    LinkedIn Profile
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark`}>
                    Website URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr 
                    key={index}
                    className={`border-b ${isDark ? 'border-navy-light hover:bg-navy-dark' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-3 py-2 text-center text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.sNo}
                    </td>
                    <td className={`px-3 py-2 text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerName}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.companyName}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.typeOfBusiness}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.riskInvolvedSpecificToProtection}
                    </td>
                    <td className={`px-3 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.riskExposureCategory?.includes('High')
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : row.riskExposureCategory?.includes('Moderate')
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {row.riskExposureCategory}
                      </span>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.numberOfPersonsRequiredProtectionService}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyInsights}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.keyContactPerson}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.designationRole}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={`mailto:${row.emailAddress}`} className="text-electric-blue hover:underline">
                        {row.emailAddress}
                      </a>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.phoneWhatsAppNumber}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={row.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                        LinkedIn
                      </a>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark`}>
                      <a href={row.websiteURL} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                        {row.websiteURL.replace('https://', '').replace('http://', '')}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 2 Table */}
      {activeModule === 'module2' && (
        <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Module 2 - Customer Information, Contact Details & Threat Exposure & Risk Drivers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th rowSpan={2} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-navy-dark' : 'bg-gray-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    S.No.
                  </th>
                  <th colSpan={7} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Information
                  </th>
                  <th colSpan={6} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Contact Details
                  </th>
                  <th colSpan={3} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark`}>
                    Threat Exposure & Risk Drivers
                  </th>
                </tr>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Name
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Company Name
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Type of Business
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Risk Involved Specific to Protection
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Risk Exposure Category
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Number/Count of Person Required Protection Service
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Other Key Insights
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Key Contact Person
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Designation/Role
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Email Address
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Phone/WhatsApp Number
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    LinkedIn Profile
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Website URL
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Types of Threats Faced
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Past Incidents or Recent Triggers
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark`}>
                    Family Members at Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr 
                    key={index}
                    className={`border-b ${isDark ? 'border-navy-light hover:bg-navy-dark' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-3 py-2 text-center text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.sNo}
                    </td>
                    <td className={`px-3 py-2 text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerName}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.companyName}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.typeOfBusiness}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.riskInvolvedSpecificToProtection}
                    </td>
                    <td className={`px-3 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.riskExposureCategory?.includes('High')
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : row.riskExposureCategory?.includes('Moderate')
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {row.riskExposureCategory}
                      </span>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.numberOfPersonsRequiredProtectionService}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyInsights}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.keyContactPerson}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.designationRole}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={`mailto:${row.emailAddress}`} className="text-electric-blue hover:underline">
                        {row.emailAddress}
                      </a>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.phoneWhatsAppNumber}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={row.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                        LinkedIn
                      </a>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={row.websiteURL} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                        {row.websiteURL.replace('https://', '').replace('http://', '')}
                      </a>
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.typesOfThreatsFaced}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.pastIncidentsOrRecentTriggers}
                    </td>
                    <td className={`px-3 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark`}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.familyMembersAtRisk?.includes('Yes')
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {row.familyMembersAtRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 3 Table */}
      {activeModule === 'module3' && (
        <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Module 3 - Complete Customer Intelligence with Purchasing Behaviour, Service Requirements & CMI Insights
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th rowSpan={2} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-navy-dark' : 'bg-gray-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    S.No.
                  </th>
                  <th colSpan={7} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Information
                  </th>
                  <th colSpan={6} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Contact Details
                  </th>
                  <th colSpan={3} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Threat Exposure & Risk Drivers
                  </th>
                  <th colSpan={3} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Purchasing Behaviour
                  </th>
                  <th colSpan={5} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Service Requirements
                  </th>
                  <th colSpan={2} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-text-primary-light dark:text-text-primary-dark`}>
                    CMI Insights
                  </th>
                </tr>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Name
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Company Name
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Type of Business
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Risk Involved
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Risk Category
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Number of Persons
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Other Key Insights
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Contact Person
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Designation
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Email
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Phone
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    LinkedIn
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Website
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Types of Threats
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Past Incidents
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Family at Risk
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Decision Makers
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Procurement Method
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Budget Levels
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Type of Protection
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Protection Intensity
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Contract Duration
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Technology Expectations
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Other Key Details
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Benchmarking Summary
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-text-primary-light dark:text-text-primary-dark`}>
                    Additional Comments
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr 
                    key={index}
                    className={`border-b ${isDark ? 'border-navy-light hover:bg-navy-dark' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-2 py-2 text-center text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.sNo}
                    </td>
                    <td className={`px-2 py-2 text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerName}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.companyName}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.typeOfBusiness}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.riskInvolvedSpecificToProtection}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                        row.riskExposureCategory?.includes('High')
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : row.riskExposureCategory?.includes('Moderate')
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {row.riskExposureCategory}
                      </span>
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.numberOfPersonsRequiredProtectionService}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyInsights}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.keyContactPerson}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.designationRole}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={`mailto:${row.emailAddress}`} className="text-electric-blue hover:underline text-xs">
                        {row.emailAddress}
                      </a>
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.phoneWhatsAppNumber}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={row.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline text-xs">
                        LinkedIn
                      </a>
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <a href={row.websiteURL} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline text-xs">
                        {row.websiteURL.replace('https://', '').replace('http://', '')}
                      </a>
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.typesOfThreatsFaced}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.pastIncidentsOrRecentTriggers}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                        row.familyMembersAtRisk?.includes('Yes')
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {row.familyMembersAtRisk}
                      </span>
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.decisionMakers}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.procurementMethod}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.budgetLevels}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.typeOfProtectionRequired}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.protectionIntensity}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.preferredContractDuration}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.technologyExpectations}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyDetails}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerBenchmarkingSummary}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark`}>
                      {row.additionalCommentsNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
        <div className="flex items-center justify-between">
          <div className="text-text-secondary-light dark:text-text-secondary-dark">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} customers
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-electric-blue text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-electric-blue text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
