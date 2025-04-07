'use client';

import { withAuth } from "@/components/hoc/withAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";

function SettingsPage() {
  return (
    <Section>
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Configurações da Loja</h1>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nome da Loja" />
            <Input label="URL Personalizada" />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Cores</h3>
            <div className="flex gap-4">
              <ColorPicker name="primaryColor" label="Primária" defaultValue="#3B82F6" />
              <ColorPicker name="secondaryColor" label="Secundária" defaultValue="#10B981" />
            </div>
          </div>

          <Button type="submit" variant="primary">
            Salvar Configurações
          </Button>
        </form>
      </Card>
    </Section>
  );
}

export default withAuth(SettingsPage); 