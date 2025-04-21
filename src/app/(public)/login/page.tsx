'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
    }
  };

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Poggo 👾</h1>
          <p className="mt-2 text-gray-500">Faça login para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-6">
            Entrar
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-primary hover:underline"
          >
            Cadastre-se
          </button>
        </div>
        <div className="text-center text-sm text-gray-500">
          <button
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-primary hover:underline"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </Card>
    </Container>
  );
}