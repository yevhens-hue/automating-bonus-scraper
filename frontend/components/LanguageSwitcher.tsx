'use client';

import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = (newLocale: string) => {
        // usePathname from next-intl returns path WITHOUT the locale prefix
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-gray-500">
            {['en', 'tr', 'pt', 'fr'].map((l) => (
                <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`transition-all duration-300 hover:scale-110 ${currentLocale === l ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'hover:text-gray-300'}`}
                >
                    {l}
                </button>
            ))}
        </div>
    );
}
