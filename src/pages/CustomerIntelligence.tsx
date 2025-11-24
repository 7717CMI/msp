import { useState, useRef, useEffect } from 'react'
import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface CustomerIntelligenceProps {
  onNavigate: (page: string) => void
}

type Proposition = 'proposition1' | 'proposition2' | 'proposition3'

interface DistributorData {
  customerName: string
  companyName: string
  companySize: string
  industryArea: string
  annualRevenue: string
  geographicsFootprint: string
  keyContact: string
  designation: string
  emailAddress: string
  phoneWhatsApp: string
  linkedinProfile: string
  websiteURL: string
  // Legacy fields
  sNo?: number
  yearEstablished?: string
  headquarters?: string
  citiesRegionsCovered?: string
  ownershipType?: string
  noOfEmployees?: string
  revenueTurnover?: string
  // Current IT Infrastructure Landscape (for Proposition 1, 2 & 3)
  numberOfEndpoints?: string
  numberOfServers?: string
  cloudFootprint?: string
  dataCenterDetails?: string
  networkSize?: string
  existingSecurityStack?: string
  backupAndDRSetup?: string
  emailAndCollaborationPlatforms?: string
  businessApplicationsUsed?: string
  complianceRequirements?: string
  recentITIncidents?: string
  itRoadmapPlans?: string
  digitalTransformationInitiatives?: string
  // Current IT Support Setup (for Proposition 2 & 3)
  presenceOfInternalIT?: string
  existingMSPVendor?: string
  currentSLAsAndSupportHours?: string
  painPointsWithExistingIT?: string
  averageDowntimeIncidents?: string
  existingMonitoringTools?: string
  // Financial & Commercial Datapoints (for Proposition 3)
  itBudgetApprox?: string
  currentITSpend?: string
  currentMSPContractValue?: string
  pricingPreferences?: string
  renewalContractTimeline?: string
  budgetAvailableForOutsourcing?: string
  // Product Portfolio fields (for Proposition 2 only)
  keyProductCategories?: string
  productSegmentCapsules?: string
  priceSegment?: string
  // CMI Insights (for Proposition 3)
  customerBenchmarkingSummary?: string
  additionalCommercialNotes?: string
  // Legacy fields (kept for backward compatibility with existing data)
  keyInternationalLocalBrands?: string
  exclusiveNonExclusivePartnership?: string
  durationOfBrandPartnerships?: string
  onlineChannel?: string
  offlineChannel?: string
  northIndia?: string
  westIndia?: string
  southIndia?: string
  eastIndia?: string
  strengths?: string
  weaknesses?: string
  opportunities?: string
  threats?: string
  futureExpansionPlans?: string
  competitiveBenchmarking?: string
  additionalComments?: string
  internationalNicheBrands?: string
  durationOfPartnership?: string
}

export function CustomerIntelligence({ onNavigate }: CustomerIntelligenceProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const [activeProposition, setActiveProposition] = useState<Proposition>('proposition1')
  const topScrollRef = useRef<HTMLDivElement>(null)
  const tableScrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const topScroll = topScrollRef.current
    const tableScroll = tableScrollRef.current
    
    if (topScroll && tableScroll) {
      const table = tableScroll.querySelector('table')
      if (table) {
        const scrollContent = topScroll.querySelector('div')
        if (scrollContent) {
          scrollContent.style.width = `${table.scrollWidth}px`
        }
      }
    }
  }, [activeProposition])

  // Sample data based on the image
  const proposition1Data: DistributorData[] = [
    {
      sNo: 1,
      customerName: 'R. Sharma',
      companyName: 'IndiGo (InterGlobe Aviation Ltd.)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Passenger',
      annualRevenue: '₹58,000 Cr',
      geographicsFootprint: '100+ Indian airports, 30+ International',
      keyContact: 'R. Sharma',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'infra.head@goindigo.in',
      phoneWhatsApp: '+91 90000 12345',
      linkedinProfile: 'linkedin.com/company/indigo-dxco',
      websiteURL: 'www.goindigo.in',
      numberOfEndpoints: '18,000 endpoints (crew devices, check-in systems)',
      numberOfServers: '850 servers (120 physical + 730 virtual)',
      cloudFootprint: 'Azure ~50%; AWS ~20%; GCP ~10%',
      // Legacy fields
      yearEstablished: '2018',
      headquarters: 'Haryana, India',
      citiesRegionsCovered: 'PAN India',
      ownershipType: 'Local (Indian partnership / firm)',
      noOfEmployees: '11 to 25',
      revenueTurnover: '5 to 25'
    },
    {
      sNo: 2,
      customerName: 'A. Patel',
      companyName: 'Air India (Tata Group)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Full Service Carrier',
      annualRevenue: '₹35,000 Cr',
      geographicsFootprint: '70+ domestic, 40+ international destinations',
      keyContact: 'A. Patel',
      designation: 'CDO – Chief Data Officer',
      emailAddress: 'a.patel@airindia.com',
      phoneWhatsApp: '+91 98765 43210',
      linkedinProfile: 'linkedin.com/company/airindia',
      websiteURL: 'www.airindia.com',
      numberOfEndpoints: '22,000 endpoints (check-in, crew, office systems)',
      numberOfServers: '1,200 servers (180 physical + 1,020 virtual)',
      cloudFootprint: 'Azure ~55%; AWS ~25%; GCP ~20%'
    },
    {
      sNo: 3,
      customerName: 'S. Kapoor',
      companyName: 'SpiceJet Limited',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹8,500 Cr',
      geographicsFootprint: '60+ domestic, 15+ international routes',
      keyContact: 'S. Kapoor',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 's.kapoor@spicejet.com',
      phoneWhatsApp: '+91 99887 76543',
      linkedinProfile: 'linkedin.com/company/spicejet',
      websiteURL: 'www.spicejet.com',
      numberOfEndpoints: '8,500 endpoints (airport systems, crew devices)',
      numberOfServers: '420 servers (55 physical + 365 virtual)',
      cloudFootprint: 'AWS ~60%; Azure ~30%; GCP ~10%'
    },
    {
      sNo: 4,
      customerName: 'M. Singh',
      companyName: 'Vistara (TATA-SIA Airlines Ltd)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Premium Carrier',
      annualRevenue: '₹12,000 Cr',
      geographicsFootprint: '45+ domestic, 12+ international destinations',
      keyContact: 'M. Singh',
      designation: 'CISO – Chief Information Security Officer',
      emailAddress: 'm.singh@airvistara.com',
      phoneWhatsApp: '+91 88776 65544',
      linkedinProfile: 'linkedin.com/company/airvistara',
      websiteURL: 'www.airvistara.com',
      numberOfEndpoints: '12,000 endpoints (lounges, check-in, crew tablets)',
      numberOfServers: '680 servers (85 physical + 595 virtual)',
      cloudFootprint: 'Azure ~50%; AWS ~35%; Private Cloud ~15%'
    },
    {
      sNo: 5,
      customerName: 'R. Gupta',
      companyName: 'Go First (Go Airlines India Ltd)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹6,200 Cr',
      geographicsFootprint: '35+ domestic destinations',
      keyContact: 'R. Gupta',
      designation: 'COO – Chief Operating Officer',
      emailAddress: 'r.gupta@flygofirst.com',
      phoneWhatsApp: '+91 77665 54433',
      linkedinProfile: 'linkedin.com/company/go-first',
      websiteURL: 'www.flygofirst.com',
      numberOfEndpoints: '6,800 endpoints (airport kiosks, crew systems)',
      numberOfServers: '320 servers (40 physical + 280 virtual)',
      cloudFootprint: 'AWS ~65%; Azure ~25%; GCP ~10%'
    },
    {
      sNo: 6,
      customerName: 'K. Reddy',
      companyName: 'AirAsia India',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹4,800 Cr',
      geographicsFootprint: '20+ domestic destinations',
      keyContact: 'K. Reddy',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'k.reddy@airasia.com',
      phoneWhatsApp: '+91 66554 43322',
      linkedinProfile: 'linkedin.com/company/airasia-india',
      websiteURL: 'www.airasia.com',
      numberOfEndpoints: '5,200 endpoints (check-in systems, crew devices)',
      numberOfServers: '280 servers (35 physical + 245 virtual)',
      cloudFootprint: 'AWS ~70%; Azure ~20%; GCP ~10%'
    },
    {
      sNo: 7,
      customerName: 'V. Nair',
      companyName: 'Alliance Air (Air India Regional)',
      companySize: 'SME',
      industryArea: 'Commercial Aviation – Regional Carrier',
      annualRevenue: '₹1,200 Cr',
      geographicsFootprint: '70+ remote & Tier-2/3 cities',
      keyContact: 'V. Nair',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'v.nair@allianceair.in',
      phoneWhatsApp: '+91 55443 32211',
      linkedinProfile: 'linkedin.com/company/alliance-air',
      websiteURL: 'www.allianceair.in',
      numberOfEndpoints: '3,500 endpoints (regional airports, crew devices)',
      numberOfServers: '180 servers (22 physical + 158 virtual)',
      cloudFootprint: 'Azure ~60%; AWS ~30%; Private ~10%'
    },
    {
      sNo: 8,
      customerName: 'D. Joshi',
      companyName: 'Akasa Air',
      companySize: 'SME',
      industryArea: 'Commercial Aviation – Ultra Low Cost Carrier',
      annualRevenue: '₹2,800 Cr',
      geographicsFootprint: '22+ domestic destinations (rapidly expanding)',
      keyContact: 'D. Joshi',
      designation: 'CDO – Chief Data Officer',
      emailAddress: 'd.joshi@akasaair.com',
      phoneWhatsApp: '+91 44332 21100',
      linkedinProfile: 'linkedin.com/company/akasa-air',
      websiteURL: 'www.akasaair.com',
      numberOfEndpoints: '4,200 endpoints (modern digital-first airline)',
      numberOfServers: '240 servers (28 physical + 212 virtual)',
      cloudFootprint: 'AWS ~75%; Azure ~15%; GCP ~10%'
    },
    {
      sNo: 9,
      customerName: 'P. Malhotra',
      companyName: 'Air India Express',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Int. Carrier',
      annualRevenue: '₹5,500 Cr',
      geographicsFootprint: '30+ domestic, 35+ international (Middle East, SE Asia)',
      keyContact: 'P. Malhotra',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'p.malhotra@airindiaexpress.in',
      phoneWhatsApp: '+91 33221 10099',
      linkedinProfile: 'linkedin.com/company/air-india-express',
      websiteURL: 'www.airindiaexpress.in',
      numberOfEndpoints: '7,500 endpoints (international airports, crew systems)',
      numberOfServers: '380 servers (48 physical + 332 virtual)',
      cloudFootprint: 'Azure ~55%; AWS ~30%; GCP ~15%'
    }
  ]

  // Proposition 2 data with Product Portfolio
  const proposition2Data: DistributorData[] = [
    {
      sNo: 1,
      customerName: 'R. Sharma',
      companyName: 'IndiGo (InterGlobe Aviation Ltd.)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Passenger',
      annualRevenue: '₹58,000 Cr',
      geographicsFootprint: '100+ Indian airports, 30+ International',
      keyContact: 'R. Sharma',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'infra.head@goindigo.in',
      phoneWhatsApp: '+91 90000 12345',
      linkedinProfile: 'linkedin.com/company/indigo-dxco',
      websiteURL: 'www.goindigo.in',
      numberOfEndpoints: '18,000 endpoints (crew devices, check-in systems)',
      numberOfServers: '850 servers (120 physical + 730 virtual)',
      cloudFootprint: 'Azure ~50%; AWS ~20%; GCP ~10%',
      dataCenterDetails: 'Primary DC: Gurgaon, DR DC: 10+',
      networkSize: 'Routers: 250+; Switches: 300+;',
      existingSecurityStack: 'Intender SOC: ATP, Palo Alto, NGFv',
      presenceOfInternalIT: '20+ members across Infrastructure',
      existingMSPVendor: 'Multiple MSPs - airport IT, 10 mins',
      currentSLAsAndSupportHours: '24x7x365 P1 response < 15 mins',
      // Legacy fields
      yearEstablished: '2018',
      headquarters: 'Haryana, India',
      citiesRegionsCovered: 'PAN India',
      ownershipType: 'Local (Indian partnership / firm)',
      noOfEmployees: '11 to 25',
      revenueTurnover: '5 to 25',
      keyProductCategories: 'Lactobacillus (Lactobacillus acidophilus)',
      productSegmentCapsules: 'Capsules',
      priceSegment: 'Mid'
    },
    {
      sNo: 2,
      customerName: 'A. Patel',
      companyName: 'Air India (Tata Group)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Full Service Carrier',
      annualRevenue: '₹35,000 Cr',
      geographicsFootprint: '70+ domestic, 40+ international destinations',
      keyContact: 'A. Patel',
      designation: 'CDO – Chief Data Officer',
      emailAddress: 'a.patel@airindia.com',
      phoneWhatsApp: '+91 98765 43210',
      linkedinProfile: 'linkedin.com/company/airindia',
      websiteURL: 'www.airindia.com',
      numberOfEndpoints: '22,000 endpoints (check-in, crew, office systems)',
      numberOfServers: '1,200 servers (180 physical + 1,020 virtual)',
      cloudFootprint: 'Azure ~55%; AWS ~25%; GCP ~20%',
      dataCenterDetails: 'Primary DC: Mumbai, Delhi; DR: Bangalore',
      networkSize: 'Routers: 380+; Switches: 520+; SD-WAN: 85+',
      existingSecurityStack: 'Cisco Umbrella, Palo Alto, Symantec, SIEM',
      presenceOfInternalIT: '80+ IT infrastructure & operations team',
      existingMSPVendor: 'TCS for legacy systems, IBM for mainframes',
      currentSLAsAndSupportHours: '24x7x365, P1 < 20 mins (flight operations)'
    },
    {
      sNo: 3,
      customerName: 'S. Kapoor',
      companyName: 'SpiceJet Limited',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹8,500 Cr',
      geographicsFootprint: '60+ domestic, 15+ international routes',
      keyContact: 'S. Kapoor',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 's.kapoor@spicejet.com',
      phoneWhatsApp: '+91 99887 76543',
      linkedinProfile: 'linkedin.com/company/spicejet',
      websiteURL: 'www.spicejet.com',
      numberOfEndpoints: '8,500 endpoints (airport systems, crew devices)',
      numberOfServers: '420 servers (55 physical + 365 virtual)',
      cloudFootprint: 'AWS ~60%; Azure ~30%; GCP ~10%',
      dataCenterDetails: 'Primary DC: Gurgaon; DR: Hyderabad',
      networkSize: 'Routers: 180+; Switches: 240+; WAN links',
      existingSecurityStack: 'FortiGate, Sophos, Microsoft Defender',
      presenceOfInternalIT: '35+ IT operations team',
      existingMSPVendor: 'HCL for infrastructure, local vendors',
      currentSLAsAndSupportHours: '24x7, P1 < 30 mins'
    },
    {
      sNo: 4,
      customerName: 'M. Singh',
      companyName: 'Vistara (TATA-SIA Airlines Ltd)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Premium Carrier',
      annualRevenue: '₹12,000 Cr',
      geographicsFootprint: '45+ domestic, 12+ international destinations',
      keyContact: 'M. Singh',
      designation: 'CISO – Chief Information Security Officer',
      emailAddress: 'm.singh@airvistara.com',
      phoneWhatsApp: '+91 88776 65544',
      linkedinProfile: 'linkedin.com/company/airvistara',
      websiteURL: 'www.airvistara.com',
      numberOfEndpoints: '12,000 endpoints (lounges, check-in, crew tablets)',
      numberOfServers: '680 servers (85 physical + 595 virtual)',
      cloudFootprint: 'Azure ~50%; AWS ~35%; Private Cloud ~15%',
      dataCenterDetails: 'Primary DC: Delhi; DR: Mumbai',
      networkSize: 'Routers: 220+; Switches: 310+; SD-WAN',
      existingSecurityStack: 'Palo Alto, Cisco ISE, Trend Micro',
      presenceOfInternalIT: '45+ IT & digital transformation team',
      existingMSPVendor: 'Singapore Airlines IT, TCS selective',
      currentSLAsAndSupportHours: '24x7x365, P1 < 20 mins, premium support'
    },
    {
      sNo: 5,
      customerName: 'R. Gupta',
      companyName: 'Go First (Go Airlines India Ltd)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹6,200 Cr',
      geographicsFootprint: '35+ domestic destinations',
      keyContact: 'R. Gupta',
      designation: 'COO – Chief Operating Officer',
      emailAddress: 'r.gupta@flygofirst.com',
      phoneWhatsApp: '+91 77665 54433',
      linkedinProfile: 'linkedin.com/company/go-first',
      websiteURL: 'www.flygofirst.com',
      numberOfEndpoints: '6,800 endpoints (airport kiosks, crew systems)',
      numberOfServers: '320 servers (40 physical + 280 virtual)',
      cloudFootprint: 'AWS ~65%; Azure ~25%; GCP ~10%',
      dataCenterDetails: 'Primary DC: Mumbai; DR: Bangalore',
      networkSize: 'Routers: 140+; Switches: 190+',
      existingSecurityStack: 'FortiGate, Kaspersky, AWS Security',
      presenceOfInternalIT: '25+ IT team',
      existingMSPVendor: 'Wipro for managed services',
      currentSLAsAndSupportHours: '24x7, P1 < 45 mins'
    },
    {
      sNo: 6,
      customerName: 'K. Reddy',
      companyName: 'AirAsia India',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹4,800 Cr',
      geographicsFootprint: '20+ domestic destinations',
      keyContact: 'K. Reddy',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'k.reddy@airasia.com',
      phoneWhatsApp: '+91 66554 43322',
      linkedinProfile: 'linkedin.com/company/airasia-india',
      websiteURL: 'www.airasia.com',
      numberOfEndpoints: '5,200 endpoints (check-in systems, crew devices)',
      numberOfServers: '280 servers (35 physical + 245 virtual)',
      cloudFootprint: 'AWS ~70%; Azure ~20%; GCP ~10%',
      dataCenterDetails: 'Primary DC: Bangalore; Cloud-heavy',
      networkSize: 'Routers: 110+; Switches: 150+',
      existingSecurityStack: 'AWS WAF, CloudFlare, Sophos',
      presenceOfInternalIT: '20+ IT support team',
      existingMSPVendor: 'AirAsia Group IT, local MSP',
      currentSLAsAndSupportHours: '24x7, P1 < 1 hr'
    },
    {
      sNo: 7,
      customerName: 'V. Nair',
      companyName: 'Alliance Air (Air India Regional)',
      companySize: 'SME',
      industryArea: 'Commercial Aviation – Regional Carrier',
      annualRevenue: '₹1,200 Cr',
      geographicsFootprint: '70+ remote & Tier-2/3 cities',
      keyContact: 'V. Nair',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'v.nair@allianceair.in',
      phoneWhatsApp: '+91 55443 32211',
      linkedinProfile: 'linkedin.com/company/alliance-air',
      websiteURL: 'www.allianceair.in',
      numberOfEndpoints: '3,500 endpoints (regional airports, crew devices)',
      numberOfServers: '180 servers (22 physical + 158 virtual)',
      cloudFootprint: 'Azure ~60%; AWS ~30%; Private ~10%',
      dataCenterDetails: 'Shared DC with Air India',
      networkSize: 'Routers: 90+; Switches: 120+',
      existingSecurityStack: 'Basic firewall, Symantec',
      presenceOfInternalIT: '12+ IT staff',
      existingMSPVendor: 'Air India IT support',
      currentSLAsAndSupportHours: '16x5, P1 < 2 hrs'
    },
    {
      sNo: 8,
      customerName: 'D. Joshi',
      companyName: 'Akasa Air',
      companySize: 'SME',
      industryArea: 'Commercial Aviation – Ultra Low Cost Carrier',
      annualRevenue: '₹2,800 Cr',
      geographicsFootprint: '22+ domestic destinations (rapidly expanding)',
      keyContact: 'D. Joshi',
      designation: 'CDO – Chief Data Officer',
      emailAddress: 'd.joshi@akasaair.com',
      phoneWhatsApp: '+91 44332 21100',
      linkedinProfile: 'linkedin.com/company/akasa-air',
      websiteURL: 'www.akasaair.com',
      numberOfEndpoints: '4,200 endpoints (modern digital-first airline)',
      numberOfServers: '240 servers (28 physical + 212 virtual)',
      cloudFootprint: 'AWS ~75%; Azure ~15%; GCP ~10%',
      dataCenterDetails: 'Cloud-first, minimal on-prem',
      networkSize: 'Routers: 80+; SD-WAN focused',
      existingSecurityStack: 'AWS Security, Zscaler, Modern stack',
      presenceOfInternalIT: '18+ digital-first IT team',
      existingMSPVendor: 'AWS Professional Services',
      currentSLAsAndSupportHours: '24x7, P1 < 30 mins, agile support'
    },
    {
      sNo: 9,
      customerName: 'P. Malhotra',
      companyName: 'Air India Express',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Int. Carrier',
      annualRevenue: '₹5,500 Cr',
      geographicsFootprint: '30+ domestic, 35+ international (Middle East, SE Asia)',
      keyContact: 'P. Malhotra',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'p.malhotra@airindiaexpress.in',
      phoneWhatsApp: '+91 33221 10099',
      linkedinProfile: 'linkedin.com/company/air-india-express',
      websiteURL: 'www.airindiaexpress.in',
      numberOfEndpoints: '7,500 endpoints (international airports, crew systems)',
      numberOfServers: '380 servers (48 physical + 332 virtual)',
      cloudFootprint: 'Azure ~55%; AWS ~30%; GCP ~15%',
      dataCenterDetails: 'Primary DC: Kochi; DR: Mumbai',
      networkSize: 'Routers: 160+; Switches: 220+',
      existingSecurityStack: 'Cisco ASA, Microsoft Defender, SIEM',
      presenceOfInternalIT: '30+ IT operations team',
      existingMSPVendor: 'Air India shared services, TCS',
      currentSLAsAndSupportHours: '24x7, P1 < 30 mins'
    }
  ]

  // Proposition 3 data with all sections
  const proposition3Data: DistributorData[] = [
    {
      sNo: 1,
      customerName: 'R. Sharma',
      companyName: 'IndiGo (InterGlobe Aviation Ltd.)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Passenger',
      annualRevenue: '₹58,000 Cr',
      geographicsFootprint: '100+ Indian airports, 30+ International',
      keyContact: 'R. Sharma',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'infra.head@goindigo.in',
      phoneWhatsApp: '+91 90000 12345',
      linkedinProfile: 'linkedin.com/company/indigo-dxco',
      websiteURL: 'www.goindigo.in',
      numberOfEndpoints: '18,000 endpoints (crew devices, check-in systems)',
      numberOfServers: '850 servers (120 physical + 730 virtual)',
      cloudFootprint: 'Azure ~50%; AWS ~20%; GCP ~10%',
      dataCenterDetails: 'Primary DC: Gurgaon, DR DC: 10+',
      networkSize: 'Routers: 250+; Switches: 300+;',
      existingSecurityStack: 'Intender SOC: ATP, Palo Alto, NGFv',
      itBudgetApprox: '~₹600 Cr',
      existingMSPVendor: 'Multiple MSPs - airport IT',
      currentSLAsAndSupportHours: '24x7x365 P1 response < 15 mins',
      painPointsWithExistingIT: 'Airport network congestion on peak',
      averageDowntimeIncidents: '~15-20 major incidents (airport WAN, DB alert)',
      existingMonitoringTools: 'Dynatrace, SolarWinds, OBadar, New',
      currentITSpend: 'OPEX 80% / CAPEX 20%',
      currentMSPContractValue: '~₹40-45 Cr across MSPs (breakdown)',
      pricingPreferences: 'Mostly fixed cost, tier-consumption',
      renewalContractTimeline: 'FY 2026',
      budgetAvailableForOutsourcing: 'High (continuous bids)',
      customerBenchmarkingSummary: 'Benchmark: Alt.trade, focusing on route...',
      additionalCommercialNotes: 'Agile; focusing on route...',
      // Legacy fields
      yearEstablished: '2018',
      headquarters: 'Haryana, India',
      citiesRegionsCovered: 'PAN India',
      ownershipType: 'Local (Indian partnership / firm)',
      noOfEmployees: '11 to 25',
      revenueTurnover: '5 to 25',
      keyProductCategories: 'Lactobacillus and Bifidobacterium',
      productSegmentCapsules: 'Capsules',
      priceSegment: 'Mid',
      keyInternationalLocalBrands: 'Local',
      exclusiveNonExclusivePartnership: 'NA',
      durationOfBrandPartnerships: 'NA',
      onlineChannel: 'Yes (IndiaMART)',
      offlineChannel: 'Retail pharmacies, and local distribution',
      northIndia: 'Yes',
      westIndia: 'Yes',
      southIndia: 'Yes',
      eastIndia: 'Yes',
      strengths: 'Wide Product Portfolio: Offers a variety of products, including tablets, capsules, syrups, and injectables, catering to diverse needs. Broad national distribution network. Focus on health supplements.',
      weaknesses: 'Lack of Clear Branding for Probiotics: Limited public information on specific probiotics brands they distribute, making it Limited publicly available information. No clear digital presence or e-commerce focus.',
      opportunities: 'E-commerce Expansion: With the increasing trend of online shopping, they can tap into e-commerce platforms to distribute probiotics and other products. Expanding probiotics offerings as the demand for gut health grows in India. Potential for partnerships with international brands.',
      threats: 'Price Sensitivity: The probiotics market is price-sensitive, and maintaining competitive pricing while ensuring quality can be challenging. Intense competition in the health supplement and probiotics market. Regulatory challenges in supplement distribution.',
      futureExpansionPlans: 'Yes',
      competitiveBenchmarking: 'Top-tier / Mid-tier / Niche Emerging national-distributor / wholesaler / Likely Mid-tier distributor',
      additionalComments: 'NA'
    },
    {
      sNo: 2,
      customerName: 'A. Patel',
      companyName: 'Air India (Tata Group)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Full Service Carrier',
      annualRevenue: '₹35,000 Cr',
      geographicsFootprint: '70+ domestic, 40+ international destinations',
      keyContact: 'A. Patel',
      designation: 'CDO – Chief Data Officer',
      emailAddress: 'a.patel@airindia.com',
      phoneWhatsApp: '+91 98765 43210',
      linkedinProfile: 'linkedin.com/company/airindia',
      websiteURL: 'www.airindia.com',
      numberOfEndpoints: '22,000 endpoints (check-in, crew, office systems)',
      numberOfServers: '1,200 servers (180 physical + 1,020 virtual)',
      cloudFootprint: 'Azure ~55%; AWS ~25%; GCP ~20%',
      dataCenterDetails: 'Primary DC: Mumbai, Delhi; DR: Bangalore',
      networkSize: 'Routers: 380+; Switches: 520+; SD-WAN: 85+',
      existingSecurityStack: 'Cisco Umbrella, Palo Alto, Symantec, SIEM',
      itBudgetApprox: '~₹450 Cr',
      existingMSPVendor: 'TCS for legacy systems, IBM for mainframes',
      currentSLAsAndSupportHours: '24x7x365, P1 < 20 mins (flight operations)',
      painPointsWithExistingIT: 'Legacy system modernization challenges',
      averageDowntimeIncidents: '~12-15 incidents (mostly legacy systems)',
      existingMonitoringTools: 'IBM Tivoli, SolarWinds, ServiceNow',
      currentITSpend: 'OPEX 75% / CAPEX 25%',
      currentMSPContractValue: '~₹35-40 Cr across multiple vendors',
      pricingPreferences: 'Fixed cost with performance SLAs',
      renewalContractTimeline: 'FY 2025-26',
      budgetAvailableForOutsourcing: 'High - modernization focus',
      customerBenchmarkingSummary: 'Benchmark: Emirates, Singapore Airlines',
      additionalCommercialNotes: 'Tata merger - major IT transformation underway'
    },
    {
      sNo: 3,
      customerName: 'S. Kapoor',
      companyName: 'SpiceJet Limited',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹8,500 Cr',
      geographicsFootprint: '60+ domestic, 15+ international routes',
      keyContact: 'S. Kapoor',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 's.kapoor@spicejet.com',
      phoneWhatsApp: '+91 99887 76543',
      linkedinProfile: 'linkedin.com/company/spicejet',
      websiteURL: 'www.spicejet.com',
      numberOfEndpoints: '8,500 endpoints (airport systems, crew devices)',
      numberOfServers: '420 servers (55 physical + 365 virtual)',
      cloudFootprint: 'AWS ~60%; Azure ~30%; GCP ~10%',
      dataCenterDetails: 'Primary DC: Gurgaon; DR: Hyderabad',
      networkSize: 'Routers: 180+; Switches: 240+; WAN links',
      existingSecurityStack: 'FortiGate, Sophos, Microsoft Defender',
      itBudgetApprox: '~₹110 Cr',
      existingMSPVendor: 'HCL for infrastructure, local vendors',
      currentSLAsAndSupportHours: '24x7, P1 < 30 mins',
      painPointsWithExistingIT: 'Cost optimization challenges, scalability',
      averageDowntimeIncidents: '~18-22 incidents (network, system)',
      existingMonitoringTools: 'Nagios, AWS CloudWatch, basic tools',
      currentITSpend: 'OPEX 85% / CAPEX 15%',
      currentMSPContractValue: '~₹12-15 Cr',
      pricingPreferences: 'Per-user, consumption-based model',
      renewalContractTimeline: 'FY 2025',
      budgetAvailableForOutsourcing: 'Medium - cost-sensitive',
      customerBenchmarkingSummary: 'Benchmark: Ryanair, EasyJet (LCC model)',
      additionalCommercialNotes: 'Focus on cost-effective IT solutions'
    },
    {
      sNo: 4,
      customerName: 'P. Mehta',
      companyName: 'Vistara (TATA-SIA Airlines Ltd)',
      companySize: 'Large Enterprise',
      industryArea: 'Commercial Aviation – Full Service',
      annualRevenue: '₹6,200 Cr',
      geographicsFootprint: '45+ domestic, 15+ international (Asia-Pacific)',
      keyContact: 'P. Mehta',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'p.mehta@airvistara.com',
      phoneWhatsApp: '+91 88776 54321',
      linkedinProfile: 'linkedin.com/in/pmehta-vistara',
      websiteURL: 'www.airvistara.com',
      numberOfEndpoints: '7,500 endpoints (crew tablets, lounges, offices)',
      numberOfServers: '380 servers (55 physical + 325 virtual)',
      cloudFootprint: 'Azure ~55%; AWS ~25%; Private Cloud ~20%',
      dataCenterDetails: 'Primary DC: Gurgaon; DR: Bangalore',
      networkSize: 'Routers: 120+; Switches: 160+; SD-WAN',
      existingSecurityStack: 'Fortinet, Microsoft Defender, SIEM',
      presenceOfInternalIT: '32+ IT infrastructure team',
      existingMSPVendor: 'TCS for infra, Wipro for apps',
      currentSLAsAndSupportHours: '24x7x365, P1 < 20 mins',
      itBudgetApprox: '~₹95 Cr',
      painPointsWithExistingIT: 'Legacy system integration, app modernization',
      averageDowntimeIncidents: '~12-15 incidents (network, legacy system)',
      existingMonitoringTools: 'Dynatrace, Azure Monitor, custom dashboards',
      currentITSpend: 'OPEX 75% / CAPEX 25%',
      currentMSPContractValue: '~₹18-22 Cr',
      pricingPreferences: 'Hybrid: fixed base + variable consumption',
      renewalContractTimeline: 'FY 2025 Q4',
      budgetAvailableForOutsourcing: 'Medium-High (strategic partnerships)',
      customerBenchmarkingSummary: 'Benchmark: Singapore Airlines, ANA',
      additionalCommercialNotes: 'Focus on premium service excellence'
    },
    {
      sNo: 5,
      customerName: 'K. Iyer',
      companyName: 'Go First (Go Airlines India Ltd)',
      companySize: 'Medium Enterprise',
      industryArea: 'Commercial Aviation – Low Cost Carrier',
      annualRevenue: '₹5,800 Cr',
      geographicsFootprint: '35+ domestic airports, select international',
      keyContact: 'K. Iyer',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'k.iyer@flygofirst.com',
      phoneWhatsApp: '+91 77665 43210',
      linkedinProfile: 'linkedin.com/in/kiyer-gofirst',
      websiteURL: 'www.flygofirst.com',
      numberOfEndpoints: '4,200 endpoints (check-in, crew devices)',
      numberOfServers: '210 servers (28 physical + 182 virtual)',
      cloudFootprint: 'AWS ~60%; Azure ~25%; On-prem ~15%',
      dataCenterDetails: 'Primary: Mumbai; DR: Bangalore',
      networkSize: 'Routers: 85+; Switches: 110+',
      existingSecurityStack: 'Sophos, Cloudflare, basic monitoring',
      presenceOfInternalIT: '18+ IT support team',
      existingMSPVendor: 'Local MSPs for infrastructure',
      currentSLAsAndSupportHours: '24x7, P1 < 45 mins',
      itBudgetApprox: '~₹58 Cr',
      painPointsWithExistingIT: 'Financial constraints, operational challenges',
      averageDowntimeIncidents: '~20-25 incidents (budget constraints)',
      existingMonitoringTools: 'Basic monitoring, AWS CloudWatch',
      currentITSpend: 'OPEX 90% / CAPEX 10%',
      currentMSPContractValue: '~₹8-10 Cr',
      pricingPreferences: 'Pay-as-you-go, minimal commitment',
      renewalContractTimeline: 'Under restructuring',
      budgetAvailableForOutsourcing: 'Low – operational challenges',
      customerBenchmarkingSummary: 'Benchmark: Budget carriers (cost-focused)',
      additionalCommercialNotes: 'Undergoing financial restructuring'
    },
    {
      sNo: 6,
      customerName: 'M. Rao',
      companyName: 'AirAsia India',
      companySize: 'Medium Enterprise',
      industryArea: 'Commercial Aviation – Ultra Low Cost',
      annualRevenue: '₹3,200 Cr',
      geographicsFootprint: '22+ domestic routes',
      keyContact: 'M. Rao',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'm.rao@airasia.co.in',
      phoneWhatsApp: '+91 66554 32109',
      linkedinProfile: 'linkedin.com/in/mrao-airasia',
      websiteURL: 'www.airasia.co.in',
      numberOfEndpoints: '2,800 endpoints (lean operations)',
      numberOfServers: '145 servers (18 physical + 127 virtual)',
      cloudFootprint: 'AWS ~75%; Azure ~15%; On-prem ~10%',
      dataCenterDetails: 'Primary: Bangalore; DR: Mumbai',
      networkSize: 'Routers: 55+; Switches: 70+',
      existingSecurityStack: 'AWS Security, Sophos, basic tools',
      presenceOfInternalIT: '12+ IT team (lean)',
      existingMSPVendor: 'AWS support, local vendors',
      currentSLAsAndSupportHours: '24x7, P1 < 1 hr',
      itBudgetApprox: '~₹32 Cr',
      painPointsWithExistingIT: 'Ultra-lean operations, cost optimization',
      averageDowntimeIncidents: '~15-18 incidents (acceptable for model)',
      existingMonitoringTools: 'AWS native tools, minimal SIEM',
      currentITSpend: 'OPEX 95% / CAPEX 5%',
      currentMSPContractValue: '~₹4-5 Cr',
      pricingPreferences: 'Consumption-based, no frills',
      renewalContractTimeline: 'FY 2025',
      budgetAvailableForOutsourcing: 'Very Low (ultra-cost-sensitive)',
      customerBenchmarkingSummary: 'Benchmark: AirAsia Group (ULCC model)',
      additionalCommercialNotes: 'Extreme cost discipline required'
    },
    {
      sNo: 7,
      customerName: 'D. Singh',
      companyName: 'Alliance Air (Air India Regional)',
      companySize: 'Small-Medium Enterprise',
      industryArea: 'Regional Aviation – Government Subsidiary',
      annualRevenue: '₹1,200 Cr',
      geographicsFootprint: '50+ tier-2/tier-3 cities, remote connectivity',
      keyContact: 'D. Singh',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'd.singh@allianceair.in',
      phoneWhatsApp: '+91 55443 21098',
      linkedinProfile: 'linkedin.com/in/dsingh-alliance',
      websiteURL: 'www.allianceair.in',
      numberOfEndpoints: '1,800 endpoints (regional operations)',
      numberOfServers: '95 servers (12 physical + 83 virtual)',
      cloudFootprint: 'Government Cloud ~50%; On-prem ~40%; Azure ~10%',
      dataCenterDetails: 'Primary: Delhi; DR: Mumbai (shared with Air India)',
      networkSize: 'Routers: 45+; Switches: 55+; Regional networks',
      existingSecurityStack: 'Basic govt-compliant security, shared with AI',
      presenceOfInternalIT: '8+ IT team (shared resources with Air India)',
      existingMSPVendor: 'Air India shared services',
      currentSLAsAndSupportHours: '24x7, P1 < 2 hrs (regional focus)',
      itBudgetApprox: '~₹15 Cr',
      painPointsWithExistingIT: 'Limited budget, remote connectivity issues',
      averageDowntimeIncidents: '~25-30 incidents (remote locations)',
      existingMonitoringTools: 'Basic monitoring, shared with Air India',
      currentITSpend: 'OPEX 85% / CAPEX 15%',
      currentMSPContractValue: '~₹2-3 Cr',
      pricingPreferences: 'Government procurement, fixed cost',
      renewalContractTimeline: 'Aligned with Air India cycles',
      budgetAvailableForOutsourcing: 'Very Low (government constraints)',
      customerBenchmarkingSummary: 'Benchmark: Regional carriers (govt model)',
      additionalCommercialNotes: 'Government procurement rules apply'
    },
    {
      sNo: 8,
      customerName: 'A. Gupta',
      companyName: 'Akasa Air',
      companySize: 'Start-up / Small Enterprise',
      industryArea: 'Commercial Aviation – New Entrant LCC',
      annualRevenue: '₹800 Cr (growing)',
      geographicsFootprint: '20+ domestic airports (expanding rapidly)',
      keyContact: 'A. Gupta',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'a.gupta@akasaair.com',
      phoneWhatsApp: '+91 44332 10987',
      linkedinProfile: 'linkedin.com/in/agupta-akasa',
      websiteURL: 'www.akasaair.com',
      numberOfEndpoints: '1,200 endpoints (greenfield operations)',
      numberOfServers: '75 servers (8 physical + 67 virtual)',
      cloudFootprint: 'AWS ~80%; Azure ~15%; Hybrid ~5%',
      dataCenterDetails: 'Cloud-first: AWS Mumbai; DR: AWS Singapore',
      networkSize: 'Routers: 35+; Switches: 45+; Modern SD-WAN',
      existingSecurityStack: 'AWS Security Hub, modern cloud-native',
      presenceOfInternalIT: '15+ tech-savvy team (startup culture)',
      existingMSPVendor: 'AWS Professional Services, boutique MSPs',
      currentSLAsAndSupportHours: '24x7, P1 < 30 mins',
      itBudgetApprox: '~₹25 Cr (growing)',
      painPointsWithExistingIT: 'Rapid scaling challenges, building systems',
      averageDowntimeIncidents: '~8-10 incidents (new, well-architected)',
      existingMonitoringTools: 'AWS CloudWatch, Datadog, modern stack',
      currentITSpend: 'OPEX 100% (cloud-first)',
      currentMSPContractValue: '~₹3-5 Cr',
      pricingPreferences: 'Cloud consumption, agile partnerships',
      renewalContractTimeline: 'Annual (flexible)',
      budgetAvailableForOutsourcing: 'Medium (strategic growth)',
      customerBenchmarkingSummary: 'Benchmark: New-age carriers (tech-first)',
      additionalCommercialNotes: 'Focus on modern, scalable solutions'
    },
    {
      sNo: 9,
      customerName: 'V. Nair',
      companyName: 'Air India Express',
      companySize: 'Medium Enterprise',
      industryArea: 'Commercial Aviation – LCC International',
      annualRevenue: '₹4,500 Cr',
      geographicsFootprint: '35+ domestic + Middle East, SE Asia routes',
      keyContact: 'V. Nair',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 'v.nair@airindiaexpress.in',
      phoneWhatsApp: '+91 33221 09876',
      linkedinProfile: 'linkedin.com/in/vnair-aixpress',
      websiteURL: 'www.airindiaexpress.in',
      numberOfEndpoints: '3,500 endpoints (LCC model, international)',
      numberOfServers: '180 servers (22 physical + 158 virtual)',
      cloudFootprint: 'Azure ~45%; AWS ~30%; On-prem ~25%',
      dataCenterDetails: 'Primary: Kochi; DR: Bangalore, Mumbai',
      networkSize: 'Routers: 95+; Switches: 120+; International links',
      existingSecurityStack: 'Palo Alto, basic SIEM, compliance tools',
      presenceOfInternalIT: '22+ IT team (shared with Air India)',
      existingMSPVendor: 'Tata Consultancy Services, local vendors',
      currentSLAsAndSupportHours: '24x7, P1 < 30 mins',
      itBudgetApprox: '~₹55 Cr',
      painPointsWithExistingIT: 'Integration with Air India, legacy systems',
      averageDowntimeIncidents: '~16-20 incidents (merger transition)',
      existingMonitoringTools: 'SolarWinds, Azure Monitor, compliance tools',
      currentITSpend: 'OPEX 80% / CAPEX 20%',
      currentMSPContractValue: '~₹10-12 Cr',
      pricingPreferences: 'Fixed cost with performance SLAs',
      renewalContractTimeline: 'FY 2026 (post-merger alignment)',
      budgetAvailableForOutsourcing: 'Medium (merger synergies)',
      customerBenchmarkingSummary: 'Benchmark: Flydubai, Air Arabia (LCC intl)',
      additionalCommercialNotes: 'Merging with AIX Connect (AirAsia India)'
    },
    {
      sNo: 10,
      customerName: 'T. Reddy',
      companyName: 'Star Air (Sree Airlines)',
      companySize: 'Small Enterprise',
      industryArea: 'Regional Aviation – Scheduled Carrier',
      annualRevenue: '₹450 Cr',
      geographicsFootprint: '18+ tier-2/tier-3 cities (regional focus)',
      keyContact: 'T. Reddy',
      designation: 'CIO – Chief Information Officer',
      emailAddress: 't.reddy@starair.in',
      phoneWhatsApp: '+91 22110 98765',
      linkedinProfile: 'linkedin.com/in/treddy-starair',
      websiteURL: 'www.starair.in',
      numberOfEndpoints: '950 endpoints (regional hubs)',
      numberOfServers: '48 servers (6 physical + 42 virtual)',
      cloudFootprint: 'AWS ~65%; On-prem ~30%; Azure ~5%',
      dataCenterDetails: 'Primary: Bangalore; DR: Mumbai (limited)',
      networkSize: 'Routers: 28+; Switches: 35+; Basic network',
      existingSecurityStack: 'Basic firewall, antivirus, minimal SIEM',
      presenceOfInternalIT: '5+ IT support team (lean)',
      existingMSPVendor: 'Local IT vendors, AWS support',
      currentSLAsAndSupportHours: '12x6, P1 < 4 hrs (limited operations)',
      itBudgetApprox: '~₹8 Cr',
      painPointsWithExistingIT: 'Limited resources, scalability challenges',
      averageDowntimeIncidents: '~12-15 incidents (regional constraints)',
      existingMonitoringTools: 'Basic AWS monitoring, minimal tools',
      currentITSpend: 'OPEX 92% / CAPEX 8%',
      currentMSPContractValue: '~₹1-1.5 Cr',
      pricingPreferences: 'Pay-per-use, minimal fixed costs',
      renewalContractTimeline: 'Annual contracts',
      budgetAvailableForOutsourcing: 'Very Low (small operator)',
      customerBenchmarkingSummary: 'Benchmark: Regional carriers (limited scale)',
      additionalCommercialNotes: 'Focus on cost-effective regional connectivity'
    },
    {
      sNo: 11,
      customerName: 'N. Kumar',
      companyName: 'TruJet Airlines (Turbo Megha Airways)',
      companySize: 'Small Enterprise',
      industryArea: 'Regional Aviation – Tier-2/3 Connectivity',
      annualRevenue: '₹320 Cr',
      geographicsFootprint: '12+ tier-2/tier-3 cities (South/East India)',
      keyContact: 'N. Kumar',
      designation: 'CTO – Chief Technology Officer',
      emailAddress: 'n.kumar@trujet.com',
      phoneWhatsApp: '+91 11009 87654',
      linkedinProfile: 'linkedin.com/in/nkumar-trujet',
      websiteURL: 'www.trujet.com',
      numberOfEndpoints: '680 endpoints (limited operations)',
      numberOfServers: '35 servers (4 physical + 31 virtual)',
      cloudFootprint: 'AWS ~70%; On-prem ~25%; Hybrid ~5%',
      dataCenterDetails: 'Primary: Hyderabad; DR: Shared facility',
      networkSize: 'Routers: 18+; Switches: 22+; Basic setup',
      existingSecurityStack: 'Basic security suite, AWS native',
      presenceOfInternalIT: '4+ IT personnel (minimal)',
      existingMSPVendor: 'Local IT support, AWS managed services',
      currentSLAsAndSupportHours: '12x6, P1 < 6 hrs',
      itBudgetApprox: '~₹5 Cr',
      painPointsWithExistingIT: 'Minimal IT investment, operational focus',
      averageDowntimeIncidents: '~18-20 incidents (acceptable for size)',
      existingMonitoringTools: 'AWS CloudWatch, basic monitoring',
      currentITSpend: 'OPEX 95% / CAPEX 5%',
      currentMSPContractValue: '~₹0.8-1 Cr',
      pricingPreferences: 'Cloud consumption, no commitments',
      renewalContractTimeline: 'Flexible/Monthly',
      budgetAvailableForOutsourcing: 'Very Low (survival mode)',
      customerBenchmarkingSummary: 'Benchmark: Small regional operators',
      additionalCommercialNotes: 'Limited operations, cost-sensitive market'
    },
    {
      sNo: 12,
      customerName: 'S. Bose',
      companyName: 'FLY91 (Fly-Ninety-One)',
      companySize: 'Start-up / Small Enterprise',
      industryArea: 'Regional Aviation – New Entrant (South India)',
      annualRevenue: '₹180 Cr (new operations)',
      geographicsFootprint: '8+ cities (Karnataka, Goa, Kerala focus)',
      keyContact: 'S. Bose',
      designation: 'COO – Chief Operating Officer',
      emailAddress: 's.bose@fly91.in',
      phoneWhatsApp: '+91 99887 65432',
      linkedinProfile: 'linkedin.com/in/sbose-fly91',
      websiteURL: 'www.fly91.in',
      numberOfEndpoints: '420 endpoints (startup phase)',
      numberOfServers: '22 servers (2 physical + 20 virtual)',
      cloudFootprint: 'AWS ~85%; SaaS ~15% (cloud-native)',
      dataCenterDetails: 'Cloud-only: AWS Mumbai region',
      networkSize: 'Routers: 12+; Switches: 15+; Modern SD-WAN',
      existingSecurityStack: 'AWS Security Hub, cloud-native security',
      presenceOfInternalIT: '3+ tech team (startup lean)',
      existingMSPVendor: 'AWS Professional Services, startup partners',
      currentSLAsAndSupportHours: '24x7 (growth phase), P1 < 2 hrs',
      itBudgetApprox: '~₹3.5 Cr (scaling)',
      painPointsWithExistingIT: 'Building infrastructure, rapid scaling needs',
      averageDowntimeIncidents: '~5-8 incidents (new, modern stack)',
      existingMonitoringTools: 'AWS native tools, DataDog, modern APM',
      currentITSpend: 'OPEX 100% (cloud-first startup)',
      currentMSPContractValue: '~₹0.5-0.8 Cr',
      pricingPreferences: 'Consumption-based, flexible startup model',
      renewalContractTimeline: 'Flexible (startup mode)',
      budgetAvailableForOutsourcing: 'Low-Medium (growth focused)',
      customerBenchmarkingSummary: 'Benchmark: Startup carriers (tech-forward)',
      additionalCommercialNotes: 'New entrant with modern tech approach'
    }
  ]

  const getCurrentData = () => {
    if (activeProposition === 'proposition2') {
      return proposition2Data
    }
    if (activeProposition === 'proposition3') {
      return proposition3Data
    }
    return proposition1Data
  }

  const exportToCSV = () => {
    const data = getCurrentData()
    const headers = ['S.No.', 'Company Name', 'Year Established', 'Headquarters', 'Cities / Regions Covered', 
                     'Ownership Type (Local / Regional / Global)', 'No. of Employees (est.liff available)', 
                     'Revenue/Turnover(if available) 2024', 'Key Contact Person', 'Designation / Role', 
                     'Email', 'Address (verified / generic)', 'Phone / WhatsApp Number', 'LinkedIn Profile', 'Website URL']
    
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        [row.sNo, row.companyName, row.yearEstablished, row.headquarters, row.citiesRegionsCovered,
         row.ownershipType, row.noOfEmployees, row.revenueTurnover, row.keyContact, row.designation,
         row.emailAddress, row.geographicsFootprint, row.phoneWhatsApp, row.linkedinProfile, row.websiteURL]
          .map(val => `"${String(val || 'NN').replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `airline_industry_${activeProposition}.csv`
    link.click()
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex justify-end items-start mb-6">
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
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
          GLOBAL IT MSP AIRLINE INDUSTRY DATABASE
        </h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
          Verified directory and insights on airline industry IT infrastructure and MSP opportunities
        </p>
      </motion.div>

      {/* Proposition Tabs */}
      <div className={`p-6 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveProposition('proposition1')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeProposition === 'proposition1'
                ? 'bg-electric-blue text-white shadow-lg'
                : isDark
                ? 'bg-navy-dark text-text-secondary-dark hover:bg-navy-light'
                : 'bg-gray-100 text-text-secondary-light hover:bg-gray-200'
            }`}
          >
            Proposition 1 - Basic
          </button>
          <button
            onClick={() => setActiveProposition('proposition2')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeProposition === 'proposition2'
                ? 'bg-electric-blue text-white shadow-lg'
                : isDark
                ? 'bg-navy-dark text-text-secondary-dark hover:bg-navy-light'
                : 'bg-gray-100 text-text-secondary-light hover:bg-gray-200'
            }`}
          >
            Proposition 2 - Advanced
          </button>
          <button
            onClick={() => setActiveProposition('proposition3')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeProposition === 'proposition3'
                ? 'bg-electric-blue text-white shadow-lg'
                : isDark
                ? 'bg-navy-dark text-text-secondary-dark hover:bg-navy-light'
                : 'bg-gray-100 text-text-secondary-light hover:bg-gray-200'
            }`}
          >
            Proposition 3 - Premium
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 1: Number of Endpoints - SME vs Large Enterprises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}
        >
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Number of Endpoints (SME vs Large Enterprise)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
              const data = getCurrentData()
              const smeData = data.filter(d => d.companySize?.toLowerCase().includes('sme') || d.companySize?.toLowerCase().includes('small') || d.companySize?.toLowerCase().includes('medium'))
              const largeData = data.filter(d => d.companySize?.toLowerCase().includes('large'))

              const smeEndpoints = smeData.reduce((sum, d) => {
                const match = d.numberOfEndpoints?.match(/[\d,]+/)
                return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0)
              }, 0)

              const largeEndpoints = largeData.reduce((sum, d) => {
                const match = d.numberOfEndpoints?.match(/[\d,]+/)
                return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0)
              }, 0)

              return [
                { category: 'SME', endpoints: Math.round(smeEndpoints / Math.max(smeData.length, 1)) },
                { category: 'Large Enterprise', endpoints: Math.round(largeEndpoints / Math.max(largeData.length, 1)) }
              ]
            })()}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="category" stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#e5e7eb' : '#1f2937'
                }}
              />
              <Legend />
              <Bar dataKey="endpoints" fill="#0075FF" name="Avg Endpoints" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart 2: Number of Servers - SME vs Large Enterprises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}
        >
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Number of Servers (SME vs Large Enterprise)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
              const data = getCurrentData()
              const smeData = data.filter(d => d.companySize?.toLowerCase().includes('sme') || d.companySize?.toLowerCase().includes('small') || d.companySize?.toLowerCase().includes('medium'))
              const largeData = data.filter(d => d.companySize?.toLowerCase().includes('large'))

              const smeServers = smeData.reduce((sum, d) => {
                const match = d.numberOfServers?.match(/[\d,]+/)
                return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0)
              }, 0)

              const largeServers = largeData.reduce((sum, d) => {
                const match = d.numberOfServers?.match(/[\d,]+/)
                return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0)
              }, 0)

              return [
                { category: 'SME', servers: Math.round(smeServers / Math.max(smeData.length, 1)) },
                { category: 'Large Enterprise', servers: Math.round(largeServers / Math.max(largeData.length, 1)) }
              ]
            })()}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="category" stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#e5e7eb' : '#1f2937'
                }}
              />
              <Legend />
              <Bar dataKey="servers" fill="#06B6D4" name="Avg Servers" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart 3: Network Size Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}
        >
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Network Size (Routers & Switches)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
              // Use Proposition 2 or 3 data as they have networkSize
              const data = activeProposition === 'proposition1' ? proposition2Data : getCurrentData()
              return data.slice(0, 6).map(d => {
                const routersMatch = d.networkSize?.match(/Routers:\s*([\d,]+)/)
                const switchesMatch = d.networkSize?.match(/Switches:\s*([\d,]+)/)
                const routers = routersMatch ? parseInt(routersMatch[1].replace(/,/g, '').replace(/\+/g, '')) : 0
                const switches = switchesMatch ? parseInt(switchesMatch[1].replace(/,/g, '').replace(/\+/g, '')) : 0
                return {
                  company: d.companyName?.split('(')[0].trim() || 'Unknown',
                  routers: routers,
                  switches: switches
                }
              }).filter(d => d.routers > 0 || d.switches > 0)
            })()}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="company" stroke={isDark ? '#9ca3af' : '#6b7280'} angle={-45} textAnchor="end" height={100} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#e5e7eb' : '#1f2937'
                }}
              />
              <Legend />
              <Bar dataKey="routers" fill="#8B5CF6" name="Routers" />
              <Bar dataKey="switches" fill="#EC4899" name="Switches" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart 4: IT Budget Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}
        >
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            IT Budget Comparison (Top Airlines)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={(() => {
              // Use Proposition 3 data as it has itBudgetApprox
              const data = proposition3Data
              return data.slice(0, 9).map(d => {
                const budgetMatch = d.itBudgetApprox?.match(/[\d,]+/)
                const budget = budgetMatch ? parseInt(budgetMatch[0].replace(/,/g, '')) : 0
                return {
                  company: d.companyName?.split('(')[0].trim() || 'Unknown',
                  budget: budget
                }
              }).filter(d => d.budget > 0)
            })()}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="company" stroke={isDark ? '#9ca3af' : '#6b7280'} angle={-45} textAnchor="end" height={100} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#e5e7eb' : '#1f2937'
                }}
                formatter={(value: number) => [`₹${value} Cr`, 'IT Budget']}
              />
              <Legend />
              <Line type="monotone" dataKey="budget" stroke="#F59E0B" strokeWidth={3} name="IT Budget (₹ Cr)" dot={{ fill: '#F59E0B', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Distributors Table */}
      <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
        {/* Top Scrollbar */}
        <div 
          ref={topScrollRef}
          className="overflow-x-auto mb-2"
          onScroll={(e) => {
            if (tableScrollRef.current) {
              tableScrollRef.current.scrollLeft = e.currentTarget.scrollLeft
            }
          }}
        >
          <div style={{ height: '1px' }}></div>
        </div>
        
        <div 
          ref={tableScrollRef}
          className="overflow-x-auto"
          onScroll={(e) => {
            if (topScrollRef.current) {
              topScrollRef.current.scrollLeft = e.currentTarget.scrollLeft
            }
          }}
        >
          <table className="w-full border-collapse text-sm min-w-max">
            <thead>
              <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                <th className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-gray-300 text-gray-900' : 'bg-gray-200 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '60px', maxWidth: '60px' }}>
                  S.No.
                </th>
                <th colSpan={6} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-orange-200 text-gray-900' : 'bg-orange-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  CUSTOMER INFORMATION
                </th>
                <th colSpan={6} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-cyan-200 text-gray-900' : 'bg-cyan-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  CONTACT DETAILS
                </th>
                {activeProposition === 'proposition1' && (
                  <th colSpan={3} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-purple-200 text-gray-900' : 'bg-purple-100 text-gray-900'}`}>
                    Current IT Infrastructure Landscape
                  </th>
                )}
                {activeProposition === 'proposition2' && (
                  <>
                    <th colSpan={6} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-purple-200 text-gray-900' : 'bg-purple-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                      Current IT Infrastructure Landscape
                    </th>
                    <th colSpan={3} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-pink-200 text-gray-900' : 'bg-pink-100 text-gray-900'}`}>
                      Current IT Support Setup
                    </th>
                  </>
                )}
                {activeProposition === 'proposition3' && (
                  <>
                    <th colSpan={6} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-purple-200 text-gray-900' : 'bg-purple-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                      Current IT Infrastructure Landscape
                    </th>
                    <th colSpan={6} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-pink-200 text-gray-900' : 'bg-pink-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                      Current IT Support Setup
                    </th>
                    <th colSpan={5} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-yellow-200 text-gray-900' : 'bg-yellow-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                      Financial & Commercial Datapoints
                    </th>
                    <th colSpan={2} className={`px-3 py-3 text-center font-bold ${isDark ? 'bg-green-200 text-gray-900' : 'bg-green-100 text-gray-900'}`}>
                      CMI Insights
                    </th>
                  </>
                )}
              </tr>
              <tr className={`border-b-2 ${isDark ? 'border-navy-light' : 'border-gray-300'}`}>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '60px', maxWidth: '60px' }}>
                  S.No.
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-orange-100 text-gray-900' : 'bg-orange-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Customer Name
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-orange-100 text-gray-900' : 'bg-orange-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Company Name
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-orange-100 text-gray-900' : 'bg-orange-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Company Size (SME or Large Enterprise)
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-orange-100 text-gray-900' : 'bg-orange-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Industry Area
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-orange-100 text-gray-900' : 'bg-orange-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Annual Revenue
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-orange-100 text-gray-900' : 'bg-orange-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Geographics | Footprint
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-cyan-100 text-gray-900' : 'bg-cyan-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Key Contact Person
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-cyan-100 text-gray-900' : 'bg-cyan-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Designation / Role
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-cyan-100 text-gray-900' : 'bg-cyan-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Email Address (verified / generic)
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-cyan-100 text-gray-900' : 'bg-cyan-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Phone / WhatsApp Number
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-cyan-100 text-gray-900' : 'bg-cyan-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  LinkedIn Profile
                </th>
                <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-cyan-100 text-gray-900' : 'bg-cyan-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                  Website URL
                </th>
                {activeProposition === 'proposition1' && (
                  <>
                    {/* Current IT Infrastructure Landscape - 3 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Number of endpoints (laptops, desktops, mobile devices)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Number of servers (physical + virtual)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Cloud footprint (Azure/AWS/GC P workloads)
                    </th>
                  </>
                )}
                {activeProposition === 'proposition2' && (
                  <>
                    {/* Current IT Infrastructure Landscape - 6 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Number of endpoints (laptops, desktops, mobile devices)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Number of servers (physical + virtual)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Cloud footprint (Azure/AWS/GC P workloads)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Data center details (on-prem, colo, colocation, cloud)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Network size: routers, switches, firewalls, WAN links
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Existing security stack (EDR, antivirus, SIEM, firewalls)
                    </th>
                    {/* Current IT Support Setup - 3 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Presence of internal IT team (size, roles)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Existing MSP/vendor (if any)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Current SLAs and support hours
                    </th>
                  </>
                )}
                {activeProposition === 'proposition3' && (
                  <>
                    {/* Current IT Infrastructure Landscape - 6 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Number of endpoints (laptops, desktops, mobile devices)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Number of servers (physical / virtual)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Cloud footprint (Azure/AWS/ GCP workloads)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Data center details (on-prem, colo, colocation, cloud)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Network size: routers, switches, SD-WAN firewalls, VPN
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-purple-100 text-gray-900' : 'bg-purple-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Existing security stack (EDR, antivirus, SIEM, firewalls)
                    </th>
                    {/* Current IT Support Setup - 6 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      IT Budget (Approx.)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Existing MSP/Vendor (if any)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Current SLAs and support hours
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Pain points with existing IT support
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Average downtime incidents per year
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-pink-100 text-gray-900' : 'bg-pink-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Existing monitoring tools (RMM/MDC tools)
                    </th>
                    {/* Financial & Commercial Datapoints - 5 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-yellow-100 text-gray-900' : 'bg-yellow-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Current IT spend (UPEX / CAPEX)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-yellow-100 text-gray-900' : 'bg-yellow-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Current MSP/vendor contract value
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-yellow-100 text-gray-900' : 'bg-yellow-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '140px', maxWidth: '140px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Pricing preferences (per user, per service, fixed monthly, tier-consumption model)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-yellow-100 text-gray-900' : 'bg-yellow-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Renewal/contract timeline
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-yellow-100 text-gray-900' : 'bg-yellow-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '120px', maxWidth: '120px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Budget availability for outsourcing
                    </th>
                    {/* CMI Insights - 2 columns */}
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-green-100 text-gray-900' : 'bg-green-50 text-gray-900'} border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '140px', maxWidth: '140px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Customer Benchmarking 8 Summars (Potential Customers/ Peer Group)
                    </th>
                    <th className={`px-3 py-3 text-center font-semibold ${isDark ? 'bg-green-100 text-gray-900' : 'bg-green-50 text-gray-900'}`} style={{ width: '140px', maxWidth: '140px', whiteSpace: 'normal', lineHeight: '1.4', wordWrap: 'break-word' }}>
                      Additional Comments/ Notes bg CMI Team
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {getCurrentData().map((row, index) => (
                <tr
                  key={index}
                  className={`border-b ${isDark ? 'border-navy-light hover:bg-navy-dark' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                >
                  <td className={`px-3 py-3 text-center font-semibold text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ width: '60px', maxWidth: '60px' }}>
                    {row.sNo}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.customerName || 'NN'}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.companyName}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.companySize || 'NN'}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.industryArea || 'NN'}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.annualRevenue || 'NN'}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.geographicsFootprint || 'NN'}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.keyContact}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.designation}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.emailAddress !== 'NA' ? (
                      <a href={`mailto:${row.emailAddress}`} className="text-electric-blue hover:underline">
                        {row.emailAddress}
                      </a>
                    ) : row.emailAddress}
                  </td>
                  <td className={`px-3 py-3 text-center text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.phoneWhatsApp}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.linkedinProfile !== 'NA' ? (
                      <a href={`https://${row.linkedinProfile}`} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline text-xs">
                        {row.linkedinProfile}
                      </a>
                    ) : row.linkedinProfile}
                  </td>
                  <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                    {row.websiteURL !== 'NA' ? (
                      <a href={`https://${row.websiteURL}`} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline text-xs">
                        {row.websiteURL}
                      </a>
                    ) : row.websiteURL}
                  </td>
                  {activeProposition === 'proposition1' && (
                    <>
                      {/* Current IT Infrastructure Landscape - 3 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.numberOfEndpoints || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.numberOfServers || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark`}>
                        {row.cloudFootprint || 'NN'}
                      </td>
                    </>
                  )}
                  {activeProposition === 'proposition2' && (
                    <>
                      {/* Current IT Infrastructure Landscape - 6 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.numberOfEndpoints || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.numberOfServers || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.cloudFootprint || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.dataCenterDetails || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.networkSize || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.existingSecurityStack || 'NN'}
                      </td>
                      {/* Current IT Support Setup - 3 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.presenceOfInternalIT || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.existingMSPVendor || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark`}>
                        {row.currentSLAsAndSupportHours || 'NN'}
                      </td>
                    </>
                  )}
                  {activeProposition === 'proposition3' && (
                    <>
                      {/* Current IT Infrastructure Landscape - 6 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.numberOfEndpoints || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.numberOfServers || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.cloudFootprint || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.dataCenterDetails || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.networkSize || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.existingSecurityStack || 'NN'}
                      </td>
                      {/* Current IT Support Setup - 6 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.itBudgetApprox || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.existingMSPVendor || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.currentSLAsAndSupportHours || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.painPointsWithExistingIT || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.averageDowntimeIncidents || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.existingMonitoringTools || 'NN'}
                      </td>
                      {/* Financial & Commercial Datapoints - 5 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.currentITSpend || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.currentMSPContractValue || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.pricingPreferences || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.renewalContractTimeline || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.budgetAvailableForOutsourcing || 'NN'}
                      </td>
                      {/* CMI Insights - 2 columns */}
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark border-r ${isDark ? 'border-gray-400' : 'border-gray-300'}`}>
                        {row.customerBenchmarkingSummary || 'NN'}
                      </td>
                      <td className={`px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark`}>
                        {row.additionalCommercialNotes || 'NN'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
