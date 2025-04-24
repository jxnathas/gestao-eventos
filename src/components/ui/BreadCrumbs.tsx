import React from 'react';

interface BreadCrumbsProps {
    items: Array<{
        label: string;
        href?: string;
        active?: boolean;
    }>;
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
    return (
        <nav aria-label="breadcrumb" className="text-sm text-gray-500">
            <ol className="flex space-x-2">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center ${
                            index === items.length - 1 ? 'text-gray-800 font-medium' : ''
                        }`}
                        aria-current={index === items.length - 1 ? 'page' : undefined}
                    >
                        {item.href && index !== items.length - 1 ? (
                            <a
                                href={item.href}
                                className="text-primary hover:underline"
                            >
                                {item.label}
                            </a>
                        ) : (
                            item.label
                        )}
                        {index !== items.length - 1 && (
                            <span className="mx-2 text-gray-400">/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};