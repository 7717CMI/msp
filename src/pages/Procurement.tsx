import { useState, useMemo } from 'react'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { getData, filterDataframe, formatWithCommas, FilterOptions } from '../utils/dataGenerator'
import { StatBox } from '../components/StatBox'
import { FilterDropdown } from '../components/FilterDropdown'
import { BarChart } from '../components/BarChart'
import { PieChart } from '../components/PieChart'
import { LineChart } from '../components/LineChart'
import { StackedBarChart } from '../components/StackedBarChart'
import { DemoNotice } from '../components/DemoNotice'
import { useTheme } from '../context/ThemeContext'
import { InfoTooltip } from '../components/InfoTooltip'
import { getChartColors } from '../utils/chartColors'

interface ProcurementProps {
  onNavigate: (page: string) => void
}

export function Procurement({ onNavigate }: ProcurementProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = getData()
  
  const [filters, setFilters] = useState<FilterOptions>({
    year: [],
    disease: [],
    region: [],
    country: [],
  })

  const filteredData = useMemo(() => {
    return filterDataframe(data, filters)
  }, [data, filters])

  // Check if country filter is active (one or more countries)
  const hasCountryFilter = filters.country && filters.country.length > 0
  const selectedCountries = filters.country && filters.country.length > 0 ? filters.country : []

  const uniqueOptions = useMemo(() => {
    // Filter countries based on selected regions
    let availableCountries = [...new Set(data.map(d => d.country))].sort()
    if (filters.region && filters.region.length > 0) {
      const regionCountries = new Set<string>()
      filters.region.forEach((region: string) => {
        const countriesInRegion = data
          .filter(d => d.region === region)
          .map(d => d.country)
        countriesInRegion.forEach(country => regionCountries.add(country))
      })
      availableCountries = Array.from(regionCountries).sort()
    }
    
    return {
      years: [...new Set(data.map(d => d.year))].sort(),
      diseases: [...new Set(data.map(d => d.disease))].sort(),
      regions: [...new Set(data.map(d => d.region))].sort(),
      countries: availableCountries,
      procurementTypes: [...new Set(data.map(d => (d as any).procurement))].sort(),
    }
  }, [data, filters.region])

  // Grouped options for countries (by region)
  const groupedCountries = useMemo(() => {
    const regionMap = new Map<string, Set<string>>()
    
    if (filters.region && filters.region.length > 0) {
      filters.region.forEach((region: string) => {
        const countriesInRegion = data
          .filter(d => d.region === region)
          .map(d => d.country)
        
        if (!regionMap.has(region)) {
          regionMap.set(region, new Set())
        }
        countriesInRegion.forEach(country => regionMap.get(region)!.add(country))
      })
    } else {
      data.forEach(d => {
        if (!regionMap.has(d.region)) {
          regionMap.set(d.region, new Set())
        }
        regionMap.get(d.region)!.add(d.country)
      })
    }
    
    return Array.from(regionMap.entries())
      .map(([region, countries]) => ({
        group: region,
        items: Array.from(countries).sort()
      }))
      .sort((a, b) => a.group.localeCompare(b.group))
  }, [data, filters.region])

  const kpis = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalQuantity: 'N/A',
        totalValue: 'N/A',
        publicShare: 'N/A',
        topChannel: 'N/A',
      }
    }

    const totalQuantity = filteredData.reduce((sum, d) => sum + d.qty, 0) / 1000 // Convert to millions (boxes)
    const totalValue = filteredData.reduce((sum, d) => sum + (d.marketValueUsd / 1000), 0)
    const publicCount = filteredData.filter(d => (d as any).publicPrivate === 'Public').length
    const publicShare = (publicCount / filteredData.length) * 100
    
    const channelGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      const channel = (d as any).procurement || 'Unknown'
      acc[channel] = (acc[channel] || 0) + d.qty
      return acc
    }, {})
    const topChannel = Object.entries(channelGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      totalQuantity: `${Math.round(totalQuantity)}M`,
      totalValue: `${formatWithCommas(totalValue, 1)}M`,
      publicShare: `${formatWithCommas(publicShare, 1)}%`,
      topChannel,
    }
  }, [filteredData])

  const chartData1 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      const channel = (d as any).procurement || 'Unknown'
      acc[channel] = (acc[channel] || 0) + d.qty
      return acc
    }, {})
    return Object.entries(grouped).map(([channel, qty]) => ({
      channel,
      qty: qty / 1000, // Convert to millions
      country: countryForData,
    })).sort((a, b) => b.qty - a.qty)
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData2 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      const channel = (d as any).procurement || 'Unknown'
      acc[channel] = (acc[channel] || 0) + d.qty
      return acc
    }, {})
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)
    return Object.entries(grouped).map(([channel, qty]) => ({
      channel,
      qty,
      percentage: total > 0 ? (qty / total) * 100 : 0,
      country: countryForData,
    }))
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<number, Record<string, number>>, d) => {
      if (!acc[d.year]) {
        acc[d.year] = { public: 0, private: 0 }
      }
      const type = (d as any).publicPrivate === 'Public' ? 'public' : 'private'
      acc[d.year][type] += d.qty
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([year, types]) => ({
        year: parseInt(year),
        public: types.public / 1000, // Convert to millions
        private: types.private / 1000,
        country: countryForData,
      }))
      .sort((a, b) => a.year - b.year)
  }, [filteredData, hasCountryFilter, filters.country])

  // Channel performance analysis (weighted by market value for efficiency)
  const channelPerformance = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, { total: number; count: number }>, d) => {
      if (!acc[d.procurement]) {
        acc[d.procurement] = { total: 0, count: 0 }
      }
      // Weight by market value to show channel efficiency
      const efficiencyWeight = Math.max(0.5, d.marketValueUsd / 10000)
      acc[d.procurement].total += d.qty * efficiencyWeight
      acc[d.procurement].count += 1
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([channel, data]) => ({
        channel,
        avgVolume: data.total / data.count,
        totalVolume: Math.round(data.total),
        country: countryForData,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume)
  }, [filteredData, hasCountryFilter, filters.country])

  // Procurement efficiency by region
  const procurementByRegion = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, Record<string, number>>, d) => {
      if (!acc[d.procurement]) {
        acc[d.procurement] = {}
      }
      acc[d.procurement][d.region] = (acc[d.procurement][d.region] || 0) + d.qty
      return acc
    }, {})
    const result: Array<{ region: string; procurement: string; qty: number; label: string; country?: string }> = []
    Object.entries(grouped).forEach(([procurement, regions]) => {
      Object.entries(regions).forEach(([region, qty]) => {
        result.push({ 
          region, 
          procurement, 
          qty, 
          label: `${region} - ${procurement}`,
          country: countryForData,
        })
      })
    })
    return result
  }, [filteredData, hasCountryFilter, filters.country])

  const uniqueProcurement = useMemo(() => {
    return [...new Set(filteredData.map(d => d.procurement))].sort()
  }, [filteredData])

  const updateFilter = (key: keyof FilterOptions, value: string[] | string) => {
    const newFilters = { ...filters, [key]: value }
    
    // If region filter changes, filter out countries that don't belong to selected regions
    if (key === 'region') {
      const selectedRegions = Array.isArray(value) ? value : []
      if (selectedRegions.length > 0) {
        const validCountries = new Set<string>()
        selectedRegions.forEach((region: string) => {
          const countriesInRegion = data
            .filter(d => d.region === region)
            .map(d => d.country)
          countriesInRegion.forEach(country => validCountries.add(country))
        })
        
        // Filter out countries that don't belong to selected regions
        const currentCountries = Array.isArray(newFilters.country) ? newFilters.country : []
        const validSelectedCountries = currentCountries.filter((country: string) => 
          validCountries.has(country)
        )
        
        newFilters.country = validSelectedCountries
      }
    }
    
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('Home')}
          className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <InfoTooltip content="• Provides insights into procurement volumes\n• Analyze channel performance and distribution patterns\n• Explore public and private sector trends\n• Compare channel performance across regions\n• Optimize supply chain strategies">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            Procurement Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Public and private procurement tracking
        </p>
      </motion.div>

      <DemoNotice />

      {/* Filters */}
      <div className={`p-5 rounded-lg mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <FilterDropdown
            label="Year"
            value={filters.year || []}
            onChange={(value) => updateFilter('year', value)}
            options={uniqueOptions.years}
          />
          <FilterDropdown
            label="Disease"
            value={filters.disease || []}
            onChange={(value) => updateFilter('disease', value)}
            options={uniqueOptions.diseases}
          />
          <FilterDropdown
            label="Region"
            value={filters.region || []}
            onChange={(value) => updateFilter('region', value)}
            options={uniqueOptions.regions}
          />
          <FilterDropdown
            label="Country"
            value={filters.country || []}
            onChange={(value) => updateFilter('country', value)}
            options={uniqueOptions.countries}
            groupedOptions={groupedCountries}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalQuantity}
            subtitle="Total Quantity (Units Million - Box)"
            icon={<ShoppingCart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalValue}
            subtitle="Total Market Value (US$ Million)"
            icon={<ShoppingCart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.publicShare}
            subtitle="Public Sector Share (%)"
            icon={<ShoppingCart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topChannel}
            subtitle="Top Procurement Channel"
            icon={<ShoppingCart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Displays procurement volumes by channel\n• Bar height represents volume in million units\n• Higher bars = larger procurement volumes\n• Identify largest procurement sources\n• Understand procurement distribution">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Procurement Volume by Type (Units Million)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData1}
              dataKey="qty"
              nameKey="channel"
              color="#0075FF"
              xAxisLabel="Procurement Channel"
              yAxisLabel="Volume"
              isVolume={true}
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Shows procurement volume distribution by channel\n• Each slice represents a channel\n• Slice size indicates proportion of total procurement\n• Understand relative importance of channels\n• Identify dominant procurement pathways">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Procurement Distribution by Channel (%)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <PieChart
              data={chartData2}
              dataKey="qty"
              nameKey="channel"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-4">
          <InfoTooltip content="• Tracks public and private procurement trends\n• Two lines show volume changes over time\n• Identify procurement trends and sector performance\n• Understand public/private procurement evolution\n• Rising lines = increasing, declining = decreasing">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              Public vs Private Procurement Trend (Units Million)
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-40px)]">
          <LineChart
            data={chartData3}
            dataKeys={['public', 'private']}
            nameKey="year"
            colors={getChartColors(2)}
            xAxisLabel="Year"
            yAxisLabel="Volume"
            isVolume={true}
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
          />
        </div>
      </div>

      {/* Additional Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Analyzes channel performance by volume\n• Higher bars = better performing channels\n• Identify high-performing channels\n• Evaluate channel effectiveness\n• Compare performance across pathways">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Channel Performance Analysis
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={channelPerformance}
              dataKey="totalVolume"
              nameKey="channel"
              color="#4FD1C5"
              xAxisLabel="Procurement Channel"
              yAxisLabel="Volume"
              isVolume={true}
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Stacked bar chart showing procurement by region and channel\n• Each bar represents a region with channel breakdown\n• Colored segments show channel contributions\n• Understand regional procurement patterns\n• Identify channel performance across regions">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Procurement Distribution by Region and Channel
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <StackedBarChart
              data={procurementByRegion}
              dataKey="qty"
              nameKey="region"
              diseaseKey="procurement"
              uniqueDiseases={uniqueProcurement}
              xAxisLabel="Region"
              yAxisLabel="Volume"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
