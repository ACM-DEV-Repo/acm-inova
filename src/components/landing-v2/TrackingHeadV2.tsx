import { useEffect } from "react";
import { LPContent } from "@/lib/cms-v2/cms-types";
import { validatePixelId, PixelPlatform } from "@/lib/cms-v2/pixelValidation-v2";

interface TrackingHeadV2Props {
  tracking: LPContent['tracking'];
  seo: LPContent['seo'];
  lpKey: string;
}

/**
 * TrackingHeadV2 — Injeta pixels de rastreamento e meta tags SEO no <head>
 * Aceita dados diretamente do LPContent (sem conversão V1→V2)
 */
export const TrackingHeadV2 = ({ tracking, seo, lpKey }: TrackingHeadV2Props) => {
  // Inject SEO meta tags
  useEffect(() => {
    if (!seo) return;

    const setMeta = (name: string, content: string, property?: boolean) => {
      if (!content) return;
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (seo.metaTitle) document.title = seo.metaTitle;
    if (seo.metaDescription) setMeta('description', seo.metaDescription);
    if (seo.ogTitle) setMeta('og:title', seo.ogTitle, true);
    if (seo.ogDescription) setMeta('og:description', seo.ogDescription, true);
    if (seo.ogImage) setMeta('og:image', seo.ogImage, true);

    return () => {
      // Cleanup on unmount: remove dynamically added meta tags
      ['og:title', 'og:description', 'og:image'].forEach(name => {
        const el = document.querySelector(`meta[property="${name}"]`);
        if (el) el.remove();
      });
    };
  }, [seo]);

  // Inject tracking pixels
  useEffect(() => {
    if (!tracking || tracking.enabled === false) return;

    const scripts: HTMLScriptElement[] = [];

    const addScript = (id: string, src?: string, inline?: string) => {
      if (document.getElementById(id)) return;
      const script = document.createElement('script');
      script.id = id;
      if (src) {
        script.src = src;
        script.async = true;
      }
      if (inline) {
        script.textContent = inline;
      }
      document.head.appendChild(script);
      scripts.push(script);
    };

    // Helper: only inject if pixel format is valid
    const isValidPixel = (platform: PixelPlatform, value: string | undefined): value is string =>
      !!value && validatePixelId(platform, value).status === 'valid';

    // Meta Pixel (Facebook/Instagram)
    if (isValidPixel('meta', tracking.meta)) {
      addScript(
        `v2-meta-pixel-${lpKey}`,
        undefined,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.meta}');fbq('track','PageView');`
      );
    }

    // Google Analytics (GA4)
    if (isValidPixel('ga', tracking.ga)) {
      addScript(`v2-ga4-lib-${lpKey}`, `https://www.googletagmanager.com/gtag/js?id=${tracking.ga}`);
      addScript(
        `v2-ga4-init-${lpKey}`,
        undefined,
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tracking.ga}');`
      );
    }

    // Google Tag Manager
    if (isValidPixel('gtm', tracking.gtm)) {
      addScript(
        `v2-gtm-${lpKey}`,
        undefined,
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${tracking.gtm}');`
      );
    }

    // TikTok Pixel
    if (isValidPixel('tiktok', tracking.tiktok)) {
      addScript(
        `v2-tiktok-${lpKey}`,
        undefined,
        `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tracking.tiktok}');ttq.page();}(window,document,'ttq');`
      );
    }

    // LinkedIn Insight
    if (isValidPixel('linkedin', tracking.linkedin)) {
      addScript(
        `v2-linkedin-${lpKey}`,
        undefined,
        `_linkedin_partner_id="${tracking.linkedin}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`
      );
    }

    return () => {
      scripts.forEach(s => s.remove());
    };
  }, [tracking, lpKey]);

  return null;
};
