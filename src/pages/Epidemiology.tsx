import { useState, useMemo } from 'react'
import { ArrowLeft, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { getData, filterDataframe, formatWithCommas, FilterOptions } from '../utils/dataGenerator'
import { StatBox } from '../components/StatBox'
import { FilterDropdown } from '../components/FilterDropdown'
import { BarChart } from '../components/BarChart'
import { PieChart } from '../components/PieChart'
import { PieChartWithDiseases } from '../components/PieChartWithDiseases'
import { StackedBarChart } from '../components/StackedBarChart'
import { LineChart } from '../components/LineChart'
import { DemoNotice } from '../components/DemoNotice'
import { useTheme } from '../context/ThemeContext'
import { InfoTooltip } from '../components/InfoTooltip'
import { getChartColors } from '../utils/chartColors'

interface EpidemiologyProps {
  onNavigate: (page: string) => void
}

export function Epidemiology({ onNavigate }: EpidemiologyProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = getData()
  
  const [filters, setFilters] = useState<FilterOptions>({
    year: [],
    disease: [],
    region: [],
    incomeType: [],
    country: [],
  })

  const [openModal, setOpenModal] = useState<'prevalence' | 'incidence' | null>(null)

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
      incomeTypes: [...new Set(data.map(d => d.incomeType))].sort(),
      countries: availableCountries,
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
        marketSize: 'N/A',
        totalPrevalence: 'N/A',
        totalIncidence: 'N/A',
        topDisease: 'N/A',
      }
    }

    const marketSize = filteredData.reduce((sum, d) => sum + (d.marketValueUsd / 1000), 0)
    const totalPrevalence = filteredData.reduce((sum, d) => sum + d.prevalence, 0)
    const totalIncidence = filteredData.reduce((sum, d) => sum + d.incidence, 0)
    const diseaseGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.disease] = (acc[d.disease] || 0) + d.prevalence
      return acc
    }, {})
    const topDisease = Object.entries(diseaseGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      marketSize: `${formatWithCommas(marketSize)}M`,
      totalPrevalence: `${formatWithCommas(totalPrevalence / 1000)}K`,
      totalIncidence: `${formatWithCommas(totalIncidence / 1000)}K`,
      topDisease,
    }
  }, [filteredData])

  const chartData1 = useMemo(() => {
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.disease] = (acc[d.disease] || 0) + d.prevalence
      return acc
    }, {})
    return Object.entries(grouped).map(([disease, prevalence]) => ({
      disease,
      prevalence,
    })).sort((a, b) => b.prevalence - a.prevalence)
  }, [filteredData])

  const chartData2 = useMemo(() => {
    // Check if country filter is applied
    const hasCountryFilter = filters.country && filters.country.length > 0
    const countryForData = hasCountryFilter && filters.country.length === 1 ? filters.country[0] : undefined
    
    const grouped = filteredData.reduce((acc: Record<string, { incidence: number; country?: string }>, d) => {
      if (!acc[d.region]) {
        acc[d.region] = { incidence: 0, country: countryForData }
      }
      acc[d.region].incidence += d.incidence
      return acc
    }, {})
    return Object.entries(grouped).map(([region, data]) => ({
      region,
      incidence: data.incidence,
      country: data.country,
    }))
  }, [filteredData, filters.country])

  // Combined chart data showing disease contributions within each region
  const chartData2WithDiseases = useMemo(() => {
    const hasCountryFilter = filters.country && filters.country.length > 0
    const countryForData = hasCountryFilter && filters.country.length === 1 ? filters.country[0] : undefined
    
    const grouped = filteredData.reduce((acc: Record<string, Record<string, number>>, d) => {
      if (!acc[d.region]) {
        acc[d.region] = {}
      }
      acc[d.region][d.disease] = (acc[d.region][d.disease] || 0) + d.incidence
      return acc
    }, {})
    
    // Flatten to region-disease combinations
    const result: Array<{ region: string; disease: string; incidence: number; label: string; country?: string }> = []
    Object.entries(grouped).forEach(([region, diseases]) => {
      Object.entries(diseases).forEach(([disease, incidence]) => {
        result.push({
          region,
          disease,
          incidence,
          label: `${region} - ${disease}`,
          country: countryForData,
        })
      })
    })
    return result.sort((a, b) => b.incidence - a.incidence)
  }, [filteredData, filters.country])

  // Get unique diseases for color mapping
  const uniqueDiseases = useMemo(() => {
    return [...new Set(filteredData.map(d => d.disease))].sort()
  }, [filteredData])

  // Region comparison - Top 6 regions by total cases (weighted by prevalence more heavily)
  const regionComparisonData = useMemo(() => {
    const hasCountryFilter = filters.country && filters.country.length === 1
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      // Weight prevalence more heavily than incidence for variation
      acc[d.region] = (acc[d.region] || 0) + (d.prevalence * 1.5) + d.incidence
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([region, total]) => ({ region, total: Math.round(total), country: countryForData }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
  }, [filteredData, filters.country])

  // Individual disease comparison charts (when 2 or more diseases selected)
  const diseaseComparisonCharts = useMemo(() => {
    if (!filters.disease || filters.disease.length < 2) return []
    
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    
    return filters.disease.map((disease) => {
      const diseaseData = filteredData.filter(d => d.disease === disease)
      const grouped = diseaseData.reduce((acc: Record<string, number>, d) => {
        acc[d.region] = (acc[d.region] || 0) + d.incidence
        return acc
      }, {})
      return {
        disease,
        data: Object.entries(grouped).map(([region, incidence]) => ({
          region,
          incidence,
          country: countryForData,
        }))
      }
    })
  }, [filteredData, filters.disease, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const hasCountryFilter = filters.country && filters.country.length === 1
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    
    const grouped = filteredData.reduce((acc: Record<number, { prevalence: number; incidence: number }>, d) => {
      if (!acc[d.year]) {
        acc[d.year] = { prevalence: 0, incidence: 0 }
      }
      acc[d.year].prevalence += d.prevalence
      acc[d.year].incidence += d.incidence
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([year, values]) => ({
        year: parseInt(year),
        prevalence: values.prevalence,
        incidence: values.incidence,
        country: countryForData,
      }))
      .sort((a, b) => a.year - b.year)
  }, [filteredData, filters.country])

  const prevalencePieData = useMemo(() => {
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.disease] = (acc[d.disease] || 0) + d.prevalence
      return acc
    }, {})
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)
    return Object.entries(grouped)
      .map(([disease, prevalence]) => ({
        disease,
        value: prevalence,
        percent: total > 0 ? ((prevalence / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  const incidencePieData = useMemo(() => {
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.disease] = (acc[d.disease] || 0) + d.incidence
      return acc
    }, {})
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)
    return Object.entries(grouped)
      .map(([disease, incidence]) => ({
        disease,
        value: incidence,
        percent: total > 0 ? ((incidence / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.value - a.value)
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
        <InfoTooltip content="• Provides insights into disease prevalence and incidence rates\n• Analyze data across regions, countries, and time periods\n• Use filters to explore trends and compare diseases\n• Charts show prevalence (existing cases) and incidence (new cases)\n• Understand disease burden and spread patterns">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            Epidemiology Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Disease prevalence and incidence trends
        </p>
      </motion.div>

      <DemoNotice />

      {/* Filters */}
      <div className={`p-5 rounded-lg mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
            label="Income Type"
            value={filters.incomeType || []}
            onChange={(value) => updateFilter('incomeType', value)}
            options={uniqueOptions.incomeTypes}
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
            title={kpis.marketSize}
            subtitle="Market Size (US$ Million)"
            icon={<Activity className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalPrevalence}
            subtitle="Total Prevalence (000s)"
            icon={<Activity className="text-electric-blue dark:text-cyan-accent" size={26} />}
            progress={0.75}
            onCircleClick={() => setOpenModal('prevalence')}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalIncidence}
            subtitle="Total Incidence (000s)"
            icon={<Activity className="text-electric-blue dark:text-cyan-accent" size={26} />}
            progress={0.70}
            onCircleClick={() => setOpenModal('incidence')}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topDisease}
            subtitle="Top Disease"
            icon={<Activity className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Displays total prevalence (existing cases) for each disease\n• Bar height represents cumulative number of cases\n• Identify diseases with highest disease burden\n• Filter by year, region, or country for comparison">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Prevalence by Disease
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData1}
              dataKey="prevalence"
              nameKey="disease"
              color="#0075FF"
              xAxisLabel="Disease"
              yAxisLabel="Cases (thousands)"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Stacked bar chart showing incidence distribution by region\n• Each bar represents a region with disease breakdown\n• Colored segments show disease contributions\n• Compare regions to identify high-incidence areas">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Incidence by Region (% Distribution)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <StackedBarChart
              data={chartData2WithDiseases}
              dataKey="incidence"
              nameKey="region"
              diseaseKey="disease"
              uniqueDiseases={uniqueDiseases}
              xAxisLabel="Region"
              yAxisLabel="Incidence"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>

      {/* Individual Disease Comparison Charts (when 2 or more diseases selected) */}
      {diseaseComparisonCharts.length >= 2 && (
        <div className="mb-6">
          <div className="mb-4">
            <InfoTooltip content="• Individual pie charts for each selected disease\n• Shows regional incidence distribution per disease\n• Compare regional patterns between diseases\n• Identify most affected regions for each disease">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
                Disease Comparison: Regional Incidence Distribution
              </h2>
            </InfoTooltip>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {diseaseComparisonCharts.map((comparison, index) => (
              <div key={comparison.disease} className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
                <div className="mb-2">
                  <InfoTooltip content={`• Shows regional distribution for ${comparison.disease}\n• Each slice represents a region\n• Slice size indicates proportion of total incidence\n• Identify regions with highest incidence rates\n• Compare regional contributions to disease burden`}>
                    <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                      {comparison.disease} - Incidence by Region
                    </h3>
                  </InfoTooltip>
                </div>
                    <div className="h-[calc(100%-75px)]">
                      <PieChart
                    data={comparison.data}
                    dataKey="incidence"
                    nameKey="region"
                    showCountry={selectedCountries.length > 0 ? selectedCountries : false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`p-3 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-2">
          <InfoTooltip content="• Tracks prevalence and incidence trends over time\n• Two lines show disease burden and new cases\n• Identify trends, seasonal patterns, and outbreaks\n• Evaluate impact of interventions\n• Rising lines = increasing burden, declining = improvement">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
              Prevalence and Incidence Trends Over Time
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-70px)]">
          <LineChart
            data={chartData3}
            dataKeys={['prevalence', 'incidence']}
            nameKey="year"
            colors={getChartColors(2)}
            xAxisLabel="Year"
            yAxisLabel="Cases"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
          />
        </div>
      </div>

      {/* Additional Analysis Charts */}
      <div className={`p-3 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-2">
          <InfoTooltip content="• Ranks top 6 regions by total disease burden\n• Combines prevalence and incidence data\n• Bar height represents cumulative disease impact\n• Higher bars = greater overall burden\n• Prioritize regions for intervention and resources">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
              Top Regions by Total Disease Burden
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-70px)]">
          <BarChart
            data={regionComparisonData}
            dataKey="total"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            nameKey="region"
            color="#0075FF"
            xAxisLabel="Region"
            yAxisLabel="Cases"
          />
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-2xl w-full rounded-lg p-6 ${isDark ? 'bg-navy-card' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {openModal === 'prevalence' ? 'Total Prevalence by Disease' : 'Total Incidence by Disease'}
              </h2>
              <button
                onClick={() => setOpenModal(null)}
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
              >
                ✕
              </button>
            </div>
            <div className="h-[500px]">
              <PieChart
                data={openModal === 'prevalence' ? prevalencePieData : incidencePieData}
                dataKey="value"
                nameKey="disease"
                colors={getChartColors(10)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

