import { useState, useMemo } from 'react'
import { ArrowLeft, Pill } from 'lucide-react'
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

interface BrandDemographicProps {
  onNavigate: (page: string) => void
}

export function BrandDemographic({ onNavigate }: BrandDemographicProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const data = getData()
  
  const [filters, setFilters] = useState<FilterOptions>({
    year: [],
    disease: [],
    region: [],
    brand: [],
    ageGroup: [],
    gender: [],
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
      ageGroups: [...new Set(data.map(d => (d as any).ageGroup))].sort(),
      genders: [...new Set(data.map(d => (d as any).gender))].sort(),
    }
  }, [data, filters.disease, filters.region])

  // Grouped options for countries (by region)
  const groupedCountries = useMemo(() => {
    const regionMap = new Map<string, Set<string>>()
    const allCountries = filters.region && filters.region.length > 0
      ? new Set<string>()
      : new Set([...data.map(d => d.country)])
    
    if (filters.region && filters.region.length > 0) {
      filters.region.forEach((region: string) => {
        const countriesInRegion = data
          .filter(d => d.region === region)
          .map(d => d.country)
        countriesInRegion.forEach(country => allCountries.add(country))
        
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
    let availableBrands = [...new Set(data.map(d => d.brand))].sort()
    
    if (filters.disease && filters.disease.length > 0) {
      const relatedBrands = new Set<string>()
      filters.disease.forEach((disease: string) => {
        Object.entries(brandToDiseaseMap).forEach(([brand, diseases]) => {
          if (diseases.includes(disease)) {
            relatedBrands.add(brand)
          }
        })
      })
      availableBrands = Array.from(relatedBrands).sort()
      
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
        totalMarketValue: 'N/A',
        totalRevenue: 'N/A',
        topBrand: 'N/A',
        topAgeGroup: 'N/A',
      }
    }

    const totalMarketValue = filteredData.reduce((sum, d) => sum + (d.marketValueUsd / 1000), 0)
    const totalRevenue = filteredData.reduce((sum, d) => sum + (d.revenue / 1000), 0)
    
    const brandGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.brand] = (acc[d.brand] || 0) + d.revenue
      return acc
    }, {})
    const topBrand = Object.entries(brandGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    
    const ageGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      const age = (d as any).ageGroup || 'Unknown'
      acc[age] = (acc[age] || 0) + d.revenue
      return acc
    }, {})
    const topAgeGroup = Object.entries(ageGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      totalMarketValue: `${formatWithCommas(totalMarketValue, 1)}M`,
      totalRevenue: `${formatWithCommas(totalRevenue, 1)}M`,
      topBrand,
      topAgeGroup,
    }
  }, [filteredData])

  const chartData1 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      acc[d.brand] = (acc[d.brand] || 0) + (d.revenue / 1000) // Convert to millions
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([brand, revenue]) => ({
        brand,
        revenue,
        country: countryForData,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData2 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      const gender = (d as any).gender || 'Unknown'
      acc[gender] = (acc[gender] || 0) + (d.revenue / 1000)
      return acc
    }, {})
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)
    return Object.entries(grouped).map(([gender, revenue]) => ({
      gender,
      revenue,
      percentage: total > 0 ? (revenue / total) * 100 : 0,
      country: countryForData,
    }))
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, Record<string, number>>, d) => {
      const ageGroup = (d as any).ageGroup || 'Unknown'
      if (!acc[ageGroup]) {
        acc[ageGroup] = {}
      }
      if (!acc[ageGroup][d.brand]) {
        acc[ageGroup][d.brand] = 0
      }
      acc[ageGroup][d.brand] += (d.revenue / 1000)
      return acc
    }, {})

    const ageGroups = Object.keys(grouped)
    const allBrands = new Set<string>()
    Object.values(grouped).forEach(brands => {
      Object.keys(brands).forEach(brand => allBrands.add(brand))
    })
    const topBrands = Array.from(allBrands)
      .map(brand => ({
        brand,
        total: Object.values(grouped).reduce((sum, brands) => sum + (brands[brand] || 0), 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(b => b.brand)

    return ageGroups.map(ageGroup => {
      const entry: Record<string, any> = { ageGroup, country: countryForData }
      topBrands.forEach(brand => {
        entry[brand] = grouped[ageGroup]?.[brand] || 0
      })
      return entry
    })
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
        <InfoTooltip content="• Provides insights into brand performance by demographics\n• Analyze performance across age groups and gender\n• Use filters to explore revenue patterns\n• Identify demographic preferences and segments\n• Understand market segmentation and target audiences">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            Brand-Demographic Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Brand performance by demographics
        </p>
      </motion.div>

      <DemoNotice />

      {/* Filters */}
      <div className={`p-5 rounded-lg mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            label="Age Group"
            value={(filters as any).ageGroup || []}
            onChange={(value) => setFilters({ ...filters, ageGroup: value as string[] })}
            options={uniqueOptions.ageGroups}
          />
          <FilterDropdown
            label="Gender"
            value={(filters as any).gender || []}
            onChange={(value) => setFilters({ ...filters, gender: value as string[] })}
            options={uniqueOptions.genders}
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
            icon={<Pill className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalRevenue}
            subtitle="Total Revenue (US$ Million)"
            icon={<Pill className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topBrand}
            subtitle="Top Brand by Revenue"
            icon={<Pill className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topAgeGroup}
            subtitle="Top Age Group"
            icon={<Pill className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Displays revenue for each brand\n• Bar height represents revenue in US$ millions\n• Higher bars = higher revenue brands\n• Identify top-performing brands\n• Compare revenue across brand portfolio">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Revenue by Brand (US$ Million)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData1}
              dataKey="revenue"
              nameKey="brand"
              color="#0075FF"
              xAxisLabel="Brand Name"
              yAxisLabel="Revenue"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <div className="mb-2">
            <InfoTooltip content="• Shows revenue distribution by gender\n• Each slice represents a gender category\n• Slice size indicates proportion of total revenue\n• Understand gender-based revenue patterns\n• Identify highest contributing gender segments">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
                Revenue Distribution by Gender (%)
              </h3>
            </InfoTooltip>
          </div>
          <div className="h-[calc(100%-40px)]">
            <PieChart
              data={chartData2}
              dataKey="revenue"
              nameKey="gender"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <div className="mb-2">
          <InfoTooltip content="• Displays revenue for top 10 brands by age group\n• Each line represents a brand\n• Shows revenue variation across age segments\n• Identify best-performing brands per age group\n• Analyze demographic targeting opportunities">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1 cursor-help">
              Top 10 Brands by Age Group (US$ Million)
            </h3>
          </InfoTooltip>
        </div>
        <div className="h-[calc(100%-40px)]">
          <LineChart
            data={chartData3}
            dataKeys={chartData3 && chartData3.length > 0 ? Object.keys(chartData3[0] || {}).filter(k => k !== 'ageGroup' && k !== 'country').slice(0, 10) : []}
            nameKey="ageGroup"
            colors={getChartColors(Math.min(10, chartData3 && chartData3.length > 0 ? Object.keys(chartData3[0] || {}).filter(k => k !== 'ageGroup' && k !== 'country').length : 0))}
            xAxisLabel="Age Group"
            yAxisLabel="Revenue"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
          />
        </div>
      </div>
    </div>
  )
}
