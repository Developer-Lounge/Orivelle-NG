import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
}

export function QuantityInput({
  value,
  onChange,
  max = 99,
  min = 1,
}: QuantityInputProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="min-w-[2rem] text-center">{value}</span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
