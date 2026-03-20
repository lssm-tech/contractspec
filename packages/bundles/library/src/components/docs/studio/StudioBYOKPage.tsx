import Link from '@contractspec/lib.ui-link';

export function StudioBYOKPage() {
	return (
		<main className="space-y-6 py-12">
			<h1 className="font-bold text-3xl">Studio docs moved</h1>
			<p className="text-muted-foreground text-sm">
				Security and BYOK guidance now lives in the Studio app docs.
			</p>
			<Link href="https://www.contractspec.studio/docs" className="btn-primary">
				Open Studio docs
			</Link>
		</main>
	);
}
