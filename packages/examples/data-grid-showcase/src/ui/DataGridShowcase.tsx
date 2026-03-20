'use client';

import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tabs';
import {
	ClientModeTable,
	DataViewModeTable,
	ServerModeTable,
} from './data-grid-showcase.tables';

export function DataGridShowcase() {
	return (
		<VStack gap="lg">
			<Tabs defaultValue="client" className="w-full">
				<TabsList>
					<TabsTrigger value="client">Generic Client</TabsTrigger>
					<TabsTrigger value="server">Generic Server</TabsTrigger>
					<TabsTrigger value="data-view">DataView Adapter</TabsTrigger>
				</TabsList>
				<TabsContent value="client">
					<ClientModeTable />
				</TabsContent>
				<TabsContent value="server">
					<ServerModeTable />
				</TabsContent>
				<TabsContent value="data-view">
					<DataViewModeTable />
				</TabsContent>
			</Tabs>
		</VStack>
	);
}
