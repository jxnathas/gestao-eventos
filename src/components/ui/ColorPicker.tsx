'use client';
import { useState, useEffect } from 'react';
import { Button } from './Button';

type ColorPickerProps = {
  initialColor?: string;
  onColorChange: (color: string) => void;
  label?: string;
};

export const ColorPicker = ({ 
  initialColor = '#3B82F6', 
  onColorChange,
  label 
}: ColorPickerProps) => {
  const [color, setColor] = useState(initialColor);
  const [showPicker, setShowPicker] = useState(false);

  const presetColors = [
    '#3B82F6',
    '#10B981',
    '#EF4444',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#000000',
    '#FFFFFF'
  ];

  useEffect(() => {
    onColorChange(color);
  }, [color, onColorChange]);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-md cursor-pointer border border-gray-300"
          style={{ 
            backgroundColor: color,
            border: color === '#FFFFFF' ? '1px solid #D1D5DB' : 'none'
          }}
          onClick={() => setShowPicker(!showPicker)}
        />
        
        <span className="text-sm font-mono">{color}</span>
      </div>

      {showPicker && (
        <div className="mt-2 p-3 border rounded-lg bg-white shadow-lg">
          <div className="grid grid-cols-8 gap-2 mb-3">
            {presetColors.map((preset) => (
              <button
                key={preset}
                className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
                style={{ 
                  backgroundColor: preset,
                  border: preset === '#FFFFFF' ? '1px solid #D1D5DB' : 'none'
                }}
                onClick={() => {
                  setColor(preset);
                  setShowPicker(false);
                }}
                aria-label={`Cor ${preset}`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowPicker(false)}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};