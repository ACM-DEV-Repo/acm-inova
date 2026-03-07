import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CMSProviderV2, useCMSV2 } from '@/lib/cms-v2/CMSProvider';
import { LPContent, TrackingSettings } from '@/lib/cms-v2/cms-types';
import { fetchGlobalTrackingV2 } from '@/lib/cms-v2/cms-api';
import { resolveTrackingV2 } from '@/lib/cms-v2/resolveTracking-v2';

import { HeroV2 } from '@/components/landing-v2/HeroV2';
import { BenefitsV2 } from '@/components/landing-v2/BenefitsV2';
import { HowItWorksV2 } from '@/components/landing-v2/HowItWorksV2';
import { PlansV2 } from '@/components/landing-v2/PlansV2';
import { TestimonialsV2 } from '@/components/landing-v2/TestimonialsV2';
import { KPIsV2 } from '@/components/landing-v2/KPIsV2';
import { AboutV2 } from '@/components/landing-v2/AboutV2';
import { ContactV2 } from '@/components/landing-v2/ContactV2';
import { BeforeAfterV2 } from '@/components/landing-v2/BeforeAfterV2';
import { ProcessV2 } from '@/components/landing-v2/ProcessV2';
import { ServicesV2 } from '@/components/landing-v2/ServicesV2';
import { ScheduleV2 } from '@/components/landing-v2/ScheduleV2';
import { VideoV2 } from '@/components/landing-v2/VideoV2';
import { VideoCarouselV2 } from '@/components/landing-v2/VideoCarouselV2';
import { WhyChooseV2 } from '@/components/landing-v2/WhyChooseV2';
import { CTAFinalV2 } from '@/components/landing-v2/CTAFinalV2';
import { FAQV2 } from '@/components/landing-v2/FAQV2';
import { ForWhomV2 } from '@/components/landing-v2/ForWhomV2';
import { FooterV2 } from '@/components/landing-v2/FooterV2';
import { FormV2 } from '@/components/landing-v2/FormV2';
import { SpeakersV2 } from '@/components/landing-v2/SpeakersV2';
import { SponsorsV2 } from '@/components/landing-v2/SponsorsV2';
import { WhatsAppButtonV2 } from '@/components/landing-v2/WhatsAppButtonV2';
import { TrackingHeadV2 } from '@/components/landing-v2/TrackingHeadV2';
import { ExitIntentPopupV2 } from '@/components/landing-v2/ExitIntentPopupV2';
import { SocialProofToastV2 } from '@/components/landing-v2/SocialProofToastV2';
import { StickyMobileCtaV2 } from '@/components/landing-v2/StickyMobileCtaV2';
import { GlobalMenuV2 } from '@/components/landing-v2/GlobalMenuV2';

const renderSection = (sectionId: string, content: LPContent, lpKey: string, index: number) => {
  const key = `section-${sectionId}-${index}`;
  const couponCode = content.conversion?.couponCode;
  switch (sectionId) {
    case 'hero': return <HeroV2 key={key} data={content.hero} lpKey={lpKey} couponCode={couponCode} />;
    case 'benefits': return <BenefitsV2 key={key} data={content.benefits} lpKey={lpKey} couponCode={couponCode} />;
    case 'howItWorks': return <HowItWorksV2 key={key} data={content.howItWorks} lpKey={lpKey} couponCode={couponCode} />;
    case 'plans': return <PlansV2 key={key} data={content.plans} lpKey={lpKey} couponCode={couponCode} conversion={content.conversion} />;
    case 'testimonials': return <TestimonialsV2 key={key} data={content.testimonials} lpKey={lpKey} couponCode={couponCode} />;
    case 'kpis': return <KPIsV2 key={key} data={content.kpis} lpKey={lpKey} couponCode={couponCode} />;
    case 'about': return <AboutV2 key={key} data={content.about} lpKey={lpKey} couponCode={couponCode} />;
    case 'contact': return <ContactV2 key={key} data={content.contact} lpKey={lpKey} />;
    case 'beforeAfter': return <BeforeAfterV2 key={key} data={content.beforeAfter} lpKey={lpKey} couponCode={couponCode} />;
    case 'process': return <ProcessV2 key={key} data={content.process} lpKey={lpKey} couponCode={couponCode} />;
    case 'services': return <ServicesV2 key={key} data={content.services} lpKey={lpKey} couponCode={couponCode} />;
    case 'schedule': return <ScheduleV2 key={key} data={content.schedule} lpKey={lpKey} couponCode={couponCode} />;
    case 'video': return <VideoV2 key={key} data={content.video} lpKey={lpKey} couponCode={couponCode} />;
    case 'videoCarousel': return <VideoCarouselV2 key={key} data={content.videoCarousel} lpKey={lpKey} couponCode={couponCode} />;
    case 'whyChoose': return <WhyChooseV2 key={key} data={content.whyChoose} lpKey={lpKey} couponCode={couponCode} />;
    case 'ctaFinal': return <CTAFinalV2 key={key} data={content.ctaFinal} lpKey={lpKey} couponCode={couponCode} conversion={content.conversion} />;
    case 'faq': return <FAQV2 key={key} data={content.faq} lpKey={lpKey} couponCode={couponCode} />;
    case 'forWhom': return <ForWhomV2 key={key} data={content.forWhom} lpKey={lpKey} couponCode={couponCode} />;
    case 'form': return <FormV2 key={key} data={content.form} lpKey={lpKey} couponCode={couponCode} />;
    case 'speakers': return <SpeakersV2 key={key} data={content.speakers} lpKey={lpKey} couponCode={couponCode} />;
    case 'sponsors': return <SponsorsV2 key={key} data={content.sponsors} lpKey={lpKey} couponCode={couponCode} />;
    default: return null;
  }
};

export const LandingPageV2Content = () => {
  const { content, lpKey, isLoading, error } = useCMSV2();
  const [globalTracking, setGlobalTracking] = useState<TrackingSettings | null>(null);

  useEffect(() => { fetchGlobalTrackingV2().then(setGlobalTracking); }, []);

  if (isLoading && !content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !content) return <Navigate to="/404" replace />;

  const sectionOrder = content.sectionOrder || [];
  const gradient = content.design?.gradient;
  const gradientStyle = gradient?.from && gradient?.to ? { background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})` } : undefined;
  const hasMenu = content.globalMenu?.enabled;

  return (
    <main className="min-h-screen lp-v2-content" style={gradientStyle}>
      <style>{`
        .lp-v2-content > div > section {
          padding-top: var(--ds-section-py, 4rem);
          padding-bottom: var(--ds-section-py, 4rem);
        }
        @media (min-width: 768px) {
          .lp-v2-content > div > section {
            padding-top: calc(var(--ds-section-py, 4rem) * 1.5);
            padding-bottom: calc(var(--ds-section-py, 4rem) * 1.5);
          }
        }
      `}</style>
      <TrackingHeadV2 tracking={resolveTrackingV2(content.tracking, globalTracking)} seo={content.seo} lpKey={lpKey} />
      {hasMenu && <GlobalMenuV2 data={content.globalMenu} footer={content.footer} />}
      <div className={hasMenu ? 'pt-16' : ''}>
        {sectionOrder.map((sectionId, index) => renderSection(sectionId, content, lpKey, index))}
      </div>
      <FooterV2 data={content.footer} lpKey={lpKey} />
      <WhatsAppButtonV2 data={content.floatingWhatsapp} lpKey={lpKey} />
      <ExitIntentPopupV2 data={content.conversion?.exitIntent} coupon={content.conversion?.couponCode} lpKey={lpKey} />
      <SocialProofToastV2 data={content.conversion?.socialProof} lpKey={lpKey} />
      <StickyMobileCtaV2 data={content.floatingWhatsapp?.stickyCta} coupon={content.conversion?.couponCode} lpKey={lpKey} />
    </main>
  );
};

export default function LandingPageV2() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/404" replace />;
  return (
    <CMSProviderV2 lpKey={slug}>
      <LandingPageV2Content />
    </CMSProviderV2>
  );
}