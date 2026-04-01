import { Loader2, Check, AlertCircle, Circle } from "lucide-react";
import { formatBrazilTime } from "@/lib/dateUtils";

interface SaveStatusHUDV2Props {
  status: 'idle' | 'unsaved' | 'saving' | 'success' | 'error';
  lastSaved: Date | null;
}

export const SaveStatusHUDV2 = ({ status, lastSaved }: SaveStatusHUDV2Props) => {
  if (status === 'idle' && !lastSaved) {
    return null;
  }

  return (
    <div className="mt-2">
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 rounded-lg
          transition-all duration-300 ease-out text-xs
          ${status === 'saving'
            ? 'text-accent'
            : status === 'unsaved'
              ? 'text-amber-500'
              : status === 'success'
                ? 'text-[hsl(var(--ui-success-text))]'
                : status === 'error'
                  ? 'text-destructive'
                  : 'text-muted-foreground'
          }
        `}
      >
        {status === 'saving' && (
          <Loader2 className="w-3 h-3 animate-spin" />
        )}
        {status === 'unsaved' && (
          <Circle className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
        )}
        {status === 'success' && (
          <Check className="w-3 h-3" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-3 h-3" />
        )}
        {status === 'idle' && lastSaved && (
          <Check className="w-3 h-3" />
        )}

        <span className="font-medium">
          {status === 'unsaved' && 'Alterações não salvas'}
          {status === 'saving' && 'Salvando...'}
          {status === 'success' && 'Salvo'}
          {status === 'error' && 'Erro ao salvar!'}
          {status === 'idle' && lastSaved && 'Salvo'}
        </span>

        {lastSaved && status !== 'saving' && status !== 'unsaved' && (
          <span className="text-muted-foreground">
            {formatBrazilTime(lastSaved)}
          </span>
        )}
      </div>
    </div>
  );
};
