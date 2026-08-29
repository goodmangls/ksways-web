import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import '@/app/globals.css';

const KS_WAYS_INTERCOM_APP_ID = 'k5z51xs2';

type RootDocumentProps = {
  lang: 'en' | 'ko-KR';
  children: React.ReactNode;
};

// (en)/(kr) 루트 레이아웃이 공유하는 문서 셸. lang 은 route group 레이아웃이 정적으로
// 지정한다 — headers() 같은 동적 API 를 쓰면 전 라우트가 SSG 를 잃으므로 금지.
export function RootDocument({ lang, children }: RootDocumentProps) {
  const intercomAppId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID?.trim() || KS_WAYS_INTERCOM_APP_ID;
  const isVercel = process.env.VERCEL === '1';

  return (
    <html lang={lang}>
      <body>
        {children}
        {intercomAppId ? (
          <>
            <Script id="intercom-settings" strategy="afterInteractive">
              {`window.intercomSettings = { app_id: ${JSON.stringify(intercomAppId)} };`}
            </Script>
            <Script id="intercom-loader" strategy="afterInteractive">
              {`(function(){var w=window;var ic=w.Intercom;if(typeof ic==='function'){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/'+${JSON.stringify(intercomAppId)};var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`}
            </Script>
          </>
        ) : null}
        {/* Vercel Analytics 는 Vercel 위에서만 주입한다. /_vercel/insights/* 는 Vercel
            플랫폼이 제공하는 라우트라, 평범한 `next start`(CI e2e·자체 호스팅)에서는
            404 + MIME 거부가 콘솔 에러로 남는다 — smoke 스펙의 "no console errors" 가
            실제로 이걸 잡았다. 프로덕션 비콘은 동일 출처라 CSP 는 'self' 로 충분하다. */}
        {isVercel ? <Analytics /> : null}
      </body>
    </html>
  );
}
