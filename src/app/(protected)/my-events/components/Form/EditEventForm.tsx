
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FormItemContainer } from './FormItemContainer';
import { FormSection } from './FormSection';

export function EditEventForm({
  eventFields,
  sectorFields,
  lotFields,
  eventData,
  sectors,
  lotes,
  addSector,
  updateSector,
  removeSector,
  addLot,
  updateLot,
  removeLot,
  isSubmitting,
  onSubmit,
}: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection title="Informações do Evento">
        {eventFields.map((field: any) => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            required={field.required}
            defaultValue={eventData[field.name]}
          />
        ))}
      </FormSection>

      <FormSection title="Setores" onAdd={addSector}>
        {sectors.map((sector: any, index: number) => (
          <FormItemContainer key={index} onRemove={() => removeSector(index)}>
            {sectorFields.map((field: any) => (
              <Input
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={sector[field.name]}
                onChange={(e) => updateSector(index, field.name, e.target.value)}
              />
            ))}
          </FormItemContainer>
        ))}
      </FormSection>

      <FormSection title="Lotes" onAdd={addLot}>
        {lotes.map((lot: any, index: number) => (
          <FormItemContainer key={index} onRemove={() => removeLot(index)}>
            {lotFields.map((field: any) => (
              <Input
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={lot[field.name]}
                onChange={(e) => updateLot(index, field.name, e.target.value)}
              />
            ))}
          </FormItemContainer>
        ))}
      </FormSection>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
        <Link href="/my-events">
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}