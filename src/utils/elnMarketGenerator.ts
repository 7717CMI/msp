export interface ELNMarketData {
  // Module 1: Customer Information
  sNo: string
  customerName: string
  companyName: string
  typeOfBusiness: string
  customerNeedsUseCaseRequirements: string
  customerPainPointsAndPercentAffected: string
  customerBuyingDriversWithWeightedScore: string
  customerSpendingBehaviourAvgAnnualSpend: string
  
  // Module 1: Contact Details
  keyContactPerson: string
  designationRole: string
  emailAddress: string
  phoneWhatsAppNumber: string
  linkedInProfile: string
  websiteURL: string
  
  // Module 2: Customer Satisfaction & Churn Data
  avgELNContractTenure?: string
  annualChurnRateGlobal?: string
  topReasonsForChurn?: string
  
  // Module 3: Customer Readiness for AI & Automation
  aiUsageInExperimentalDesign?: string
  cloudDataReadiness?: string
  automationEquipmentInLab?: string
  aiDrivenELN?: string
  
  // Module 3: Customer Future Needs
  realTimeCollaborationDashboards?: string
  modularWorkflowBuilders?: string
  elnDataLakeConnectivity?: string
  otherKeyNeeds?: string
  
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
  "Pharmaceutical Research Labs Inc.", "Biotechnology Innovations Ltd.", "Chemical Research Corporation",
  "Medical Device Development Co.", "Clinical Research Organization", "Academic Research Institute",
  "Contract Research Organization", "Food & Beverage Testing Lab", "Environmental Testing Services",
  "Forensic Science Laboratory", "Quality Control Laboratory", "Analytical Chemistry Lab",
  "Biomedical Research Center", "Genomics Research Facility", "Proteomics Research Lab",
  "Drug Discovery Laboratory", "Toxicology Testing Lab", "Microbiology Research Lab",
  "Materials Science Laboratory", "Nanotechnology Research Center", "Agricultural Research Lab",
  "Veterinary Research Institute", "Pharmaceutical Manufacturing", "Biotech Startup Labs",
  "University Research Department", "Government Research Facility", "Private Research Institute",
  "Diagnostic Laboratory Services", "Pathology Laboratory", "Hematology Research Lab",
  "Immunology Research Center", "Molecular Biology Lab", "Cell Culture Facility",
  "Stem Cell Research Lab", "Cancer Research Institute", "Infectious Disease Lab",
  "Vaccine Development Facility", "Antibody Research Lab", "Protein Engineering Lab",
  "Enzyme Research Laboratory", "Metabolomics Research Center", "Lipidomics Research Lab",
  "Glycomics Research Facility", "Epigenetics Research Lab", "CRISPR Research Center",
  "Gene Therapy Laboratory", "Cell Therapy Research Lab", "Regenerative Medicine Lab",
  "Tissue Engineering Facility", "Biomaterials Research Lab", "Drug Formulation Lab",
  "Pharmaceutical Analysis Lab", "Quality Assurance Laboratory", "Regulatory Affairs Lab",
  "Clinical Trial Management", "Data Management Services", "Biostatistics Research",
  "Epidemiology Research Lab", "Public Health Laboratory", "Occupational Health Lab",
  "Industrial Hygiene Laboratory", "Safety Testing Services", "Compliance Testing Lab",
  "Validation Services Laboratory", "Calibration Services", "Metrology Laboratory",
  "Reference Material Production", "Standards Development Lab", "Certification Services",
  "Testing & Inspection Services", "Product Development Lab", "R&D Laboratory Services",
  "Innovation Research Center", "Technology Development Lab", "Process Development Lab",
  "Scale-up Laboratory", "Pilot Plant Facility", "Manufacturing Support Lab",
  "Supply Chain Quality Lab", "Incoming Material Testing", "Finished Product Testing",
  "Stability Testing Laboratory", "Packaging Testing Lab", "Sterility Testing Facility",
  "Pyrogen Testing Laboratory", "Endotoxin Testing Lab", "Microbial Testing Services",
  "Antimicrobial Testing Lab", "Disinfectant Testing Facility", "Preservative Testing Lab",
  "Allergen Testing Laboratory", "Nutritional Analysis Lab", "Food Safety Testing",
  "Water Quality Testing Lab", "Air Quality Testing Facility", "Soil Testing Laboratory",
  "Waste Testing Services", "Hazardous Material Testing", "Chemical Analysis Lab",
  "Spectroscopy Laboratory", "Chromatography Lab", "Mass Spectrometry Facility",
  "NMR Spectroscopy Lab", "X-ray Crystallography Lab", "Electron Microscopy Facility",
  "Imaging Services Laboratory", "Flow Cytometry Lab", "Cell Sorting Facility"
]

const typesOfBusiness = [
  "Pharmaceutical Research", "Biotechnology", "Chemical Research",
  "Medical Device Development", "Clinical Research", "Academic Research",
  "Contract Research", "Food & Beverage Testing", "Environmental Testing",
  "Forensic Science", "Quality Control", "Analytical Chemistry",
  "Biomedical Research", "Genomics", "Proteomics",
  "Drug Discovery", "Toxicology", "Microbiology",
  "Materials Science", "Nanotechnology", "Agricultural Research",
  "Veterinary Research", "Pharmaceutical Manufacturing", "Biotech Startup",
  "University Research", "Government Research", "Private Research",
  "Diagnostic Services", "Pathology", "Hematology",
  "Immunology", "Molecular Biology", "Cell Culture",
  "Stem Cell Research", "Cancer Research", "Infectious Disease",
  "Vaccine Development", "Antibody Research", "Protein Engineering",
  "Enzyme Research", "Metabolomics", "Lipidomics",
  "Glycomics", "Epigenetics", "CRISPR Research",
  "Gene Therapy", "Cell Therapy", "Regenerative Medicine",
  "Tissue Engineering", "Biomaterials", "Drug Formulation",
  "Pharmaceutical Analysis", "Quality Assurance", "Regulatory Affairs",
  "Clinical Trial Management", "Data Management", "Biostatistics",
  "Epidemiology", "Public Health", "Occupational Health",
  "Industrial Hygiene", "Safety Testing", "Compliance Testing",
  "Validation Services", "Calibration", "Metrology",
  "Reference Materials", "Standards Development", "Certification",
  "Testing & Inspection", "Product Development", "R&D Services",
  "Innovation Research", "Technology Development", "Process Development",
  "Scale-up Services", "Pilot Plant", "Manufacturing Support",
  "Supply Chain Quality", "Material Testing", "Product Testing",
  "Stability Testing", "Packaging Testing", "Sterility Testing",
  "Pyrogen Testing", "Endotoxin Testing", "Microbial Testing",
  "Antimicrobial Testing", "Disinfectant Testing", "Preservative Testing",
  "Allergen Testing", "Nutritional Analysis", "Food Safety",
  "Water Quality", "Air Quality", "Soil Testing",
  "Waste Testing", "Hazardous Material", "Chemical Analysis",
  "Spectroscopy", "Chromatography", "Mass Spectrometry",
  "NMR Spectroscopy", "X-ray Crystallography", "Electron Microscopy",
  "Imaging Services", "Flow Cytometry", "Cell Sorting"
]

const customerNeedsUseCaseRequirements = [
  "Electronic lab notebook for research data management, protocol documentation, and experiment tracking",
  "Compliance with FDA 21 CFR Part 11, GLP, and GMP regulations for pharmaceutical research",
  "Integration with laboratory instruments and LIMS systems for automated data capture",
  "Collaborative research platform for multi-site clinical trials and data sharing",
  "Real-time data analysis and visualization tools for experimental results",
  "Audit trail and version control for regulatory compliance and quality assurance",
  "Mobile access for field research and remote laboratory monitoring",
  "Custom workflow builder for specific research protocols and standard operating procedures",
  "Data export and integration with data lakes and cloud storage platforms",
  "AI-powered experimental design suggestions and predictive analytics",
  "Automated report generation and documentation for regulatory submissions",
  "Integration with electronic signatures and approval workflows",
  "Template library for common experiments and research protocols",
  "Search and retrieval of historical experimental data and results",
  "Multi-user collaboration with role-based access control and permissions",
  "Integration with inventory management and sample tracking systems",
  "Support for various data types including images, spectra, and molecular structures",
  "Cloud-based deployment for scalability and remote access",
  "Data backup and disaster recovery capabilities",
  "Customizable dashboards and analytics for research insights"
]

const customerPainPointsAndPercentAffected = [
  "Data silos and lack of integration between systems (75% of customers)",
  "Manual data entry leading to errors and inefficiency (68% of customers)",
  "Difficulty in finding and retrieving historical experimental data (72% of customers)",
  "Compliance and regulatory documentation challenges (65% of customers)",
  "Limited collaboration capabilities across research teams (60% of customers)",
  "Inadequate audit trails for regulatory inspections (58% of customers)",
  "High cost of implementation and maintenance (55% of customers)",
  "Lack of mobile access for field research (52% of customers)",
  "Poor user interface and steep learning curve (50% of customers)",
  "Limited customization options for specific workflows (48% of customers)",
  "Data security and privacy concerns (45% of customers)",
  "Slow system performance with large datasets (43% of customers)",
  "Incompatibility with existing laboratory instruments (40% of customers)",
  "Limited AI and automation capabilities (38% of customers)",
  "Insufficient training and support resources (35% of customers)"
]

const customerBuyingDriversWithWeightedScore = [
  "Regulatory compliance and audit readiness (Score: 9.2/10)",
  "Data integrity and security (Score: 8.9/10)",
  "Integration capabilities with existing systems (Score: 8.7/10)",
  "Ease of use and user adoption (Score: 8.5/10)",
  "Cost-effectiveness and ROI (Score: 8.3/10)",
  "Scalability and performance (Score: 8.1/10)",
  "Mobile and remote access (Score: 7.9/10)",
  "AI and automation features (Score: 7.7/10)",
  "Collaboration and data sharing (Score: 7.5/10)",
  "Customization and flexibility (Score: 7.3/10)",
  "Vendor support and training (Score: 7.1/10)",
  "Cloud deployment options (Score: 6.9/10)",
  "Advanced analytics and reporting (Score: 6.7/10)",
  "Template library and best practices (Score: 6.5/10)",
  "Data export and migration capabilities (Score: 6.3/10)"
]

const customerSpendingBehaviourAvgAnnualSpend = [
  "$50,000 - $100,000 annually",
  "$100,000 - $250,000 annually",
  "$250,000 - $500,000 annually",
  "$500,000 - $1,000,000 annually",
  "$1,000,000 - $2,000,000 annually",
  "$2,000,000+ annually",
  "$25,000 - $50,000 annually",
  "$75,000 - $150,000 annually",
  "$150,000 - $300,000 annually",
  "$300,000 - $600,000 annually"
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
  "Chief Scientific Officer (CSO)", "Research Director", "Laboratory Manager",
  "Quality Assurance Manager", "Regulatory Affairs Director", "Data Management Lead",
  "IT Director - Laboratory Systems", "Head of R&D", "Principal Investigator",
  "Laboratory Information Systems Manager", "Compliance Officer", "Research Scientist",
  "Senior Research Associate", "Laboratory Supervisor", "Quality Control Manager",
  "Clinical Research Manager", "Biostatistics Director", "Laboratory Operations Manager",
  "Research Operations Director", "Scientific Computing Manager", "Data Science Lead",
  "Laboratory Informatics Manager", "ELN Administrator", "Laboratory Systems Analyst",
  "Research Data Manager", "Laboratory Compliance Manager", "Regulatory Compliance Specialist",
  "Quality Systems Manager", "Laboratory IT Manager", "Research Informatics Manager"
]

const avgELNContractTenure = [
  "1-2 years", "2-3 years", "3-5 years", "5+ years", "Less than 1 year",
  "1.5-2.5 years", "2.5-4 years", "4-6 years", "6+ years", "0.5-1 year"
]

const annualChurnRateGlobal = [
  "5-10%", "10-15%", "15-20%", "20-25%", "25-30%",
  "3-8%", "8-12%", "12-18%", "18-22%", "22-28%"
]

const topReasonsForChurn = [
  "High cost and budget constraints",
  "Poor user experience and difficult adoption",
  "Lack of integration with existing systems",
  "Insufficient features and customization options",
  "Better alternative solutions available",
  "Company restructuring or budget cuts",
  "Dissatisfaction with vendor support",
  "System performance and reliability issues",
  "Data migration and implementation challenges",
  "Regulatory compliance concerns"
]

const yesNoOptions = ["Y", "N"]

const modularWorkflowBuilders = [
  "Custom protocol builder", "Template-based workflows", "Drag-and-drop interface",
  "Script-based workflows", "Visual workflow designer", "API-based customization",
  "Pre-built workflow library", "Configurable templates", "Rule-based automation",
  "Integration workflow builder"
]

const elnDataLakeConnectivity = [
  "Data Export/Data Pipelines/Security enabled", "Basic export only",
  "Full integration with data lake", "API-based connectivity",
  "Real-time data streaming", "Batch data export", "Secure data transfer",
  "Cloud storage integration", "Data warehouse connectivity", "Limited export capabilities"
]

const otherKeyNeeds = [
  "Multi-language support", "Advanced search capabilities", "Custom reporting",
  "Integration with LIMS", "Mobile app development", "Training and onboarding",
  "Dedicated support team", "Custom development services", "Data migration assistance",
  "Regulatory consulting services"
]

const customerBenchmarkingSummaries = [
  "High-value potential customer with comprehensive ELN requirements",
  "Moderate-value customer with standard ELN needs",
  "Premium customer requiring advanced AI and automation features",
  "Standard customer with basic ELN functionality needs",
  "High-priority customer with complex integration requirements",
  "Potential long-term customer with growing research needs",
  "Premium customer requiring specialized customization",
  "Standard customer with compliance-focused requirements",
  "High-value customer with multi-site deployment needs",
  "Moderate customer with single-site implementation"
]

const additionalComments = [
  "Customer shows strong interest in AI-powered experimental design features",
  "Requires detailed proposal for cloud-based deployment",
  "Customer evaluating multiple ELN vendors",
  "High potential for long-term contract renewal",
  "Customer has specific integration requirements with LIMS",
  "Requires customized workflow templates",
  "Customer prefers on-premise deployment",
  "Budget approved, awaiting contract finalization",
  "Customer needs immediate pilot program",
  "Follow-up required for product demonstration"
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

export function generateELNMarketData(): ELNMarketData[] {
  const data: ELNMarketData[] = []
  const totalRecords = 120 // Generate 100-120 customers
  
  for (let i = 0; i < totalRecords; i++) {
    const seed = i * 1000 + 12345
    const random = seededRandom(seed)
    
    const customerName = customerNames[i]
    const companyName = randomElement(companyNames, random)
    const typeOfBusiness = randomElement(typesOfBusiness, random)
    const customerNeeds = randomElement(customerNeedsUseCaseRequirements, random)
    const painPoints = randomElement(customerPainPointsAndPercentAffected, random)
    const buyingDrivers = randomElement(customerBuyingDriversWithWeightedScore, random)
    const spendingBehaviour = randomElement(customerSpendingBehaviourAvgAnnualSpend, random)
    
    const firstName = randomElement(firstNames, random)
    const lastName = randomElement(lastNames, random)
    const keyContactPerson = `${firstName} ${lastName}`
    const designation = randomElement(designations, random)
    const emailAddress = generateEmail(firstName, lastName, companyName, random)
    const phone = generatePhone(random)
    const linkedIn = generateLinkedIn(companyName, firstName, lastName, random)
    const website = generateWebsite(companyName)
    
    // Module 2 fields
    const contractTenure = randomElement(avgELNContractTenure, random)
    const churnRate = randomElement(annualChurnRateGlobal, random)
    const churnReasons = randomElement(topReasonsForChurn, random)
    
    // Module 3 fields
    const aiUsage = randomElement(yesNoOptions, random)
    const cloudReadiness = randomElement(yesNoOptions, random)
    const automationEquipment = randomElement(yesNoOptions, random)
    const aiDrivenELN = randomElement(yesNoOptions, random)
    const realTimeDashboards = randomElement(yesNoOptions, random)
    const workflowBuilders = randomElement(modularWorkflowBuilders, random)
    const dataLakeConnectivity = randomElement(elnDataLakeConnectivity, random)
    const otherNeeds = randomElement(otherKeyNeeds, random)
    const benchmarking = randomElement(customerBenchmarkingSummaries, random)
    const comments = randomElement(additionalComments, random)
    
    data.push({
      sNo: String(i + 1),
      customerName,
      companyName,
      typeOfBusiness,
      customerNeedsUseCaseRequirements: customerNeeds,
      customerPainPointsAndPercentAffected: painPoints,
      customerBuyingDriversWithWeightedScore: buyingDrivers,
      customerSpendingBehaviourAvgAnnualSpend: spendingBehaviour,
      keyContactPerson,
      designationRole: designation,
      emailAddress,
      phoneWhatsAppNumber: phone,
      linkedInProfile: linkedIn,
      websiteURL: website,
      avgELNContractTenure: contractTenure,
      annualChurnRateGlobal: churnRate,
      topReasonsForChurn: churnReasons,
      aiUsageInExperimentalDesign: aiUsage,
      cloudDataReadiness: cloudReadiness,
      automationEquipmentInLab: automationEquipment,
      aiDrivenELN: aiDrivenELN,
      realTimeCollaborationDashboards: realTimeDashboards,
      modularWorkflowBuilders: workflowBuilders,
      elnDataLakeConnectivity: dataLakeConnectivity,
      otherKeyNeeds: otherNeeds,
      customerBenchmarkingSummary: benchmarking,
      additionalCommentsNotes: comments
    })
  }
  
  return data
}

let dataCache: ELNMarketData[] | null = null

export function getELNMarketData(): ELNMarketData[] {
  // Always generate fresh data to ensure all fields are populated
  try {
    return generateELNMarketData()
  } catch (error) {
    console.error('Error generating ELN Market data:', error)
    return []
  }
}

export function clearELNMarketCache(): void {
  dataCache = null
}

