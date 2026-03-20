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
				justifyContent: 'space-between',
				backgroundColor: '#f7f0e6',
				backgroundImage:
					'radial-gradient(circle at 16% 12%, rgba(162,79,42,0.18), transparent 28%), radial-gradient(circle at 84% 8%, rgba(37,86,120,0.12), transparent 24%)',
				padding: '54px 64px',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 18,
					maxWidth: 980,
				}}
			>
				<div
					style={{
						display: 'flex',
						fontSize: 18,
						letterSpacing: 6,
						textTransform: 'uppercase',
						color: '#a24f2a',
					}}
				>
					ContractSpec
				</div>
				<div
					style={{
						display: 'flex',
						fontSize: 92,
						fontWeight: 700,
						letterSpacing: -5,
						lineHeight: 0.94,
						color: '#1d1b18',
					}}
				>
					The open spec system for AI-native software
				</div>
				<div
					style={{
						display: 'flex',
						fontSize: 30,
						lineHeight: 1.35,
						color: '#5e564d',
						maxWidth: 930,
					}}
				>
					Define explicit contracts, keep every surface aligned, and move into
					Studio when you want the operating layer on top.
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					borderTop: '1px solid rgba(94,86,77,0.2)',
					paddingTop: 24,
					fontSize: 22,
					color: '#5e564d',
				}}
			>
				<div style={{ display: 'flex', gap: 30 }}>
					<span>OSS/Core</span>
					<span>Studio</span>
					<span>Templates</span>
				</div>
				<div style={{ color: '#255678' }}>contractspec.io</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		}
	);
}
