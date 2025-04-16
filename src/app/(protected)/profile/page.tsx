'use client';
import withAuth from '@/components/hoc/withAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Section } from '@/components/ui/Section';
import { useAuthStore } from '@/lib/stores/authStore';

function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <Section>
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Perfil</h1>
        <form className="space-y-4">
          <Input label="Nome" defaultValue={user?.name} name={'nome'} />
          <Input label="Email" type="email" defaultValue={user?.email} name={'email'} />
          <Input label="Telefone" type="tel" defaultValue={user?.phone} name={'telefone'} />
          <Button type="submit" variant="primary">
            Salvar Alterações
          </Button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
          <form className="space-y-4">
            <Input label="Nova Senha" type="password" name={'novaSenha'} />
            <Input label="Confirmar Nova Senha" type="password" name={'confirmarNovaSenha'} />
            <Button type="submit" variant="secondary">
              Alterar Senha
            </Button>
          </form>
        </div>
      </Card>
    </Section>
  );
}

export default withAuth(ProfilePage);