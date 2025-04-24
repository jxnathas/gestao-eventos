import { Input } from '@/components/ui/Input';
import { FormSection } from './FormSection';
import { FormItemContainer } from './FormItemContainer';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';
import { eventFields, sectorFields, lotFields } from './eventFormConfig';

export const CreateEventForm = ({
  isSubmitting,
  sectors,
  lotes,
  addSector,
  updateSector,
  removeSector,
  addLot,
  updateLot,
  removeLot,
  onSubmit,
}: any) => {
  const renderField = (
    field: { name: string; label: string; type: string; required?: boolean; step?: string },
    value: any,
    onChange: (value: any) => void,
    fullWidth = false
  ) => (
    <div key={field.name} className={fullWidth ? 'md:col-span-4' : ''}>
      <Input
        label={field.label}
        value={value}
        onChange={(e) => onChange(field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        type={field.type as any}
        required={field.required}
        step={field.step}
        name={field.name}
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section className="w-full">
        {eventFields.map((field) => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type as any}
            required={field.required}
            accept={field.type === 'file' ? 'image/*' : undefined}
          />
        ))}
      </Section>

      <FormSection title="Setores" onAdd={addSector}>
        {sectors.map((sector: any, index: number) => (
          <FormItemContainer key={sector.id} onRemove={() => removeSector(index)}>
            {sectorFields.map((field) =>
              renderField(
                field,
                sector[field.name as keyof typeof sector],
                (value) => updateSector(index, field.name as keyof typeof sector, value),
                field.name === 'description'
              )
            )}
          </FormItemContainer>
        ))}
      </FormSection>

      <FormSection title="Lotes" onAdd={addLot}>
        {lotes.map((lot: any, index: number) => (
          <FormItemContainer key={lot.id} onRemove={() => removeLot(index)}>
            {lotFields.map((field) =>
              renderField(
                field,
                lot[field.name as keyof typeof lot],
                (value) => updateLot(index, field.name as keyof typeof lot, value)
              )
            )}
          </FormItemContainer>
        ))}
      </FormSection>

      <Section className="flex gap-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Evento'}
        </Button>
        <Link href="/my-events">
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </Link>
      </Section>
    </form>
  );
};