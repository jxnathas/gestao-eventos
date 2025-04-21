'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api/api';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userData = {
      name: formData.get('name') as string,
      document: formData.get('document') as string,
      establishmentName: formData.get('establishmentName') as string,
      tradingName: formData.get('tradingName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      role: 'user' as const,
    };

    try {
      await api.post('/users', userData);
      router.push('/login');
      
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Criar Conta</h1>
          <p className="mt-2 text-gray-500">Preencha os dados do estabelecimento</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" type="text" placeholder="Nome completo" required />
          <Input name="document" type="text" placeholder="CPF ou CNPJ" required />
          <Input name="phone" type="tel" placeholder="Telefone" required />
          <Input name="establishmentName" type="text" placeholder="Razão Social" required />
          <Input name="tradingName" type="text" placeholder="Nome Fantasia" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Senha (mín. 6 caracteres)" minLength={6} required />
          <Button type="submit" variant="primary" className="w-full mt-4">
            Cadastrar
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <button onClick={() => router.push('/login')} className="text-primary hover:underline">
            Faça login
          </button>
        </div>
      </Card>
    </Container>
  );
}