import * as React from 'react';
import { KeyValueList } from '../atoms/KeyValueList';
import { LegalHeading } from '../atoms/LegalHeading';
import { LegalSection } from '../atoms/LegalSection';
import { LegalText } from '../atoms/LegalText';
import { LegalPageLayout } from '../organisms/LegalPageLayout';

export function CookiesTemplate({
	title = 'Politique Cookies',
	meta,
	toc,
	keyValues,
	sections,
}: {
	title?: React.ReactNode;
	meta?: { lastUpdated?: string | Date; version?: string };
	toc?: { href: string; label: React.ReactNode }[];
	keyValues?: { key: React.ReactNode; value: React.ReactNode }[];
	sections: { id: string; title: React.ReactNode; content: React.ReactNode }[];
}) {
	return (
		<LegalPageLayout title={title} meta={meta} toc={toc}>
			{keyValues && keyValues.length > 0 && (
				<LegalSection border="bottom">
					<KeyValueList items={keyValues} />
				</LegalSection>
			)}

			{sections.map((s) => (
				<LegalSection
					key={s.id}
					id={s.id}
					border="top"
					className="scroll-mt-24"
				>
					<LegalHeading as="h2" level="h2">
						{s.title}
					</LegalHeading>
					<LegalText as="div">{s.content}</LegalText>
				</LegalSection>
			))}
		</LegalPageLayout>
	);
}
