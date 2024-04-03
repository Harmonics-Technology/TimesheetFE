export default function GTM() {
    return (
        <>
            {/* Google Analytics */}
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=G-BLBPB619BH`}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BLBPB619BH');
            `,
                }}
            />
            {/* End Google Analytics */}
        </>
    );
}
