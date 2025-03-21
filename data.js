const { v4: uuidv4 } = require("uuid");
let sampleListings = [
  {
    title: "Modern Villa in Malibu",
    description: "A luxurious villa with breathtaking ocean views in Malibu.",
    image: {
      url: "https://media.istockphoto.com/id/1196336560/photo/beautiful-white-gazebo-and-tropical-flower-garden-on-caribbean-ocean-background-summer.jpg?s=612x612&w=0&k=20&c=PohymufkpeqWxY5VK-X558yJj32cnHQiNFlfRSW1a7o=",
      filename: "listing image",
    },
    price: 4500,
    location: "Malibu",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Cozy Cottage in the Cotswolds",
    description: "A charming cottage surrounded by the picturesque Cotswolds.",
    image: {
      url: "https://media.istockphoto.com/id/1453154418/photo/3d-rendering-of-white-and-black-modern-tudor-house-in-evening.jpg?s=612x612&w=0&https://media.istockphoto.com/id/1428319805/photo/3d-rendering-of-white-and-black-modern-tudor-house.jpg?s=612x612&w=0&k=20&c=U4hwvfipo3nWL3bB6cjiAllHnoJa3rlnVeZngDyB1XQ=k=20&c=bb5VH6V9scq-ORn0NM7infTcUXs5hcldK_RpJeGYD7k=",
      filename: "listing image",
    },
    price: 1800,
    location: "Cotswolds",
    country: "United Kingdom",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "A serene beachfront bungalow in the tranquil setting of Bali.",
    image: {
      url: "https://media.istockphoto.com/id/1431373851/photo/3d-rendering-of-white-and-black-modern-tudor-house.jpg?s=612x612&w=0&k=20&c=VHFUg1gSm-JLe8F45qpDTPiEYGWMATX0wcbuc0C3Xoc=",
      filename: "listing image",
    },
    price: 3000,
    location: "Bali",
    country: "Indonesia",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Renaissance Chateau in Provence",
    description:
      "An exquisite chateau with stunning gardens in the heart of Provence.",
    image: {
      url: "https://media.istockphoto.com/id/1453154426/photo/3d-rendering-of-white-and-black-modern-tudor-house-in-evening.jpg?s=612x612&w=0&k=20&c=efUHYn2ubhPQZyxKmnmYhttps://media.istockphoto.com/id/1461608471/photo/3d-rendering-of-white-and-black-modern-tudor-house-in-autumn-day.jpg?s=612x612&w=0&k=20&c=neQjsy40jiafp-PQi15s8iSNi5Kck8MmG6N4XZZan34=FORd4VJCJjUAeA8IpiZ9vyY=",
      filename: "listing image",
    },
    price: 5000,
    location: "Provence",
    country: "France",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Modern Loft in New York City",
    description:
      "A sleek and modern loft in the vibrant heart of New York City.",
    image: {
      url: "https://media.istockphoto.com/id/610654156/photo/swimming-pool-in-cultivated-garden-and-private-finca-house.jpg?s=612x612&w=0&k=20&c=WdulsdZiSCURHvTeIebMd9MNG6a7X3vGGK7nqCOF0lc=",
      filename: "listing image",
    },
    price: 4000,
    location: "New York City",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Tuscan Farmhouse in Siena",
    description: "A rustic farmhouse surrounded by rolling hills in Tuscany.",
    image: {
      url: "https://media.istockphoto.com/id/911814140/photo/3d-rendering-of-modern-cozy-house-in-chalet-style.jpg?s=612x612&w=0&k=20&c=o3FYVVOwx5zd-dXdFagOXoQElHfeqSVQUPkUXBV8644=",
      filename: "listing image",
    },
    price: 2800,
    location: "Siena",
    country: "Italy",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Contemporary Home in Sydney",
    description:
      "A stylish and contemporary home with stunning harbor views in Sydney.",
    image: {
      url: "https://media.istockphoto.com/id/1431373847/photo/3d-rendering-of-white-and-black-modern-tudor-house.jpg?s=612x612&w=0&k=20&c=LXwu6NZRVLDanjkw44pQS0GfJHGDQbrfa9SB_Yb-Y_A=",
      filename: "listing image",
    },
    price: 3500,
    location: "Sydney",
    country: "Australia",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Swiss Chalet in Zermatt",
    description: "A cozy chalet with panoramic mountain views in Zermatt.",
    image: {
      url: "https://media.istockphoto.com/id/1560745233/photo/modern-mediterranean-villa-with-pool.jpg?s=612x612&w=0&k=20&c=Xhs2_Q9CiGWiCZdRjZ45Z0LnRWXKFW3W-dqdKmk_7ws=",
      filename: "listing image",
    },
    price: 4500,
    location: "Zermatt",
    country: "Switzerland",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Mediterranean Villa in Mykonos",
    description:
      "A stunning Mediterranean villa with a private pool in Mykonos.",
    image: {
      url: "https://media.istockphoto.com/id/656623406/photo/luxury-white-house-with-swimming-pool.jpg?s=612x612&w=0&k=20&c=Yk2b9RH_86Y0XJPREpOIrfEVLN5Tuuh8mkT9nlVSJa0=",
      filename: "listing image",
    },
    price: 4200,
    location: "Mykonos",
    country: "Greece",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Historic Riad in Marrakech",
    description:
      "A beautiful riad with traditional Moroccan architecture in Marrakech.",
    image: {
      url: "https://media.istockphoto.com/id/1327809345/photo/3d-rendering-of-modern-cozy-chalet-in-evening.jpg?s=612x612&w=0&k=20&c=OQ4eIL8NSvexDUE9TtOMxuwl5si4iG5X92aYat_av9A=",
      filename: "listing image",
    },
    price: 3200,
    location: "Marrakech",
    country: "Morocco",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Apartment in Dubai",
    description:
      "A high-end apartment with views of the Burj Khalifa in Dubai.",
    image: {
      url: "https://media.istockphoto.com/id/1324729836/photo/3d-rendering-of-modern-cozy-chalet-in-evening.jpg?s=612x612&w=0&k=20&c=hCiqZOWBj2fJp_O0SaagNxZibNJEhAT1Fgf4hSBwGew=",
      filename: "listing image",
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Coastal Retreat in Cape Town",
    description:
      "A peaceful coastal retreat with stunning ocean views in Cape Town.",
    image: {
      url: "https://media.istockphoto.com/id/183522635/photo/luxury-caribbean-villa-in-the-virgin-islands-tropical-vacation.jpg?s=612x612&w=0&k=20&c=GrzHhb_NACe9hoEZTD8tnnJtOKK1Opmoc94VzWHE4bk=",
      filename: "listing image",
    },
    price: 3000,
    location: "Cape Town",
    country: "South Africa",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Traditional Villa in Kyoto",
    description:
      "A serene villa surrounded by beautiful gardens in historic Kyoto.",
    image: {
      url: "https://media.istockphoto.com/id/697705430/photo/3d-rendering-of-modern-cozy-house-summer-evening.jpg?s=612x612&w=0&k=20&c=fHsdUgVMWc3UOv2ea47HLrpPfjeuGn1udZVw-UXpSkA=",
      filename: "listing image",
    },
    price: 3700,
    location: "Kyoto",
    country: "Japan",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Victorian Mansion in London",
    description:
      "A grand Victorian mansion located in a prestigious area of London.",
    image: {
      url: "https://media.istockphoto.com/id/1325395852/photo/3d-rendering-of-modern-cozy-chalet-in-evening.jpg?s=612x612&w=0&k=20&c=QWlZjP7GnEg2l2j4vFNDCn0UmdOOOeK9WuBmweQ2WgI=",
      filename: "listing image",
    },
    price: 6000,
    location: "London",
    country: "United Kingdom",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Mountain Lodge in Aspen",
    description: "A cozy mountain lodge with direct ski access in Aspen.",
    image: {
      url: "https://media.istockphoto.com/id/1215952013/photo/huge-villa-with-pool.jpg?s=612x612&w=0&k=20&c=RIfVgx9DFfErTkz6FjjSdTzqlpSHGH-NIxVcLRhuFSQ=",
      filename: "listing image",
    },
    price: 5500,
    location: "Aspen",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Rustic Cabin in the Adirondacks",
    description:
      "A rustic cabin nestled in the serene wilderness of the Adirondacks.",
    image: {
      url: "https://media.istockphoto.com/id/1312113141/photo/3d-rendering-of-modern-cozy-chalet.jpg?s=612x612&w=0&k=20&c=HnB4ffiIF_z7-f7l5rO6_lCVxQxnFq1PKg6QKZZmdVY=",
      filename: "listing image",
    },
    price: 2500,
    location: "Adirondacks",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Beach House in Malibu",
    description: "A modern beach house with private beach access in Malibu.",
    image: {
      url: "https://media.istockphoto.com/id/656623644/photo/luxury-white-house-with-swimming-pool.jpg?s=612x612&w=0&k=20&c=YzYKJWK8OKOhvaDbjYnW3uvua-o6OIH6Vco0fDIuhLo=",
      filename: "listing image",
    },
    price: 7000,
    location: "Malibu",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Country Estate in Tuscany",
    description: "A grand country estate surrounded by vineyards in Tuscany.",
    image: {
      url: "https://media.istockphoto.com/id/658156860/photo/3d-rendering-of-modern-cozy-house-in-chalet-style.jpg?s=612x612&w=0&k=20&c=1wXbct9FgA1GkWY2yTh7SU4Ftv-4Ou2-PyaxFlkqB3s=",
      filename: "listing image",
    },
    price: 8500,
    location: "Tuscany",
    country: "Italy",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Seaside Villa in Santorini",
    description:
      "A stunning villa with panoramic views of the Aegean Sea in Santorini.",
    image: {
      url: "https://media.istockphoto.com/id/917299044/photo/3d-rendering-of-modern-cozy-house-in-chalet-style.jpg?s=612x612&w=0&k=20&c=2BLrQGG3uI9tNXwUi9RMYG0chb0rqi8eWjnxiPLECKY=",
      filename: "listing image",
    },
    price: 4000,
    location: "Santorini",
    country: "Greece",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Penthouse in Paris",
    description:
      "A luxurious penthouse with Eiffel Tower views in the heart of Paris.",
    image: {
      url: "https://media.istockphoto.com/id/1629092092/photo/3d-illustration-of-luxury-double-story-villa-with-swimming-pool.jpg?s=612x612&w=0&k=20&c=c87q8R0Dec9_li8Xqvm1jBw7O9OAu0JFASmnICDWwgQ=",
      filename: "listing image",
    },
    price: 9500,
    location: "Paris",
    country: "France",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Traditional Longhouse in Bali",
    description:
      "An authentic Balinese longhouse set in a lush tropical garden.",
    image: {
      url: "https://media.istockphoto.com/id/950447466/photo/3d-rendering-of-modern-cozy-house-in-the-garden.jpg?s=612x612&w=0&k=20&c=B_TMdgYcCX7Pj5UDzOlOsKPmND5hQXYDh3gC3PLvyUA=",
      filename: "listing image",
    },
    price: 3000,
    location: "Ubud",
    country: "Indonesia",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Cliffside Mansion in Phuket",
    description:
      "A luxurious mansion perched on a cliff with stunning ocean views in Phuket.",
    image: {
      url: "https://media.istockphoto.com/id/1315378504/photo/3d-rendering-of-modern-cozy-chalet.jpg?s=612x612&w=0&k=20&c=xj80pDjRaf_p4yuNEt38fTdQdgFobTbmDG-bPhyzD8c=",
      filename: "listing image",
    },
    price: 9000,
    location: "Phuket",
    country: "Thailand",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Art Deco Apartment in Miami",
    description:
      "A stylish Art Deco apartment located in the vibrant South Beach area of Miami.",
    image: {
      url: "https://media.istockphoto.com/id/1024703984/photo/3d-rendering-of-modern-cozy-house-by-the-river-cool-autumn-evening-with-soft-light.jpg?s=612x612&w=0&k=20&c=0LyzLaJ_y-d8siqEh3AWblAOyMCeePGwIUvBca-wRN0=",
      filename: "listing image",
    },
    price: 3500,
    location: "Miami",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Ski Chalet in Chamonix",
    description:
      "A charming ski chalet with direct access to the slopes in Chamonix.",
    image: {
      url: "https://media.istockphoto.com/id/1466682518/photo/3d-rendering-of-white-and-black-modern-tudor-house-in-autumn-day.jpg?s=612x612&w=0&k=20&c=VaLAPuqVvgpmRb-tTb_ZfHpe6UEoVRAAsADNWmA5B-4=",
      filename: "listing image",
    },
    price: 7000,
    location: "Chamonix",
    country: "France",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Medieval Castle in Edinburgh",
    description:
      "A historic medieval castle offering luxury accommodation in Edinburgh.",
    image: {
      url: "https://media.istockphoto.com/id/970201666/photo/3d-rendering-of-modern-cozy-house-in-chalet-style.jpg?s=612x612&w=0&k=20&c=KLWvQ9FLIMaHtHwuHWCgg5G92IDjd8JSyz1m_gWtS5c=",
      filename: "listing image",
    },
    price: 12000,
    location: "Edinburgh",
    country: "United Kingdom",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Eco Lodge in Costa Rica",
    description:
      "A sustainable eco lodge set in the lush rainforest of Costa Rica.",
    image: {
      url: "https://media.istockphoto.com/id/1436679007/photo/brittany-ile-aux-moines-island-in-the-morbihan-gulf.jpg?s=612x612&w=0&k=20&c=1ZBs62SSViHq9hf8EgqStZMVzMb9ew41o5JmyikVqUY=",
      filename: "listing image",
    },
    price: 4000,
    location: "Osa Peninsula",
    country: "Costa Rica",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Historic Townhouse in Charleston",
    description:
      "A beautifully restored townhouse in the historic district of Charleston.",
    image: {
      url: "https://media.istockphoto.com/id/949560748/photo/luxury-beach-house-with-sea-view-swimming-pool-and-terrace-in-modern-design-lounge-chairs-on.jpg?s=612x612&w=0&k=20&c=dT8sToNJFv2NHhTbRpWjwFQnozWO05C6lswJ2MIx1Xc=",
      filename: "listing image",
    },
    price: 3200,
    location: "Charleston",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Oceanfront Villa in Fiji",
    description:
      "A luxurious oceanfront villa with private beach access in Fiji.",
    image: {
      url: "https://media.istockphoto.com/id/1456151948/photo/architectural-3d-rendering-illustration.jpg?s=612x612&w=0&k=20&c=ODEOqh-kAh2RWponMdJ2b7nYy6zJx1C9NqK-q3p0TZs=",
      filename: "listing image",
    },
    price: 10000,
    location: "Nadi",
    country: "Fiji",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Art Nouveau Apartment in Vienna",
    description: "A stunning Art Nouveau apartment in the heart of Vienna.",
    image: {
      url: "https://media.istockphoto.com/id/961928924/photo/big-whirlpool-in-luxury-hotel-suite.jpg?s=612x612&w=0&k=20&c=dBObsioFwsyjIcFHHM4XEfWBIizW5wpupsrHu1t7uzs=",
      filename: "listing image",
    },
    price: 6000,
    location: "Vienna",
    country: "Austria",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Ranch in Wyoming",
    description:
      "A sprawling luxury ranch with breathtaking mountain views in Wyoming.",
    image: {
      url: "https://media.istockphoto.com/id/1292554886/photo/classical-pitched-slate-roof-house-with-pool-and-garden.jpg?s=612x612&w=0&k=20&c=-PZLva2xG2-tYekar0j_9FCS_X6O58p30FWWZasoToM=",
      filename: "listing image",
    },
    price: 8500,
    location: "Jackson Hole",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Beachfront Condo in Rio de Janeiro",
    description:
      "A modern beachfront condo with stunning views of Copacabana Beach in Rio.",
    image: {
      url: "https://media.istockphoto.com/id/911814176/photo/3d-rendering-of-modern-cozy-house-in-chalet-style.jpg?s=612x612&w=0&k=20&c=L90xHOtlSyb3_oHY4SAXAg6HMl_vYU6ehNAFgldS1pY=",
      filename: "listing image",
    },
    price: 4500,
    location: "Rio de Janeiro",
    country: "Brazil",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Forest Cabin in British Columbia",
    description:
      "A secluded forest cabin nestled in the stunning wilderness of British Columbia.",
    image: {
      url: "https://media.istockphoto.com/id/1325900420/photo/3d-rendering-of-modern-cozy-chalet-in-evening.jpg?s=612x612&w=0&k=20&c=_KwoF3IojvtWHUJgYhI-5hctI_eaZdSc1E_wA-3CuNo=",
      filename: "listing image",
    },
    price: 3800,
    location: "Whistler",
    country: "Canada",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Island Villa in the Maldives",
    description:
      "A private island villa surrounded by crystal clear waters in the Maldives.",
    image: {
      url: "https://media.istockphoto.com/id/494358113/photo/luxury-house-with-lap-pool.jpg?s=612x612&w=0&k=20&c=Y2AkQ5MPkBKfiU87XCoX5lTfPhZo31ydkeJ6D6SRa0U=",
      filename: "listing image",
    },
    price: 12000,
    location: "Malé",
    country: "Maldives",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Historic Palazzo in Venice",
    description: "A grand historic palazzo overlooking the canals in Venice.",
    image: {
      url: "https://media.istockphoto.com/id/1406784349/photo/ivy-house-and-green-garden-with-palm-in-europe-against-mountain.jpg?s=612x612&w=0&k=20&c=NknV8Na_8G0P0GXHrKbvwnUYUEleLM80pSkVvBt-51E=",
      filename: "listing image",
    },
    price: 9000,
    location: "Venice",
    country: "Italy",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Riverside Cottage in the Lake District",
    description:
      "A cozy riverside cottage surrounded by the stunning scenery of the Lake District.",
    image: {
      url: "https://media.istockphoto.com/id/1456452848/photo/beach-luxury-living-room-and-sea-view-interior-3d-rendering.jpg?s=612x612&w=0&k=20&c=DT_fCs2EupJDDsXPP9CifESREq_woJhRUvUYUA9riLA=",
      filename: "listing image",
    },
    price: 2700,
    location: "Lake District",
    country: "United Kingdom",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Treehouse in Thailand",
    description:
      "A unique luxury treehouse nestled in the lush rainforest of Thailand.",
    image: {
      url: "https://media.istockphoto.com/id/862196252/photo/3d-rendering-of-modern-cozy-mountain-ski-resort-with-snow.jpg?s=612x612&w=0&k=20&c=MVApsNSWgTJceT8GWNa5EACY-NyvrdjnLJqMvNVVWQg=",
      filename: "listing image",
    },
    price: 6000,
    location: "Chiang Mai",
    country: "Thailand",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Modern Farmhouse in Napa Valley",
    description:
      "A modern farmhouse surrounded by vineyards in the heart of Napa Valley.",
    image: {
      url: "https://media.istockphoto.com/id/883695894/photo/pool-and-modern-house.jpg?s=612x612&w=0&k=20&c=ch1oZmQ2OpTVT8rxUCq02KMfwSLkwiy8kcSBmvmUHmk=",
      filename: "listing image",
    },
    price: 5500,
    location: "Napa Valley",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Tent in the Serengeti",
    description:
      "A luxury tented camp offering an unforgettable safari experience in the Serengeti.",
    image: {
      url: "https://media.istockphoto.com/id/485046946/photo/maldives-villa-on-piles-in-water.jpg?s=612x612&w=0&k=20&c=uEw-umQigmALN_VKLPCTiHNaPSOvXcqGMAhWCHrjv6A=",
      filename: "listing image",
    },
    price: 9500,
    location: "Serengeti",
    country: "Tanzania",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Modern Beach House in Byron Bay",
    description:
      "A sleek and modern beach house just steps away from the surf in Byron Bay.",
    image: {
      url: "https://media.istockphoto.com/id/466254839/photo/beautiful-backyard-with-pool-in-australian-mansion.jpg?s=612x612&w=0&k=20&c=UO56KZlJ7eN7YH3cpt_klbR50fdJpqMAh98wK038ldU=",
      filename: "listing image",
    },
    price: 7000,
    location: "Byron Bay",
    country: "Australia",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "A beautifully restored villa surrounded by rolling hills in Tuscany.",
    image: {
      url: "https://media.istockphoto.com/id/1301587662/photo/luxury-house-with-swimming-pool-and-wooden-terrace-in-modern-design.jpg?s=612x612&w=0&k=20&c=QICNKjNkk-0mZP2WSPlzM3PZ85-mamSqMmgPP4hiKBA=",
      filename: "listing image",
    },
    price: 8000,
    location: "Florence",
    country: "Italy",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Charming Cottage in Provence",
    description:
      "A charming stone cottage nestled among lavender fields in Provence.",
    image: {
      url: "https://media.istockphoto.com/id/470802318/photo/house-cube-day.jpg?s=612x612&w=0&k=20&c=387PPlpZNl_xYrUkcd7lUGhZWJAm-KZjx1johXJdL8g=",
      filename: "listing image",
    },
    price: 3500,
    location: "Provence",
    country: "France",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Yacht in the Caribbean",
    description:
      "A luxury yacht offering a unique accommodation experience in the Caribbean.",
    image: {
      url: "https://media.istockphoto.com/id/1848221945/photo/tranquil-waterfront-dining-in-a-coastal-village.jpg?s=612x612&w=0&k=20&c=fs5EvzS-h5kXR4c0IDKw3eSxLtEaWitV8S8poM-4Gfw=",
      filename: "listing image",
    },
    price: 15000,
    location: "Saint Lucia",
    country: "Caribbean",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Contemporary Home in Los Angeles",
    description:
      "A sleek contemporary home with panoramic city views in Los Angeles.",
    image: {
      url: "https://media.istockphoto.com/id/976440758/photo/town-of-arachova-in-greece.jpg?s=612x612&w=0&k=20&c=oV_OQcAR9pPXqpWtQtE1DG6DQpc-LZ4f8-kaHe_1iXw=",
      filename: "listing image",
    },
    price: 9500,
    location: "Los Angeles",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Alpine Chalet in the Dolomites",
    description:
      "A luxurious alpine chalet with breathtaking mountain views in the Dolomites.",
    image: {
      url: "https://media.istockphoto.com/id/1021320776/photo/beautiful-old-town-at-the-france.jpg?s=612x612&w=0&k=20&c=Qx873xEtdn8d38nXopMy0YxvCL08HFBcj9aKaoH-9ZY=",
      filename: "listing image",
    },
    price: 8000,
    location: "Dolomites",
    country: "Italy",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Modern Penthouse in Singapore",
    description:
      "A stunning modern penthouse with views of Marina Bay Sands in Singapore.",
    image: {
      url: "https://media.istockphoto.com/id/911814162/photo/3d-rendering-of-modern-cozy-house-in-chalet-style.jpg?s=612x612&w=0&k=20&c=nPWFILMYyD4MtKndrmhIxGVOoYrW_w1JDU-_80oijAU=",
      filename: "listing image",
    },
    price: 10000,
    location: "Singapore",
    country: "Singapore",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Apartment in Dubai Marina",
    description:
      "A high-end apartment with stunning marina views in Dubai Marina.",
    image: {
      url: "https://media.istockphoto.com/id/2156646283/photo/beautiful-harbour-of-port-de-soller-majorca-balearic-islands-spain.jpg?s=612x612&w=0&k=20&c=FbB-PGZBQWHwGRYUkWI7WCEmW5aTJR2HbClZmwwRdrY=",
      filename: "listing image",
    },
    price: 8000,
    location: "Dubai",
    country: "United Arab Emirates",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Mountain Cabin in Banff",
    description:
      "A cozy mountain cabin surrounded by stunning natural beauty in Banff.",
    image: {
      url: "https://media.istockphoto.com/id/1324744728/photo/potes-is-a-mountain-town-in-picos-de-europa-park-spain.jpg?s=612x612&w=0&k=20&c=__kvaI9GH89XJHKDXIMhAc0UoAKhtg0pTXgzjKVEeN4=",
      filename: "listing image",
    },
    price: 4000,
    location: "Banff",
    country: "Canada",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Modern Villa in Ibiza",
    description:
      "A stylish modern villa with a private pool and stunning sea views in Ibiza.",
    image: {
      url: "https://media.istockphoto.com/id/1277628556/photo/view-of-houses-and-church-of-grez-neuville.jpg?s=612x612&w=0&k=20&c=-lHqf-RWAJuMJnSIprv-SoDkQQMMGeycBEc8SPQnufE=",
      filename: "listing image",
    },
    price: 12000,
    location: "Ibiza",
    country: "Spain",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Secluded Cottage in the Highlands",
    description:
      "A remote cottage surrounded by breathtaking landscapes in the Scottish Highlands.",
    image: {
      url: "https://media.istockphoto.com/id/1436679007/photo/brittany-ile-aux-moines-island-in-the-morbihan-gulf.jpg?s=612x612&w=0&k=20&c=1ZBs62SSViHq9hf8EgqStZMVzMb9ew41o5JmyikVqUY=",
      filename: "listing image",
    },
    price: 2500,
    location: "Highlands",
    country: "United Kingdom",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Cabin in the Smoky Mountains",
    description:
      "A luxurious cabin with stunning mountain views in the Smoky Mountains.",
    image: {
      url: "https://media.istockphoto.com/id/1093500960/photo/town-of-france.jpg?s=612x612&w=0&k=20&c=jZobML205_5gNRbzG8_5iqtDfsVIuON4EqBFcsqqPyg=",
      filename: "listing image",
    },
    price: 6000,
    location: "Gatlinburg",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Beach Villa in the Hamptons",
    description:
      "A luxurious beach villa with private access to the shore in the Hamptons.",
    image: {
      url: "https://media.istockphoto.com/id/1396904051/photo/brittany-ile-aux-moines-island.jpg?s=612x612&w=0&k=20&c=ei-KKBRuycXUV-xFC_QE5uZAJH8Fob2eBufD0U6sjiA=",
      filename: "listing image",
    },
    price: 10000,
    location: "Hamptons",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Historic Castle in Ireland",
    description:
      "A grand historic castle offering a unique and luxurious stay in Ireland.",
    image: {
      url: "https://media.istockphoto.com/id/1053407142/photo/aerial-view-of-felanitx-with-sant-miguel-church-mallorca-spain.jpg?s=612x612&w=0&k=20&c=rhrdwA8BilxiGuPotK8Rr07kdxmifXN9odhl5psEmY4=",
      filename: "listing image",
    },
    price: 15000,
    location: "Dublin",
    country: "Ireland",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Riverside Loft in Amsterdam",
    description:
      "A modern loft with stunning views of the canals in Amsterdam.",
    image: {
      url: "https://media.istockphoto.com/id/1196046340/photo/beautiful-white-gazebo-and-tropical-flower-garden-on-caribbean-ocean-background-summer.jpg?s=612x612&w=0&k=20&c=g1lhBraVpzOZYcz1pdIBdCWSDgbwAFvz3ZK-ZYU9jRQ=",
      filename: "listing image",
    },
    price: 6500,
    location: "Amsterdam",
    country: "Netherlands",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Luxury Estate in Beverly Hills",
    description:
      "A sprawling luxury estate with stunning views in Beverly Hills.",
    image: {
      url: "https://media.istockphoto.com/id/1026878138/photo/idyllic-autumn-scene-in-grundlsee-lake.jpg?s=612x612&w=0&k=20&c=_s8eYhORuBggOyT7WaPlRMI1KhfSSZ8-GGWEi6J3cQU=",
      filename: "listing image",
    },
    price: 20000,
    location: "Beverly Hills",
    country: "United States",
    owner: "66c2ca655822ccdfdc56c825",
  },
  {
    title: "Coastal Cottage in Cornwall",
    description:
      "A charming coastal cottage with stunning sea views in Cornwall.",
    image: {
      url: "https://media.istockphoto.com/id/1029692452/photo/bonnieux-village-in-france.jpg?s=612x612&w=0&k=20&c=6wl99mSdI9B851RZuGPjDHVbwNyad23GqYqyrm74x_A=",
      filename: "listing image",
    },
    price: 4000,
    location: "Cornwall",
    country: "United Kingdom",
    owner: "66c2ca655822ccdfdc56c825",
  },
];
const coordinates = [
  { Malibu: { latitude: 34.0259, longitude: -118.7798 } },
  { Cotswolds: { latitude: 51.8471, longitude: -1.8185 } },
  { Bali: { latitude: -8.3405, longitude: 115.0919 } },
  { Provence: { latitude: 43.8346, longitude: 4.939 } },
  { "New York City": { latitude: 40.7128, longitude: -74.006 } },
  { Siena: { latitude: 43.3188, longitude: 11.3306 } },
  { Sydney: { latitude: -33.8688, longitude: 151.2093 } },
  { Zermatt: { latitude: 46.0207, longitude: 7.7491 } },
  { Mykonos: { latitude: 37.4467, longitude: 25.3289 } },
  { Marrakech: { latitude: 31.6295, longitude: -7.9811 } },
  { Dubai: { latitude: 25.276987, longitude: 55.296249 } },
  { "Cape Town": { latitude: -33.9249, longitude: 18.4241 } },
  { Kyoto: { latitude: 35.0116, longitude: 135.7681 } },
  { London: { latitude: 51.5074, longitude: -0.1278 } },
  { Aspen: { latitude: 39.1911, longitude: -106.8175 } },
  { Adirondacks: { latitude: 43.8801, longitude: -73.8834 } },
  { Tuscany: { latitude: 43.7711, longitude: 11.2486 } },
  { Santorini: { latitude: 36.3932, longitude: 25.4615 } },
  { Paris: { latitude: 48.8566, longitude: 2.3522 } },
  { Ubud: { latitude: -8.5069, longitude: 115.2624 } },
  { Phuket: { latitude: 7.8804, longitude: 98.3923 } },
  { Miami: { latitude: 25.7617, longitude: -80.1918 } },
  { Chamonix: { latitude: 45.9237, longitude: 6.8694 } },
  { Edinburgh: { latitude: 55.9533, longitude: -3.1883 } },
  { "Osa Peninsula": { latitude: 8.5565, longitude: -83.4336 } },
  { Charleston: { latitude: 32.7765, longitude: -79.9311 } },
  { Nadi: { latitude: -17.8138, longitude: 177.3753 } },
  { Vienna: { latitude: 48.2082, longitude: 16.3738 } },
  { "Jackson Hole": { latitude: 43.4799, longitude: -110.7624 } },
  { "Rio de Janeiro": { latitude: -22.9068, longitude: -43.1729 } },
  { Whistler: { latitude: 50.1163, longitude: -122.9574 } },
  { Malé: { latitude: 4.1755, longitude: 73.5093 } },
  { Venice: { latitude: 45.4408, longitude: 12.3155 } },
  { "Lake District": { latitude: 54.4609, longitude: -3.0886 } },
  { "Chiang Mai": { latitude: 18.7902, longitude: 98.9817 } },
  { "Napa Valley": { latitude: 38.5025, longitude: -122.2654 } },
  { Serengeti: { latitude: -2.3333, longitude: 34.8333 } },
  { "Byron Bay": { latitude: -28.6457, longitude: 153.6072 } },
  { Florence: { latitude: 43.7696, longitude: 11.2558 } },
  { "Saint Lucia": { latitude: 13.9094, longitude: -60.978 } },
  { "Los Angeles": { latitude: 34.0522, longitude: -118.2437 } },
  { Dolomites: { latitude: 46.499, longitude: 11.0 } },
  { Singapore: { latitude: 1.3521, longitude: 103.8198 } },
  { Banff: { latitude: 51.1784, longitude: -115.5708 } },
  { Ibiza: { latitude: 38.9067, longitude: 1.4204 } },
  { Highlands: { latitude: 56.4907, longitude: -4.2026 } },
  { Gatlinburg: { latitude: 35.7144, longitude: -83.4914 } },
  { Hamptons: { latitude: 40.9634, longitude: -72.1848 } },
  { Dublin: { latitude: 53.3331, longitude: -6.2489 } },
  { Amsterdam: { latitude: 52.3676, longitude: 4.9041 } },
  { "Beverly Hills": { latitude: 34.0697, longitude: -118.4053 } },
  { Cornwall: { latitude: 50.5039, longitude: -4.25 } },
  { Barcelona: { latitude: 41.3851, longitude: 2.1734 } },
  { Lisbon: { latitude: 38.7223, longitude: -9.1399 } },
  { Tokyo: { latitude: 35.6895, longitude: 139.6917 } },
  { "Hong Kong": { latitude: 22.3193, longitude: 114.1694 } },
  { "Buenos Aires": { latitude: -34.6037, longitude: -58.3816 } },
  { Istanbul: { latitude: 41.0082, longitude: 28.9784 } },
  { Athens: { latitude: 37.9838, longitude: 23.7275 } },
  { Moscow: { latitude: 55.7558, longitude: 37.6176 } },
  { Bangkok: { latitude: 13.7563, longitude: 100.5018 } },
  { Seoul: { latitude: 37.5665, longitude: 126.978 } },
  { Toronto: { latitude: 43.6532, longitude: -79.3832 } },
  { Vancouver: { latitude: 49.2827, longitude: -123.1207 } },
  { Montreal: { latitude: 45.5017, longitude: -73.5673 } },
  { "San Francisco": { latitude: 37.7749, longitude: -122.4194 } },
  { Seattle: { latitude: 47.6062, longitude: -122.3321 } },
  { Zurich: { latitude: 47.3769, longitude: 8.5417 } },
  { Reykjavik: { latitude: 64.1466, longitude: -21.9426 } },
  { Budapest: { latitude: 47.4979, longitude: 19.0402 } },
  { Warsaw: { latitude: 52.2297, longitude: 21.0122 } },
  { Prague: { latitude: 50.0755, longitude: 14.4378 } },
  { Glasgow: { latitude: 55.8642, longitude: -4.2518 } },
  { Porto: { latitude: 41.1496, longitude: -8.6109 } },
  { Milan: { latitude: 45.4642, longitude: 9.19 } },
  { Naples: { latitude: 40.8522, longitude: 14.2681 } },
  { Stockholm: { latitude: 59.3293, longitude: 18.0686 } },
];
let categoriesEnum = [
  "Trending",
  "Dessert",
  "Top Cities",
  "Lake Front",
  "Outside City",
  "Inside City",
  "Tiny Homes",
  "Caves",
  "Camping",
  "Hut",
  "Pool",
  "villa",
  "Arctic",
  "castel",
  "Island",
  "Farm",
  "Mountain",
  "Rooms",
  "Luxery",
  "Beach",
  "Others",
];
const updatedSampleListing = sampleListings.map((item) => {
  const location = item.location;
  const coordinate = coordinates.find((coord) => coord[location]);
  return {
    ...item,
    geometry: {
      type: "Point",
      coordinates: [
        coordinate[location].longitude,
        coordinate[location].latitude,
      ],
    },
  };
});
const getRandomCategories = (categoriesEnum) => {
  const numCategories = Math.floor(Math.random() * 4) + 1; // 1 to 4 categories
  const shuffled = categoriesEnum.sort(() => 0.5 - Math.random()); // Shuffle the array
  return shuffled.slice(0, numCategories);
};

// Adding category to each object in samplelisting
const updatedSamplelisting2 = updatedSampleListing.map((item) => ({
  ...item,
  category: getRandomCategories(categoriesEnum),
}));

//   console.log(updatedSamplelisting);
// console.log(updatedSamplelisting2);
let Data = updatedSamplelisting2.map((item) => ({
  ...item,
  id: uuidv4(),
}));
module.exports = Data;
