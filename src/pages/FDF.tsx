import { useState, useMemo } from 'react'
import { ArrowLeft, FlaskConical } from 'lucide-react'
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

interface FDFProps {
  onNavigate: (page: string) => void
}

export function FDF({ onNavigate }: FDFProps) {
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
      fdfTypes: [...new Set(data.map(d => (d as any).fdf))].sort(),
      roaTypes: [...new Set(data.map(d => (d as any).roa))].sort(),
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
        totalQuantity: 'N/A',
        totalRevenue: 'N/A',
        topFDF: 'N/A',
      }
    }

    const totalMarketValue = filteredData.reduce((sum, d) => sum + (d.marketValueUsd / 1000), 0)
    const totalQuantity = filteredData.reduce((sum, d) => sum + d.volumeUnits, 0) / 1000 // Convert to millions
    const totalRevenue = filteredData.reduce((sum, d) => sum + (d.revenue / 1000), 0) // Convert to millions
    
    const fdfGroups = filteredData.reduce((acc: Record<string, number>, d) => {
      const fdf = (d as any).fdf || 'Unknown'
      acc[fdf] = (acc[fdf] || 0) + (d.revenue / 1000)
      return acc
    }, {})
    const topFDF = Object.entries(fdfGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return {
      totalMarketValue: `${formatWithCommas(totalMarketValue, 1)}M`,
      totalQuantity: `${formatWithCommas(totalQuantity, 1)}M`,
      totalRevenue: `${formatWithCommas(totalRevenue, 1)}M`,
      topFDF,
    }
  }, [filteredData])

  // Map ROA abbreviations to full forms
  const mapROAToFullForm = (roa: string): string => {
    const roaMap: Record<string, string> = {
      'IM': 'Intramuscular',
      'SC': 'Subcutaneous',
      'Oral': 'Oral',
      'Intranasal': 'Intranasal'
    }
    return roaMap[roa] || roa
  }

  const chartData1 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, Record<string, number>>, d) => {
      const fdf = (d as any).fdf || 'Unknown'
      const roaAbbr = (d as any).roa || 'Unknown'
      const roa = mapROAToFullForm(roaAbbr)
      if (!acc[fdf]) {
        acc[fdf] = {}
      }
      if (!acc[fdf][roa]) {
        acc[fdf][roa] = 0
      }
      acc[fdf][roa] += (d.revenue / 1000) // Convert to millions
      return acc
    }, {})

    const fdfTypes = Object.keys(grouped)
    const roaTypes = new Set<string>()
    Object.values(grouped).forEach(roas => {
      Object.keys(roas).forEach(roa => roaTypes.add(roa))
    })

    return Array.from(roaTypes).map(roa => {
      const entry: Record<string, any> = { roa, country: countryForData }
      fdfTypes.forEach(fdf => {
        entry[fdf] = grouped[fdf]?.[roa] || 0
      })
      return entry
    })
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData2 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, number>, d) => {
      const fdf = (d as any).fdf || 'Unknown'
      acc[fdf] = (acc[fdf] || 0) + (d.revenue / 1000)
      return acc
    }, {})
    return Object.entries(grouped).map(([fdf, revenue]) => ({
      fdf,
      revenue,
      country: countryForData,
    }))
  }, [filteredData, hasCountryFilter, filters.country])

  const chartData3 = useMemo(() => {
    const countryForData = hasCountryFilter && filters.country ? filters.country[0] : undefined
    const grouped = filteredData.reduce((acc: Record<string, Record<number, number>>, d) => {
      const fdf = (d as any).fdf || 'Unknown'
      if (!acc[fdf]) {
        acc[fdf] = {}
      }
      if (!acc[fdf][d.year]) {
        acc[fdf][d.year] = 0
      }
      acc[fdf][d.year] += (d.revenue / 1000)
      return acc
    }, {})

    const years = [...new Set(filteredData.map(d => d.year))].sort()
    const fdfTypes = Object.keys(grouped).slice(0, 5) // Top 5 FDFs

    return years.map(year => {
      const entry: Record<string, any> = { year: parseInt(String(year)), country: countryForData }
      fdfTypes.forEach(fdf => {
        entry[fdf] = grouped[fdf]?.[year] || 0
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
        <InfoTooltip content="• Provides insights into revenue by formulation type\n• Analyze performance across dosage forms and ROA\n• Use filters to explore revenue patterns\n• Compare formulation performance over time\n• Optimize product portfolios">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            FDF Analysis
          </h1>
        </InfoTooltip>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Formulation and ROA performance
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
          <FilterDropdown
            label="Brand"
            value={filters.brand || []}
            onChange={(value) => updateFilter('brand', value)}
            options={uniqueOptions.brands}
            groupedOptions={groupedBrands}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalMarketValue}
            subtitle="Total Market Value (US$ Million)"
            icon={<FlaskConical className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalQuantity}
            subtitle="Total Quantity (Units Million)"
            icon={<FlaskConical className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.totalRevenue}
            subtitle="Total Revenue per FDF (Million US$)"
            icon={<FlaskConical className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
        <div className={`p-5 rounded-lg ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <StatBox
            title={kpis.topFDF}
            subtitle="Top FDF by Revenue"
            icon={<FlaskConical className="text-electric-blue dark:text-cyan-accent" size={26} />}
          />
        </div>
      </div>

      {/* Charts */}
      <div className={`p-3 rounded-lg h-[450px] mb-6 ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
        <InfoTooltip content="• Revenue matrix for FDF and ROA combinations\n• Each line represents an FDF type\n• Shows revenue across ROA categories\n• Identify highest-revenue FDF-ROA combinations\n• Understand formulation performance patterns">
          <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
            Revenue Matrix: FDF vs ROA (US$ Million)
          </h3>
        </InfoTooltip>
        <div className="h-[calc(100%-60px)]">
          <LineChart
            data={chartData1}
            dataKeys={chartData1 && chartData1.length > 0 ? Object.keys(chartData1[0] || {}).filter(k => k !== 'roa' && k !== 'country') : []}
            nameKey="roa"
            colors={getChartColors(chartData1 && chartData1.length > 0 ? Object.keys(chartData1[0] || {}).filter(k => k !== 'roa' && k !== 'country').length : 0)}
            xAxisLabel="Route of Administration"
            yAxisLabel="Revenue (US$ Million)"
            showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            focusDataRange={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <InfoTooltip content="• Displays revenue for each FDF type\n• Bar height represents revenue in US$ millions\n• Higher bars = higher revenue FDF types\n• Identify top-performing formulations\n• Compare profitability across dosage forms">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              Revenue by Finished Dosage Form (US$ Million)
            </h3>
          </InfoTooltip>
          <div className="h-[calc(100%-40px)]">
            <BarChart
              data={chartData2}
              dataKey="revenue"
              nameKey="fdf"
              color="#0075FF"
              xAxisLabel="Finished Dosage Form"
              yAxisLabel="Revenue (US$ Million)"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
        <div className={`p-3 rounded-lg h-[450px] ${isDark ? 'bg-navy-card' : 'bg-white border border-gray-200'}`}>
          <InfoTooltip content="• Tracks revenue trends for different FDF types\n• Each line represents an FDF type over time\n• Identify growing or declining formulation trends\n• Evaluate FDF performance over time\n• Rising lines = increasing revenue, declining = decreasing popularity">
            <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 cursor-help">
              FDF Revenue Trend Over Time (US$ Million)
            </h3>
          </InfoTooltip>
          <div className="h-[calc(100%-40px)]">
            <LineChart
              data={chartData3}
              dataKeys={chartData3 && chartData3.length > 0 ? Object.keys(chartData3[0] || {}).filter(k => k !== 'year' && k !== 'country').slice(0, 5) : []}
              nameKey="year"
              colors={getChartColors(5)}
              xAxisLabel="Year"
              yAxisLabel="Revenue (US$ Million)"
              showCountry={selectedCountries.length > 0 ? selectedCountries : false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
