export type EventCategory =
  | 'music'
  | 'party_nightlife'
  | 'cultural_festival'
  | 'food_drink'
  | 'comedy'
  | 'workshop_wellness'
  | 'beach_festival'
  | 'traditional_carnival'

export type EventTimeFilter = 'today' | 'tomorrow' | 'weekend' | 'upcoming'
export type EventRegion = 'North Goa' | 'South Goa' | 'Panaji & Central'

export interface EventReview {
  id: string
  author: string
  avatar: string
  rating: number // 1 to 5
  date: string
  comment: string
}

export interface TicketTier {
  id: string
  name: string
  price: number
  description: string
  available: boolean
}

export interface EventItem {
  id: string
  slug: string
  name: string
  category: EventCategory
  categoryLabel: string
  region: EventRegion
  city: string
  venue: string
  fullAddress: string
  coordinates: {
    lat: number
    lng: number
  }
  googleMapsUrl: string
  startDate: string // e.g. "Nov 14, 2026"
  endDate?: string
  startTime: string // e.g. "4:00 PM"
  endTime: string // e.g. "11:00 PM"
  dayOfWeek: string // e.g. "Saturday"
  month: string // e.g. "NOV"
  day: string // e.g. "14"
  timeFilter: EventTimeFilter
  isFeatured: boolean
  isPopular: boolean
  isParty: boolean
  free: boolean
  price: number
  priceUnit: string
  image: string
  gallery: string[]
  description: string
  about: string
  lineup?: string[]
  highlights: string[]
  guidelines: string[]
  organizer: {
    name: string
    contact?: string
    verified: boolean
  }
  rating: number
  reviewsCount: number
  ticketTiers: TicketTier[]
  reviews: EventReview[]
}

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'All Events', icon: 'Grid' },
  { id: 'music', label: 'Music Festivals', icon: 'Music' },
  { id: 'party_nightlife', label: 'Party & Nightlife', icon: 'Sparkles' },
  { id: 'beach_festival', label: 'Beach Parties', icon: 'Waves' },
  { id: 'food_drink', label: 'Food & Wine', icon: 'Utensils' },
  { id: 'cultural_festival', label: 'Culture & Arts', icon: 'Palette' },
  { id: 'traditional_carnival', label: 'Traditional Festivals', icon: 'PartyPopper' },
  { id: 'workshop_wellness', label: 'Wellness & Yoga', icon: 'Heart' },
]

export const EVENTS_DATA: EventItem[] = [
  // 1. Sunburn Goa EDM Music Festival
  {
    id: 'ev-1',
    slug: 'sunburn-goa-music-festival',
    name: 'Sunburn Goa EDM Music Festival 2026',
    category: 'music',
    categoryLabel: 'Music Festival',
    region: 'North Goa',
    city: 'Vagator',
    venue: 'Vagator Clifftop Arena',
    fullAddress: 'Vagator Beach Rd, Ozran, Vagator, Goa 403509',
    coordinates: { lat: 15.6028, lng: 73.7336 },
    googleMapsUrl: 'https://maps.google.com/?q=Vagator+Beach+Goa',
    startDate: 'Dec 28, 2026',
    endDate: 'Dec 31, 2026',
    startTime: '2:00 PM',
    endTime: '10:00 PM',
    dayOfWeek: 'Saturday',
    month: 'DEC',
    day: '28',
    timeFilter: 'upcoming',
    isFeatured: true,
    isPopular: true,
    isParty: true,
    free: false,
    price: 3499,
    priceUnit: '/pass',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
    ],
    description:
      'Asia’s biggest electronic dance music carnival returns to the sun-drenched cliffs of Vagator. Experience 4 mega stages, international headliners, pyrotechnic spectacles, and thousands of global music lovers.',
    about:
      'Sunburn Goa is synonymous with year-end celebrations in India. Taking over the expansive laterite cliffs of Vagator, the multi-day festival showcases premier EDM, techno, and progressive house superstars alongside artisan food stalls, flea bazaars, and beachside camping.',
    lineup: ['Martin Garrix', 'Armin van Buuren', 'Lost Frequencies', 'Nucleya', 'Ankytrixx'],
    highlights: [
      '4 massive themed stages with world-class spatial sound systems',
      'Sunset clifftop view overlooking Little Vagator beach',
      'Gourmet food village featuring authentic Goan seafood and international street food',
      'Curated artisan flea market and chill-out lounges',
    ],
    guidelines: [
      'Age limit: 18 years and above. Valid government photo ID mandatory.',
      'Wristband exchange counter opens at 12:00 PM daily at the venue box office.',
      'Outside food, beverages, and professional cameras are strictly prohibited.',
      'Designated designated parking available at Ozran ground with shuttle service.',
    ],
    organizer: {
      name: 'Sunburn Entertainment Pvt Ltd',
      contact: 'support@sunburn.in',
      verified: true,
    },
    rating: 4.9,
    reviewsCount: 3420,
    ticketTiers: [
      { id: 'sb-gen', name: 'General Access (Single Day)', price: 3499, description: 'Access to all regular stages and food court', available: true },
      { id: 'sb-season', name: '4-Day Season Pass', price: 8999, description: 'Unlimited 4-day festival access with fast-track entry', available: true },
      { id: 'sb-vip', name: 'VIP Clifftop Deck', price: 14999, description: 'Elevated viewing lounge, private bars, dedicated restrooms & fast entry', available: true },
    ],
    reviews: [
      {
        id: 'rev-sb-1',
        author: 'Rohan Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Absolute peak energy! The sound production on the main cliff stage was world-class and watching the sunset over the Arabian Sea while listening to top DJs was unforgettable.',
      },
      {
        id: 'rev-sb-2',
        author: 'Natasha Fernandez',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120',
        rating: 5,
        date: 'September 2026',
        comment:
          'Unmatched vibe. The venue layout is smooth, cashless payments worked great, and security was well organized. Highly recommended!',
      },
      {
        id: 'rev-sb-3',
        author: 'Vikram Joshi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120',
        rating: 4,
        date: 'August 2026',
        comment:
          'Great festival experience! Gets very crowded post 6 PM so plan to arrive early to beat the entry queue.',
      },
    ],
  },

  // 2. HillTop Goa Sunday Trance Psychedelic Gathering
  {
    id: 'ev-2',
    slug: 'hilltop-sunday-sunset-party',
    name: 'HillTop Sunday Sunset Psychedelic Gathering',
    category: 'party_nightlife',
    categoryLabel: 'Party & Nightlife',
    region: 'North Goa',
    city: 'Vagator',
    venue: 'HillTop Goa',
    fullAddress: 'HillTop Vagator, Near Michael’s School, Vagator, Goa 403509',
    coordinates: { lat: 15.5962, lng: 73.7441 },
    googleMapsUrl: 'https://maps.google.com/?q=HillTop+Vagator+Goa',
    startDate: 'Every Sunday',
    startTime: '5:00 PM',
    endTime: '10:00 PM',
    dayOfWeek: 'Sunday',
    month: 'WEEKLY',
    day: 'SUN',
    timeFilter: 'weekend',
    isFeatured: true,
    isPopular: true,
    isParty: true,
    free: false,
    price: 1500,
    priceUnit: '/entry',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
    ],
    description:
      'The quintessential Goa party tradition since the 1970s. HillTop’s Sunday sunset session brings UV-glowing neon art, swaying palm canopies, and iconic psychedelic trance music under the open skies.',
    about:
      'Nestled between palm groves in Vagator, HillTop is world-renowned as the spiritual home of Goa Trance. Every Sunday evening, international travelers and locals gather to dance under UV string-art sculptures as celebrated DJs craft an infectious musical journey.',
    lineup: ['Starling (HillTop)', 'Ajja', 'Tristan', 'Arjun Vagale'],
    highlights: [
      'Legendary open-air natural amphitheatre surrounded by illuminated coconut palms',
      'Iconic handmade UV neon art installations and mandala tapestries',
      'Artisan craft market with handcrafted jewelry, bohemian clothes, and chai stalls',
      'Warm, friendly global community welcoming dancers of all backgrounds',
    ],
    guidelines: [
      'Gates open at 4:30 PM. Peak crowd arrives around 6:30 PM for sunset.',
      'Entry is 21+. Please carry digital or physical photo ID.',
      'Eco-conscious venue: single-use plastics are strictly prohibited.',
    ],
    organizer: {
      name: 'HillTop Goa Live',
      contact: 'events@hilltopgoa.com',
      verified: true,
    },
    rating: 4.9,
    reviewsCount: 2890,
    ticketTiers: [
      { id: 'ht-standard', name: 'General Sunday Pass', price: 1500, description: 'Includes venue entry & dancefloor access', available: true },
      { id: 'ht-couple', name: 'Couple Entry Pass', price: 2500, description: 'Discounted access for couples', available: true },
    ],
    reviews: [
      {
        id: 'rev-ht-1',
        author: 'Kavita Menon',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'If you come to Goa and don’t visit HillTop on Sunday, you haven’t experienced the real Goa! The neon decorations, hypnotic beats, and vibrant crowd are unmatched.',
      },
      {
        id: 'rev-ht-2',
        author: 'Marcus Lindner',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Unbelievable atmosphere. Music starts melodic at 5 PM and peaks at sunset. Great sound system and super friendly security staff.',
      },
    ],
  },

  // 3. Goa Sunsplash Reggae Beach Festival
  {
    id: 'ev-3',
    slug: 'goa-sunsplash-reggae-festival',
    name: 'Goa Sunsplash Reggae Beach Festival',
    category: 'beach_festival',
    categoryLabel: 'Beach Festival',
    region: 'North Goa',
    city: 'Ashwem',
    venue: 'Riva Beach Resort Grounds',
    fullAddress: 'Mandrem-Ashwem Beach Rd, Pernem, Ashwem, Goa 403527',
    coordinates: { lat: 15.6622, lng: 73.7154 },
    googleMapsUrl: 'https://maps.google.com/?q=Ashwem+Beach+Goa',
    startDate: 'Jan 16, 2027',
    endDate: 'Jan 18, 2027',
    startTime: '1:00 PM',
    endTime: '10:00 PM',
    dayOfWeek: 'Friday',
    month: 'JAN',
    day: '16',
    timeFilter: 'upcoming',
    isFeatured: true,
    isPopular: true,
    isParty: false,
    free: false,
    price: 2499,
    priceUnit: '/day',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200',
    ],
    description:
      'India’s premier international reggae, roots, and dub celebration right on the pristine sands of Ashwem Beach. Featuring custom handcrafted bass sound systems, live bands, yoga workshops, and seaside dance.',
    about:
      'Goa Sunsplash brings conscious roots music and holistic beachside vibes together. With artists flying in from Jamaica, UK, France, and Africa, enjoy two custom sound systems (10,000 Lion Sound System and Reggae Rajahs), sunset yoga sessions, and organic Caribbean & Goan food.',
    lineup: ['Anthony B (Jamaica)', 'Earl Gateshead (UK)', 'Reggae Rajahs', 'General Zooz', '10,000 Lions'],
    highlights: [
      'Two handcrafted Jamaican-style heavyweight bass sound systems on the sand',
      'Sunset drum circles and morning beachfront vinyasa yoga workshops',
      'Caribbean jerk chicken, vegan organic food trucks, and fresh fruit bars',
      'Kid-friendly daytime atmosphere with beach art installations',
    ],
    guidelines: [
      'Family and dog friendly festival.',
      'Bring beach towels and sunscreen for afternoon beach sessions.',
      'Re-entry permitted with verified festival wristband.',
    ],
    organizer: {
      name: 'Reggae Rajahs & Sunsplash Collective',
      contact: 'info@goasunsplash.com',
      verified: true,
    },
    rating: 4.8,
    reviewsCount: 1650,
    ticketTiers: [
      { id: 'gs-single', name: 'Day Pass', price: 2499, description: 'Single day access to both sound system stages', available: true },
      { id: 'gs-weekend', name: 'Full 3-Day Weekend Pass', price: 5499, description: 'All-weekend access + morning yoga sessions', available: true },
    ],
    reviews: [
      {
        id: 'rev-gs-1',
        author: 'Tanvi Shirodkar',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Hands down the most peaceful, joyful, and wholesome festival in Goa! Dancing barefoot on the warm sand to deep bass while watching the sunset is pure therapy.',
      },
    ],
  },

  // 4. Goa Carnival & Grand Float Parade
  {
    id: 'ev-4',
    slug: 'goa-carnival-grand-parade',
    name: 'Goa Carnival & King Momo Grand Float Parade',
    category: 'traditional_carnival',
    categoryLabel: 'Traditional Carnival',
    region: 'Panaji & Central',
    city: 'Panaji',
    venue: 'DB Marg Riverside Promenade',
    fullAddress: 'Dayanand Bandodkar Marg, Mandovi Promenade, Panaji, Goa 403001',
    coordinates: { lat: 15.4989, lng: 73.8278 },
    googleMapsUrl: 'https://maps.google.com/?q=Panaji+Promenade+Goa',
    startDate: 'Feb 13, 2027',
    endDate: 'Feb 16, 2027',
    startTime: '3:30 PM',
    endTime: '8:30 PM',
    dayOfWeek: 'Saturday',
    month: 'FEB',
    day: '13',
    timeFilter: 'upcoming',
    isFeatured: true,
    isPopular: true,
    isParty: false,
    free: true,
    price: 0,
    priceUnit: 'Free Entry',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200',
    ],
    description:
      'The legendary 500-year-old Goan carnival tradition. Presided over by King Momo under the decree of "Kha, Piye, Aani Maza Kar" (Eat, Drink, and Make Merry), witness vibrant floats, brass bands, and street masquerades.',
    about:
      'Introduced during Portuguese rule, Goa Carnival is celebrated uniquely in Goa before the Catholic season of Lent. Spectacular floats depicting mythology, Goan village culture, marine ecology, and humor glide down the palm-lined riverside of Panaji, followed by Margao, Vasco, and Mapusa.',
    lineup: ['King Momo Decree & Court', 'Goa Police Brass Band', 'Corridinho Folk Dancers', 'Konkani Pop Ensembles'],
    highlights: [
      'Grand 3-kilometer parade featuring over 80 vibrant decorated floats',
      'Traditional Goan Red and Black Dance costume ball in the evening',
      'Authentic street delicacies: Bebinca, Dodol, Goan Chorizo Pao, and fresh poie',
      'Completely free open-to-public street festival along the scenic Mandovi river',
    ],
    guidelines: [
      'Arrive by 2:30 PM to secure prime viewing spots along the DB Marg railing.',
      'Traffic diversions will be in place around Panaji city center; park at multi-level parking.',
      'Wear bright colorful carnival attire and comfortable walking shoes.',
    ],
    organizer: {
      name: 'Department of Tourism, Government of Goa',
      contact: 'carnival@goatourism.gov.in',
      verified: true,
    },
    rating: 4.9,
    reviewsCount: 5210,
    ticketTiers: [
      { id: 'gc-free', name: 'Open Street Viewing', price: 0, description: 'Free public street access along the parade route', available: true },
      { id: 'gc-grandstand', name: 'VIP Grandstand Seating', price: 499, description: 'Shaded elevated seating with bottled water & clear view', available: true },
    ],
    reviews: [
      {
        id: 'rev-gc-1',
        author: 'Savio Coutinho',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'The soul of Goa on full display! The creativity of the floats, the brass music, and the infectious energy of King Momo make this a world-class celebration.',
      },
    ],
  },

  // 5. Saturday Night Bazaar Live Music & Flea Market
  {
    id: 'ev-5',
    slug: 'saturday-night-market-arpora',
    name: 'Saturday Night Bazaar & Live Stage',
    category: 'food_drink',
    categoryLabel: 'Food & Live Music',
    region: 'North Goa',
    city: 'Arpora',
    venue: 'Arpora Hillside Bazaar Grounds',
    fullAddress: 'Aguada - Siolim Rd, Arpora, North Goa 403516',
    coordinates: { lat: 15.5684, lng: 73.7661 },
    googleMapsUrl: 'https://maps.google.com/?q=Saturday+Night+Market+Arpora',
    startDate: 'Every Saturday',
    startTime: '6:00 PM',
    endTime: '1:00 AM',
    dayOfWeek: 'Saturday',
    month: 'WEEKLY',
    day: 'SAT',
    timeFilter: 'weekend',
    isFeatured: true,
    isPopular: true,
    isParty: true,
    free: true,
    price: 0,
    priceUnit: 'Free Entry',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200',
    ],
    description:
      'Goa’s iconic night bazaar on the Arpora hillside. Hundreds of designer boutiques, live acoustic and rock stages, international culinary courts, and fire dancers under twinkling fairy lights.',
    about:
      'Spread across tiered hillside terraces, the Saturday Night Market is a world of its own. Browse handcrafted spices, silver jewelry, leather boots, and silk tunics while sipping spiced cocktails and listening to live world-music bands on the central amphitheatre stage.',
    lineup: ['The Goa Collective Live', 'Acoustic Soul Sessions', 'Fire Dancers of Anjuna'],
    highlights: [
      'Over 300 designer stalls run by international artists and local artisans',
      'Central stage hosting live blues, reggae, and acoustic rock bands all night',
      'Global food avenue: woodfired pizzas, Greek gyro, Goan chorizo, dim sums & desserts',
      'Upper level boutique cocktail bar with panoramic hillside view',
    ],
    guidelines: [
      'Free admission for all visitors.',
      'Parking is available on the main Arpora approach road (₹100 per car).',
      'Cash and UPI payments accepted at stalls.',
    ],
    organizer: {
      name: 'Arpora Cultural Bazaar Association',
      contact: 'hello@arporanightmarket.com',
      verified: true,
    },
    rating: 4.8,
    reviewsCount: 3120,
    ticketTiers: [
      { id: 'snm-free', name: 'General Admission', price: 0, description: 'Free entry to market, food avenue and live music stage', available: true },
    ],
    reviews: [
      {
        id: 'rev-snm-1',
        author: 'Ananya Roy',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Best shopping and nightlife combination in North Goa! The live band was fantastic and the food options are endless.',
      },
    ],
  },

  // 6. Curlies Anjuna Beach Shack Full Moon Psy Party
  {
    id: 'ev-6',
    slug: 'curlies-full-moon-beach-party',
    name: 'Curlies Anjuna Full Moon Beach Party',
    category: 'party_nightlife',
    categoryLabel: 'Beach Party',
    region: 'North Goa',
    city: 'Anjuna',
    venue: 'Curlies Beach Shack & Club',
    fullAddress: 'South Anjuna Beach, Near Flea Market, Anjuna, Goa 403509',
    coordinates: { lat: 15.5733, lng: 73.7412 },
    googleMapsUrl: 'https://maps.google.com/?q=Curlies+Beach+Shack+Goa',
    startDate: 'Tonight',
    startTime: '8:00 PM',
    endTime: '4:00 AM',
    dayOfWeek: 'Tonight',
    month: 'TONIGHT',
    day: 'NOW',
    timeFilter: 'today',
    isFeatured: true,
    isPopular: true,
    isParty: true,
    free: false,
    price: 999,
    priceUnit: '/person',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
    ],
    description:
      'Dance on the golden sands of South Anjuna under the full moonlight. Ocean waves crashing feet away, laser displays reflecting on the sea, and high-energy electronic beats.',
    about:
      'Curlies is a legendary institution that pioneered beach parties in Goa. Located at the extreme southern edge of Anjuna beach against the rocky cliff, its dual-level dancefloor, open-air beach shack, and beachfront sound system create an electric nocturnal playground.',
    lineup: ['DJ Ma Faiza', 'DJ Nelio (France)', 'Goa Gil Memorial Tribute', 'DJ Brainwash'],
    highlights: [
      'Beachfront dance floor right on the water edge of South Anjuna',
      'Dual levels with open-air beach deck and air-conditioned rooftop lounge',
      'Fresh seafood grills, wood-fired pizzas, and cocktail bars open all night',
      'Laser and fire dancing performers throughout the evening',
    ],
    guidelines: [
      'Age limit: 21+. Valid physical or Digilocker government ID required.',
      'Swim safety: Night swimming in the sea is prohibited by lifeguards.',
      'Cover charge includes 1 complimentary beverage token.',
    ],
    organizer: {
      name: 'Curlies Beach Management',
      contact: 'curliesgoa@gmail.com',
      verified: true,
    },
    rating: 4.7,
    reviewsCount: 4190,
    ticketTiers: [
      { id: 'cu-single', name: 'Single Entry + 1 Drink', price: 999, description: 'Includes entry and 1 craft beverage token', available: true },
      { id: 'cu-couple', name: 'Couple Entry + 2 Drinks', price: 1699, description: 'Discounted couple entry with 2 beverage tokens', available: true },
    ],
    reviews: [
      {
        id: 'rev-cu-1',
        author: 'Arjun Verma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Curlies at night is a vibe you have to experience at least once! Sea breeze on your face, cold beer, and incredible music under the stars.',
      },
    ],
  },

  // 7. Goa Food, Seafood & Cultural Fest
  {
    id: 'ev-7',
    slug: 'goa-food-cultural-festival',
    name: 'Goa Food & Cultural Festival 2026',
    category: 'food_drink',
    categoryLabel: 'Food & Culture',
    region: 'Panaji & Central',
    city: 'Panaji',
    venue: 'Campal Parade Ground',
    fullAddress: 'Campal, Near Kala Academy, Panaji, Goa 403001',
    coordinates: { lat: 15.4925, lng: 73.8122 },
    googleMapsUrl: 'https://maps.google.com/?q=Campal+Ground+Panaji',
    startDate: 'Nov 20, 2026',
    endDate: 'Nov 24, 2026',
    startTime: '5:00 PM',
    endTime: '11:00 PM',
    dayOfWeek: 'Friday',
    month: 'NOV',
    day: '20',
    timeFilter: 'upcoming',
    isFeatured: true,
    isPopular: true,
    isParty: false,
    free: true,
    price: 0,
    priceUnit: 'Free Entry',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
    ],
    description:
      'Celebrate Goan gastronomy with over 80 master chef stalls. Savor butter garlic crab, prawn balchão, pork vindaloo, poie bread, feni cocktails, and live Konkani pop performances.',
    about:
      'Organized by Goa Tourism, this 5-day culinary extravaganza brings the authentic culinary heritage of Goa into the spotlight. From traditional home recipes prepared in clay pots to contemporary fusion dishes from top restaurants, enjoy masterclasses, live cooking demos, and evening musical concerts.',
    lineup: ['Lorna Cordeiro (Nightingale of Goa)', 'Symphony Band', 'Chef Floyd Cardoz Foundation Showcase'],
    highlights: [
      'Over 80 curated seafood, barbecue, vegetarian, and dessert stalls',
      'Authentic Feni and Urrack tasting bar featuring infused heritage spirits',
      'Live masterclasses by renowned Goan chefs',
      'Daily Konkani folk and live pop music concerts on the main stage',
    ],
    guidelines: [
      'Admission is completely free and open to families.',
      'Eco-friendly event: cutlery is biodegradable; please dispose in compost bins.',
      'Paid parking available adjacent to SAG Campal ground.',
    ],
    organizer: {
      name: 'Goa Tourism Development Corporation (GTDC)',
      contact: 'events@goa-tourism.com',
      verified: true,
    },
    rating: 4.8,
    reviewsCount: 1980,
    ticketTiers: [
      { id: 'gf-free', name: 'General Public Admission', price: 0, description: 'Free entry to all food pavilions and concerts', available: true },
    ],
    reviews: [
      {
        id: 'rev-gf-1',
        author: 'Melanie D’Silva',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'The crab xec xec and fresh bebinca were heavenly! Listening to Lorna sing live under the stars while eating delicious seafood is as Goan as it gets.',
      },
    ],
  },

  // 8. Silent Noise Headphone Beach Rave
  {
    id: 'ev-8',
    slug: 'silent-noise-palolem-beach',
    name: 'Silent Noise Headphone Rave at Palolem',
    category: 'beach_festival',
    categoryLabel: 'Beach Party',
    region: 'South Goa',
    city: 'Palolem',
    venue: 'Neptune Point Cliff',
    fullAddress: 'South End of Palolem Beach, Canacona, Goa 403702',
    coordinates: { lat: 15.0099, lng: 74.0232 },
    googleMapsUrl: 'https://maps.google.com/?q=Palolem+Beach+Goa',
    startDate: 'Tomorrow Night',
    startTime: '9:00 PM',
    endTime: '4:00 AM',
    dayOfWeek: 'Tomorrow',
    month: 'TOMORROW',
    day: 'NIGHT',
    timeFilter: 'tomorrow',
    isFeatured: false,
    isPopular: true,
    isParty: true,
    free: false,
    price: 800,
    priceUnit: '/headset',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
    ],
    description:
      'South Goa’s legendary sound-free clifftop party. Put on multi-channel wireless glowing headphones and switch between 3 live DJs spinning EDM, funk, and reggae overlooking the dark Arabian Sea.',
    about:
      'Invented in Goa to comply with sound pollution laws while keeping the dancing alive till dawn, Silent Noise at Neptune Point offers an extraordinary sensory experience. Looking out over the tranquil moonlit waters of Palolem, hundreds dance together in surreal silence.',
    lineup: ['DJ Blue Channel (Deep House)', 'DJ Red Channel (Reggae & Hip Hop)', 'DJ Green Channel (Psy-Trance)'],
    highlights: [
      'Premium multi-channel wireless stereo LED headsets with individual volume dial',
      'Switch between 3 distinct live DJs battling simultaneously',
      'Stunning clifftop view overlooking the crescent bay of Palolem Beach',
      'Open until 4:00 AM without sound curfew restrictions',
    ],
    guidelines: [
      'Headphone security deposit: Photo ID or ₹1000 refundable cash deposit required.',
      'Entry is 18+. Outside alcohol not permitted.',
    ],
    organizer: {
      name: 'Silent Noise Goa',
      contact: 'palolem@silentnoise.in',
      verified: true,
    },
    rating: 4.8,
    reviewsCount: 2210,
    ticketTiers: [
      { id: 'sn-headset', name: 'Headphone Pass', price: 800, description: 'Includes entry & wireless 3-channel LED headset', available: true },
    ],
    reviews: [
      {
        id: 'rev-sn-1',
        author: 'Liam O’Connor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120',
        rating: 5,
        date: 'September 2026',
        comment:
          'Taking off the headphones and hearing only waves and hundreds of people singing together is surreal! Switching channels kept the party fresh all night.',
      },
    ],
  },

  // 9. Fontainhas Latin Heritage Walk & Fado Evening
  {
    id: 'ev-9',
    slug: 'fontainhas-heritage-fado-evening',
    name: 'Fontainhas Latin Heritage Walk & Fado Music',
    category: 'cultural_festival',
    categoryLabel: 'Cultural & Arts',
    region: 'Panaji & Central',
    city: 'Panaji',
    venue: 'Fontainhas Latin Quarter',
    fullAddress: 'Near St. Sebastian Chapel, Fontainhas, Panaji, Goa 403001',
    coordinates: { lat: 15.4989, lng: 73.8322 },
    googleMapsUrl: 'https://maps.google.com/?q=Fontainhas+Panaji+Goa',
    startDate: 'This Weekend',
    startTime: '4:30 PM',
    endTime: '8:30 PM',
    dayOfWeek: 'Saturday',
    month: 'WEEKEND',
    day: 'SAT',
    timeFilter: 'weekend',
    isFeatured: false,
    isPopular: true,
    isParty: false,
    free: false,
    price: 799,
    priceUnit: '/person',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
    ],
    description:
      'Stroll through Asia’s only conserved Portuguese heritage quarter with colonial ochre villas, ornate azulejo tiles, and conclude with an authentic candlelit Portuguese Fado guitar recital.',
    about:
      'Led by Goan historians, navigate the cobbled alleys of Fontainhas and Sao Tome. Discover the secrets of rooster weather-vanes, shell windows, and 200-year-old family bakeries before settling in a heritage veranda for an intimate live Portuguese Fado acoustic performance.',
    lineup: ['Fadista Sonia Shirsat', 'Portuguese 12-string Guitarist Orlando de Noronha'],
    highlights: [
      '2-hour guided walking tour of architectural wonders and secret alleyways',
      'Sampling hot Goan pastries at historic 1920s Confeitaria 31 de Janeiro',
      'Exclusive 1-hour live Portuguese Fado vocal & acoustic guitar concert',
      'Complimentary glass of port wine or seasonal spiced fruit punch',
    ],
    guidelines: [
      'Wear comfortable walking shoes with grip for cobblestone paths.',
      'Respect local residents: maintain quiet in narrow residential lanes.',
    ],
    organizer: {
      name: 'Soul Travelling Goa',
      contact: 'walks@soultravelling.in',
      verified: true,
    },
    rating: 4.9,
    reviewsCount: 1420,
    ticketTiers: [
      { id: 'fh-walk', name: 'Heritage Walk + Fado Recital', price: 799, description: 'Includes guide, food tasting, and concert admission', available: true },
    ],
    reviews: [
      {
        id: 'rev-fh-1',
        author: 'Pooja Bhatt',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Sonia Shirsat’s voice gave me goosebumps! A deeply moving cultural experience that shows the rich artistic soul of Goa beyond the beaches.',
      },
    ],
  },

  // 10. Morjim Sunset Acoustic & Wine Sessions
  {
    id: 'ev-10',
    slug: 'morjim-sunset-acoustic-jazz',
    name: 'Morjim Sunset Acoustic & Jazz Sessions',
    category: 'music',
    categoryLabel: 'Live Music',
    region: 'North Goa',
    city: 'Morjim',
    venue: 'Marbela Beach Club',
    fullAddress: 'Gawdewada, Morjim Beach, Morjim, Goa 403512',
    coordinates: { lat: 15.6322, lng: 73.7314 },
    googleMapsUrl: 'https://maps.google.com/?q=Marbela+Beach+Morjim',
    startDate: 'This Sunday',
    startTime: '5:00 PM',
    endTime: '9:30 PM',
    dayOfWeek: 'Sunday',
    month: 'WEEKEND',
    day: 'SUN',
    timeFilter: 'weekend',
    isFeatured: false,
    isPopular: false,
    isParty: true,
    free: false,
    price: 1200,
    priceUnit: '/person',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    ],
    description:
      'Unwind on Morjim’s soft white sands with chilled sangria, white cabanas, and live saxophone and acoustic guitar melodies as the sunset paints the horizon gold.',
    about:
      'Marbela’s Sunset Sessions offer sophisticated beach relaxation. Lounge on plush white daybeds overlooking the gentle waves of Morjim, paired with Mediterranean tapas, curated wines, and melodic jazz and bossa nova ensembles.',
    lineup: ['Fabio (Saxophone & House)', 'Goa Jazz Trio', 'Anish (Percussion)'],
    highlights: [
      'White-draped luxury beachfront cabanas facing the direct sunset',
      'Live saxophone, acoustic guitar, and gentle melodic house sets',
      'Curated wine list and Mediterranean wood-fired gourmet tapas',
      'Serene, relaxed coastal atmosphere away from the bustling party crowds',
    ],
    guidelines: [
      'Dress code: Beach chic / White coastal attire recommended.',
      'Cabana reservations require minimum spend.',
    ],
    organizer: {
      name: 'Marbela Hospitality Group',
      contact: 'reservations@marbelabeach.com',
      verified: true,
    },
    rating: 4.8,
    reviewsCount: 1150,
    ticketTiers: [
      { id: 'mb-entry', name: 'Sunset Entry + Sangria Glass', price: 1200, description: 'Includes entry & complimentary welcome beverage', available: true },
    ],
    reviews: [
      {
        id: 'rev-mb-1',
        author: 'Shruti Kapur',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120',
        rating: 5,
        date: 'October 2026',
        comment:
          'Pure relaxation and luxury. The live saxophonist playing while the sun set into the sea was magical. Excellent food and cocktails.',
      },
    ],
  },
]

