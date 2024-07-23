import { useState } from "react";

const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="bg-white shadow-md rounded-lg mt-2">
            <button
                className="w-full text-left px-4 py-2 text-gray-700 bg-gray-200 rounded-t-lg focus:outline-none"
                onClick={onClick}
            >
                {title}
            </button>
            {isOpen && <div className="px-4 py-2">{children}</div>}
        </div>
    );
};

const Accordion = ({ items, openIndex, onAccordionClick }) => {
    return (
        <div className="max-w-md mx-auto bg-gray-100 p-10">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onClick={() => onAccordionClick(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;
