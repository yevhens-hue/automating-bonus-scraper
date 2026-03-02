import React from 'react';
import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
            <article className="max-w-3xl mx-auto">
                <header className="mb-12 border-b border-gray-800 pb-12">
                    <Link
                        href="/blog"
                        className="text-blue-400 hover:text-blue-300 mb-8 inline-block font-medium"
                    >
                        ← Back to Blog
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight tracking-tighter">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-500 text-sm font-mono uppercase tracking-widest">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>Expert Insights</span>
                    </div>
                </header>

                <div className="prose prose-invert prose-blue max-w-none 
          prose-headings:tracking-tight prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
          prose-li:text-gray-300 prose-li:mb-2
          prose-table:border prose-table:border-gray-800 prose-table:rounded-xl prose-table:overflow-hidden
          prose-th:bg-gray-900 prose-th:p-4 prose-th:text-left prose-th:text-xs prose-th:uppercase prose-th:tracking-widest
          prose-td:p-4 prose-td:border-t prose-td:border-gray-800 prose-td:text-sm
        ">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <section className="mt-20 p-10 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-3xl text-center">
                    <h2 className="text-2xl font-bold mb-4 tracking-tighter uppercase">Looking for the Best Bonuses?</h2>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                        Our database is updated every 6 hours with the latest casino and betting offers from vetted brands.
                    </p>
                    <Link
                        href="/all-bonuses"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-blue-500/30 uppercase tracking-widest text-sm"
                    >
                        View Full Bonus Table
                    </Link>
                </section>

                <footer className="mt-20 border-t border-gray-800 pt-12 text-center">
                    <div className="text-gray-600 text-xs mb-8 uppercase tracking-widest font-mono">
                        © 2026 games-income.com — All Rights Reserved
                    </div>
                </footer>
            </article>
        </div>
    );
}
