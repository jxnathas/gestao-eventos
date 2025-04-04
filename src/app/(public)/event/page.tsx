
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import api from '@/lib/api/api';

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await api.get(`/events/${params.id}`).then((res) => res.data);

  return (
    <Section className="py-12">
      <Card className="max-w-4xl mx-auto p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 h-64 md:h-full"></div>
          <div className="p-6">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <p className="text-gray-500 mt-2">
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </p>
            <Button variant="primary" className="mt-6 w-full">
              Comprar Ingresso
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}