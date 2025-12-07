import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (links.length <= 3) return null;

    const prev = links[0];
    const next = links[links.length - 1];
    const cleanLinks = links.filter(l => !l.label.includes('Previous') && !l.label.includes('Next'));

    const activeIndex = cleanLinks.findIndex(l => l.active);
    let start = Math.max(0, activeIndex - 4);
    let end = Math.min(cleanLinks.length, start + 8);

    if (end === cleanLinks.length) start = Math.max(0, end - 8);

    const visibleLinks = cleanLinks.slice(start, end);

    return (
        <div className="flex justify-center flex-wrap gap-1 mt-6">
            {prev.url ? (
                <Link href={prev.url} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600 font-medium transition">&laquo; Prev</Link>
            ) : (
                <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">&laquo; Prev</span>
            )}

            {visibleLinks.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={`px-3.5 py-1.5 border rounded-lg text-sm font-bold transition ${
                        link.active
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}

            {next.url ? (
                <Link href={next.url} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600 font-medium transition">Next &raquo;</Link>
            ) : (
                <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">Next &raquo;</span>
            )}
        </div>
    );
}
