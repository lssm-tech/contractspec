import { schema } from '@contractspec/bundle.studio/infrastructure';
import { exportContractsToGraphQLSchema } from './utils/graphql-schema-export';

exportContractsToGraphQLSchema(schema, __dirname);
