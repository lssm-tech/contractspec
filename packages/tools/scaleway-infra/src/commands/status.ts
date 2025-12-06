import { Domain, Instance, Lb, Rdb, Redis, Vpc, Vpcgw } from '@scaleway/sdk';
import { createScalewayClient } from '../clients/scaleway-client';
import {
  getConfig,
  getResourceNames,
  loadScalewayCredentials,
} from '../config/index';

export interface StatusResult {
  networking: {
    vpc: boolean;
    privateNetwork: boolean;
    publicGateway: boolean;
    securityGroups: {
      backend: boolean;
      db: boolean;
      redis: boolean;
    };
  };
  compute: {
    instances: number;
  };
  database: {
    instance: boolean;
    databases: number;
  };
  cache: {
    instance: boolean;
  };
  storage: {
    buckets: number;
  };
  queues: {
    queues: number;
  };
  loadBalancer: {
    instance: boolean;
    frontends: number;
    backends: number;
  };
  dns: {
    zones: number;
    records: number;
  };
}

export async function status(env?: string): Promise<StatusResult> {
  const config = getConfig(env as 'prod' | 'stg');
  const credentials = loadScalewayCredentials();
  const client = createScalewayClient(credentials, config.region, config.zone);
  const resourceNames = getResourceNames(config.environment, config.org);

  // Initialize API clients
  const apiVpc = new Vpc.v2.API(client);
  const apiVpcGw = new Vpcgw.v2.API(client);
  const apiInstance = new Instance.v1.API(client);
  const apiRdb = new Rdb.v1.API(client);
  const apiRedis = new Redis.v1.API(client);
  // const apiMnqSqs = new Mnqv1beta1.SqsAPI(client);
  const apiLb = new Lb.v1.API(client);
  const apiDns = new Domain.v2beta1.API(client);

  // Check networking
  const vpcs = await apiVpc.listVPCs({ name: resourceNames.vpc });
  const pns = await apiVpc.listPrivateNetworks({
    name: resourceNames.privateNetwork,
  });
  const gateways = await apiVpcGw.listGateways({
    name: resourceNames.publicGateway,
  });
  const backendSg = await apiInstance.listSecurityGroups({
    name: resourceNames.securityGroupBackend,
  });
  const dbSg = await apiInstance.listSecurityGroups({
    name: resourceNames.securityGroupDb,
  });
  const redisSg = await apiInstance.listSecurityGroups({
    name: resourceNames.securityGroupRedis,
  });

  // Check compute
  let instanceCount = 0;
  for (let i = 1; i <= 10; i++) {
    const instances = await apiInstance.listServers({
      name: resourceNames.instance(i),
    });
    if (instances.servers && instances.servers.length > 0) {
      instanceCount++;
    }
  }

  // Check database
  const dbInstances = await apiRdb.listInstances({
    name: resourceNames.postgresInstance,
  });
  let dbCount = 0;
  if (dbInstances.instances && dbInstances.instances.length > 0) {
    const instance = dbInstances.instances[0];
    if (instance) {
      const dbs = await apiRdb.listDatabases({
        instanceId: instance.id,
        skipSizeRetrieval: true,
      });
      dbCount = dbs.databases?.length || 0;
    }
  }

  // Check cache
  const redisClusters = await apiRedis.listClusters({
    name: resourceNames.redisInstance,
  });

  // Check queues
  // let queueCount = 0;
  // for (const queueName of resourceNames.queues) {
  //   const queues = await apiMnqSqs.listQueues({ name: queueName });
  //   if (queues.queues && queues.queues.length > 0) {
  //     queueCount++;
  //   }
  // }

  // Check load balancer
  const lbs = await apiLb.listLbs({ name: resourceNames.loadBalancer });
  let frontendCount = 0;
  let backendCount = 0;
  if (lbs.lbs && lbs.lbs.length > 0) {
    const lb = lbs.lbs[0];
    if (lb) {
      const frontends = await apiLb.listFrontends({ lbId: lb.id });
      const backends = await apiLb.listBackends({ lbId: lb.id });
      frontendCount = frontends.frontends?.length || 0;
      backendCount = backends.backends?.length || 0;
    }
  }

  // Check DNS
  let zoneCount = 0;
  let recordCount = 0;
  for (const zoneName of resourceNames.dnsZones) {
    const zoneList = await apiDns.listDNSZones({ domain: zoneName });
    if (zoneList.dnsZones && zoneList.dnsZones.length > 0) {
      zoneCount++;
      const zone = zoneList.dnsZones[0];
      if (zone) {
        const records = await apiDns.listDNSZoneRecords({
          dnsZone: zone.domain,
          name: '',
        });
        recordCount += records.records?.length || 0;
      }
    }
  }

  return {
    networking: {
      vpc: (vpcs.vpcs?.length || 0) > 0,
      privateNetwork: (pns.privateNetworks?.length || 0) > 0,
      publicGateway: (gateways.gateways?.length || 0) > 0,
      securityGroups: {
        backend: (backendSg.securityGroups?.length || 0) > 0,
        db: (dbSg.securityGroups?.length || 0) > 0,
        redis: (redisSg.securityGroups?.length || 0) > 0,
      },
    },
    compute: {
      instances: instanceCount,
    },
    database: {
      instance: (dbInstances.instances?.length || 0) > 0,
      databases: dbCount,
    },
    cache: {
      instance: (redisClusters.clusters?.length || 0) > 0,
    },
    storage: {
      buckets: resourceNames.buckets.length, // Placeholder
    },
    queues: {
      queues: -1,
    },
    loadBalancer: {
      instance: (lbs.lbs?.length || 0) > 0,
      frontends: frontendCount,
      backends: backendCount,
    },
    dns: {
      zones: zoneCount,
      records: recordCount,
    },
  };
}

export function formatStatus(statusResult: StatusResult): string {
  const lines: string[] = [];
  lines.push('Infrastructure Status');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push('Networking:');
  lines.push(`  VPC: ${statusResult.networking.vpc ? '✅' : '❌'}`);
  lines.push(
    `  Private Network: ${statusResult.networking.privateNetwork ? '✅' : '❌'}`
  );
  lines.push(
    `  Public Gateway: ${statusResult.networking.publicGateway ? '✅' : '❌'}`
  );
  lines.push(
    `  Security Group (Backend): ${statusResult.networking.securityGroups.backend ? '✅' : '❌'}`
  );
  lines.push(
    `  Security Group (DB): ${statusResult.networking.securityGroups.db ? '✅' : '❌'}`
  );
  lines.push(
    `  Security Group (Redis): ${statusResult.networking.securityGroups.redis ? '✅' : '❌'}`
  );
  lines.push('');

  lines.push('Compute:');
  lines.push(`  Instances: ${statusResult.compute.instances}`);
  lines.push('');

  lines.push('Database:');
  lines.push(`  Instance: ${statusResult.database.instance ? '✅' : '❌'}`);
  lines.push(`  Databases: ${statusResult.database.databases}`);
  lines.push('');

  lines.push('Cache:');
  lines.push(`  Redis Instance: ${statusResult.cache.instance ? '✅' : '❌'}`);
  lines.push('');

  lines.push('Storage:');
  lines.push(`  Buckets: ${statusResult.storage.buckets}`);
  lines.push('');

  lines.push('Queues:');
  lines.push(`  Queues: ${statusResult.queues.queues}`);
  lines.push('');

  lines.push('Load Balancer:');
  lines.push(`  LB: ${statusResult.loadBalancer.instance ? '✅' : '❌'}`);
  lines.push(`  Frontends: ${statusResult.loadBalancer.frontends}`);
  lines.push(`  Backends: ${statusResult.loadBalancer.backends}`);
  lines.push('');

  lines.push('DNS:');
  lines.push(`  Zones: ${statusResult.dns.zones}`);
  lines.push(`  Records: ${statusResult.dns.records}`);

  return lines.join('\n');
}
