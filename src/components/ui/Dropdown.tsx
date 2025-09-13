'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { DropdownProps } from '@/interfaces/Dropdown.interface';

const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  className = '',
  position = 'right',
  width = '200px'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`fixed z-[9999] mt-1 bg-secondary-800 rounded-md shadow-xl border border-secondary-700 overflow-hidden ${
            position === 'right' ? 'right-0' : 'left-0'
          }`}
          style={{ 
            width,
            transform: 'translateY(0)',
            top: dropdownRef.current ? 
              `${dropdownRef.current.getBoundingClientRect().bottom + 5}px` : 'auto',
            left: position === 'right' ? 
              'auto' : 
              (dropdownRef.current ? 
                `${dropdownRef.current.getBoundingClientRect().left}px` : 'auto'),
            right: position === 'right' ? 
              (dropdownRef.current ? 
                `calc(100% - ${dropdownRef.current.getBoundingClientRect().right}px)` : 'auto') : 
              'auto',
          }}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item.onClick);
                }}
                className={`px-4 py-2.5 text-sm text-secondary-50 hover:bg-secondary-700 cursor-pointer flex items-center transition-colors ${
                  item.className || ''
                }`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;