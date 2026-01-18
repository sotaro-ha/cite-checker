import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Cite Checker - Free Citation Verifier for Academic Papers'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FAF9F7',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Background pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25% 25%, #DA7756 0.5px, transparent 0.5px)',
                        backgroundSize: '50px 50px',
                        opacity: 0.1,
                    }}
                />

                {/* Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 80px',
                    }}
                >
                    {/* Logo/Icon */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 120,
                            height: 120,
                            backgroundColor: '#DA7756',
                            borderRadius: 24,
                            marginBottom: 40,
                        }}
                    >
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 700,
                            color: '#1A1A1A',
                            marginBottom: 20,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Cite Checker
                    </div>

                    {/* Subtitle */}
                    <div
                        style={{
                            fontSize: 32,
                            color: '#666666',
                            textAlign: 'center',
                            maxWidth: 800,
                            lineHeight: 1.4,
                        }}
                    >
                        Free Citation Verifier for Academic Papers
                    </div>

                    {/* Features */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 40,
                            marginTop: 50,
                        }}
                    >
                        {['Crossref', 'OpenAlex', 'Privacy-First'].map((feature) => (
                            <div
                                key={feature}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    fontSize: 24,
                                    color: '#DA7756',
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* URL footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 24,
                        color: '#999999',
                    }}
                >
                    www.citechecker.app
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
