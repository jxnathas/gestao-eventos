'use client';
import React, { useState } from 'react';
import { Sector } from '@/types';

export const SectorSelector = ({ sectors }: { sectors: Sector[] }) => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      {sectors.map((sector) => (
        <div 
          key={sector.id}
          className={`p-4 border rounded-lg cursor-pointer ${
            selectedSector === sector.id ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => setSelectedSector(sector.id)}
        >
          <div className="flex justify-between">
            <h3 className="font-medium">{sector.name}</h3>
            <span>R$ {sector.price.toFixed(2)}</span>
          </div>
          {selectedSector === sector.id && (
            <div className="mt-3">
              <label className="block mb-2">Quantidade:</label>
              <select 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num} value={num + 1}>{num + 1}</option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Disponível: {sector.capacity ? sector.capacity - (sector.sold ?? 0) : 'N/A'} ingressos
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
    );
};