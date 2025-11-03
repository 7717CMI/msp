import { useState, useMemo } from 'react'
import { ArrowLeft, Heart } from 'lucide-react'
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

interface VaccinationRateProps {
  onNavigate: (page: string) => void
}

export function VaccinationRate({ onNavigate }: VaccinationRateProps) {
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
        avgVaccinationRate: 'N/A',
        patientsVaccinated: 'N/A',
        avgCoverageRate: 'N/A',
        topRegion: 'N/A',
      }
    }

    const avgVaccinationRate = filteredData.reduce((sum, d) => sum + d.vaccinationRate, 0) / filteredData.length
    const totalPrevalence = filteredData.reduce((sum, d) => sum + d.prevalence, 0)
    const avgCoverageRate = filteredData.reduce((sum, d) => sum + d.coverageRate, 0) / filteredData.length
    const patientsVaccinated = (totalPrevalence * avgVaccinationRate) / 100
    
    const regionGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.region] = (acc[d.region] || 0) + d.vaccinationRate
      return acc
    }, {})
    const topRegion = Object.entries(regionGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      avgVaccinationRate: `${formatWithCommas(avgVaccinationRate, 1)}%`,
      patientsVaccinated: `${formatWithCommas(patientsVaccinated / 1000, 1)}K`,
      avgCoverageRate: `${formatWithCommas(avgCoverageRate, 1)}%`,
      topRegion,
    }
  }, [filteredData])

  const chartData1 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, { total: number; count: number }>, d) => {
      if (!acc[d.disease]) {
        acc[d.disease] = { total: 0, count: 0 }
      }
      acc[d.disease].total += d.vaccinationRate
      acc[d.disease].count += 1
      return acc
    }, {})
    return Object.entries(grouped).map(([disease, data]) => ({
      disease,
      vaccinationRate: data.total / data.count,
      country: countryForData,
    })).sort((a, b) => b.vaccinationRate - a.vaccinationRate)
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData2 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.region] = (acc[d.region] || 0) + d.vaccinationRate
      return acc
    }, {})
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)
    return Object.entries(grouped).map(([region, rate]) => ({
      region,
      vaccinationRate: rate,
      percentage: total > 0 ? (rate / total) * 100 : 0,
      country: countryForData,
    }))
  }, [filteredData, hasCountryFilter, filters.country])

  // Combined chart data showing disease contributions within each region
  const chartData2WithDiseases = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, Record<string, number>>, d) => {
      if (!acc[d.region]) {
        acc[d.region] = {}
      }
      acc[d.region][d.disease] = (acc[d.region][d.disease] || 0) + d.vaccinationRate
      return acc
    }, {})
    
    // Flatten to region-disease combinations
    const result: Array<{ region: string; disease: string; vaccinationRate: number; label: string; country?: string }> = []
    Object.entries(grouped).forEach(([region, diseases]) => {
      Object.entries(diseases).forEach(([disease, vaccinationRate]) => {
        result.push({
          region,
          disease,
          vaccinationRate,
          label: `${region} - ${disease}`,
          country: countryForData,
        })
      })
    })
    return result.sort((a, b) => b.vaccinationRate - a.vaccinationRate)
  }, [filteredData, hasCountryFilter, filters.country])

  // Get unique diseases for color mapping
  const uniqueDiseasesVax = useMemo(() => {
    return [...new Set(filteredData.map(d => d.disease))].sort()
  }, [filteredData])



  // Individual disease comparison charts (when 2 or more diseases selected)
  const diseaseComparisonCharts = useMemo(() => {
    if (!filters.disease || filters.disease.length < 2) return []
    
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    
    return filters.disease.map((disease) => {
      const diseaseData = filteredData.filter(d => d.disease === disease)
      const grouped = diseaseData.reduce((acc: Record<string, number>, d) => {
        acc[d.region] = (acc[d.region] || 0) + d.vaccinationRate
        return acc
      }, {})
      const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)
      return {
        disease,
        data: Object.entries(grouped).map(([region, rate]) => ({
          region,
          vaccinationRate: rate,
          percentage: total > 0 ? (rate / total) * 100 : 0,
          country: countryForData,
        }))
      }
    })
  }, [filteredData, filters.disease, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<number, { total: number; count: number }>, d) => {
      if (!acc[d.year]) {
        acc[d.year] = { total: 0, count: 0 }
      }
      acc[d.year].total += d.vaccinationRate
      acc[d.year].count += 1
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([year, data]) => {
        const yearData = filteredData.filter(d => d.year === parseInt(year))
        const avgCoverage = yearData.reduce((sum, d) => sum + d.coverageRate, 0) / yearData.length
        return {
          year: parseInt(year),
          vaccinationRate: data.total / data.count,
          coverageRate: avgCoverage,
          country: countryForData,
        }
      })
      .sort((a, b) => a.year - b.year)
  }, [filteredData, hasCountryFilter, filters.country])

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
        <InfoTooltip content="• Tracks vaccination coverage and rates across regions\n• Analyze data by country, disease, and time period\n• Use filters to explore vaccination performance\n• Identify coverage gaps and compare rates\n• Understand immunization program effectiveness">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            Vaccination Rate Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Coverage and vaccination rate tracking (%)
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
            title={kpis.avgVaccinationRate}
            subtitle="Average Vaccination Rate (%)"
            icon={<Heart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.patientsVaccinated}
            subtitle="Patients Vaccinated (000s)"
            icon={<Heart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.avgCoverageRate}
            subtitle="Average Coverage Rate (%)"
            icon={<Heart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topRegion}
            subtitle="Top Region by Rate"
            icon={<Heart className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Displays vaccination rates for each disease\n• Bar height shows percentage of population vaccinated\n• Higher bars = better vaccination coverage\n• Identify highest and lowest vaccination rates\n• Prioritize immunization programs effectively">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Vaccination Rate by Disease (%)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData1}
              dataKey="vaccinationRate"
              nameKey="disease"
              color="#0075FF"
              xAxisLabel="Disease"
              yAxisLabel="Rate (%)"
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Stacked bar chart showing coverage distribution by region\n• Each bar represents a region with disease breakdown\n• Colored segments show disease contributions\n• Compare regions to identify program strengths\n• Identify areas needing vaccination improvements">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Vaccination Coverage by Region (% Distribution)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <StackedBarChart
              data={chartData2WithDiseases}
              dataKey="vaccinationRate"
              nameKey="region"
              diseaseKey="disease"
              uniqueDiseases={uniqueDiseasesVax}
              xAxisLabel="Region"
              yAxisLabel="Rate (%)"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>

      {/* Individual Disease Comparison Charts (when 2 or more diseases selected) */}
      {diseaseComparisonCharts.length >= 2 && (
        <div className="mb-6">
          <div className="mb-4">
            <InfoTooltip content="• Individual pie charts for each selected disease\n• Shows regional vaccination coverage per disease\n• Compare regional performance between diseases\n• Identify regions excelling or struggling\n• Analyze disease-specific vaccination patterns">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
                Disease Comparison: Regional Vaccination Coverage
              </h2>
            </InfoTooltip>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {diseaseComparisonCharts.map((comparison) => (
              <div key={comparison.disease} className={`p-5 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
                <div className="mb-4">
                  <InfoTooltip content={`• Shows regional coverage distribution for ${comparison.disease}\n• Each slice represents a region\n• Slice size indicates proportion of total coverage\n• Identify regions with highest coverage rates\n• Compare regional contributions to vaccination success`}>
                    <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                      {comparison.disease} - Coverage by Region
                    </h3>
                  </InfoTooltip>
                </div>
                <div className="h-[calc(100%-75px)]">
                  <PieChart
                    data={comparison.data}
                    dataKey="vaccinationRate"
                    nameKey="region"
                    showCountry={selectedCountries.length > 0 ? selectedCountries : false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`p-5 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-4">
          <InfoTooltip content="• Tracks vaccination and coverage rate trends over time\n• Two lines show performance changes\n• Identify improving or declining trends\n• Evaluate impact of vaccination campaigns\n• Rising lines = increasing coverage, declining = decreasing rates">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              Vaccination Rate Trend Over Time (%)
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-40px)]">
          <LineChart
            data={chartData3}
            dataKeys={['vaccinationRate', 'coverageRate']}
            nameKey="year"
            colors={getChartColors(2)}
            xAxisLabel="Year"
            yAxisLabel="Rate (%)"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
          />
        </div>
      </div>

    </div>
  )
}
