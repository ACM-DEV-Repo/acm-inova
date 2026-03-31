import { WhatsAppIcon } from "../icons/WhatsAppIconV2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/lib/cms-v2/cms-types";
import { getMaskFunction } from "@/lib/cms-v2/form-masks-v2";
import { cn } from "@/lib/utils";
import { CEPFieldWithButtonV2 } from "./CEPFieldWithButtonV2";

// SVG oficial do WhatsApp

interface DynamicFormFieldV2Props {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  onAddressFound?: (address: { logradouro: string; bairro: string; cidade: string; uf: string }) => void;
  onAddressFieldsChange?: (fields: { bairro: string; cidade: string; uf: string }) => void;
  error?: string;
}

export const DynamicFormFieldV2 = ({
  field,
  value,
  onChange,
  onAddressFound,
  onAddressFieldsChange,
  error,
}: DynamicFormFieldV2Props) => {
  const handleChange = (newValue: string) => {
    const maskFn = getMaskFunction(field.type);
    if (maskFn) {
      onChange(maskFn(newValue));
    } else {
      onChange(newValue);
    }
  };

  const inputClasses = cn(
    "bg-[hsl(var(--ds-color-glass)/var(--ds-glass-opacity))] border-[hsl(var(--ds-border-color)/var(--ds-border-opacity))] text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--ds-color-accent))] focus:ring-[hsl(var(--ds-color-accent)/0.3)] transition-colors duration-200",
    error && "border-destructive focus:border-destructive"
  );

  // Paragraph — static text, no data collection
  if (field.type === 'paragraph') {
    return (
      <div className={cn(
        "w-full",
        field.width === '50%' ? 'md:w-[calc(50%-0.5rem)]' : ''
      )}>
        <p className="text-sm text-muted-foreground py-3 px-4 bg-muted/20 rounded-lg border border-border/30">
          {field.content || field.label}
        </p>
      </div>
    );
  }

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(inputClasses, "min-h-[100px] resize-none")}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder={field.placeholder || 'Selecione...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox': {
        const selectedValues = value ? value.split(',').filter(Boolean) : [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/10 p-2 rounded-md transition-colors"
              >
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    let newValues = [...selectedValues];
                    if (checked) {
                      if (!field.maxSelect || newValues.length < field.maxSelect) {
                        newValues.push(option);
                      }
                    } else {
                      newValues = newValues.filter(v => v !== option);
                    }
                    onChange(newValues.join(','));
                  }}
                />
                <span className="text-sm text-foreground">{option}</span>
              </label>
            ))}
            {(field.minSelect || field.maxSelect) && (
              <p className="text-xs text-muted-foreground mt-1">
                {field.minSelect && field.maxSelect
                  ? `Selecione de ${field.minSelect} a ${field.maxSelect} opções`
                  : field.minSelect
                    ? `Selecione pelo menos ${field.minSelect} opção(ões)`
                    : `Selecione no máximo ${field.maxSelect} opção(ões)`
                }
              </p>
            )}
          </div>
        );
      }

      case 'cep':
        return (
          <CEPFieldWithButtonV2
            value={value}
            onChange={onChange}
            onAddressFound={onAddressFound}
            onAddressFieldsChange={onAddressFieldsChange}
            error={error}
            placeholder={field.placeholder || '00000-000'}
          />
        );

      case 'whatsapp':
        return (
          <div className="relative">
            <Input
              id={field.id}
              type="tel"
              inputMode="tel"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder || '(00) 00000-0000'}
              className={cn(inputClasses, "pl-10")}
              maxLength={15}
            />
            <WhatsAppIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#25D366]" />
          </div>
        );

      case 'date':
        return (
          <Input
            id={field.id}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || 'DD/MM/AAAA'}
            className={inputClasses}
            maxLength={10}
          />
        );

      case 'phone':
        return (
          <Input
            id={field.id}
            type="tel"
            inputMode="tel"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || '(00) 00000-0000'}
            className={inputClasses}
            maxLength={15}
          />
        );

      case 'cpf':
        return (
          <Input
            id={field.id}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || '000.000.000-00'}
            className={inputClasses}
            maxLength={14}
          />
        );

      case 'email':
        return (
          <Input
            id={field.id}
            type="email"
            inputMode="email"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClasses}
          />
        );

      case 'text':
      default:
        return (
          <Input
            id={field.id}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className={cn(
      "space-y-2",
      field.width === '50%' ? 'w-full md:w-[calc(50%-0.5rem)]' : 'w-full'
    )}>
      <Label htmlFor={field.id} className="text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
