import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

export const metadata: Metadata = {
    title: 'Games Income — Best Casino & Betting Bonuses 2026',
    description: 'Compare casino and sports betting bonuses across India, Turkey, and Brazil. Auto-updated every 6 hours. Expert insights and AI-powered guides.',
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
    verification: {
        google: 'bP5mZLLCJchnCQ97hGnI5TM1KBrEgaqaYnWYkwRR8mE',
    },
    other: {
        'google-site-verification': 'bP5mZLLCJchnCQ97hGnI5TM1KBrEgaqaYnWYkwRR8mE',
    },
    openGraph: {
        siteName: 'Games Income',
        type: 'website',
        url: 'https://games-income.com',
        title: 'Games Income — Best Casino & Betting Bonuses 2026',
        description: 'Compare casino and sports betting bonuses across India, Turkey, and Brazil. Auto-updated every 6 hours.',
        images: [{ url: 'https://games-income.com/og-image.png', width: 1200, height: 630, alt: 'Games Income' }],
        locale: 'en_IN',
    },
};

import bonusesData from '../data/bonuses.json';
import oddsData from '../data/odds.json';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const bonusDate = new Date(bonusesData.updated_at).getTime();
    const oddsDate = oddsData?.updated_at ? new Date(oddsData.updated_at).getTime() : 0;
    const latestDate = new Date(Math.max(bonusDate, oddsDate) || bonusDate);

    const lastUpdate = latestDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#0a0d1a] text-white flex flex-col min-h-screen`}>
                {/* Google Analytics */}
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                />
                <Script id="ga-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}', {
                            page_path: window.location.pathname,
                            anonymize_ip: true
                        });
                    `}
                </Script>

                {/* Navigation */}
                <nav className="sticky top-0 z-50 bg-[#0a0d1a]/90 backdrop-blur-md border-b border-white/5">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xl font-black tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Games</span>
                                <span className="text-white">Income</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1 text-xs font-bold">
                            <Link href="/all-bonuses" className="text-gray-400 hover:text-white hover:bg-white/5 transition-all px-3 py-2 rounded-lg">
                                📊 All Bonuses
                            </Link>
                            <Link href="/holiday-bonuses" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-bold px-3 py-2 rounded-lg border border-red-500/20 ml-2">
                                🎁 Holiday
                            </Link>
                            <Link href="/vip-bonuses" className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all font-bold px-3 py-2 rounded-lg border border-yellow-500/20 ml-2">
                                👑 VIP
                            </Link>
                            <Link href="/top-odds" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-bold px-3 py-2 rounded-lg border border-cyan-500/20 ml-2 animate-pulse">
                                📈 Top Odds
                            </Link>
                            <a href="/#blog" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all px-3 py-2 rounded-lg border border-blue-500/20 ml-2">
                                ✍️ Blog
                            </a>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-green-400">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="hidden sm:inline">Live · {lastUpdate}</span>
                                <span className="inline sm:hidden">Live</span>
                            </span>
                        </div>
                    </div>
                </nav>

                <main className="flex-grow">
                    {children}
                </main>

                {/* Global Footer */}
                <footer className="py-16 px-4 border-t border-white/5 text-center bg-[#0a0d1a]">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-white font-black text-2xl mb-8 tracking-widest uppercase">GAMES INCOME</div>
                        <div className="flex justify-center flex-wrap gap-8 mb-12 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                            <Link href="/all-bonuses" className="hover:text-white transition-colors">Database</Link>
                            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <Link href="/holiday-bonuses" className="hover:text-white transition-colors">Holiday</Link>
                            <Link href="/vip-bonuses" className="hover:text-white transition-colors">VIP</Link>
                        </div>
                        <p className="text-gray-600 text-[10px] leading-loose max-w-2xl mx-auto">
                            © 2026 Games Income. For adults 18+ only. Gambling can be addictive — please play responsibly.
                            This site contains affiliate links. We may earn commission when you sign up via our links.
                        </p>
                    </div>
                </footer>

                {/* JSON-LD Schema */}
                <Script id="schema-org" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Games Income",
                        "url": "https://games-income.com",
                        "logo": "https://games-income.com/favicon.svg",
                        "sameAs": []
                    })
                }} />
                <Script id="schema-website" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Games Income",
                        "url": "https://games-income.com"
                    })
                }} />
            </body>
        </html>
    );
}
