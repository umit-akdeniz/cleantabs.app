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
    // TEKNOLOJİ - Yazılım
    { name: 'GitHub', url: 'https://github.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'Visual Studio Code', url: 'https://code.visualstudio.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'GitLab', url: 'https://gitlab.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'JetBrains', url: 'https://jetbrains.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'Bitbucket', url: 'https://bitbucket.org', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'CodePen', url: 'https://codepen.io', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'Replit', url: 'https://replit.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'Figma', url: 'https://figma.com', categoryId: 'teknoloji', subcategoryId: 'yazilim' },
    { name: 'Notion', url: 'https://notion.so', categoryId: 'teknoloji', subcategoryId: 'yazilim' },

    // TEKNOLOJİ - Donanım
    { name: 'Intel', url: 'https://intel.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'AMD', url: 'https://amd.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'NVIDIA', url: 'https://nvidia.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'ASUS', url: 'https://asus.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'MSI', url: 'https://msi.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'Corsair', url: 'https://corsair.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'Logitech', url: 'https://logitech.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'Razer', url: 'https://razer.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'SteelSeries', url: 'https://steelseries.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },
    { name: 'HyperX', url: 'https://hyperx.com', categoryId: 'teknoloji', subcategoryId: 'donanim' },

    // TEKNOLOJİ - Mobil
    { name: 'Apple', url: 'https://apple.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Samsung', url: 'https://samsung.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Google Pixel', url: 'https://store.google.com/category/phones', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Xiaomi', url: 'https://mi.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'OnePlus', url: 'https://oneplus.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Huawei', url: 'https://huawei.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Oppo', url: 'https://oppo.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Vivo', url: 'https://vivo.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Realme', url: 'https://realme.com', categoryId: 'teknoloji', subcategoryId: 'mobil' },
    { name: 'Nothing', url: 'https://nothing.tech', categoryId: 'teknoloji', subcategoryId: 'mobil' },

    // TEKNOLOJİ - Web Tasarım
    { name: 'Dribbble', url: 'https://dribbble.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Behance', url: 'https://behance.net', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Adobe', url: 'https://adobe.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Canva', url: 'https://canva.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Sketch', url: 'https://sketch.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'InVision', url: 'https://invisionapp.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Framer', url: 'https://framer.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Webflow', url: 'https://webflow.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Squarespace', url: 'https://squarespace.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },
    { name: 'Wix', url: 'https://wix.com', categoryId: 'teknoloji', subcategoryId: 'web-tasarim' },

    // TEKNOLOJİ - Yapay Zeka
    { name: 'OpenAI', url: 'https://openai.com', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Google Bard', url: 'https://bard.google.com', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Claude', url: 'https://claude.ai', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Midjourney', url: 'https://midjourney.com', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Stable Diffusion', url: 'https://stability.ai', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Hugging Face', url: 'https://huggingface.co', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Replicate', url: 'https://replicate.com', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Runway', url: 'https://runwayml.com', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Character.ai', url: 'https://character.ai', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },
    { name: 'Perplexity', url: 'https://perplexity.ai', categoryId: 'teknoloji', subcategoryId: 'yapay-zeka' },

    // EĞLENCE - Oyunlar
    { name: 'Steam', url: 'https://store.steampowered.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Epic Games', url: 'https://epicgames.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'PlayStation', url: 'https://playstation.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Xbox', url: 'https://xbox.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Nintendo', url: 'https://nintendo.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Riot Games', url: 'https://riotgames.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Blizzard', url: 'https://blizzard.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Valve', url: 'https://valvesoftware.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'Ubisoft', url: 'https://ubisoft.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },
    { name: 'EA Games', url: 'https://ea.com', categoryId: 'eglence', subcategoryId: 'oyunlar' },

    // EĞLENCE - Filmler
    { name: 'Netflix', url: 'https://netflix.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Disney+', url: 'https://disneyplus.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Amazon Prime', url: 'https://primevideo.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'HBO Max', url: 'https://hbomax.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Hulu', url: 'https://hulu.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Apple TV+', url: 'https://tv.apple.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'IMDb', url: 'https://imdb.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Rotten Tomatoes', url: 'https://rottentomatoes.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Letterboxd', url: 'https://letterboxd.com', categoryId: 'eglence', subcategoryId: 'filmler' },
    { name: 'Paramount+', url: 'https://paramountplus.com', categoryId: 'eglence', subcategoryId: 'filmler' },

    // EĞLENCE - Müzik
    { name: 'Spotify', url: 'https://spotify.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Apple Music', url: 'https://music.apple.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'YouTube Music', url: 'https://music.youtube.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'SoundCloud', url: 'https://soundcloud.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Bandcamp', url: 'https://bandcamp.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Last.fm', url: 'https://last.fm', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Deezer', url: 'https://deezer.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Tidal', url: 'https://tidal.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Amazon Music', url: 'https://music.amazon.com', categoryId: 'eglence', subcategoryId: 'muzik' },
    { name: 'Pandora', url: 'https://pandora.com', categoryId: 'eglence', subcategoryId: 'muzik' },

    // EĞLENCE - Sosyal Medya
    { name: 'Instagram', url: 'https://instagram.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'TikTok', url: 'https://tiktok.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Twitter/X', url: 'https://x.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Facebook', url: 'https://facebook.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'LinkedIn', url: 'https://linkedin.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Snapchat', url: 'https://snapchat.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Pinterest', url: 'https://pinterest.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Reddit', url: 'https://reddit.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Discord', url: 'https://discord.com', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },
    { name: 'Telegram', url: 'https://telegram.org', categoryId: 'eglence', subcategoryId: 'sosyal-medya' },

    // EĞLENCE - Streaming
    { name: 'Twitch', url: 'https://twitch.tv', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'YouTube', url: 'https://youtube.com', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'Kick', url: 'https://kick.com', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'Rumble', url: 'https://rumble.com', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'Facebook Gaming', url: 'https://fb.gg', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'TikTok Live', url: 'https://tiktok.com/live', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'Instagram Live', url: 'https://instagram.com/live', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'OBS Studio', url: 'https://obsproject.com', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'Streamlabs', url: 'https://streamlabs.com', categoryId: 'eglence', subcategoryId: 'streaming' },
    { name: 'Restream', url: 'https://restream.io', categoryId: 'eglence', subcategoryId: 'streaming' },

    // FİNANS - Bankalar
    { name: 'Garanti BBVA', url: 'https://garantibbva.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'İş Bankası', url: 'https://isbank.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'Akbank', url: 'https://akbank.com', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'Yapı Kredi', url: 'https://yapikredi.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'Vakıfbank', url: 'https://vakifbank.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'Ziraat Bankası', url: 'https://ziraatbank.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'Halkbank', url: 'https://halkbank.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'Denizbank', url: 'https://denizbank.com', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'QNB Finansbank', url: 'https://qnbfinansbank.com', categoryId: 'finans', subcategoryId: 'bankalar' },
    { name: 'TEB', url: 'https://teb.com.tr', categoryId: 'finans', subcategoryId: 'bankalar' },

    // FİNANS - Yatırım
    { name: 'Borsa İstanbul', url: 'https://borsaistanbul.com', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Enpara', url: 'https://enpara.com', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Gedik Yatırım', url: 'https://gedik.com.tr', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'İş Yatırım', url: 'https://isyatirim.com.tr', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Garanti Yatırım', url: 'https://garantiyatirim.com.tr', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Ak Yatırım', url: 'https://akyatirim.com.tr', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Yapı Kredi Yatırım', url: 'https://ykb.com', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Investing.com', url: 'https://tr.investing.com', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Bloomberg HT', url: 'https://bloomberght.com', categoryId: 'finans', subcategoryId: 'yatirim' },
    { name: 'Finans Gündem', url: 'https://finansgundem.com', categoryId: 'finans', subcategoryId: 'yatirim' },

    // FİNANS - Kripto Para
    { name: 'Binance', url: 'https://binance.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'Coinbase', url: 'https://coinbase.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'Kraken', url: 'https://kraken.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'Bitget', url: 'https://bitget.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'OKX', url: 'https://okx.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'Gate.io', url: 'https://gate.io', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'CoinMarketCap', url: 'https://coinmarketcap.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'CoinGecko', url: 'https://coingecko.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'DeFiLlama', url: 'https://defillama.com', categoryId: 'finans', subcategoryId: 'kripto' },
    { name: 'Uniswap', url: 'https://uniswap.org', categoryId: 'finans', subcategoryId: 'kripto' },

    // FİNANS - Sigortalar
    { name: 'Anadolu Sigorta', url: 'https://anadolusigorta.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Aksigorta', url: 'https://aksigorta.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Allianz', url: 'https://allianz.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Zurich Sigorta', url: 'https://zurich.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'HDI Sigorta', url: 'https://hdi.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Groupama', url: 'https://groupama.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Mapfre Genel', url: 'https://mapfre.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Güneş Sigorta', url: 'https://gunes.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Ray Sigorta', url: 'https://raysigorta.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },
    { name: 'Türkiye Sigorta', url: 'https://turkiyesigorta.com.tr', categoryId: 'finans', subcategoryId: 'sigortalar' },

    // FİNANS - Borsa
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'MarketWatch', url: 'https://marketwatch.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'TradingView', url: 'https://tradingview.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Bloomberg', url: 'https://bloomberg.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Reuters', url: 'https://reuters.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Finviz', url: 'https://finviz.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Morning Star', url: 'https://morningstar.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Seeking Alpha', url: 'https://seekingalpha.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Zacks', url: 'https://zacks.com', categoryId: 'finans', subcategoryId: 'borsa' },
    { name: 'Benzinga', url: 'https://benzinga.com', categoryId: 'finans', subcategoryId: 'borsa' }
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
      description: `${site.name} resmi web sitesi`,
      color: getRandomColor(),
      reminderEnabled: false,
      subLinks: []
    });
    idCounter++;
  });

  return sites;
};

export const generatedSites = generateSites();