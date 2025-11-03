import { useState, useMemo } from 'react'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { getData, filterDataframe, formatWithCommas, FilterOptions } from '../utils/dataGenerator'
import { StatBox } from '../components/StatBox'
import { FilterDropdown } from '../components/FilterDropdown'
import { BarChart } from '../components/BarChart'
import { PieChart } from '../components/PieChart'
import { LineChart } from '../components/LineChart'
import { DemoNotice } from '../components/DemoNotice'
import { useTheme } from '../context/ThemeContext'
import { InfoTooltip } from '../components/InfoTooltip'
import { getChartColors } from '../utils/chartColors'

interface CAGRProps {
  onNavigate: (page: string) => void
}

export function CAGR({ onNavigate }: CAGRProps) {
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
      // Group all countries by their regions
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
      
      // Only show selected diseases
      filters.disease.forEach((disease: string) => {
        const brandsForDisease = Array.from(relatedBrands).filter(brand => 
          brandToDiseaseMap[brand]?.includes(disease)
        )
        if (brandsForDisease.length > 0) {
          diseaseMap.set(disease, new Set(brandsForDisease))
        }
      })
    } else {
      // Group all brands by their diseases
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
        avgCAGR: 'N/A',
        avgYoY: 'N/A',
        topBrand: 'N/A',
        topRegion: 'N/A',
      }
    }

    const avgCAGR = filteredData.reduce((sum, d) => sum + d.cagr, 0) / filteredData.length
    const avgYoY = filteredData.reduce((sum, d) => sum + d.yoyGrowth, 0) / filteredData.length
    
    const brandGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.brand] = (acc[d.brand] || 0) + d.cagr
      return acc
    }, {})
    const topBrand = Object.entries(brandGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    
    const regionGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.region] = (acc[d.region] || 0) + d.cagr
      return acc
    }, {})
    const topRegion = Object.entries(regionGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      avgCAGR: `${formatWithCommas(avgCAGR, 1)}%`,
      avgYoY: `${formatWithCommas(avgYoY, 1)}%`,
      topBrand,
      topRegion,
    }
  }, [filteredData])

  const chartData1 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, { total: number; count: number }>, d) => {
      if (!acc[d.brand]) {
        acc[d.brand] = { total: 0, count: 0 }
      }
      acc[d.brand].total += d.cagr
      acc[d.brand].count += 1
      return acc
    }, {})
    return Object.entries(grouped).map(([brand, data]) => ({
      brand,
      cagr: data.total / data.count,
      country: countryForData,
    })).sort((a, b) => b.cagr - a.cagr).slice(0, 10)
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData2 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.region] = (acc[d.region] || 0) + d.cagr
      return acc
    }, {})
    return Object.entries(grouped).map(([region, cagr]) => ({
      region,
      cagr,
      country: countryForData,
    }))
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<number, { total: number; count: number; yoy: number }>, d) => {
      if (!acc[d.year]) {
        acc[d.year] = { total: 0, count: 0, yoy: 0 }
      }
      acc[d.year].total += d.cagr
      acc[d.year].count += 1
      acc[d.year].yoy += d.yoyGrowth
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([year, data]) => ({
        year: parseInt(year),
        avgCAGR: data.total / data.count,
        avgYoY: data.yoy / data.count,
        country: countryForData,
      }))
      .sort((a, b) => a.year - b.year)
  }, [filteredData, hasCountryFilter, filters.country])

  // Growth leaderboard - brands with highest CAGR (weighted by market value)
  const growthLeaderboard = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, { total: number; weight: number }>, d) => {
      if (!acc[d.brand]) {
        acc[d.brand] = { total: 0, weight: 0 }
      }
      // Weight by market value to show meaningful growth
      const weight = Math.max(1, d.marketValueUsd / 1000)
      acc[d.brand].total += d.cagr * weight
      acc[d.brand].weight += weight
      return acc
    }, {})
    return Object.entries(grouped)
      .filter(([_, data]) => data.weight > 0)
      .map(([brand, data]) => ({
        brand,
        avgCAGR: data.total / data.weight,
        country: countryForData,
      }))
      .sort((a, b) => b.avgCAGR - a.avgCAGR)
      .slice(0, 10)
  }, [filteredData, hasCountryFilter, filters.country])

  const updateFilter = (key: keyof FilterOptions, value: string[] | string | number[] | number | (string | number)[]) => {
    const newFilters = { ...filters }
    
    // Convert (string | number)[] to the appropriate type based on key
    if (key === 'year' && Array.isArray(value)) {
      newFilters[key] = value.map(v => typeof v === 'string' ? parseInt(v) : v) as number[]
    } else {
      newFilters[key] = value as any
    }
    
    // If region filter changes, filter out countries that don't belong to selected regions
    if (key === 'region') {
      const selectedRegions = Array.isArray(value) ? value.map(v => String(v)) : []
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
        <InfoTooltip content="• Provides insights into compound annual growth rates\n• Analyze growth for brands, regions, and segments\n• Use filters to explore growth trends\n• Compare growth rates between brands and regions\n• Identify fastest-growing segments and opportunities">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            CAGR Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Growth rates by segments (%)
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
            title={kpis.avgCAGR}
            subtitle="Average CAGR (%)"
            icon={<TrendingUp className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.avgYoY}
            subtitle="Average YoY Growth (%)"
            icon={<TrendingUp className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topBrand}
            subtitle="Top Brand by CAGR"
            icon={<TrendingUp className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topRegion}
            subtitle="Top Region by CAGR"
            icon={<TrendingUp className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Displays CAGR for each brand\n• Bar height represents growth rate percentage\n• Higher positive values = faster-growing brands\n• Negative values = declining brands\n• Identify brands with rapid growth or decline">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                CAGR by Brand (%)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData1}
              dataKey="cagr"
              nameKey="brand"
              color="#0075FF"
              xAxisLabel="Brand"
              yAxisLabel="CAGR"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Shows CAGR distribution across regions\n• Each slice represents a region\n• Slice size indicates growth rate contribution\n• Identify fastest-growing regions\n• Understand regional growth dynamics">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Market Growth by Region (%)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <PieChart
              data={chartData2}
              dataKey="cagr"
              nameKey="region"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-4">
          <InfoTooltip content="• Tracks CAGR and YoY growth trends over time\n• Two lines show growth rate changes\n• Identify growth trends and market momentum\n• Understand growth rate fluctuations\n• Rising lines = accelerating, declining = slowing">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              CAGR Trend by Year (%)
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-40px)]">
          <LineChart
            data={chartData3}
            dataKeys={['avgCAGR', 'avgYoY']}
            nameKey="year"
            colors={getChartColors(2)}
            xAxisLabel="Year"
            yAxisLabel="Rate (%)"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
          />
        </div>
      </div>

      {/* Additional Analysis Charts */}
      <div className={`p-5 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-4">
          <InfoTooltip content="• Ranks top brands by CAGR\n• Shows fastest-growing brands in market\n• Higher bars = higher growth rates\n• Identify growth leaders and outperformers\n• Compare growth strategies across brands">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              Growth Leaderboard - Top Brands by CAGR
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-40px)]">
          <BarChart
            data={growthLeaderboard}
            dataKey="avgCAGR"
            nameKey="brand"
            color="#00C49F"
            xAxisLabel="Brand"
            yAxisLabel="CAGR"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
          />
        </div>
      </div>
    </div>
  )
}
