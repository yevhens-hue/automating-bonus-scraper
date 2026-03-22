'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsletterSignup() {
    const t = useTranslations('Newsletter');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setStatus('loading');
        
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (!res.ok) throw new Error('API Error');
            
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-white/5 backdrop-blur-sm text-center">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                {t('title')}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
                {t('subtitle')}
            </p>
            
            {status === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl font-bold uppercase tracking-widest text-sm animate-pulse">
                    🎉 You&apos;re on the list!
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('placeholder')}
                        className={`flex-grow bg-black/50 border ${status === 'error' ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium`}
                        required
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                    >
                        {status === 'loading' ? 'Joining...' : t('subscribe')}
                    </button>
                    {status === 'error' && (
                        <p className="absolute bottom-[-24px] text-red-400 text-xs w-full text-center left-0">
                            Something went wrong. Try again.
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}
