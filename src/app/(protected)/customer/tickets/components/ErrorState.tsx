import React from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">{errorMessage}</p>
      <Button variant="ghost" className="mt-4" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
};

export default ErrorState;