// ============================================================
// GABARITO UNIVERSAL — Fonte Única da Verdade (Hardcoded)
// ============================================================
// Este template NÃO depende de nenhuma LP existente no banco.
// Toda LP nova nasce deste molde. Ele é invisível pro usuário.
// Se qualquer LP for deletada, o gabarito continua intacto.
// Apenas o código-fonte pode alterar este arquivo.
// ============================================================

import type { LPContent, SectionFooterCTA } from './cms-types';

// ---- Helper: footerCta padrão (desabilitado por default) ----
const defaultFooterCta: SectionFooterCTA = {
  enabled: false,
  text: 'Quero contratar',
  link: '#plans',
  mobileHidden: false,
};

// ============================================================
// O MOLDE
// ============================================================
export const DEFAULT_LP_TEMPLATE: LPContent = {

  // ==================== HERO ====================
  hero: {
    enabled: true,
    title: '',
    subtitle: '',
    ctaPrimary: { text: 'Contratar agora', link: '#plans' },
    ctaSecondary: { text: 'Saiba mais', link: '#beneficios' },
    imageDesktop: '',
    imageMobile: '',
    imagePosition: 'center',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== BENEFITS ====================
  benefits: {
    enabled: true,
    title: '',
    items: [
      { title: '', description: '', image: '' },
      { title: '', description: '', image: '' },
      { title: '', description: '', image: '' },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== HOW IT WORKS ====================
  howItWorks: {
    enabled: true,
    title: '',
    steps: ['', '', ''],
    imageDesktop: '',
    imageMobile: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== BEFORE & AFTER ====================
  beforeAfter: {
    enabled: false,
    title: '',
    subtitle: '',
    images: [
      { before: '', after: '', caption: '' },
    ],
    imageDesktop: '',
    imageMobile: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== PROCESS ====================
  process: {
    enabled: true,
    title: '',
    subtitle: '',
    steps: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ],
    imageDesktop: '',
    imageMobile: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== FOR WHOM ====================
  forWhom: {
    enabled: false,
    title: '',
    subtitle: '',
    items: ['', '', '', ''],
    imageDesktop: '',
    imageMobile: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== SERVICES ====================
  services: {
    enabled: true,
    title: '',
    items: [
      { text: '', enabled: true },
      { text: '', enabled: true },
      { text: '', enabled: true },
      { text: '', enabled: true },
      { text: '', enabled: true },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== SCHEDULE ====================
  schedule: {
    enabled: false,
    title: '',
    subtitle: '',
    days: [
      {
        id: 'dia-1',
        date: '',
        label: 'Dia 1',
        items: [
          { time: '09:00', title: '', speaker: '', location: '' },
        ],
      },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== PLANS ====================
  plans: {
    enabled: true,
    title: '',
    items: [
      {
        id: 'bronze',
        name: 'Bronze',
        frequency: '',
        price: '',
        originalPrice: '',
        showStrikethrough: false,
        discount: '',
        supportText: '',
        features: ['', '', ''],
        ctaText: 'Contratar',
        link: '',
        recommended: false,
      },
      {
        id: 'silver',
        name: 'Prata',
        frequency: '',
        price: '',
        originalPrice: '',
        showStrikethrough: false,
        discount: '',
        supportText: '',
        features: ['', '', ''],
        ctaText: 'Contratar',
        link: '',
        recommended: false,
      },
      {
        id: 'gold',
        name: 'Ouro',
        frequency: '',
        price: '',
        originalPrice: '',
        showStrikethrough: false,
        discount: '',
        supportText: '',
        features: ['', '', ''],
        ctaText: 'Contratar',
        link: '',
        recommended: true,
      },
      {
        id: 'diamond',
        name: 'Diamante',
        frequency: '',
        price: '',
        originalPrice: '',
        showStrikethrough: false,
        discount: '',
        supportText: '',
        features: ['', '', ''],
        ctaText: 'Contratar',
        link: '',
        recommended: false,
      },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== VIDEO ====================
  video: {
    enabled: false,
    title: '',
    subtitle: '',
    url: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== WHY CHOOSE ====================
  whyChoose: {
    enabled: false,
    title: '',
    subtitle: '',
    items: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ],
    imageDesktop: '',
    imageMobile: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== TESTIMONIALS ====================
  testimonials: {
    enabled: true,
    title: '',
    items: [
      { image: '', text: '', name: '', city: '', rating: 5 },
      { image: '', text: '', name: '', city: '', rating: 5 },
      { image: '', text: '', name: '', city: '', rating: 5 },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== VIDEO CAROUSEL ====================
  videoCarousel: {
    enabled: false,
    title: '',
    items: [
      { title: '', url: '' },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== KPIS ====================
  kpis: {
    enabled: true,
    items: [
      { enabled: true, value: '', label: '', description: '' },
      { enabled: true, value: '', label: '', description: '' },
      { enabled: true, value: '', label: '', description: '' },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== SPEAKERS ====================
  speakers: {
    enabled: false,
    title: '',
    subtitle: '',
    items: [],
    layout: 'grid',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== SPONSORS ====================
  sponsors: {
    enabled: false,
    title: '',
    subtitle: '',
    tiers: [
      { name: 'Diamante', enabled: true, color: '#B9F2FF', logoHeight: 'lg', items: [] },
      { name: 'Ouro', enabled: true, color: '#FFD700', logoHeight: 'md', items: [] },
      { name: 'Prata', enabled: true, color: '#C0C0C0', logoHeight: 'md', items: [] },
      { name: 'Bronze', enabled: false, color: '#CD7F32', logoHeight: 'sm', items: [] },
      { name: 'Apoio', enabled: false, color: '', logoHeight: 'sm', items: [] },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== ABOUT ====================
  about: {
    enabled: true,
    title: '',
    text: '',
    imageDesktop: '',
    imageMobile: '',
    footerCta: { ...defaultFooterCta },
  },

  // ==================== FAQ ====================
  faq: {
    enabled: true,
    title: '',
    items: [
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
    ],
    footerCta: { ...defaultFooterCta },
  },

  // ==================== FORM ====================
  form: {
    enabled: false,
    title: '',
    subtitle: '',
    ctaButton: 'Enviar',
    fields: [
      { id: 'nome', type: 'text', label: 'Nome completo', placeholder: 'Seu nome', required: true, width: '100%' },
      { id: 'email', type: 'email', label: 'E-mail', placeholder: 'seu@email.com', required: true, width: '50%' },
      { id: 'whatsapp', type: 'whatsapp', label: 'WhatsApp', placeholder: '(00) 00000-0000', required: true, width: '50%' },
    ],
    footerCta: { ...defaultFooterCta },
    successAction: {
      type: 'toast',
      redirectUrl: '',
      successTitle: 'Enviado com sucesso!',
      successMessage: 'Entraremos em contato em breve.',
      successImage: '',
    },
    webhookUrl: '',
  },

  // ==================== CTA FINAL ====================
  ctaFinal: {
    enabled: true,
    title: '',
    subtitle: '',
    buttonText: 'Contratar agora',
    buttonLink: '#plans',
    imageDesktop: '',
    imageMobile: '',
    trustText: '',
  },

  // ==================== CONTACT ====================
  contact: {
    enabled: true,
    title: '',
    subtitle: '',
    whatsappLink: '',
  },

  // ==================== FOOTER ====================
  footer: {
    enabled: true,
    logo: '',
    logoDesktop: '',
    logoMobile: '',
    links: [],
    privacy: { text: 'Política de Privacidade', url: '', hasLink: false, enabled: true },
    terms: { text: 'Termos de Uso', url: '', hasLink: false, enabled: true },
    cnpj: { text: '', enabled: false },
    socials: {
      instagram: { url: '', enabled: false },
      facebook: { url: '', enabled: false },
      linkedin: { url: '', enabled: false },
      youtube: { url: '', enabled: false },
      tiktok: { url: '', enabled: false },
    },
  },

  // ==================== SECTION ORDER ====================
  sectionOrder: [
    'hero',
    'benefits',
    'howItWorks',
    'beforeAfter',
    'process',
    'forWhom',
    'services',
    'plans',
    'video',
    'whyChoose',
    'testimonials',
    'videoCarousel',
    'kpis',
    'speakers',
    'sponsors',
    'about',
    'faq',
    'form',
    'ctaFinal',
    'contact',
  ],

  // ==================== DESIGN (Midnight = default) ====================
  design: {
    preset: 'midnight',
    primaryColor: '#6366F1',
    secondaryColor: '#818CF8',
    backgroundColor: '#0F0B1A',
    gradient: { from: '#0F0B1A', to: '#1A1333' },
    glassIntensity: 0.08,
    buttonColor: '#6366F1',
    titleColor: '#FFFFFF',
    borderColor: '#312E81',
    iconColor: '#818CF8',
    starColor: '#FBBF24',
    cardRoundness: 'medio',
    verticalSpacing: 'medium',
    fontFamily: 'Inter',
    textPrimaryColor: '#FFFFFF',
    textSecondaryColor: '#A1A1AA',
  },

  // ==================== SEO (sempre vazio — LP-specific) ====================
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
  },

  // ==================== TRACKING (sempre vazio — LP-specific) ====================
  tracking: {
    enabled: false,
    meta: '',
    ga: '',
    tiktok: '',
    linkedin: '',
    gtm: '',
  },

  // ==================== FLOATING WHATSAPP ====================
  floatingWhatsapp: {
    enabled: false,
    phoneNumber: '',
    message: '',
    label: 'Fale conosco',
    pulseEffect: true,
    showOnMobile: true,
    showLabelOnMobile: false,
    stickyCta: {
      enabled: false,
      text: 'Contratar agora',
      link: '#plans',
      scrollThreshold: 600,
    },
  },

  // ==================== CONVERSION ====================
  conversion: {
    couponCode: '',
    countdown: {
      enabled: false,
      mode: 'evergreen',
      evergreenHours: 24,
      roundHourAhead: 2,
      label: 'OFERTA EXPIRA EM',
      showInPlans: true,
      showInCtaFinal: false,
      expiredText: 'Oferta expirada',
      urgencyColor: '',
    },
    exitIntent: {
      enabled: false,
      title: '',
      text: '',
      ctaText: 'Aproveitar oferta',
      ctaLink: '#plans',
      dismissText: 'Não, obrigado',
      titleUppercase: true,
      frequency: 'session',
      delaySeconds: 3,
      imageUrl: '',
      imagePosition: 'top',
    },
    socialProof: {
      enabled: false,
      items: [
        { name: '', city: '', plan: '', timeAgo: 'há 5 minutos' },
        { name: '', city: '', plan: '', timeAgo: 'há 12 minutos' },
        { name: '', city: '', plan: '', timeAgo: 'há 23 minutos' },
      ],
      intervalSeconds: 15,
      maxPerVisit: 5,
      position: 'bottom-left',
      toastDuration: 4,
    },
  },

  // ==================== GLOBAL MENU ====================
  globalMenu: {
    enabled: false,
    logoUrl: '',
    links: [],
  },
};

// ============================================================
// Função que entrega um clone limpo do template.
// Sempre retorna uma cópia nova (deep clone) — nunca o original.
// ============================================================
export const getNewLPContent = (): LPContent => {
  return JSON.parse(JSON.stringify(DEFAULT_LP_TEMPLATE));
};

/**
 * Preset "Evento Medico" — ativa apenas secoes relevantes para eventos.
 * Desativa: howItWorks, beforeAfter, process, services, whyChoose, videoCarousel
 */
export const getEventoMedicoContent = (): LPContent => {
  const content = getNewLPContent();
  // Secoes essenciais para eventos
  content.hero.enabled = true;
  content.speakers.enabled = true;
  content.schedule.enabled = true;
  content.plans.enabled = true;
  content.sponsors.enabled = true;
  content.faq.enabled = true;
  content.ctaFinal.enabled = true;
  content.footer.enabled = true;
  content.forWhom.enabled = true;
  content.kpis.enabled = true;
  content.about.enabled = true;
  content.contact.enabled = true;
  // Secoes de servico desativadas
  content.howItWorks.enabled = false;
  content.beforeAfter.enabled = false;
  content.process.enabled = false;
  content.services.enabled = false;
  content.whyChoose.enabled = false;
  content.videoCarousel.enabled = false;
  // Ordem otimizada para evento
  content.sectionOrder = [
    'hero', 'kpis', 'speakers', 'schedule', 'forWhom',
    'plans', 'sponsors', 'testimonials', 'about', 'faq',
    'ctaFinal', 'contact',
  ];
  // Design: preset summit-saude por padrao
  content.design.preset = 'summit-saude';
  content.design.primaryColor = '#00ACD4';
  content.design.secondaryColor = '#0088A8';
  content.design.backgroundColor = '#F0F1F3';
  content.design.buttonColor = '#00ACD4';
  content.design.titleColor = '#1A1D23';
  content.design.borderColor = '#D1D5DB';
  content.design.iconColor = '#00ACD4';
  content.design.textPrimaryColor = '#1A1D23';
  content.design.textSecondaryColor = '#5A5F6B';
  content.design.gradient = { from: '#F0F1F3', to: '#E4E6EA' };
  content.design.glassIntensity = 0.45;
  content.design.fontFamily = 'Inter';
  return content;
};
