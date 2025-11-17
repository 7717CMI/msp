export interface ExecutiveProtectionData {
  // Module 1: Customer Information
  sNo: string
  customerName: string
  companyName: string
  typeOfBusiness: string
  riskInvolvedSpecificToProtection: string
  riskExposureCategory: string
  numberOfPersonsRequiredProtectionService: string
  otherKeyInsights: string
  
  // Module 1: Contact Details
  keyContactPerson: string
  designationRole: string
  emailAddress: string
  phoneWhatsAppNumber: string
  linkedInProfile: string
  websiteURL: string
  
  // Module 2: Threat Exposure & Risk Drivers
  typesOfThreatsFaced?: string
  pastIncidentsOrRecentTriggers?: string
  familyMembersAtRisk?: string
  
  // Module 3: Purchasing Behaviour
  decisionMakers?: string
  procurementMethod?: string
  budgetLevels?: string
  
  // Module 3: Service Requirements
  typeOfProtectionRequired?: string
  protectionIntensity?: string
  preferredContractDuration?: string
  technologyExpectations?: string
  otherKeyDetails?: string
  
  // Module 3: CMI Insights
  customerBenchmarkingSummary?: string
  additionalCommentsNotes?: string
}

const customerNames = [
  "Customer 1", "Customer 2", "Customer 3", "Customer 4", "Customer 5",
  "Customer 6", "Customer 7", "Customer 8", "Customer 9", "Customer 10",
  "Customer 11", "Customer 12", "Customer 13", "Customer 14", "Customer 15",
  "Customer 16", "Customer 17", "Customer 18", "Customer 19", "Customer 20",
  "Customer 21", "Customer 22", "Customer 23", "Customer 24", "Customer 25",
  "Customer 26", "Customer 27", "Customer 28", "Customer 29", "Customer 30",
  "Customer 31", "Customer 32", "Customer 33", "Customer 34", "Customer 35",
  "Customer 36", "Customer 37", "Customer 38", "Customer 39", "Customer 40",
  "Customer 41", "Customer 42", "Customer 43", "Customer 44", "Customer 45",
  "Customer 46", "Customer 47", "Customer 48", "Customer 49", "Customer 50",
  "Customer 51", "Customer 52", "Customer 53", "Customer 54", "Customer 55",
  "Customer 56", "Customer 57", "Customer 58", "Customer 59", "Customer 60",
  "Customer 61", "Customer 62", "Customer 63", "Customer 64", "Customer 65",
  "Customer 66", "Customer 67", "Customer 68", "Customer 69", "Customer 70",
  "Customer 71", "Customer 72", "Customer 73", "Customer 74", "Customer 75",
  "Customer 76", "Customer 77", "Customer 78", "Customer 79", "Customer 80",
  "Customer 81", "Customer 82", "Customer 83", "Customer 84", "Customer 85",
  "Customer 86", "Customer 87", "Customer 88", "Customer 89", "Customer 90",
  "Customer 91", "Customer 92", "Customer 93", "Customer 94", "Customer 95",
  "Customer 96", "Customer 97", "Customer 98", "Customer 99", "Customer 100",
  "Customer 101", "Customer 102", "Customer 103", "Customer 104", "Customer 105",
  "Customer 106", "Customer 107", "Customer 108", "Customer 109", "Customer 110",
  "Customer 111", "Customer 112", "Customer 113", "Customer 114", "Customer 115",
  "Customer 116", "Customer 117", "Customer 118", "Customer 119", "Customer 120"
]

const companyNames = [
  "Global Tech Solutions Inc.", "International Finance Group", "Pharmaceutical Innovations Ltd.",
  "Energy Holdings Corporation", "Media & Entertainment Group", "Real Estate Development Corp",
  "Manufacturing Industries Ltd.", "Retail Chain Enterprises", "Telecommunications Network",
  "Aerospace & Defense Systems", "Healthcare Services Group", "Banking & Investment Firm",
  "Oil & Gas Exploration Co.", "Automotive Manufacturing", "Food & Beverage Corporation",
  "Luxury Goods Holdings", "Shipping & Logistics Group", "Construction & Engineering",
  "Entertainment & Sports Management", "Private Equity Firm", "Venture Capital Partners",
  "Family Office Holdings", "Trading & Commodities Corp", "Hospitality & Tourism Group",
  "Education Services Network", "Legal Services Partnership", "Consulting Group International",
  "Agricultural Enterprises", "Mining & Resources Corp", "Technology Startups Inc.",
  "Investment Banking Firm", "Hedge Fund Management", "Asset Management Company",
  "Insurance Corporation", "Pension Fund Management", "Sovereign Wealth Fund",
  "Cryptocurrency Exchange", "Blockchain Technology Corp", "Artificial Intelligence Labs",
  "Biotechnology Research", "Medical Device Manufacturing", "Pharmaceutical Distribution",
  "Chemical Processing Industries", "Textile Manufacturing", "Fashion & Apparel Group",
  "Jewelry & Luxury Accessories", "Automotive Dealership Network", "Aviation Services",
  "Maritime Services", "Railway Operations", "Public Transportation Authority",
  "Water & Utilities Management", "Waste Management Services", "Renewable Energy Corp",
  "Solar Power Solutions", "Wind Energy Systems", "Nuclear Power Operations",
  "Electric Vehicle Manufacturing", "Battery Technology Corp", "Semiconductor Manufacturing",
  "Software Development Company", "Cloud Services Provider", "Cybersecurity Solutions",
  "Data Analytics Firm", "Digital Marketing Agency", "E-commerce Platform",
  "Social Media Network", "Streaming Services Provider", "Gaming & Entertainment",
  "Sports Management Agency", "Talent Management Firm", "Event Management Company",
  "Public Relations Agency", "Advertising Corporation", "Market Research Firm",
  "Management Consulting", "Financial Advisory Services", "Tax Advisory Firm",
  "Audit & Accounting Services", "Legal Advisory Firm", "Intellectual Property Law",
  "Immigration Services", "Real Estate Brokerage", "Property Management Services",
  "Facilities Management", "Security Services Provider", "Private Investigation Agency",
  "Background Check Services", "Risk Management Consulting", "Crisis Management Firm",
  "Emergency Response Services", "Disaster Recovery Services", "Business Continuity Planning",
  "IT Services & Support", "Network Infrastructure", "Data Center Operations",
  "Cloud Infrastructure Provider", "Managed Services Provider", "System Integration",
  "Enterprise Software Solutions", "Customer Relationship Management", "Supply Chain Management",
  "Logistics & Distribution", "Warehouse Management", "Fleet Management Services",
  "Transportation Services", "Freight Forwarding", "Customs Brokerage",
  "International Trade Services", "Import/Export Services", "Trade Finance Services"
]

const typesOfBusiness = [
  "Technology & Software", "Financial Services", "Pharmaceuticals & Healthcare",
  "Energy & Utilities", "Media & Entertainment", "Real Estate",
  "Manufacturing", "Retail & E-commerce", "Telecommunications",
  "Aerospace & Defense", "Banking & Investment", "Oil & Gas",
  "Automotive", "Food & Beverage", "Luxury Goods",
  "Shipping & Logistics", "Construction", "Entertainment",
  "Private Equity", "Venture Capital", "Family Office",
  "Trading & Commodities", "Hospitality", "Education",
  "Legal Services", "Consulting", "Agriculture",
  "Mining", "Biotechnology", "Chemical Processing",
  "Textiles", "Fashion", "Aviation",
  "Maritime", "Public Transportation", "Utilities",
  "Renewable Energy", "Semiconductors", "Cybersecurity",
  "Data Analytics", "Digital Marketing", "Gaming",
  "Sports Management", "Event Management", "Public Relations",
  "Market Research", "Financial Advisory", "Tax Services",
  "Accounting", "Intellectual Property", "Immigration Services",
  "Property Management", "Security Services", "Risk Management",
  "Crisis Management", "Emergency Services", "IT Services",
  "Cloud Services", "Managed Services", "System Integration",
  "Enterprise Software", "Supply Chain", "Logistics",
  "Transportation", "Freight Forwarding", "International Trade"
]

const riskInvolvedSpecificToProtection = [
  "High-profile public visibility", "International travel exposure", "Political sensitivity",
  "Financial sector threats", "Cyber security risks", "Physical security threats",
  "Reputational risk management", "Kidnapping and extortion risks", "Stalking and harassment",
  "Corporate espionage", "Workplace violence", "Terrorism threats",
  "Organized crime exposure", "Regulatory compliance risks", "Media scrutiny",
  "Family security concerns", "Asset protection", "Information security",
  "Business continuity threats", "Crisis management needs", "Executive travel security",
  "Event security requirements", "Residential security", "Vehicle security",
  "Personal data protection", "Social media threats", "Online harassment",
  "Intellectual property protection", "Trade secret security", "Competitive intelligence risks"
]

const riskExposureCategories = [
  "Low-risk Individuals", "Moderate-risk Individuals", "High-risk Individuals"
]

const numberOfPersons = [
  "1-2 persons", "3-5 persons", "6-10 persons", "11-20 persons", "21-50 persons", "50+ persons"
]

const otherKeyInsights = [
  "High public visibility, frequent international travel, annual spend $500K-$1M",
  "Moderate public profile, domestic travel focus, annual spend $200K-$500K",
  "Low public visibility, occasional travel, annual spend $100K-$200K",
  "Very high public profile, extensive global travel, annual spend $1M-$2M",
  "Executive team protection, corporate events, annual spend $300K-$600K",
  "Family office protection, residential security focus, annual spend $400K-$800K",
  "Political figure, high security needs, annual spend $800K-$1.5M",
  "Celebrity/Entertainment industry, event-based protection, annual spend $500K-$1M",
  "Tech executive, cyber-physical security, annual spend $300K-$700K",
  "Financial services executive, regulatory compliance focus, annual spend $400K-$900K"
]

const firstNames = [
  "James", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas",
  "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald",
  "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George",
  "Timothy", "Ronald", "Jason", "Edward", "Jeffrey", "Ryan", "Jacob", "Gary",
  "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
  "Benjamin", "Samuel", "Frank", "Gregory", "Raymond", "Alexander", "Patrick",
  "Jack", "Dennis", "Jerry", "Tyler", "Aaron", "Jose", "Henry", "Adam", "Douglas",
  "Nathan", "Zachary", "Kyle", "Noah", "Ethan", "Jeremy", "Walter", "Christian",
  "Keith", "Roger", "Terry", "Austin", "Sean", "Gerald", "Carl", "Harold",
  "Dylan", "Arthur", "Lawrence", "Jordan", "Jesse", "Bryan", "Billy", "Bruce",
  "Gabriel", "Joe", "Logan", "Alan", "Juan", "Wayne", "Roy", "Ralph", "Randy",
  "Eugene", "Vincent", "Russell", "Louis", "Philip", "Bobby", "Johnny", "Bradley"
]

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
  "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen",
  "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter",
  "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz",
  "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook",
  "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed",
  "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson",
  "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz",
  "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long",
  "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell", "Sullivan"
]

const designations = [
  "Chief Executive Officer (CEO)", "Chief Security Officer (CSO)", "Chief Information Security Officer (CISO)",
  "Head of Security", "Director of Security", "Security Manager", "VP of Security",
  "Chief Operating Officer (COO)", "Chief Financial Officer (CFO)", "Chief Technology Officer (CTO)",
  "General Manager", "Operations Director", "Risk Management Director", "Compliance Officer",
  "Family Office Manager", "Personal Assistant", "Executive Assistant", "Chief of Staff",
  "Head of Personal Security", "Security Consultant", "Risk Assessment Manager",
  "Crisis Management Director", "Business Continuity Manager", "Facilities Manager",
  "Corporate Security Director", "Global Security Manager", "Regional Security Manager",
  "Travel Security Coordinator", "Event Security Manager", "Residential Security Manager"
]

const typesOfThreatsOptions = [
  "Physical threats, Cyber threats, Reputational risks",
  "Physical threats, Stalking, Extortion",
  "Cyber threats, Reputational risks, Physical threats",
  "Physical threats, Kidnapping risks, Extortion",
  "Reputational risks, Cyber threats, Stalking",
  "Physical threats, Workplace violence, Cyber threats",
  "Terrorism threats, Physical threats, Cyber threats",
  "Stalking, Harassment, Physical threats",
  "Corporate espionage, Cyber threats, Physical threats",
  "Physical threats, Family security, Reputational risks"
]

const pastIncidentsOptions = [
  "No significant past incidents reported",
  "Previous stalking incident in 2022, resolved",
  "Cyber attack attempt in 2023, mitigated",
  "Physical threat in 2021, security enhanced",
  "Reputational attack in 2022, managed",
  "Attempted break-in at residence in 2023",
  "Online harassment campaign in 2022",
  "Threatening communications received in 2023",
  "Security breach at office in 2021",
  "Family member targeted in 2022"
]

const familyMembersAtRisk = [
  "Yes", "No", "Yes - Spouse and children", "No", "Yes - Extended family",
  "No", "Yes - Children only", "No", "Yes - Spouse only", "No"
]

const decisionMakers = [
  "CSO (Chief Security Officer)", "CISO (Chief Information Security Officer)",
  "Family Office Manager", "Personal Security Agent", "CEO",
  "COO (Chief Operating Officer)", "CFO (Chief Financial Officer)",
  "Head of Security", "Security Director", "Risk Management Director"
]

const procurementMethods = [
  "Retainer-based service", "Per-trip basis", "Subscription-based intelligence",
  "Retainer + Per-trip hybrid", "Event-based contracts", "Monthly subscription",
  "Annual retainer", "Project-based", "On-demand services", "Hybrid model"
]

const budgetLevels = [
  "$100K - $200K annually", "$200K - $500K annually", "$500K - $1M annually",
  "$1M - $2M annually", "$2M+ annually", "$50K - $100K annually",
  "$300K - $600K annually", "$400K - $800K annually", "$800K - $1.5M annually",
  "$150K - $300K annually"
]

const typesOfProtection = [
  "Executive protection detail", "Residential security", "Travel security",
  "Event security", "Cyber-physical security", "24/7 protection detail",
  "Periodic protection", "Event-based protection", "Travel + Residential",
  "Comprehensive protection package"
]

const protectionIntensity = [
  "24/7 protection", "Periodic protection", "Event-based protection",
  "Travel-only protection", "Business hours protection", "High-risk period protection",
  "24/7 with reduced coverage", "On-demand protection", "Scheduled protection",
  "Continuous monitoring with response"
]

const contractDurations = [
  "Daily", "Monthly", "Yearly", "Multi-year (2-3 years)", "Project-based",
  "Quarterly", "Semi-annual", "Event-based", "On-demand", "Retainer + ad-hoc"
]

const technologyExpectations = [
  "Real-time tracking apps, Digital intelligence dashboards",
  "GPS tracking, Mobile security apps", "Threat monitoring systems",
  "Digital intelligence platform, Communication systems",
  "Tracking apps, Emergency response systems", "Security management software",
  "Mobile apps, Dashboard analytics", "Real-time alerts, GPS tracking",
  "Comprehensive security technology suite", "Basic tracking and communication"
]

const otherKeyDetails = [
  "Requires multilingual security team", "Needs advance team for international travel",
  "Requires coordination with local law enforcement", "Needs specialized cyber-physical integration",
  "Requires family protection protocols", "Needs event security planning capabilities",
  "Requires 24/7 command center access", "Needs integration with corporate security systems",
  "Requires medical emergency response capability", "Needs specialized threat assessment"
]

const benchmarkingSummaries = [
  "High-value potential customer with consistent protection needs",
  "Moderate-value customer with periodic protection requirements",
  "Premium customer with comprehensive security needs",
  "Standard customer with basic protection requirements",
  "High-priority customer with complex security needs",
  "Potential long-term customer with growing security requirements",
  "Premium customer requiring specialized services",
  "Standard customer with event-based needs",
  "High-value customer with international security requirements",
  "Moderate customer with domestic security focus"
]

const additionalComments = [
  "Customer shows strong interest in comprehensive protection services",
  "Requires detailed proposal for annual retainer agreement",
  "Customer evaluating multiple security providers",
  "High potential for long-term contract",
  "Customer has specific technology integration requirements",
  "Requires customized security solution",
  "Customer prefers premium service providers",
  "Budget approved, awaiting contract finalization",
  "Customer needs immediate security assessment",
  "Follow-up required for service demonstration"
]

function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function randomElement<T>(arr: T[], random: () => number): T {
  return arr[Math.floor(random() * arr.length)]
}

function randomInt(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

function generateEmail(firstName: string, lastName: string, companyName: string, random: () => number): string {
  const domain = companyName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20) + '.com'
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName[0].toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}@${domain}`,
    `${lastName.toLowerCase()}@${domain}`
  ]
  return randomElement(formats, random)
}

function generatePhone(random: () => number): string {
  const formats = [
    `+1-${randomInt(200, 999, random)}-${randomInt(200, 999, random)}-${randomInt(1000, 9999, random)}`,
    `+44-${randomInt(20, 99, random)}-${randomInt(1000, 9999, random)}-${randomInt(1000, 9999, random)}`,
    `+${randomInt(1, 99, random)}-${randomInt(10, 99, random)}-${randomInt(100, 999, random)}-${randomInt(100, 999, random)}-${randomInt(1000, 9999, random)}`
  ]
  return randomElement(formats, random)
}

function generateLinkedIn(companyName: string, firstName: string, lastName: string, random: () => number): string {
  const formats = [
    `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(1000, 9999, random)}`,
    `https://www.linkedin.com/in/${firstName[0].toLowerCase()}${lastName.toLowerCase()}-${randomInt(100, 999, random)}`,
    `https://www.linkedin.com/company/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  ]
  return randomElement(formats, random)
}

function generateWebsite(companyName: string): string {
  const domain = companyName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 25) + '.com'
  return `https://www.${domain}`
}

export function generateExecutiveProtectionData(): ExecutiveProtectionData[] {
  const data: ExecutiveProtectionData[] = []
  const totalRecords = 120 // Generate 100-120 customers
  
  for (let i = 0; i < totalRecords; i++) {
    const seed = i * 1000 + 12345
    const random = seededRandom(seed)
    
    const customerName = customerNames[i]
    const companyName = randomElement(companyNames, random)
    const typeOfBusiness = randomElement(typesOfBusiness, random)
    const riskInvolved = randomElement(riskInvolvedSpecificToProtection, random)
    const riskCategory = randomElement(riskExposureCategories, random)
    const numberOfPersons = randomElement([
      "1-2 persons", "3-5 persons", "6-10 persons", "11-20 persons", "21-50 persons", "50+ persons"
    ], random)
    const otherInsights = randomElement(otherKeyInsights, random)
    
    const firstName = randomElement(firstNames, random)
    const lastName = randomElement(lastNames, random)
    const keyContactPerson = `${firstName} ${lastName}`
    const designation = randomElement(designations, random)
    const emailAddress = generateEmail(firstName, lastName, companyName, random)
    const phone = generatePhone(random)
    const linkedIn = generateLinkedIn(companyName, firstName, lastName, random)
    const website = generateWebsite(companyName)
    
    // Module 2 fields
    const typesOfThreats = randomElement(typesOfThreatsOptions, random)
    const pastIncidents = randomElement(pastIncidentsOptions, random)
    const familyAtRisk = randomElement(familyMembersAtRisk, random)
    
    // Module 3 fields
    const decisionMaker = randomElement(decisionMakers, random)
    const procurementMethod = randomElement(procurementMethods, random)
    const budget = randomElement(budgetLevels, random)
    const protectionType = randomElement(typesOfProtection, random)
    const intensity = randomElement(protectionIntensity, random)
    const contractDuration = randomElement(contractDurations, random)
    const techExpectations = randomElement(technologyExpectations, random)
    const otherDetails = randomElement(otherKeyDetails, random)
    const benchmarking = randomElement(benchmarkingSummaries, random)
    const comments = randomElement(additionalComments, random)
    
    data.push({
      sNo: String(i + 1),
      customerName,
      companyName,
      typeOfBusiness,
      riskInvolvedSpecificToProtection: riskInvolved,
      riskExposureCategory: riskCategory,
      numberOfPersonsRequiredProtectionService: numberOfPersons,
      otherKeyInsights: otherInsights,
      keyContactPerson,
      designationRole: designation,
      emailAddress,
      phoneWhatsAppNumber: phone,
      linkedInProfile: linkedIn,
      websiteURL: website,
      typesOfThreatsFaced: typesOfThreats,
      pastIncidentsOrRecentTriggers: pastIncidents,
      familyMembersAtRisk: familyAtRisk,
      decisionMakers: decisionMaker,
      procurementMethod,
      budgetLevels: budget,
      typeOfProtectionRequired: protectionType,
      protectionIntensity: intensity,
      preferredContractDuration: contractDuration,
      technologyExpectations: techExpectations,
      otherKeyDetails: otherDetails,
      customerBenchmarkingSummary: benchmarking,
      additionalCommentsNotes: comments
    })
  }
  
  return data
}

let dataCache: ExecutiveProtectionData[] | null = null

export function getExecutiveProtectionData(): ExecutiveProtectionData[] {
  if (!dataCache) {
    try {
      dataCache = generateExecutiveProtectionData()
    } catch (error) {
      console.error('Error generating executive protection data:', error)
      dataCache = []
    }
  }
  return dataCache
}

export function clearExecutiveProtectionCache(): void {
  dataCache = null
}

