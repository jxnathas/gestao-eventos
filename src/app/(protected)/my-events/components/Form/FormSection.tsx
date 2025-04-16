import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export const FormSection = ({
  title,
  children,
  onAdd,
  addLabel = 'Adicionar',
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) => (
  <Section className="border border-gray-300 shadow-md rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {onAdd && (
        <Button type="button" variant="ghost" size="small" onClick={onAdd}>
          {addLabel}
        </Button>
      )}
    </div>
    {children}
  </Section>
);