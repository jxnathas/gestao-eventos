'use client';

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export default function CheckoutPage() {
  return (
    <Section className="py-12">
      <Card className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Pagamento via PIX</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center mb-4">
            <span>QR Code aqui</span>
          </div>
          <input
            type="text"
            value="00020126360014BR.GOV.BCB.PIX0114+55679999999998204..."
            readOnly
            className="w-full p-2 bg-white border border-gray-300 rounded"
          />
        </div>
        <Button variant="primary" className="w-full">
          Confirmar Pagamento
        </Button>
      </Card>
    </Section>
  );
}