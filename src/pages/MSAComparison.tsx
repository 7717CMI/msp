import { useState, useMemo } from 'react'
import { ArrowLeft, PieChart as PieChartIcon } from 'lucide-react'
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

interface MSAComparisonProps {
  onNavigate: (page: string) => void
}

export function MSAComparison({ onNavigate }: MSAComparisonProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = getData()
  
  const [filters, setFilters] = useState<FilterOptions>({
    year: [],
    disease: [],
    region: [],
    brand: [],
    country: [],
  })

  const filteredData = useMemo(() => {
    return filterDataframe(data, filters)
  }, [data, filters])

  // Check if country filter is active (one or more countries)
  const hasCountryFilter = filters.country && filters.country.length > 0
  const selectedCountries = filters.country && filters.country.length > 0 ? filters.country : []

  // Brand to disease mapping
  const brandToDiseaseMap: Record<string, string[]> = {
    "Engerix-B": ["HBV"],
    "Heplisav-B": ["HBV"],
    "Recombivax HB": ["HBV"],
    "Twinrix": ["HBV"],
    "Shingrix": ["Herpes"],
    "Zostavax": ["Herpes"],
    "Typbar TCV": ["TCV"],
    "Typhim Vi": ["TCV"],
    "Vivotif": ["TCV"],
    "Gardasil 9": ["HPV"],
    "Cervarix": ["HPV"],
    "Fluzone": ["Influenza"],
    "Flucelvax": ["Influenza"],
    "FluMist": ["Influenza"],
    "Fluad": ["Influenza"],
    "Prevnar 13": ["Pneumococcal"],
    "Prevnar 20": ["Pneumococcal"],
    "Pneumovax 23": ["Pneumococcal"],
    "Synflorix": ["Pneumococcal"],
    "M-M-R II": ["MMR"],
    "Priorix": ["MMR"],
    "RotaTeq": ["Rotavirus"],
    "Rotarix": ["Rotavirus"],
    "Bexsero": ["Meningococcal"],
    "Trumenba": ["Meningococcal"],
    "MenACWY": ["Meningococcal"],
    "Varivax": ["Varicella"],
    "ProQuad": ["Varicella"],
  }

  const uniqueOptions = useMemo(() => {
    // Filter brands based on selected diseases
    let availableBrands = [...new Set(data.map(d => d.brand))].sort()
    
    if (filters.disease && filters.disease.length > 0) {
      // Only show brands related to selected diseases
      const relatedBrands = new Set<string>()
      filters.disease.forEach((disease: string) => {
        Object.entries(brandToDiseaseMap).forEach(([brand, diseases]) => {
          if (diseases.includes(disease)) {
            relatedBrands.add(brand)
          }
        })
      })
      availableBrands = Array.from(relatedBrands).sort()
    }
    
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
      brands: availableBrands,
      countries: availableCountries,
    }
  }, [data, filters.disease, filters.region])

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

  // Grouped options for brands (by disease)
  const groupedBrands = useMemo(() => {
    const diseaseMap = new Map<string, Set<string>>()
    
    if (filters.disease && filters.disease.length > 0) {
      const relatedBrands = new Set<string>()
      filters.disease.forEach((disease: string) => {
        Object.entries(brandToDiseaseMap).forEach(([brand, diseases]) => {
          if (diseases.includes(disease)) {
            relatedBrands.add(brand)
          }
        })
      })
      
      filters.disease.forEach((disease: string) => {
        const brandsForDisease = Array.from(relatedBrands).filter(brand => 
          brandToDiseaseMap[brand]?.includes(disease)
        )
        if (brandsForDisease.length > 0) {
          diseaseMap.set(disease, new Set(brandsForDisease))
        }
      })
    } else {
      Object.entries(brandToDiseaseMap).forEach(([brand, diseases]) => {
        diseases.forEach(disease => {
          if (!diseaseMap.has(disease)) {
            diseaseMap.set(disease, new Set())
          }
          diseaseMap.get(disease)!.add(brand)
        })
      })
    }
    
    return Array.from(diseaseMap.entries())
      .map(([disease, brands]) => ({
        group: disease,
        items: Array.from(brands).sort()
      }))
      .sort((a, b) => a.group.localeCompare(b.group))
  }, [data, filters.disease, brandToDiseaseMap])

  const kpis = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalMarketValue: 'N/A',
        avgMarketShare: 'N/A',
        topBrand: 'N/A',
        topMarket: 'N/A',
      }
    }

    const totalMarketValue = filteredData.reduce((sum, d) => sum + (d.marketValueUsd / 1000), 0)
    const avgMarketShare = filteredData.reduce((sum, d) => sum + d.marketSharePct, 0) / filteredData.length
    
    const brandGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.brand] = (acc[d.brand] || 0) + d.marketSharePct
      return acc
    }, {})
    const topBrand = Object.entries(brandGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    
    const marketGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.disease] = (acc[d.disease] || 0) + (d.marketValueUsd / 1000)
      return acc
    }, {})
    const topMarket = Object.entries(marketGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      totalMarketValue: `${formatWithCommas(totalMarketValue, 1)}M`,
      avgMarketShare: `${formatWithCommas(avgMarketShare, 1)}%`,
      topBrand,
      topMarket,
    }
  }, [filteredData])

  const chartData1 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.disease] = (acc[d.disease] || 0) + (d.marketValueUsd / 1000)
      return acc
    }, {})
    return Object.entries(grouped).map(([disease, value]) => ({
      disease,
      value,
      country: countryForData,
    })).sort((a, b) => b.value - a.value).slice(0, 10)
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData2 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.brand] = (acc[d.brand] || 0) + (d.marketValueUsd / 1000)
      return acc
    }, {})
    return Object.entries(grouped).map(([brand, value]) => ({
      brand,
      value,
      country: countryForData,
    })).sort((a, b) => b.value - a.value).slice(0, 10)
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const brandShares = filteredData.reduce((acc: Record<string, Record<number, number>>, d) => {
      if (!acc[d.brand]) {
        acc[d.brand] = {}
      }
      if (!acc[d.brand][d.year]) {
        acc[d.brand][d.year] = 0
      }
      acc[d.brand][d.year] += d.marketSharePct
      return acc
    }, {})

    const years = [...new Set(filteredData.map(d => d.year))].sort()
    const topBrands = Object.entries(brandShares)
      .sort((a, b) => {
        const totalA = Object.values(a[1]).reduce((sum, val) => sum + val, 0)
        const totalB = Object.values(b[1]).reduce((sum, val) => sum + val, 0)
        return totalB - totalA
      })
      .slice(0, 5)
      .map(([brand]) => brand)

    return years.map(year => {
      const entry: Record<string, any> = { year: parseInt(String(year)), country: countryForData }
      topBrands.forEach(brand => {
        entry[brand] = brandShares[brand]?.[year] || 0
      })
      return entry
    })
  }, [filteredData, hasCountryFilter, filters.country])

  // Market share evolution by region
  const marketShareByRegion = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<number, Record<string, number>>, d) => {
      if (!acc[d.year]) {
        acc[d.year] = {}
      }
      acc[d.year][d.region] = (acc[d.year][d.region] || 0) + d.marketSharePct
      return acc
    }, {})
    return Object.entries(grouped).map(([year, regions]) => {
      const result: any = { year: parseInt(year), country: countryForData }
      Object.entries(regions).forEach(([region, share]) => {
        result[region] = share
      })
      return result
    }).sort((a, b) => a.year - b.year).slice(-10) // Last 10 years
  }, [filteredData, hasCountryFilter, filters.country])

  const uniqueRegions = useMemo(() => {
    return [...new Set(filteredData.map(d => d.region))].sort()
  }, [filteredData])

  // Competitive positioning - brands by market value (weighted by recent performance)
  const competitivePosition = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country && filters.country.length > 0 ? filters.country[0] : undefined
    const currentYear = Math.max(...filteredData.map(d => d.year), 2035)
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      if (!acc[d.brand]) {
        acc[d.brand] = 0
      }
      // Weight recent years more heavily (shows current competitive position)
      const yearMultiplier = 1 + ((d.year - 2025) * 0.15)
      acc[d.brand] += (d.marketValueUsd / 1000) * Math.max(0.5, yearMultiplier)
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([brand, value]) => ({ brand, value: Math.round(value), country: countryForData }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
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
        <InfoTooltip content="• Provides insights into market share and positioning\n• Analyze market value distribution across brands\n• Use filters to explore market dynamics\n• Compare brand performance and competitive landscapes\n• Understand market structure and identify opportunities">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            Market Share Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Analysis by Region, Country, Segment, and Year (%)
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
            label="Brand"
            value={filters.brand || []}
            onChange={(value) => updateFilter('brand', value)}
            options={uniqueOptions.brands}
            groupedOptions={groupedBrands}
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
            title={kpis.totalMarketValue}
            subtitle="Total Market Value (US$ Million)"
            icon={<PieChartIcon className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.avgMarketShare}
            subtitle="Average Market Share (%)"
            icon={<PieChartIcon className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topBrand}
            subtitle="Top Brand by Share"
            icon={<PieChartIcon className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topMarket}
            subtitle="Top Market by Value"
            icon={<PieChartIcon className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Displays top markets by total market value\n• Bar height represents market value in US dollars\n• Higher bars = larger markets\n• Identify biggest market opportunities\n• Understand market size distribution">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Top Markets by Value (US$ Million)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData1}
              dataKey="value"
              nameKey="disease"
              color="#0075FF"
              xAxisLabel="Market/Disease"
              yAxisLabel="Value"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Shows market value distribution by brand\n• Each slice represents a brand\n• Slice size indicates market share by value\n• Identify market leaders and brand dominance\n• See competitive landscape">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Total Market Value by Brand (% Distribution)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <PieChart
              data={chartData2}
              dataKey="value"
              nameKey="brand"
            />
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-4">
          <InfoTooltip content="• Tracks market share trends for multiple brands\n• Each line represents a brand over time\n• Identify gaining or losing brands\n• Evaluate competitive dynamics\n• Rising lines = gaining share, declining = losing position">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              Market Share Trend Over Time (%)
            </h3>
          </InfoTooltip>
        </div>
          <div className="h-[calc(100%-40px)]">
            <LineChart
              data={chartData3}
              dataKeys={chartData3 && chartData3.length > 0 ? Object.keys(chartData3[0] || {}).filter(k => k !== 'year' && k !== 'country').slice(0, 5) : []}
              nameKey="year"
              colors={getChartColors(5)}
              xAxisLabel="Year"
              yAxisLabel="Share (%)"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
      </div>

      {/* Additional Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Shows competitive positioning by market value\n• Brands ranked by market value\n• Higher bars = larger market value\n• Identify market leaders\n• Understand competitive hierarchy">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Competitive Positioning by Market Value
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={competitivePosition}
              dataKey="value"
              nameKey="brand"
              color="#8884d8"
              xAxisLabel="Brand"
              yAxisLabel="Value"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Tracks market share evolution by region\n• Each line represents a region over time\n• Identify regional market dynamics\n• Evaluate regional competitiveness\n• Understand market share shifts geographically">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Market Share Evolution by Region
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <LineChart
              data={marketShareByRegion}
              dataKeys={uniqueRegions && uniqueRegions.length > 0 ? uniqueRegions.slice(0, 5) : []}
              nameKey="year"
              colors={getChartColors(5)}
              xAxisLabel="Year"
              yAxisLabel="Share (%)"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
