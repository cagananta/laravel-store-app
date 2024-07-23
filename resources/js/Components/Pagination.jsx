import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <div className="flex mt-4 space-x-1">
            {links.length > 3 &&
                links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        className={
                            link.active
                                ? "bg-indigo-600 text-white px-4 py-2 border border-indigo-600 rounded-md"
                                : "text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 border rounded-md"
                        }
                        disabled={true}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    ></Link>
                ))}
        </div>
    );
}
