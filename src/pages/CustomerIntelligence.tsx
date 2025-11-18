import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { getELNMarketData, ELNMarketData } from '../utils/elnMarketGenerator'
import { useTheme } from '../context/ThemeContext'
import { PieChart } from '../components/PieChart'
import { BarChart } from '../components/BarChart'

interface CustomerIntelligenceProps {
  onNavigate: (page: string) => void
}

export function CustomerIntelligence({ onNavigate }: CustomerIntelligenceProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const [data, setData] = useState<ELNMarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModule, setActiveModule] = useState<'module1' | 'module2' | 'module3'>('module1')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const generatedData = getELNMarketData()
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
    // 1. Type of Business Distribution
    const businessTypeData = data.reduce((acc, row) => {
      const category = row.typeOfBusiness || 'Unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const businessTypeChart = Object.entries(businessTypeData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 business types

    // 2. AI Readiness Distribution
    const aiReadinessData = data.reduce((acc, row) => {
      const aiUsage = row.aiUsageInExperimentalDesign || 'N'
      const aiDriven = row.aiDrivenELN || 'N'
      const category = (aiUsage === 'Y' || aiDriven === 'Y') ? 'AI Ready' : 'Not AI Ready'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const aiReadinessChart = Object.entries(aiReadinessData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // 3. Cloud Readiness Distribution
    const cloudReadinessData = data.reduce((acc, row) => {
      const cloudReady = row.cloudDataReadiness || 'N'
      const category = cloudReady === 'Y' ? 'Cloud Ready' : 'Not Cloud Ready'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const cloudReadinessChart = Object.entries(cloudReadinessData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return {
      businessType: businessTypeChart,
      aiReadiness: aiReadinessChart,
      cloudReadiness: cloudReadinessChart
    }
  }, [data])

  const exportToCSV = () => {
    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof ELNMarketData] || ''
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `eln_market_module_${activeModule}.csv`
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
          Global Electronic Lab Notebook (ELN) Market - Customer Database
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
        {/* Graph 1: Type of Business Distribution */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Type of Business Distribution
          </h3>
          <div className="h-[400px]">
            <BarChart
              data={graphData.businessType}
              dataKey="value"
              nameKey="name"
              color="#0075FF"
              xAxisLabel="Business Type"
              yAxisLabel="Number of Customers"
            />
          </div>
        </div>

        {/* Graph 2: AI Readiness Distribution */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            AI Readiness Distribution
          </h3>
          <div className="h-[400px]">
            <PieChart
              data={graphData.aiReadiness}
              dataKey="value"
              nameKey="name"
              colors={['#10B981', '#F59E0B']}
            />
          </div>
        </div>

        {/* Graph 3: Cloud Readiness Distribution */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Cloud Data Readiness Distribution
          </h3>
          <div className="h-[400px]">
            <PieChart
              data={graphData.cloudReadiness}
              dataKey="value"
              nameKey="name"
              colors={['#8B5CF6', '#EF4444']}
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
            Preposition 1 - Standard
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
            Preposition 2 - Advance
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
            Preposition 3 - Premium
            <span className="block text-xs mt-1 opacity-80">(list of 100-120 Customer)</span>
          </button>
        </div>
      </div>

      {/* Module 1 Table */}
      {activeModule === 'module1' && (
        <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Preposition 1 - Standard: Customer Information & Contact Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th rowSpan={2} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-navy-dark' : 'bg-gray-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    S.No.
                  </th>
                  <th colSpan={8} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
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
                    Customer Needs / Use-Case Requirements
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Pain Points and % Customers Affected
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Buying Drivers with Weighted Score (Out of 10)
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Spending Behaviour (Avg. Annual Spend)
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
                      {row.customerNeedsUseCaseRequirements}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerPainPointsAndPercentAffected}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerBuyingDriversWithWeightedScore}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerSpendingBehaviourAvgAnnualSpend}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyNeeds}
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
            Preposition 2 - Advance: Customer Information, Contact Details & Customer Satisfaction & Churn Data
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th rowSpan={2} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-navy-dark' : 'bg-gray-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    S.No.
                  </th>
                  <th colSpan={8} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Information
                  </th>
                  <th colSpan={6} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Contact Details
                  </th>
                  <th colSpan={3} className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark`}>
                    Customer Satisfaction & Churn Data
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
                    Customer Needs / Use-Case Requirements
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Pain Points and % Customers Affected
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Buying Drivers with Weighted Score (Out of 10)
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Spending Behaviour (Avg. Annual Spend)
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
                    Avg. ELN Contract Tenure
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Annual Churn Rate (Global)
                  </th>
                  <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark`}>
                    Top Reasons for Churn
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
                      {row.customerNeedsUseCaseRequirements}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerPainPointsAndPercentAffected}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerBuyingDriversWithWeightedScore}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerSpendingBehaviourAvgAnnualSpend}
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
                      {row.avgELNContractTenure}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.annualChurnRateGlobal}
                    </td>
                    <td className={`px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark`}>
                      {row.topReasonsForChurn}
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
            Preposition 3 - Premium: Complete Customer Intelligence with AI Readiness, Future Needs & CMI Insights
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                  <th rowSpan={2} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-navy-dark' : 'bg-gray-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    S.No.
                  </th>
                  <th colSpan={8} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Information
                  </th>
                  <th colSpan={6} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Contact Details
                  </th>
                  <th colSpan={3} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Satisfaction & Churn Data
                  </th>
                  <th colSpan={4} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Readiness for AI & Automation
                  </th>
                  <th colSpan={4} className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Future Needs
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
                    Customer Needs / Use-Case Requirements
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Pain Points and % Customers Affected
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Buying Drivers with Weighted Score (Out of 10)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Spending Behaviour (Avg. Annual Spend)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Other Key Insights
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Key Contact Person
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Designation/Role
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Email Address
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Phone/WhatsApp Number
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    LinkedIn Profile
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-purple-900' : 'bg-purple-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Website URL
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Avg. ELN Contract Tenure
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Annual Churn Rate (Global)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-green-900' : 'bg-green-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Top Reasons for Churn
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    AI usage in experimental design (Y/N)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Cloud data readiness (Y/N)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Automation equipment in lab (Y/N)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    AI-driven ELN (Y/N)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Real-time collaboration dashboards (Y/N)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Modular workflow builders
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    ELN - Data Lake Connectivity (Data Export/Data Pipelines/Secu)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Other Key Needs (If Any)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-text-primary-light dark:text-text-primary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                    Customer Benchmarking Summary (Potential Customers)
                  </th>
                  <th className={`px-2 py-2 text-center font-semibold ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-text-primary-light dark:text-text-primary-dark`}>
                    Additional Comments/Notes By CMI team
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
                      {row.customerNeedsUseCaseRequirements}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerPainPointsAndPercentAffected}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerBuyingDriversWithWeightedScore}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.customerSpendingBehaviourAvgAnnualSpend}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyNeeds}
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
                      {row.avgELNContractTenure}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.annualChurnRateGlobal}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.topReasonsForChurn}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.aiUsageInExperimentalDesign}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.cloudDataReadiness}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.automationEquipmentInLab}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.aiDrivenELN}
                    </td>
                    <td className={`px-2 py-2 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.realTimeCollaborationDashboards}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.modularWorkflowBuilders}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.elnDataLakeConnectivity}
                    </td>
                    <td className={`px-2 py-2 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                      {row.otherKeyNeeds}
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
