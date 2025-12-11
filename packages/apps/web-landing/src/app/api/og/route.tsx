import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    <div tw="flex flex-col w-full h-full items-center justify-center bg-[#0b0f19]">
      {/* Background Gradients */}
      <div tw="absolute top-0 left-0 right-0 h-[500px] flex bg-[radial-gradient(circle_at_50%_0%,_rgba(124,58,237,0.4)_0%,_transparent_70%)]" />

      <div tw="flex flex-col items-center justify-center z-10 p-10">
        <div tw="flex text-[84px] font-black text-white tracking-tighter mb-6 leading-none drop-shadow-2xl">
          ContractSpec
        </div>

        <div tw="flex text-[42px] font-bold text-[#d8b4fe] text-center mb-12 tracking-tight">
          Stabilize Your AI-Generated Code
        </div>

        <div tw="flex text-[26px] text-slate-200 text-center max-w-[900px] leading-relaxed font-medium">
          The deterministic, spec-first compiler that keeps AI-written software
          coherent, safe, and regenerable. You own the code.
        </div>
      </div>

      {/* Decorative bottom bar */}
      <div tw="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]" />
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
