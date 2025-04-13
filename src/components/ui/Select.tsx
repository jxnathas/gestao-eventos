interface SelectProps<T> {
    id: string;
    options: T[];
    value: T | null;
    onChange: (value: T) => void;
    placeholder?: string;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string | number;
}

export const Select = <T,>({
    options,
    value,
    onChange,
    placeholder = 'Selecione uma opção',
    getOptionLabel,
    getOptionValue,
}: SelectProps<T>) => {
    return (
        <div className="select-container">
            <select
                className="select"
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
                {options.map((option) => (
                    <option key={getOptionValue(option)} value={getOptionValue(option)}>
                        {getOptionLabel(option)}
                    </option>
                ))}
            </select>
        </div>
    );
};