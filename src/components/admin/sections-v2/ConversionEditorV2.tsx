import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Ticket } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { V2SectionEditorProps } from "./types";
import type { ConversionSettings } from "@/lib/cms-v2/cms-types";
import { CountdownEditorV2 } from "./conversion/CountdownEditorV2";
import { ExitIntentEditorV2 } from "./conversion/ExitIntentEditorV2";
import { SocialProofEditorV2 } from "./conversion/SocialProofEditorV2";

const DEFAULT_COUNTDOWN: ConversionSettings['countdown'] = {
  enabled: false, mode: 'deadline', deadline: '', evergreenHours: 24,
  label: 'Oferta termina em:', showInPlans: true, showInCtaFinal: true, expiredText: '',
};

const DEFAULT_EXIT: ConversionSettings['exitIntent'] = {
  enabled: false, title: 'Espera! Antes de ir...',
  text: 'Garanta um desconto especial na sua primeira limpeza',
  ctaText: 'Quero meu desconto', ctaLink: '/checkout',
  dismissText: 'Nao, obrigado', frequency: 'session', delaySeconds: 5,
};

const DEFAULT_SOCIAL: ConversionSettings['socialProof'] = {
  enabled: false, items: [], intervalSeconds: 20, maxPerVisit: 5, position: 'bottom-left',
};

export const ConversionEditorV2 = memo(({ draft, updateSection }: V2SectionEditorProps) => {
  const conv = draft.conversion || { couponCode: '', countdown: DEFAULT_COUNTDOWN, exitIntent: DEFAULT_EXIT, socialProof: DEFAULT_SOCIAL };
  const countdown = conv.countdown || DEFAULT_COUNTDOWN;
  const exitIntent = conv.exitIntent || DEFAULT_EXIT;
  const socialProof = conv.socialProof || DEFAULT_SOCIAL;

  const updateConv = (field: string, value: unknown) => {
    updateSection('conversion', { ...conv, [field]: value });
  };

  const updateCountdown = (field: string, value: unknown) => {
    updateSection('conversion', { ...conv, countdown: { ...countdown, [field]: value } });
  };

  const updateExit = (field: string, value: unknown) => {
    updateSection('conversion', { ...conv, exitIntent: { ...exitIntent, [field]: value } });
  };

  const updateSocial = (field: string, value: unknown) => {
    updateSection('conversion', { ...conv, socialProof: { ...socialProof, [field]: value } });
  };

  const addSocialItem = () => {
    updateSocial('items', [...socialProof.items, { name: '', city: '', plan: '', timeAgo: '', message: '' }]);
  };

  const removeSocialItem = (index: number) => {
    updateSocial('items', socialProof.items.filter((_, i) => i !== index));
  };

  const updateSocialItem = (index: number, field: string, value: string) => {
    const newItems = [...socialProof.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSocial('items', newItems);
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Conversao</h2>

      {/* Cupom */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
          <Ticket className="h-5 w-5 text-accent" />
          Cupom da Campanha
        </Label>
        <p className="text-sm text-muted-foreground">
          Este cupom sera adicionado automaticamente aos links dos produtos, exit intent e sticky CTA.
          O cupom precisa existir no Stripe.
        </p>
        <DebouncedInputV2
          value={conv.couponCode || ''}
          onDebouncedChange={(v) => updateConv('couponCode', v)}
          placeholder="Ex: PROMO25"
          className="input-admin font-mono uppercase"
        />
      </div>

      <CountdownEditorV2 countdown={countdown} onUpdate={updateCountdown} />
      <ExitIntentEditorV2 exitIntent={exitIntent} onUpdate={updateExit} />
      <SocialProofEditorV2
        socialProof={socialProof}
        onUpdate={updateSocial}
        onAddItem={addSocialItem}
        onRemoveItem={removeSocialItem}
        onUpdateItem={updateSocialItem}
      />
    </div>
  );
});

ConversionEditorV2.displayName = 'ConversionEditorV2';
