import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          backgroundColor: '#0b0f19', // ink
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '500px',
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.4) 0%, transparent 70%)', // violet with opacity
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 84,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.04em',
              marginBottom: 24,
              lineHeight: 1,
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            ContractSpec
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 42,
              fontWeight: 700,
              color: '#d8b4fe', // lighter violet
              textAlign: 'center',
              marginBottom: 48,
              letterSpacing: '-0.02em',
            }}
          >
            Stabilize Your AI-Generated Code
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#e2e8f0', // slate-200
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            The deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.
            You own the code.
          </div>
        </div>

        {/* Decorative bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '8px',
            background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
