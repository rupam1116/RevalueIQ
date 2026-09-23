export type RoleBadge = 'Student' | 'Repair Expert' | 'NGO' | 'Moderator' | 'Verified Contributor';

export type PostCategory =
  | 'All'
  | 'Repair'
  | 'Marketplace'
  | 'Donation'
  | 'Circular Economy'
  | 'Announcements'
  | 'Tips'
  | 'Success Stories';

export type FilterChip =
  | 'Latest'
  | 'Trending'
  | 'Most Helpful'
  | 'Repair'
  | 'Marketplace'
  | 'Donation'
  | 'Circular Economy'
  | 'Announcements'
  | 'Tips'
  | 'Success Stories';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: RoleBadge;
  badgeTitle?: string;
  karmaPoints: number;
  solvedCount: number;
}

export interface PostReply {
  id: string;
  author: Author;
  content: string;
  timeAgo: string;
  likes: number;
  isHelpfulAnswer?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  content: string;
  author: Author;
  category: PostCategory;
  tags: string[];
  timeAgo: string;
  createdAt: string;
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  isPinned?: boolean;
  isTrending?: boolean;
  images?: string[];
  replies?: PostReply[];
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface RepairGuideStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface RepairGuide {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  estimatedTime: string;
  category: string;
  views: number;
  likes: number;
  bookmarks: number;
  author: Author;
  toolsRequired: string[];
  partsNeeded: string[];
  steps: RepairGuideStep[];
  warningNote?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: RoleBadge;
  karmaPoints: number;
  solvedQuestions: number;
  badges: string[];
  followersCount: number;
  location: string;
  bio: string;
  isFollowing?: boolean;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  role: RoleBadge;
  points: number;
  level: string;
  solvedQuestions: number;
  streakDays: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Repair Workshop' | 'Recycling Drive' | 'Webinar' | 'Hackathon' | 'Community Challenge';
  date: string;
  time: string;
  location: string;
  mode: 'Online' | 'In-Person';
  organizer: string;
  image: string;
  attendeesCount: number;
  isRSVPed?: boolean;
  description: string;
}

export interface CommunityNotification {
  id: string;
  type: 'reply' | 'mention' | 'like' | 'bookmark' | 'announcement';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  linkId?: string;
}

export const MOCK_COMMUNITY_STATS = {
  totalMembers: '42,850+',
  questionsSolved: '18,420+',
  repairGuides: '3,150+',
  expertContributors: '890+',
  postsThisMonth: '2,410+',
};

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'How I revived an unusable 2017 MacBook Pro with thermal paste reapplication & NVMe adapter',
    description:
      'Detailed log of restoring a throttling i7 MacBook Pro. Dropped CPU idle temps from 74°C down to 42°C and boosted overall speed by 3x.',
    content:
      'Many users discard 2016-2018 Intel MacBooks thinking the logic board has degraded. In 85% of cases, dried factory thermal paste causes severe thermal throttling. Here is my exact process using Arctic MX-6 and a passive copper heat-pad mod. \n\n1. Disconnect battery snap connector safely\n2. Clean heatsink contacts with 99% Isopropyl Alcohol\n3. Apply pea-sized MX-6 compound\n4. Upgrade SSD using Sintech NVMe adapter with M.2 2280 NVMe SSD\n\nTotal cost was under $45 and reduced e-waste by 1.8 kg!',
    author: {
      id: 'usr-1',
      name: 'Dr. Aris Thorne',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'Repair Expert',
      badgeTitle: 'Hardware Specialist',
      karmaPoints: 4820,
      solvedCount: 142,
    },
    category: 'Repair',
    tags: ['MacBook', 'ThermalPaste', 'DIYRepair', 'HardwareMod'],
    timeAgo: '2 hours ago',
    createdAt: '2026-08-06T10:00:00Z',
    repliesCount: 18,
    viewsCount: 1240,
    likesCount: 156,
    bookmarksCount: 42,
    isPinned: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800',
    ],
    replies: [
      {
        id: 'rep-101',
        author: {
          id: 'usr-2',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          role: 'Verified Contributor',
          karmaPoints: 2150,
          solvedCount: 64,
        },
        content: 'This saved my 2017 Touch Bar model! The copper pad trick lowered kernel_task usage instantly.',
        timeAgo: '1 hour ago',
        likes: 14,
        isHelpfulAnswer: true,
      },
      {
        id: 'rep-102',
        author: {
          id: 'usr-3',
          name: 'Marcus Vance',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          role: 'Student',
          karmaPoints: 890,
          solvedCount: 12,
        },
        content: 'Did you need a specific screwdriver bit for the P5 pentalobe bottom screws?',
        timeAgo: '45 mins ago',
        likes: 3,
      },
    ],
  },
  {
    id: 'post-2',
    title: 'Circular Economy Benchmark: Comparing Refurbished vs New Laptop Lifecycle Carbon Impact',
    description:
      'We calculated the full LCA (Life Cycle Assessment) of buying a 3-year-old enterprise laptop versus manufacturing a new budget model.',
    content:
      'Manufacturing a single modern ultrabook generates approximately 280 kg of CO2e and requires over 1,500 liters of water during wafer fabrication. Extending the lifespan of an existing Dell XPS or ThinkPad by 24 months cuts total annual footprint by 64%. \n\nKey takeaways from our open study:\n• 80% of laptop emissions occur during raw material extraction\n• Modular repairability boosts resale residual value by 35%\n• E-waste dropoffs should prioritize donor data sanitization',
    author: {
      id: 'usr-4',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      role: 'NGO',
      badgeTitle: 'Sustainability Lead',
      karmaPoints: 3410,
      solvedCount: 98,
    },
    category: 'Circular Economy',
    tags: ['CarbonFootprint', 'EwasteReduction', 'LCAStudy', 'Sustainability'],
    timeAgo: '4 hours ago',
    createdAt: '2026-08-06T08:00:00Z',
    repliesCount: 24,
    viewsCount: 1890,
    likesCount: 210,
    bookmarksCount: 68,
    isPinned: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    ],
    replies: [
      {
        id: 'rep-201',
        author: {
          id: 'usr-5',
          name: 'David Kalu',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
          role: 'Moderator',
          karmaPoints: 5900,
          solvedCount: 210,
        },
        content: 'Spot on! This research will be included in our upcoming Q3 Circular Tech Whitepaper.',
        timeAgo: '3 hours ago',
        likes: 19,
        isHelpfulAnswer: true,
      },
    ],
  },
  {
    id: 'post-3',
    title: 'Donated 15 Refurbished ThinkPads to Local STEM Academy - Here is how we prepped them',
    description:
      'Through RevalueIQ Donation Hub, our repair club sanitized drives using DoD 5220.22-M wipe and upgraded RAM to 16GB.',
    content:
      'We collected older ThinkPad T480 units donated by local tech firms. Using Linux DBAN bootables, we thoroughly wiped all telemetry data, replaced worn keyboards, installed lightweight Ubuntu LTS, and handed them over to 15 students preparing for robotics competition.',
    author: {
      id: 'usr-6',
      name: 'Prof. Julian Vance',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      role: 'Verified Contributor',
      badgeTitle: 'STEM Mentor',
      karmaPoints: 1980,
      solvedCount: 52,
    },
    category: 'Donation',
    tags: ['DigitalInclusion', 'DonationHub', 'Refurbished', 'STEMEducation'],
    timeAgo: '6 hours ago',
    createdAt: '2026-08-06T06:00:00Z',
    repliesCount: 11,
    viewsCount: 940,
    likesCount: 118,
    bookmarksCount: 29,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    ],
    replies: [],
  },
  {
    id: 'post-4',
    title: 'Before & After: Restoring a water-damaged iPhone 13 Pro motherboard under ultrasonic bath',
    description:
      'Micro-soldering process replacing corroded capacitor filters on the VDD_MAIN rail after a salt-water immersion.',
    content:
      'A local user brought in an iPhone 13 Pro deemed "unfixable" by official service centers. After 15 minutes in a 99% IPA ultrasonic bath, we pinpointed a shorted decoupling cap on VDD_MAIN under thermal camera. Replaced with 0201 SMD component. Data completely recovered!',
    author: {
      id: 'usr-1',
      name: 'Dr. Aris Thorne',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'Repair Expert',
      badgeTitle: 'Micro-soldering Lead',
      karmaPoints: 4820,
      solvedCount: 142,
    },
    category: 'Success Stories',
    tags: ['iPhoneRepair', 'MicroSoldering', 'DataRecovery', 'BeforeAfter'],
    timeAgo: '12 hours ago',
    createdAt: '2026-08-06T00:00:00Z',
    repliesCount: 31,
    viewsCount: 2450,
    likesCount: 340,
    bookmarksCount: 95,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    ],
    replies: [],
  },
  {
    id: 'post-5',
    title: 'Top 5 Tools Every Smartphone DIY Repairer Should Have in 2026',
    description:
      'A beginner-friendly breakdown of essential precision drivers, heat pads, spudgers, and ESD-safe tweezers.',
    content:
      'If you are starting your repair journey on RevalueIQ, do not buy cheap $5 toolkit sets that strip screw heads. Invest in high-grade S2 steel precision bits (P2, P5, Y000, Phillips 000), a digital temperature-controlled heat mat, and suction pliers.',
    author: {
      id: 'usr-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      role: 'Verified Contributor',
      karmaPoints: 2150,
      solvedCount: 64,
    },
    category: 'Tips',
    tags: ['Toolkits', 'DIYGuide', 'SmartphoneRepair', 'BeginnerTips'],
    timeAgo: '1 day ago',
    createdAt: '2026-08-05T12:00:00Z',
    repliesCount: 9,
    viewsCount: 780,
    likesCount: 89,
    bookmarksCount: 35,
    replies: [],
  },
  {
    id: 'post-6',
    title: 'Announcement: RevalueIQ Global E-Waste Drive & Hardware Hackathon starting Sept 1st',
    description:
      'Join our month-long global event! Earn double Eco Credits, free diagnostic tools, and certification badges.',
    content:
      'We are excited to launch the 2026 RevalueIQ Hackathon & E-Waste Drive. Participating local repair hubs and NGO partners will host live disassembly workshops, free battery health checkups, and recycling collection points.',
    author: {
      id: 'usr-5',
      name: 'David Kalu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      role: 'Moderator',
      badgeTitle: 'Community Manager',
      karmaPoints: 5900,
      solvedCount: 210,
    },
    category: 'Announcements',
    tags: ['Hackathon', 'EwasteDrive', 'RevalueIQEvents', 'EcoPoints'],
    timeAgo: '2 days ago',
    createdAt: '2026-08-04T10:00:00Z',
    repliesCount: 45,
    viewsCount: 3120,
    likesCount: 490,
    bookmarksCount: 180,
    isPinned: true,
    replies: [],
  },
];

export const MOCK_REPAIR_GUIDES: RepairGuide[] = [
  {
    id: 'guide-1',
    title: 'Dell XPS 13 Battery Replacement & Battery Health Reset',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Easy',
    estimatedTime: '20 Mins',
    category: 'Laptops',
    views: 4520,
    likes: 380,
    bookmarks: 140,
    author: {
      id: 'usr-1',
      name: 'Dr. Aris Thorne',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'Repair Expert',
      karmaPoints: 4820,
      solvedCount: 142,
    },
    toolsRequired: ['T5 Torx Screwdriver', 'Phillips #00 Screwdriver', 'Plastic Spudger', 'Anti-static Wrist Strap'],
    partsNeeded: ['Original 52Wh Dell XPS 13 Replacement Battery (Type H5CKD)'],
    warningNote: 'Make sure to disconnect AC power adapter and ground yourself before opening bottom chassis.',
    steps: [
      {
        stepNumber: 1,
        title: 'Remove Bottom Case Screws',
        description: 'Unscrew the 8 T5 Torx screws around the edge and 1 Phillips screw hidden under the XPS center badge.',
      },
      {
        stepNumber: 2,
        title: 'Disconnect Battery Cable',
        description: 'Using a plastic spudger, gently pry the battery connector parallel to the motherboard.',
      },
      {
        stepNumber: 3,
        title: 'Replace Battery Unit',
        description: 'Unscrew 4 Phillips screws holding the old battery. Insert new unit and re-torque screws evenly.',
      },
      {
        stepNumber: 4,
        title: 'BIOS Battery Calibration',
        description: 'Boot into Dell Diagnostics by tapping F12 at startup. Run battery health check and calibrate cycle.',
      },
    ],
  },
  {
    id: 'guide-2',
    title: 'iPhone 12/13 OLED Screen Replacement & TrueTone Serial Transfer',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Medium',
    estimatedTime: '35 Mins',
    category: 'Smartphones',
    views: 8900,
    likes: 720,
    bookmarks: 290,
    author: {
      id: 'usr-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      role: 'Verified Contributor',
      karmaPoints: 2150,
      solvedCount: 64,
    },
    toolsRequired: ['P2 Pentalobe Screwdriver', 'Y000 Tri-Point Screwdriver', 'Heat Mat (70°C)', 'iSclack Suction Cup'],
    partsNeeded: ['OEM-Grade Soft OLED Display Assembly', 'Waterproof Adhesive Frame Gasket'],
    warningNote: 'Do not damage the flex cable connecting the earpiece speaker array to preserve Face ID.',
    steps: [
      {
        stepNumber: 1,
        title: 'Heat Enclosure Edge',
        description: 'Apply heat at 70°C for 3 minutes to soften internal perimeter adhesive.',
      },
      {
        stepNumber: 2,
        title: 'Open Screen Assembly',
        description: 'Attach suction cup to lower glass edge and slide guitar pick pry tool along left seam.',
      },
      {
        stepNumber: 3,
        title: 'Transfer EEPROM Serial',
        description: 'Connect old and new display to programmer programmer box to clone TrueTone display data.',
      },
    ],
  },
  {
    id: 'guide-3',
    title: 'Fixing Nintendo Switch Joy-Con Analog Stick Drift Permanently',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Easy',
    estimatedTime: '15 Mins',
    category: 'Gaming Consoles',
    views: 12400,
    likes: 1150,
    bookmarks: 510,
    author: {
      id: 'usr-3',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      role: 'Student',
      karmaPoints: 890,
      solvedCount: 12,
    },
    toolsRequired: ['Y0 Tri-Wing Screwdriver', 'JIS 00 Screwdriver', 'Tweezers'],
    partsNeeded: ['Hall-Effect Magnetic Anti-Drift Joystick Replacement'],
    steps: [
      {
        stepNumber: 1,
        title: 'Remove Tri-Wing Screws',
        description: 'Take out 4 rear Y-screws from Joy-Con housing taking care not to strip soft metal.',
      },
      {
        stepNumber: 2,
        title: 'Swap Joystick Module',
        description: 'Unclip ribbon cable ZIF connector and swap in contactless Hall-effect stick.',
      },
    ],
  },
];

export const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    id: 'usr-1',
    name: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'Repair Expert',
    karmaPoints: 4820,
    solvedQuestions: 142,
    badges: ['Master Repairer', 'Micro-Soldering Ace', 'Top 1% Contributor'],
    followersCount: 1240,
    location: 'San Francisco, CA',
    bio: 'Lead Hardware Engineer passionate about modular electronics repair & right-to-repair advocacy.',
    isFollowing: true,
  },
  {
    id: 'usr-5',
    name: 'David Kalu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'Moderator',
    karmaPoints: 5900,
    solvedQuestions: 210,
    badges: ['Community Moderator', 'Eco Champion', 'LCA Analyst'],
    followersCount: 1890,
    location: 'London, UK',
    bio: 'Circular economy researcher dedicated to zero e-waste landfill initiatives.',
    isFollowing: false,
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'Verified Contributor',
    karmaPoints: 2150,
    solvedQuestions: 64,
    badges: ['DIY Specialist', 'Top Mentor'],
    followersCount: 840,
    location: 'Vancouver, Canada',
    bio: 'Open source hardware tinkerer & refurbished laptop distributor for schools.',
    isFollowing: false,
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    role: 'NGO',
    karmaPoints: 3410,
    solvedQuestions: 98,
    badges: ['NGO Partner', 'Green Alliance'],
    followersCount: 960,
    location: 'Berlin, Germany',
    bio: 'Directing e-waste recycling networks and community donation programs across EU.',
    isFollowing: true,
  },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'lead-1',
    rank: 1,
    name: 'David Kalu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'Moderator',
    points: 5900,
    level: 'Level 12 Grandmaster',
    solvedQuestions: 210,
    streakDays: 45,
  },
  {
    id: 'lead-2',
    rank: 2,
    name: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'Repair Expert',
    points: 4820,
    level: 'Level 10 Expert',
    solvedQuestions: 142,
    streakDays: 32,
  },
  {
    id: 'lead-3',
    rank: 3,
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    role: 'NGO',
    points: 3410,
    level: 'Level 8 Lead',
    solvedQuestions: 98,
    streakDays: 28,
  },
  {
    id: 'lead-4',
    rank: 4,
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'Verified Contributor',
    points: 2150,
    level: 'Level 6 Contributor',
    solvedQuestions: 64,
    streakDays: 19,
  },
  {
    id: 'lead-5',
    rank: 5,
    name: 'Prof. Julian Vance',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    role: 'Verified Contributor',
    points: 1980,
    level: 'Level 5 Mentor',
    solvedQuestions: 52,
    streakDays: 14,
  },
  {
    id: 'lead-6',
    rank: 6,
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'Student',
    points: 890,
    level: 'Level 3 Pioneer',
    solvedQuestions: 12,
    streakDays: 7,
  },
];

export const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Live Micro-Soldering & Board Diagnostics Masterclass',
    category: 'Repair Workshop',
    date: 'Aug 18, 2026',
    time: '4:00 PM - 6:00 PM EST',
    location: 'Zoom / RevalueIQ Live Stream',
    mode: 'Online',
    organizer: 'RevalueIQ Expert Hub',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    attendeesCount: 340,
    isRSVPed: true,
    description:
      'Learn how to trace short circuits using thermal cameras, multimeter diode mode test points, and ultrasonic cleaners.',
  },
  {
    id: 'evt-2',
    title: 'Citywide E-Waste Collection & Laptop Refurbishing Drive',
    category: 'Recycling Drive',
    date: 'Aug 24, 2026',
    time: '9:00 AM - 3:00 PM local',
    location: 'GreenTech Center, San Francisco',
    mode: 'In-Person',
    organizer: 'SF Eco Alliance & RevalueIQ',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
    attendeesCount: 180,
    isRSVPed: false,
    description:
      'Bring old smartphones, tablets, or laptops! Free disk wipes on site and instantaneous RevalueIQ trade-in/donation appraisal.',
  },
  {
    id: 'evt-3',
    title: 'Circular Tech Hackathon: Open Source Diagnostics Tools',
    category: 'Hackathon',
    date: 'Sept 01 - Sept 07, 2026',
    time: 'All Week Global Virtual Event',
    location: 'RevalueIQ GitHub & Discord',
    mode: 'Online',
    organizer: 'RevalueIQ Engineering Team',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    attendeesCount: 620,
    isRSVPed: false,
    description:
      'Build open-source battery health, SSD telemetry, and component longevity algorithms. $10,000 total eco-grant prizes.',
  },
];

export const MOCK_NOTIFICATIONS: CommunityNotification[] = [
  {
    id: 'notif-1',
    type: 'reply',
    title: 'New Reply on your Post',
    message: 'Dr. Aris Thorne replied to "MacBook thermal paste restoration guide".',
    timeAgo: '15 mins ago',
    isRead: false,
    linkId: 'post-1',
  },
  {
    id: 'notif-2',
    type: 'like',
    title: 'Post Liked',
    message: 'Sarah Chen and 12 others liked your comment on Circular LCA study.',
    timeAgo: '1 hour ago',
    isRead: false,
    linkId: 'post-2',
  },
  {
    id: 'notif-3',
    type: 'announcement',
    title: 'Global Event Announcement',
    message: 'RevalueIQ Hackathon Sept 2026 early registrations are now open!',
    timeAgo: '3 hours ago',
    isRead: true,
    linkId: 'evt-3',
  },
  {
    id: 'notif-4',
    type: 'bookmark',
    title: 'Guide Saved',
    message: '5 users bookmarked your Dell XPS Battery Replacement Guide.',
    timeAgo: '5 hours ago',
    isRead: true,
    linkId: 'guide-1',
  },
];
