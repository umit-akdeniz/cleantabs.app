import { Site } from '@/types';

const colors = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', 
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const generateSites = (): Site[] => {
  const sites: Site[] = [];
  let idCounter = 1;

  const allSites = [
    // TECHNOLOGY - Software
    { name: 'GitHub', url: 'https://github.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'Visual Studio Code', url: 'https://code.visualstudio.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'GitLab', url: 'https://gitlab.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'JetBrains', url: 'https://jetbrains.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'Bitbucket', url: 'https://bitbucket.org', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'CodePen', url: 'https://codepen.io', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'Replit', url: 'https://replit.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'Figma', url: 'https://figma.com', categoryId: 'technology', subcategoryId: 'software' },
    { name: 'Notion', url: 'https://notion.so', categoryId: 'technology', subcategoryId: 'software' },

    // TECHNOLOGY - Hardware
    { name: 'Intel', url: 'https://intel.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'AMD', url: 'https://amd.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'NVIDIA', url: 'https://nvidia.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'ASUS', url: 'https://asus.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'MSI', url: 'https://msi.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'Corsair', url: 'https://corsair.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'Logitech', url: 'https://logitech.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'Razer', url: 'https://razer.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'SteelSeries', url: 'https://steelseries.com', categoryId: 'technology', subcategoryId: 'hardware' },
    { name: 'HyperX', url: 'https://hyperx.com', categoryId: 'technology', subcategoryId: 'hardware' },

    // TECHNOLOGY - Mobile
    { name: 'Apple', url: 'https://apple.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Samsung', url: 'https://samsung.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Google Pixel', url: 'https://store.google.com/category/phones', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Xiaomi', url: 'https://mi.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'OnePlus', url: 'https://oneplus.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Huawei', url: 'https://huawei.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Oppo', url: 'https://oppo.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Vivo', url: 'https://vivo.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Realme', url: 'https://realme.com', categoryId: 'technology', subcategoryId: 'mobile' },
    { name: 'Nothing', url: 'https://nothing.tech', categoryId: 'technology', subcategoryId: 'mobile' },

    // TECHNOLOGY - Web Design
    { name: 'Dribbble', url: 'https://dribbble.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Behance', url: 'https://behance.net', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Adobe', url: 'https://adobe.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Canva', url: 'https://canva.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Sketch', url: 'https://sketch.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'InVision', url: 'https://invisionapp.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Framer', url: 'https://framer.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Webflow', url: 'https://webflow.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Squarespace', url: 'https://squarespace.com', categoryId: 'technology', subcategoryId: 'web-design' },
    { name: 'Wix', url: 'https://wix.com', categoryId: 'technology', subcategoryId: 'web-design' },

    // TECHNOLOGY - Artificial Intelligence
    { name: 'OpenAI', url: 'https://openai.com', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Google Bard', url: 'https://bard.google.com', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Claude', url: 'https://claude.ai', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Midjourney', url: 'https://midjourney.com', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Stable Diffusion', url: 'https://stability.ai', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Hugging Face', url: 'https://huggingface.co', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Replicate', url: 'https://replicate.com', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Runway', url: 'https://runwayml.com', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Character.ai', url: 'https://character.ai', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
    { name: 'Perplexity', url: 'https://perplexity.ai', categoryId: 'technology', subcategoryId: 'artificial-intelligence' },

    // ENTERTAINMENT - Games
    { name: 'Steam', url: 'https://store.steampowered.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Epic Games', url: 'https://epicgames.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'PlayStation', url: 'https://playstation.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Xbox', url: 'https://xbox.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Nintendo', url: 'https://nintendo.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Riot Games', url: 'https://riotgames.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Blizzard', url: 'https://blizzard.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Valve', url: 'https://valvesoftware.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'Ubisoft', url: 'https://ubisoft.com', categoryId: 'entertainment', subcategoryId: 'games' },
    { name: 'EA Games', url: 'https://ea.com', categoryId: 'entertainment', subcategoryId: 'games' },

    // ENTERTAINMENT - Movies
    { name: 'Netflix', url: 'https://netflix.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Disney+', url: 'https://disneyplus.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Amazon Prime', url: 'https://primevideo.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'HBO Max', url: 'https://hbomax.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Hulu', url: 'https://hulu.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Apple TV+', url: 'https://tv.apple.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'IMDb', url: 'https://imdb.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Rotten Tomatoes', url: 'https://rottentomatoes.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Letterboxd', url: 'https://letterboxd.com', categoryId: 'entertainment', subcategoryId: 'movies' },
    { name: 'Paramount+', url: 'https://paramountplus.com', categoryId: 'entertainment', subcategoryId: 'movies' },

    // ENTERTAINMENT - Music
    { name: 'Spotify', url: 'https://spotify.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Apple Music', url: 'https://music.apple.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'YouTube Music', url: 'https://music.youtube.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'SoundCloud', url: 'https://soundcloud.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Bandcamp', url: 'https://bandcamp.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Last.fm', url: 'https://last.fm', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Deezer', url: 'https://deezer.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Tidal', url: 'https://tidal.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Amazon Music', url: 'https://music.amazon.com', categoryId: 'entertainment', subcategoryId: 'music' },
    { name: 'Pandora', url: 'https://pandora.com', categoryId: 'entertainment', subcategoryId: 'music' },

    // ENTERTAINMENT - Social Media
    { name: 'Instagram', url: 'https://instagram.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'TikTok', url: 'https://tiktok.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Twitter/X', url: 'https://x.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Facebook', url: 'https://facebook.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'LinkedIn', url: 'https://linkedin.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Snapchat', url: 'https://snapchat.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Pinterest', url: 'https://pinterest.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Reddit', url: 'https://reddit.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Discord', url: 'https://discord.com', categoryId: 'entertainment', subcategoryId: 'social-media' },
    { name: 'Telegram', url: 'https://telegram.org', categoryId: 'entertainment', subcategoryId: 'social-media' },

    // ENTERTAINMENT - Streaming
    { name: 'Twitch', url: 'https://twitch.tv', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'YouTube', url: 'https://youtube.com', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'Kick', url: 'https://kick.com', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'Rumble', url: 'https://rumble.com', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'Facebook Gaming', url: 'https://fb.gg', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'TikTok Live', url: 'https://tiktok.com/live', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'Instagram Live', url: 'https://instagram.com/live', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'OBS Studio', url: 'https://obsproject.com', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'Streamlabs', url: 'https://streamlabs.com', categoryId: 'entertainment', subcategoryId: 'streaming' },
    { name: 'Restream', url: 'https://restream.io', categoryId: 'entertainment', subcategoryId: 'streaming' },

    // FINANCE - Banks
    { name: 'Garanti BBVA', url: 'https://garantibbva.com.tr', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'İş Bankası', url: 'https://isbank.com.tr', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'Akbank', url: 'https://akbank.com', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'Yapı Kredi', url: 'https://yapikredi.com.tr', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'Vakıfbank', url: 'https://vakifbank.com.tr', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'Ziraat Bankası', url: 'https://ziraatbank.com.tr', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'Halkbank', url: 'https://halkbank.com.tr', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'Denizbank', url: 'https://denizbank.com', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'QNB Finansbank', url: 'https://qnbfinancebank.com', categoryId: 'finance', subcategoryId: 'banks' },
    { name: 'TEB', url: 'https://teb.com.tr', categoryId: 'finance', subcategoryId: 'banks' },

    // FINANCE - Investment
    { name: 'Borsa İstanbul', url: 'https://stock-marketistanbul.com', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Enpara', url: 'https://enpara.com', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Gedik Yatırım', url: 'https://gedik.com.tr', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'İş Yatırım', url: 'https://isinvestment.com.tr', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Garanti Yatırım', url: 'https://garantiinvestment.com.tr', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Ak Yatırım', url: 'https://akinvestment.com.tr', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Yapı Kredi Yatırım', url: 'https://ykb.com', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Investing.com', url: 'https://tr.investing.com', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Bloomberg HT', url: 'https://bloomberght.com', categoryId: 'finance', subcategoryId: 'investment' },
    { name: 'Finans Gündem', url: 'https://financegundem.com', categoryId: 'finance', subcategoryId: 'investment' },

    // FINANCE - Cryptocurrency
    { name: 'Binance', url: 'https://binance.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'Coinbase', url: 'https://coinbase.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'Kraken', url: 'https://kraken.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'Bitget', url: 'https://bitget.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'OKX', url: 'https://okx.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'Gate.io', url: 'https://gate.io', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'CoinMarketCap', url: 'https://coinmarketcap.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'CoinGecko', url: 'https://coingecko.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'DeFiLlama', url: 'https://defillama.com', categoryId: 'finance', subcategoryId: 'crypto' },
    { name: 'Uniswap', url: 'https://uniswap.org', categoryId: 'finance', subcategoryId: 'crypto' },

    // FINANCE - Insurance
    { name: 'Anadolu Sigorta', url: 'https://anadolusigorta.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Aksigorta', url: 'https://aksigorta.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Allianz', url: 'https://allianz.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Zurich Sigorta', url: 'https://zurich.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'HDI Sigorta', url: 'https://hdi.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Groupama', url: 'https://groupama.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Mapfre Genel', url: 'https://mapfre.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Güneş Sigorta', url: 'https://gunes.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Ray Sigorta', url: 'https://raysigorta.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },
    { name: 'Türkiye Sigorta', url: 'https://turkiyesigorta.com.tr', categoryId: 'finance', subcategoryId: 'insurance' },

    // FINANCE - Stock Market
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'MarketWatch', url: 'https://marketwatch.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'TradingView', url: 'https://tradingview.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Bloomberg', url: 'https://bloomberg.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Reuters', url: 'https://reuters.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Finviz', url: 'https://finviz.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Morning Star', url: 'https://morningstar.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Seeking Alpha', url: 'https://seekingalpha.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Zacks', url: 'https://zacks.com', categoryId: 'finance', subcategoryId: 'stock-market' },
    { name: 'Benzinga', url: 'https://benzinga.com', categoryId: 'finance', subcategoryId: 'stock-market' }
  ];

  // Convert to Site objects with random colors
  allSites.forEach(site => {
    sites.push({
      id: idCounter.toString(),
      name: site.name,
      url: site.url,
      categoryId: site.categoryId,
      subcategoryId: site.subcategoryId,
      tags: [],
      description: `${site.name} official website`,
      color: getRandomColor(),
      reminderEnabled: false,
      subLinks: []
    });
    idCounter++;
  });

  return sites;
};

export const generatedSites = generateSites();