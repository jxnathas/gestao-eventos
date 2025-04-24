'use client';
import withAuth from '@/components/hoc/withAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Section } from '@/components/ui/Section';
import { useAuthStore } from '@/lib/stores/authStore';
import { Header } from '@/components/ui/Header';
import { FaArrowLeft } from 'react-icons/fa';

function ProfilePage() {
  const { user } = useAuthStore() || { user: null };

  return (
    <div>
      <Header />
      <Section className='pt-3'>
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
              </Button>
              <h1 className="text-2xl font-semibold">Perfil</h1>
            </div>
          <form className="space-y-4">
            <Input disabled label="Nome" defaultValue={user?.name || ''} name={'nome'} />
            <Input disabled label="Documento" defaultValue={user?.document || ''} name={'documento'} />
            <Input label="Nome do Estabelecimento" defaultValue={user?.establishmentName || ''} name={'nomeEstabelecimento'} />
            <Input label="Nome Fantasia" defaultValue={user?.tradingName || ''} name={'nomeFantasia'} />
            <Input label="Email" type="email" defaultValue={user?.email || ''} name={'email'} />
            <Input label="Telefone" type="tel" defaultValue={user?.phone || ''} name={'telefone'} />
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
    </div>
  );
}

export default withAuth(ProfilePage);