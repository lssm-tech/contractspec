import { gqlSchemaBuilder } from './builder';
// Reuse application module registrars from api-strit for now; will be moved into bundle progressively
import { registerSpotsPrismaObjectsSchema } from './modules/spots';
import { registerBookingsSchema } from './modules/bookings';
import { registerDocumentsSchema } from './modules/documents';
import { registerWholesaleSchema } from './modules/wholesale';
import { registerMetricsSchema } from './modules/metrics';
import { registerStritNotificationsSchema } from './modules/notifications';
import { registerAdminSchema } from './modules/admin';
import { registerComplianceSchema } from './modules/compliance';
import { registerAuthSchema } from './modules/auth';
import { registerOnboardingSchema } from './modules/onboarding';
import { registerAISchema } from './modules/ai';
import { registerGdprSchema } from './modules/gdpr';
import { stritContractsReg, stritResourcesRegistry } from '../ops/registries';
import { registerContractsOnBuilder } from '@lssm/lib.contracts';
import { registerGeoAreasSchema } from './modules/geoareas';
import { GeoAreasService } from '../../application/services/GeoAreasService';
import { registerGeoHeatmapSchema } from './modules/geo-heatmap';
import { GeoHeatmapService } from '../../application/services/GeoHeatmapService';

registerContractsOnBuilder(
  gqlSchemaBuilder,
  stritContractsReg,
  stritResourcesRegistry
);

// Register modular schemas (phase 1: mixed imports; phase 2: localize into bundle)
registerAuthSchema(gqlSchemaBuilder);
registerSpotsPrismaObjectsSchema();
registerBookingsSchema();
registerDocumentsSchema();
registerWholesaleSchema();
registerMetricsSchema();
registerStritNotificationsSchema();
registerAdminSchema();
registerComplianceSchema();
registerOnboardingSchema();
registerAISchema();
registerGdprSchema();
registerGeoAreasSchema(gqlSchemaBuilder, { geoAreas: new GeoAreasService() });
registerGeoHeatmapSchema(gqlSchemaBuilder, {
  heatmap: new GeoHeatmapService(),
});
export const schema = gqlSchemaBuilder.toSchema();
