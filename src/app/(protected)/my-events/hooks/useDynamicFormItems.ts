import { useState } from 'react';

export const useDynamicFormItems = <T extends { id: string }>(
  initialItems: T[] = [],
  defaultItem: Omit<T, 'id'>
) => {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { ...defaultItem, id: `temp-${prev.length}` } as T,
    ]);
  };

  const updateItem = (index: number, field: keyof T, value: any) => {
    setItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return { items, addItem, setItems, updateItem, removeItem };
};