import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ksways.co'),
  title: 'KSWAYS — The Smart Way to Global Logistics',
  description: 'KSWAYS connects Korea and the world through reliable freight solutions, trusted partner networks, and smarter supply routes.',
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'ko-KR': '/kr',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'KSWAYS — The Smart Way to Global Logistics',
    description: 'Partner-driven global logistics from Korea to the world.',
    url: 'https://ksways.co',
    siteName: 'KSWAYS',
    type: 'website',
  },
};

const BRIDGELOGIS_INTERCOM_APP_ID = 'k5z51xs2';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const intercomAppId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID?.trim() || BRIDGELOGIS_INTERCOM_APP_ID;

  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
