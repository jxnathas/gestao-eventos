import React from 'react';

type SpinnerProps = {
    className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
    return (
        <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary ${className || ''}`} />
        </div>
    );
};

export default Spinner;