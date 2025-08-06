'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { Combobox as HeadlessCombobox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

interface Option {
  id: number | string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}

export default function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  required = false
}: ComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const filteredOptions =
    query === ''
      ? options
      : options.filter(option => {
        const searchStr =
            `${option.label} ${option.description || ''}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
      });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={comboboxRef}>
      <HeadlessCombobox
        value={value}
        onChange={(newValue: string) => {
          onChange(newValue);
          setOpen(false);
          setQuery('');
        }}
      >
        <div>
          <HeadlessCombobox.Label className='block text-sm font-medium text-gray-700 mb-1'>
            {label} {required && <span className='text-red-500'>*</span>}
          </HeadlessCombobox.Label>
          <div className='relative'>
            <HeadlessCombobox.Input
              className='w-full bg-white rounded-md border border-gray-300 py-3 pl-4 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onClick={() => setOpen(true)}
              displayValue={(id: unknown) =>
                options.find(option => option.id.toString() === id)?.label || ''
              }
              placeholder={placeholder}
              required={required}
              autoComplete='off'
            />
            <HeadlessCombobox.Button
              className='absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none'
              onClick={() => setOpen(!open)}
            >
              <ChevronUpDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  open ? 'transform rotate-180' : ''
                }`}
                aria-hidden='true'
              />
            </HeadlessCombobox.Button>
          </div>

          {open && (
            <div className='relative mt-1'>
              <HeadlessCombobox.Options
                static
                className='absolute z-[60] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                style={{
                  maxHeight: '280px'
                }}
              >
                {filteredOptions.length === 0 && query !== '' ? (
                  <div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
                    No se encontraron resultados.
                  </div>
                ) : (
                  <div className='divide-y divide-gray-100'>
                    {filteredOptions.map(option => (
                      <HeadlessCombobox.Option
                        key={option.id}
                        value={option.id.toString()}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-3 pl-4 pr-9 ${
                            active ? 'bg-blue-600' : 'bg-white'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <div className='flex flex-col'>
                              <span
                                className={`truncate font-medium ${
                                  active ? 'text-white' : 'text-gray-900'
                                } ${selected ? 'font-semibold' : ''}`}
                              >
                                {option.label}
                              </span>
                              {option.description && (
                                <span
                                  className={`text-sm truncate mt-0.5 ${
                                    active ? 'text-blue-200' : 'text-gray-500'
                                  }`}
                                >
                                  {option.description}
                                </span>
                              )}
                            </div>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                  active ? 'text-white' : 'text-blue-600'
                                }`}
                              >
                                <CheckIcon
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            )}
                          </>
                        )}
                      </HeadlessCombobox.Option>
                    ))}
                  </div>
                )}
              </HeadlessCombobox.Options>
            </div>
          )}
        </div>
      </HeadlessCombobox>
    </div>
  );
}
