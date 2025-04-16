import { Button } from "../../../../../components/ui/Button";

export const FormItemContainer = ({
    children,
    onRemove,
  }: {
    children: React.ReactNode;
    onRemove?: () => void;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-300 shadow-md rounded">
      {children}
      {onRemove && (
        <div className="flex items-end">
          <Button type="button" variant="ghost" size="small" onClick={onRemove}>
            Remover
          </Button>
        </div>
      )}
    </div>
  );