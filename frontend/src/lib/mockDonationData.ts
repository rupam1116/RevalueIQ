export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetQuantity: number;
  currentQuantity: number;
  deviceTypesNeeded: string[];
  deadline: string;
}

export interface DonationReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  donatedDevice: string;
}

export interface DonationCenter {
  id: string;
  name: string;
  logo: string;
  verificationBadge: "Verified NGO" | "Government Partner" | "Certified Recycler" | "Educational Trust";
  category: "Education" | "NGOs" | "Orphanages" | "Rural Schools" | "Digital Literacy Programs" | "Government Collection Centers" | "E-Waste Recycling Partners";
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  city: string;
  pincode: string;
  hours: string;
  acceptedDevices: string[];
  requiredDevices: string[];
  capacityDemand: "High Demand" | "Moderate Demand" | "Fully Equipped";
  capacityPercentage: number;
  shortMission: string;
  fullMission: string;
  description: string;
  impactStats: {
    devicesReceived: number;
    beneficiariesCount: number;
    co2SavedKg: number;
    schoolsPowered?: number;
  };
  phone: string;
  email: string;
  website: string;
  gallery: string[];
  campaigns: DonationCampaign[];
  reviews: DonationReview[];
  googleMapQuery: string;
  lat: number;
  lng: number;
  taxExemptionEligible: boolean;
}

export interface DonationRecord {
  id: string;
  certificateId: string;
  userName: string;
  deviceName: string;
  deviceCategory: string;
  serialOrModel: string;
  organizationId: string;
  organizationName: string;
  date: string;
  fulfillmentType: "Pickup" | "Drop-off";
  pickupDate?: string;
  pickupTimeSlot?: string;
  estimatedCo2SavedKg: number;
  treesEquivalent: number;
  circularScoreBonus: number;
  status: "Completed" | "Scheduled" | "In Transit";
  certificateUrl?: string;
}

export const MOCK_DONATION_STATS = {
  totalDevicesDonated: 14280,
  co2SavedTons: 84.5,
  peopleHelped: 32500,
  partnerOrganizations: 142,
  treesEquivalent: 3750,
  schoolsSupported: 98,
};

export const MOCK_DONATION_CENTERS: DonationCenter[] = [
  {
    id: "ngo-01",
    name: "TechForGood Foundation",
    logo: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=150&auto=format&fit=crop&q=80",
    verificationBadge: "Verified NGO",
    category: "Digital Literacy Programs",
    rating: 4.9,
    reviewCount: 148,
    distance: "2.4 km",
    address: "Plot 42, Innovation Corridor, HITEC City",
    city: "Hyderabad",
    pincode: "500081",
    hours: "Mon - Sat: 9:00 AM - 6:30 PM",
    acceptedDevices: ["Laptops", "Tablets", "Smartphones", "Monitors", "Keyboards & Mice"],
    requiredDevices: ["i3/i5 Laptops", "Android Tablets", "Full HD Monitors"],
    capacityDemand: "High Demand",
    capacityPercentage: 42,
    shortMission: "Refurbishing donated tech to equip underprivileged youth with digital skills.",
    fullMission: "TechForGood Foundation bridges the digital divide by repairing and deploying enterprise and personal devices into free digital computer labs across underserved communities.",
    description: "Established in 2019, TechForGood has set up over 60 digital labs across government schools and vocational training institutes. We ensure strict zero-data-leakage protocols with US-DoD 5220.22-M certified data wiping for all received storage media.",
    impactStats: {
      devicesReceived: 3420,
      beneficiariesCount: 12400,
      co2SavedKg: 18500,
      schoolsPowered: 42,
    },
    phone: "+91 40 4821 9900",
    email: "donate@techforgood.org.in",
    website: "https://techforgood.org.in",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
    ],
    campaigns: [
      {
        id: "camp-01",
        title: "500 Laptops for Rural Girls in Tech",
        description: "Collecting functional or minor-repair laptops to provide computer science scholarships to rural female students.",
        targetQuantity: 500,
        currentQuantity: 342,
        deviceTypesNeeded: ["Laptops", "Tablets"],
        deadline: "2026-09-30",
      },
      {
        id: "camp-02",
        title: "Coding Lab Refurbish 2026",
        description: "Upgrading outdated desktop PCs with SSDs and extra RAM for high school programming workshops.",
        targetQuantity: 200,
        currentQuantity: 140,
        deviceTypesNeeded: ["Desktops", "Monitors", "RAM / Storage"],
        deadline: "2026-08-31",
      }
    ],
    reviews: [
      {
        id: "rev-101",
        userName: "Aarav Sharma",
        rating: 5,
        date: "3 days ago",
        comment: "Donated 2 older ThinkPads. They picked them up from my home within 24 hrs and issued an instant tax receipt + CO2 certificate!",
        donatedDevice: "Lenovo ThinkPad X270",
      },
      {
        id: "rev-102",
        userName: "Priya Varma",
        rating: 5,
        date: "1 week ago",
        comment: "Great organization. Loved seeing the photos of students using the laptops in their new computer lab.",
        donatedDevice: "iPad Air 2",
      }
    ],
    googleMapQuery: "TechForGood Foundation HITEC City Hyderabad",
    lat: 17.4486,
    lng: 78.3742,
    taxExemptionEligible: true,
  },
  {
    id: "school-02",
    name: "GreenByte Rural Education Trust",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
    verificationBadge: "Educational Trust",
    category: "Rural Schools",
    rating: 4.8,
    reviewCount: 96,
    distance: "5.1 km",
    address: "Green Campus Road, Gachibowli Outer Ring",
    city: "Hyderabad",
    pincode: "500032",
    hours: "Mon - Fri: 8:30 AM - 5:00 PM",
    acceptedDevices: ["Laptops", "Tablets", "Projectors", "E-Readers", "Power Banks"],
    requiredDevices: ["Working Laptops", "LCD Projectors", "Tablets"],
    capacityDemand: "High Demand",
    capacityPercentage: 35,
    shortMission: "Empowering village government schools with interactive digital smart classrooms.",
    fullMission: "GreenByte Trust deploys refurbished consumer electronics directly into rural classrooms across Telangana and Andhra Pradesh to provide modern STEM learning.",
    description: "We work directly with 80+ rural primary and secondary schools. Devices donated here undergo light maintenance and are assigned directly to class teachers and student study groups.",
    impactStats: {
      devicesReceived: 2150,
      beneficiariesCount: 8900,
      co2SavedKg: 14200,
      schoolsPowered: 56,
    },
    phone: "+91 40 2300 4455",
    email: "contact@greenbytetrust.org",
    website: "https://greenbytetrust.org",
    gallery: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
    ],
    campaigns: [
      {
        id: "camp-03",
        title: "Smart Projectors for 30 Classrooms",
        description: "Collecting LED projectors and laptops for visual audio-video learning in village schools.",
        targetQuantity: 30,
        currentQuantity: 19,
        deviceTypesNeeded: ["Projectors", "Laptops"],
        deadline: "2026-10-15",
      }
    ],
    reviews: [
      {
        id: "rev-103",
        userName: "Dr. K. Srinivas",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent transparent process. Received exact school deployment report after donating 3 HP laptops.",
        donatedDevice: "HP Pavilion 14",
      }
    ],
    googleMapQuery: "GreenByte Trust Gachibowli Hyderabad",
    lat: 17.4401,
    lng: 78.3489,
    taxExemptionEligible: true,
  },
  {
    id: "recycler-03",
    name: "EcoCycle Certified E-Waste Recyclers",
    logo: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&auto=format&fit=crop&q=80",
    verificationBadge: "Certified Recycler",
    category: "E-Waste Recycling Partners",
    rating: 4.95,
    reviewCount: 215,
    distance: "3.8 km",
    address: "Industrial Development Area, Phase II, Cherlapally",
    city: "Hyderabad",
    pincode: "500051",
    hours: "Mon - Sat: 8:00 AM - 7:00 PM",
    acceptedDevices: ["Dead Laptops", "Broken Smartphones", "Circuit Boards", "Batteries", "Monitors", "Cables", "Printers"],
    requiredDevices: ["Non-repairable E-Waste", "Lithium Batteries", "Cracked Displays"],
    capacityDemand: "Moderate Demand",
    capacityPercentage: 78,
    shortMission: "R2 & ISO 14001 certified zero-landfill e-waste processing and precious metal recovery.",
    fullMission: "EcoCycle operates state-of-the-art automated mechanical shredding and chemical metal extraction units adhering to zero-emission standards.",
    description: "When electronics reach total end-of-life and cannot be repaired or reused, EcoCycle extracts copper, gold, rare earth metals, and high-grade plastics for industrial remanufacturing.",
    impactStats: {
      devicesReceived: 18450,
      beneficiariesCount: 4500,
      co2SavedKg: 95000,
    },
    phone: "+91 40 6711 2233",
    email: "recycle@ecocycleindia.com",
    website: "https://ecocycleindia.com",
    gallery: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80"
    ],
    campaigns: [
      {
        id: "camp-04",
        title: "Citywide Battery & Cable Drive",
        description: "Safely harvesting toxic lithium batteries and copper wiring from old consumer devices.",
        targetQuantity: 1000,
        currentQuantity: 820,
        deviceTypesNeeded: ["Batteries", "Cables", "Motherboards"],
        deadline: "2026-12-31",
      }
    ],
    reviews: [
      {
        id: "rev-104",
        userName: "Rohan Mehta",
        rating: 5,
        date: "Yesterday",
        comment: "Gave 4 broken phones and dead laptop batteries. Got an official destruction certificate ensuring safe disposal.",
        donatedDevice: "Miscellaneous Electronics & Batteries",
      }
    ],
    googleMapQuery: "EcoCycle Recyclers Cherlapally Hyderabad",
    lat: 17.4721,
    lng: 78.5832,
    taxExemptionEligible: false,
  },
  {
    id: "orphanage-04",
    name: "Aasha Youth & Children Care Center",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=80",
    verificationBadge: "Verified NGO",
    category: "Orphanages",
    rating: 4.85,
    reviewCount: 74,
    distance: "4.0 km",
    address: "Road No. 12, Jubilee Hills",
    city: "Hyderabad",
    pincode: "500033",
    hours: "Mon - Sun: 9:00 AM - 8:00 PM",
    acceptedDevices: ["Tablets", "Smartphones", "Laptops", "Headphones", "Gaming Consoles"],
    requiredDevices: ["Learning Tablets", "Headphones with Mic", "Laptops"],
    capacityDemand: "High Demand",
    capacityPercentage: 28,
    shortMission: "Providing shelter, education, and digital access to orphaned and underprivileged children.",
    fullMission: "Aasha Shelter houses 140+ children. We use donated smart devices for online tutoring, language education, and creative skills.",
    description: "Every donated device gives a child their own window to learning, online courses, and digital literacy. We manage controlled device usage under supervised study hours.",
    impactStats: {
      devicesReceived: 820,
      beneficiariesCount: 350,
      co2SavedKg: 4900,
      schoolsPowered: 3,
    },
    phone: "+91 40 2355 1188",
    email: "help@aashacare.org",
    website: "https://aashacare.org",
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80"
    ],
    campaigns: [
      {
        id: "camp-05",
        title: "Digital Learning Tablets for High Schoolers",
        description: "Collecting 40 tablets for 10th grade exam preparation and online board video classes.",
        targetQuantity: 40,
        currentQuantity: 27,
        deviceTypesNeeded: ["Tablets", "Smartphones"],
        deadline: "2026-09-15",
      }
    ],
    reviews: [
      {
        id: "rev-105",
        userName: "Sneha Reddy",
        rating: 5,
        date: "4 days ago",
        comment: "Visited the center in person to donate an iPad. Seeing the kids' bright smiles was priceless!",
        donatedDevice: "iPad 8th Gen",
      }
    ],
    googleMapQuery: "Aasha Children Care Center Jubilee Hills Hyderabad",
    lat: 17.4312,
    lng: 78.4071,
    taxExemptionEligible: true,
  },
  {
    id: "gov-05",
    name: "Telangana State E-Waste Collection Hub",
    logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80",
    verificationBadge: "Government Partner",
    category: "Government Collection Centers",
    rating: 4.75,
    reviewCount: 112,
    distance: "1.8 km",
    address: "GHMC Circle Office Complex, Begumpet",
    city: "Hyderabad",
    pincode: "500016",
    hours: "Mon - Sat: 10:00 AM - 5:30 PM",
    acceptedDevices: ["All E-Waste", "Monitors", "Printers", "Appliances", "Telecom Equipment"],
    requiredDevices: ["All Electronic Devices", "Obsolete IT Hardware"],
    capacityDemand: "Moderate Demand",
    capacityPercentage: 65,
    shortMission: "State municipal government authorized clean e-waste collection and segregation facility.",
    fullMission: "Official GHMC & TS-PCB initiative to collect urban e-waste, prevent improper dumping in municipal trash, and forward items to authorized recyclers or refurbishers.",
    description: "Drop off any electronic items hassle-free. Citizens receive an official Green Citizen e-token redeemable for property tax rebates or municipal points.",
    impactStats: {
      devicesReceived: 24100,
      beneficiariesCount: 15000,
      co2SavedKg: 140000,
    },
    phone: "+91 40 2111 0000",
    email: "ewaste@ghmc.gov.in",
    website: "https://ghmc.gov.in/ewaste",
    gallery: [
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80"
    ],
    campaigns: [
      {
        id: "camp-06",
        title: "Clean Hyderabad E-Waste Month",
        description: "Drive to collect 50 Tons of discarded electronics from residential societies.",
        targetQuantity: 5000,
        currentQuantity: 3900,
        deviceTypesNeeded: ["All Electronics"],
        deadline: "2026-08-31",
      }
    ],
    reviews: [
      {
        id: "rev-106",
        userName: "Venkatesh Rao",
        rating: 5,
        date: "1 week ago",
        comment: "Very organized government center. Drive-through drop off took less than 3 minutes.",
        donatedDevice: "Old Desktop Tower & CRT Monitor",
      }
    ],
    googleMapQuery: "GHMC Circle Office Begumpet Hyderabad",
    lat: 17.4435,
    lng: 78.4682,
    taxExemptionEligible: true,
  },
  {
    id: "ngo-06",
    name: "VidyaTech Empowerment Society",
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80",
    verificationBadge: "Verified NGO",
    category: "Education",
    rating: 4.92,
    reviewCount: 165,
    distance: "6.3 km",
    address: "Sector 3, Madhapur Tech Zone",
    city: "Hyderabad",
    pincode: "500081",
    hours: "Mon - Sat: 9:30 AM - 6:00 PM",
    acceptedDevices: ["Laptops", "MacBooks", "Smartphones", "Smartwatches", "Keyboards"],
    requiredDevices: ["MacBooks & i5 Laptops", "iPads", "Android Phones"],
    capacityDemand: "High Demand",
    capacityPercentage: 40,
    shortMission: "Training marginalized youth in software development, graphic design, and AI tools.",
    fullMission: "VidyaTech offers 6-month intensive technology bootcamps for underprivileged college graduates using donated high-performance computers.",
    description: "Over 85% of our bootcamp graduates secure full-time employment as junior developers or tech support specialists. High-spec laptops donated here directly change career trajectories.",
    impactStats: {
      devicesReceived: 1450,
      beneficiariesCount: 3200,
      co2SavedKg: 11200,
      schoolsPowered: 12,
    },
    phone: "+91 40 4012 3344",
    email: "info@vidyatech.org",
    website: "https://vidyatech.org",
    gallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80"
    ],
    campaigns: [
      {
        id: "camp-07",
        title: "Coding Laptops for Web Dev Cohort '26",
        description: "Need 60 core-i5/i7 laptops with min 8GB RAM for Python & React web development courses.",
        targetQuantity: 60,
        currentQuantity: 41,
        deviceTypesNeeded: ["Laptops"],
        deadline: "2026-09-10",
      }
    ],
    reviews: [
      {
        id: "rev-107",
        userName: "Ananya Roy",
        rating: 5,
        date: "5 days ago",
        comment: "Super smooth experience. Donated my old Dell XPS laptop. Got standard 80G tax receipt within minutes.",
        donatedDevice: "Dell XPS 13",
      }
    ],
    googleMapQuery: "VidyaTech Society Madhapur Hyderabad",
    lat: 17.4478,
    lng: 78.3914,
    taxExemptionEligible: true,
  }
];

export const MOCK_USER_DONATIONS: DonationRecord[] = [
  {
    id: "don-001",
    certificateId: "DON-2026-89412-EC",
    userName: "Rupam Das",
    deviceName: "MacBook Air 2017 (13-inch)",
    deviceCategory: "Laptops",
    serialOrModel: "A1466-2017-MAC",
    organizationId: "ngo-01",
    organizationName: "TechForGood Foundation",
    date: "2026-07-28",
    fulfillmentType: "Pickup",
    pickupDate: "2026-07-29",
    pickupTimeSlot: "10:00 AM - 1:00 PM",
    estimatedCo2SavedKg: 145.2,
    treesEquivalent: 6.5,
    circularScoreBonus: 45,
    status: "Completed",
  },
  {
    id: "don-002",
    certificateId: "DON-2026-31904-EC",
    userName: "Rupam Das",
    deviceName: "Samsung Galaxy Tab S6 Lite",
    deviceCategory: "Tablets",
    serialOrModel: "SM-P610-SAMSUNG",
    organizationId: "orphanage-04",
    organizationName: "Aasha Youth & Children Care Center",
    date: "2026-06-14",
    fulfillmentType: "Drop-off",
    estimatedCo2SavedKg: 42.8,
    treesEquivalent: 2.0,
    circularScoreBonus: 25,
    status: "Completed",
  }
];
