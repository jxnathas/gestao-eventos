'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { useCartStore } from '@/lib/stores/cartStore';

export default function CartPage() {
  const { items, removeItem } = useCartStore();

  return (
    <Section>
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Seu Carrinho</h1>
        {items.length === 0 ? (
          <p>Nenhum item no carrinho</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.eventId}-${item.sectorId}`} className="flex justify-between items-center border-b pb-4">
                <span>Ingresso #{item.eventId}</span>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.eventId, item.sectorId)}>
                  Remover
                </Button>
              </div>
            ))}
            <Button variant="primary" className="w-full mt-6" href="/checkout">
              Finalizar Compra
            </Button>
          </div>
        )}
      </Card>
    </Section>
  );
}