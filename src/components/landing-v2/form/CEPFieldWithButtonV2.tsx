import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { maskCEP } from "@/lib/cms-v2/form-masks-v2";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface CEPFieldWithButtonV2Props {
  value: string;
  onChange: (value: string) => void;
  onAddressFound?: (address: AddressData) => void;
  onAddressFieldsChange?: (fields: { bairro: string; cidade: string; uf: string }) => void;
  error?: string;
  placeholder?: string;
}

export const CEPFieldWithButtonV2 = ({
  value,
  onChange,
  onAddressFound,
  onAddressFieldsChange,
  error,
  placeholder = "00000-000",
}: CEPFieldWithButtonV2Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const handleChange = (newValue: string) => {
    setIsValid(false);
    onChange(maskCEP(newValue));
  };

  const handleBairroChange = (val: string) => {
    setBairro(val);
    onAddressFieldsChange?.({ bairro: val, cidade, uf });
  };

  const handleCidadeChange = (val: string) => {
    setCidade(val);
    onAddressFieldsChange?.({ bairro, cidade: val, uf });
  };

  const handleUfChange = (val: string) => {
    setUf(val.toUpperCase().slice(0, 2));
    onAddressFieldsChange?.({ bairro, cidade, uf: val.toUpperCase().slice(0, 2) });
  };

  const handleSearch = async () => {
    const cleanCEP = value.replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      toast.error("CEP inválido", { description: "Digite um CEP com 8 dígitos." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado", { description: "Verifique o CEP digitado e tente novamente." });
        setIsValid(false);
        return;
      }

      setIsValid(true);
      const newAddress: AddressData = {
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        uf: data.uf || '',
      };

      setBairro(newAddress.bairro);
      setCidade(newAddress.cidade);
      setUf(newAddress.uf);

      toast.success("Endereço encontrado!", { description: `${data.bairro} - ${data.localidade}/${data.uf}` });

      onAddressFound?.(newAddress);
      onAddressFieldsChange?.({
        bairro: newAddress.bairro,
        cidade: newAddress.cidade,
        uf: newAddress.uf,
      });
    } catch (err) {
      console.error('[CEPFieldV2] Error fetching:', err);
      toast.error("Erro ao buscar CEP", { description: "Tente novamente em alguns instantes." });
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = cn(
    "bg-[hsl(var(--ds-color-glass)/var(--ds-glass-opacity))] border-[hsl(var(--ds-border-color)/var(--ds-border-opacity))] text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
    error && "border-destructive focus:border-destructive",
    isValid && "border-emerald-500 focus:border-emerald-500"
  );

  const addressInputClasses = cn(
    "bg-[hsl(var(--ds-color-glass)/var(--ds-glass-opacity))] border-[hsl(var(--ds-border-color)/var(--ds-border-opacity))] text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
            maxLength={9}
          />
          {isValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
          )}
        </div>
        <Button
          type="button"
          variant="default"
          onClick={handleSearch}
          disabled={isLoading || value.replace(/\D/g, '').length !== 8}
          className="shrink-0 px-4"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Bairro</Label>
          <Input
            type="text"
            value={bairro}
            onChange={(e) => handleBairroChange(e.target.value)}
            placeholder="Bairro"
            className={addressInputClasses}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <Label className="text-sm text-muted-foreground">Cidade</Label>
            <Input
              type="text"
              value={cidade}
              onChange={(e) => handleCidadeChange(e.target.value)}
              placeholder="Cidade"
              className={addressInputClasses}
            />
          </div>
          <div className="w-20 space-y-1.5">
            <Label className="text-sm text-muted-foreground">UF</Label>
            <Input
              type="text"
              value={uf}
              onChange={(e) => handleUfChange(e.target.value)}
              placeholder="UF"
              maxLength={2}
              className={addressInputClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
