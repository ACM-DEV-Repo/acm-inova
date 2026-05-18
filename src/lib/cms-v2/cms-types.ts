// ============================================================
// CMS V2 Types - Definições de tipos e interfaces (Linear)
// ============================================================

// ========== Form Builder Types ==========
export type FormFieldType =
  | "text"
  | "email"
  | "phone"
  | "cpf"
  | "select"
  | "date"
  | "textarea"
  | "checkbox"
  | "whatsapp"
  | "paragraph"
  | "cep";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  width?: "100%" | "50%";
  mask?: string;
  minSelect?: number;
  maxSelect?: number;
  content?: string;
}

export type FormSuccessAction = {
  type: "toast" | "redirect" | "success-card";
  redirectUrl?: string;
  successTitle?: string;
  successMessage?: string;
  successImage?: string;
};

// ========== General Components ==========
export type SectionFooterCTA = {
  enabled: boolean;
  text: string;
  link: string;
  mobileHidden: boolean;
};

export type FloatingWhatsappSettings = {
  enabled: boolean;
  phoneNumber: string;
  message: string;
  label: string;
  pulseEffect: boolean;
  showOnMobile: boolean;
  showLabelOnMobile: boolean;
  stickyCta?: {
    enabled: boolean;
    text: string;
    link: string;
    scrollThreshold: number;
  };
};

// ========== Section Definitions ==========
export type HeroBackgroundType = 'image' | 'aurora' | 'gradient-mesh' | 'particles' | 'heartbeat' | 'xray' | 'stethoscope' | 'microscopy' | 'ai' | 'heart';

export interface HeroSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  ctaPrimary: { text: string; link: string };
  ctaSecondary: { text: string; link: string };
  imageDesktop: string;
  imageMobile: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  backgroundType?: HeroBackgroundType;
  heroLogo?: string;
  tagline?: string;
  logoHighlight?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
  logoShadow?: boolean;
  logoShadowIntensity?: number;
  footerCta?: SectionFooterCTA;
}

export interface BenefitsSection {
  enabled?: boolean;
  title: string;
  items: Array<{ title: string; description: string; image: string; icon?: string }>;
  footerCta?: SectionFooterCTA;
}

export interface HowItWorksSection {
  enabled?: boolean;
  title: string;
  steps: Array<string | { text: string; icon?: string }>;
  imageDesktop?: string;
  imageMobile?: string;
  footerCta?: SectionFooterCTA;
}

export interface PlansSection {
  enabled?: boolean;
  title: string;
  items: Array<{
    id: string;
    name: string;
    frequency: string;
    price: string;
    originalPrice?: string;
    showStrikethrough?: boolean;
    discount?: string;
    supportText?: string;
    features?: string[];
    ctaText?: string;
    link: string;
    recommended: boolean;
    icon?: string;
  }>;
  footerCta?: SectionFooterCTA;
}

export interface TestimonialsSection {
  enabled?: boolean;
  title: string;
  items: Array<{
    image: string;
    text: string;
    name: string;
    city: string;
    rating: number;
  }>;
  footerCta?: SectionFooterCTA;
}

export interface KpisSection {
  enabled?: boolean;
  items: Array<{
    enabled?: boolean;
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
  footerCta?: SectionFooterCTA;
}

export interface AboutSection {
  enabled?: boolean;
  title: string;
  text: string;
  imageDesktop?: string;
  imageMobile?: string;
  footerCta?: SectionFooterCTA;
}

export interface ContactSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  whatsappLink: string;
}

export interface BeforeAfterSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  images: Array<{ before: string; after: string; caption: string }>;
  imageDesktop?: string;
  imageMobile?: string;
  footerCta?: SectionFooterCTA;
}

export interface ProcessSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  steps: Array<{ title: string; description: string; icon?: string }>;
  imageDesktop?: string;
  imageMobile?: string;
  footerCta?: SectionFooterCTA;
}

export interface ServicesSection {
  enabled?: boolean;
  title: string;
  items: Array<{ text: string; enabled?: boolean }>;
  footerCta?: SectionFooterCTA;
}

export interface VideoSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  url: string;
  footerCta?: SectionFooterCTA;
}

export interface VideoCarouselSection {
  enabled?: boolean;
  title: string;
  items: Array<{ title: string; url: string }>;
  footerCta?: SectionFooterCTA;
}

export interface WhyChooseSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  items: Array<{ title: string; description: string; icon?: string }>;
  imageDesktop?: string;
  imageMobile?: string;
  footerCta?: SectionFooterCTA;
}

export interface CtaFinalSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageDesktop?: string;
  imageMobile?: string;
  trustText?: string;
}

export interface FaqSection {
  enabled?: boolean;
  title: string;
  items: Array<{ question: string; answer: string }>;
  footerCta?: SectionFooterCTA;
}

export interface FormSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  ctaButton: string;
  fields: FormField[];
  footerCta?: SectionFooterCTA;
  successAction?: FormSuccessAction;
  webhookUrl?: string;
}

export interface ScheduleSection {
  enabled?: boolean;
  title: string;
  subtitle?: string;
  days: Array<{
    id: string;
    date: string;
    label: string;
    items: Array<{
      time: string;
      title: string;
      speaker?: string;
      location?: string;
    }>;
  }>;
  footerCta?: SectionFooterCTA;
}

export interface ForWhomSection {
  enabled?: boolean;
  title: string;
  subtitle: string;
  items: string[];
  imageDesktop?: string;
  imageMobile?: string;
  footerCta?: SectionFooterCTA;
}

export interface SpeakersSection {
  enabled?: boolean;
  title: string;
  subtitle?: string;
  items: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
    socials?: {
      instagram?: string;
      linkedin?: string;
      website?: string;
    };
  }>;
  layout?: 'grid' | 'featured';
  footerCta?: SectionFooterCTA;
}

export interface SponsorsSection {
  enabled?: boolean;
  title: string;
  subtitle?: string;
  tiers: Array<{
    name: string;
    enabled: boolean;
    color?: string;
    icon?: string;
    logoHeight?: 'sm' | 'md' | 'lg';
    items: Array<{
      name: string;
      logo: string;
      url?: string;
    }>;
  }>;
  footerCta?: SectionFooterCTA;
}

export interface CarouselSection {
  enabled?: boolean;
  title: string;
  subtitle?: string;
  slides: Array<{
    image: string;
    title?: string;
    description?: string;
    cta?: { text: string; link: string; enabled: boolean };
    overlayPosition?: 'left' | 'center' | 'right' | 'bottom';
  }>;
  settings: {
    autoplay: boolean;
    interval: number; // seconds
    transition: 'slide' | 'fade';
    showDots: boolean;
    showArrows: boolean;
    height: 'sm' | 'md' | 'lg' | 'xl';
    rounded: boolean;
    overlay: boolean;
    overlayOpacity: number; // 0-100
    pauseOnHover: boolean;
  };
  footerCta?: SectionFooterCTA;
}

export interface FooterSection {
  enabled?: boolean;
  logo: string;
  logoDesktop?: string;
  logoMobile?: string;
  links: Array<{ text: string; url: string; enabled?: boolean }>;
  privacy: { text: string; url: string; hasLink: boolean; enabled?: boolean };
  terms: { text: string; url: string; hasLink: boolean; enabled?: boolean };
  cnpj: { text: string; enabled?: boolean };
  socials: {
    instagram: { url: string; enabled: boolean };
    facebook: { url: string; enabled: boolean };
    linkedin: { url: string; enabled: boolean };
    youtube: { url: string; enabled: boolean };
    tiktok: { url: string; enabled: boolean };
  };
}

// ========== Settings ==========
export interface DesignSettings {
  theme?: string;
  preset: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  gradient?: { from: string; to: string };
  glassIntensity?: number;
  buttonColor: string;
  titleColor: string;
  borderColor: string;
  iconColor: string;
  starColor: string;
  cardRoundness: "leve" | "medio" | "full";
  verticalSpacing: "small" | "medium" | "large";
  fontFamily?: string;
  textPrimaryColor?: string;
  textSecondaryColor?: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface TrackingSettings {
  enabled: boolean;
  meta: string;
  ga: string;
  tiktok: string;
  linkedin: string;
  gtm: string;
  useGlobal?: boolean; // Se true, adiciona os pixels globais além dos locais
}

// ========== Conversion Settings ==========
export interface CountdownSettings {
  enabled: boolean;
  mode: 'deadline' | 'evergreen' | 'roundHour';
  deadline?: string;
  evergreenHours?: number;
  roundHourAhead?: number;   // quantas horas cheias a frente (default 2)
  label: string;
  showInPlans: boolean;
  showInCtaFinal: boolean;
  expiredText?: string;
  urgencyColor?: string;
}

export interface ExitIntentSettings {
  enabled: boolean;
  title: string;
  text: string;
  ctaText: string;
  ctaLink: string;
  dismissText?: string;
  titleUppercase?: boolean;
  frequency: 'session' | 'day' | 'week';
  delaySeconds: number;
  imageUrl?: string;
  imagePosition?: 'top' | 'left';
}

export interface SocialProofSettings {
  enabled: boolean;
  items: Array<{
    name: string;
    city: string;
    plan: string;
    timeAgo: string;
    message?: string;
  }>;
  intervalSeconds: number;
  maxPerVisit: number;
  position: 'bottom-left' | 'bottom-right';
  toastDuration?: number;
}

export interface ConversionSettings {
  couponCode?: string;
  countdown: CountdownSettings;
  exitIntent: ExitIntentSettings;
  socialProof: SocialProofSettings;
}

// ========== Global Menu ==========
export interface GlobalMenuSettings {
  enabled: boolean;
  logoUrl?: string;
  links?: Array<{
    text: string;
    url: string;
  }>;
}

// ========== Core LP Content (Linear Model) ==========
export interface LPContent {
  hero: HeroSection;
  benefits: BenefitsSection;
  howItWorks: HowItWorksSection;
  plans: PlansSection;
  testimonials: TestimonialsSection;
  kpis: KpisSection;
  speakers: SpeakersSection;
  sponsors: SponsorsSection;
  carousel: CarouselSection;
  about: AboutSection;
  contact: ContactSection;
  beforeAfter: BeforeAfterSection;
  process: ProcessSection;
  services: ServicesSection;
  video: VideoSection;
  videoCarousel: VideoCarouselSection;
  whyChoose: WhyChooseSection;
  ctaFinal: CtaFinalSection;
  faq: FaqSection;
  form: FormSection;
  forWhom: ForWhomSection;
  schedule: ScheduleSection;
  footer: FooterSection;

  design: DesignSettings;
  seo: SEOSettings;
  tracking: TrackingSettings;

  sectionOrder: string[];
  floatingWhatsapp: FloatingWhatsappSettings;
  conversion?: ConversionSettings;
  globalMenu?: GlobalMenuSettings;
}

// ========== Database Model ==========
export type LPStatus = "active" | "draft" | "archived";

export interface LPRecord {
  id: string;
  lp_key: string; // ex: "lp01", "home", "promo-01"
  name: string; // Nome interno
  slug: string; // ex: "/" ou "/promo"
  status: LPStatus; // Status da LP
  content: LPContent; // O conteúdo completo isolado
  created_at: string;
  updated_at: string;
}

// ========== Context / Storage ==========
export type LPId = string; // Agora é dinâmico, não mais 'lp01' | 'lp02'
