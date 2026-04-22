'use client';

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { H2, Lead, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import * as React from 'react';
import {
	CapabilityList,
	InteractionLog,
	LayerMap,
	NativePrimitivePanel,
} from './data-grid-showcase.parts';
import {
	ClientModeTable,
	DataViewModeTable,
	ServerModeTable,
	WebPrimitiveTable,
} from './data-grid-showcase.tables';

export function DataGridShowcase() {
	const [entries, setEntries] = React.useState<string[]>([]);

	const appendEntry = React.useCallback((message: string) => {
		setEntries((current) => [message, ...current].slice(0, 8));
	}, []);

	return (
		<VStack gap="lg">
			<div className="space-y-4">
				<Small>Canonical example</Small>
				<H2>ContractSpec Data Table Showcase</H2>
				<Lead>
					One example, five lanes: contract definition, headless controller, raw
					web primitive, native-first primitive, and the composed design-system
					surface.
				</Lead>
				<LayerMap />
				<CapabilityList />
				<InteractionLog entries={entries} />
			</div>

			<Tabs defaultValue="client" className="w-full">
				<TabsList>
					<TabsTrigger value="client">Client</TabsTrigger>
					<TabsTrigger value="server">Server</TabsTrigger>
					<TabsTrigger value="data-view">DataView</TabsTrigger>
					<TabsTrigger value="web-primitive">Web Primitive</TabsTrigger>
					<TabsTrigger value="native-primitive">Native Primitive</TabsTrigger>
				</TabsList>
				<TabsContent value="client">
					<ClientModeTable onEvent={appendEntry} />
				</TabsContent>
				<TabsContent value="server">
					<ServerModeTable onEvent={appendEntry} />
				</TabsContent>
				<TabsContent value="data-view">
					<DataViewModeTable onEvent={appendEntry} />
				</TabsContent>
				<TabsContent value="web-primitive">
					<WebPrimitiveTable onEvent={appendEntry} />
				</TabsContent>
				<TabsContent value="native-primitive">
					<NativePrimitivePanel />
				</TabsContent>
			</Tabs>
		</VStack>
	);
}
