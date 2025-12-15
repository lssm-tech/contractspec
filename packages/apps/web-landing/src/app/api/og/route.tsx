import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b0f19',
      }}
    >
      {/* Background Gradients */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 500,
          display: 'flex',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.4) 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          padding: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 84,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: -2,
            marginBottom: 24,
            lineHeight: 1,
          }}
        >
          ContractSpec
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 42,
            fontWeight: 700,
            color: '#d8b4fe',
            textAlign: 'center',
            marginBottom: 48,
            letterSpacing: -0.5,
          }}
        >
          Stabilize Your AI-Generated Code
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#e2e8f0',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          The deterministic, spec-first compiler that keeps AI-written software
          coherent, safe, and regenerable. You own the code.
        </div>
      </div>

      {/* Decorative bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 8,
          backgroundImage: 'linear-gradient(to right, #7c3aed, #4f46e5)',
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
