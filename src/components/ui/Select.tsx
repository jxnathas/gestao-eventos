import { HiChevronDown } from 'react-icons/hi';

interface SelectProps<T> {
    id: string;
    label?: string;
    options: T[];
    value: T | null;
    onChange: (value: T) => void;
    placeholder?: string;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string | number;
}

export const Select = <T,>({
    id,
    label,
    options,
    value,
    onChange,
    placeholder = 'Selecione uma opção',
    getOptionLabel,
    getOptionValue,
}: SelectProps<T>) => {
    if (typeof getOptionValue !== 'function') {
        throw new Error('getOptionValue must be a function');
    }

    return (
        <div className="relative w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <select
                id={id}
                className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-700 cursor-pointer transition-all"
                value={value ? getOptionValue(value) : ''}
                onChange={(e) => {
                    const selectedOption = options.find(
                        (option) => getOptionValue(option).toString() === e.target.value
                    );
                    if (selectedOption) {
                        onChange(selectedOption);
                    }
                }}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option, index) => {
                    const optionValue = getOptionValue(option);
                    return (
                        <option
                            key={`${optionValue}-${index}`}
                            value={optionValue || ''}
                        >
                            {getOptionLabel(option)}
                        </option>
                    );
                })}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <HiChevronDown className="w-4 h-4 text-gray-400" />
            </div>
        </div>
    );
};