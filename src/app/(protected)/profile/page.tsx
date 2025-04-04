'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Section } from '@/components/ui/Section';
import { useAuthStore } from '@/lib/stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <Section>
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Perfil</h1>
        <form className="space-y-4">
          <Input label="Nome" defaultValue={user?.name} />
          <Input label="Email" type="email" defaultValue={user?.email} />
          <Input label="Telefone" type="tel" defaultValue={user?.phone} />
          <Button type="submit" variant="primary">
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </Section>
  );
}