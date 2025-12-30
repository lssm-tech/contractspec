import { Domain, Instance, Lb, Rdb, Redis, Vpc, Vpcgw } from '@scaleway/sdk';
import { createScalewayClient } from '../clients/scaleway-client';
import {
  getConfig,
  getResourceNames,
  loadScalewayCredentials,
} from '../config/index';

export async function destroy(
  env?: string,
  autoApprove = false
): Promise<void> {
  const config = getConfig(env as 'prd' | 'stg');
  const credentials = loadScalewayCredentials();
  const client = createScalewayClient(credentials, config.region, config.zone);
  const resourceNames = getResourceNames(config.environment, config.org);

  // Initialize API clients
  const apiVpc = new Vpc.v2.API(client);
  const apiVpcGw = new Vpcgw.v1.API(client);
  const apiInstance = new Instance.v1.API(client);
  const apiRdb = new Rdb.v1.API(client);
  const apiRedis = new Redis.v1.API(client);
  // const apiMnqSqs = new Mnqv1beta1.SqsAPI(client);
  const apiLb = new Lb.v1.API(client);
  const apiDns = new Domain.v2beta1.API(client);

  if (!autoApprove) {
    console.warn(
      '⚠️  WARNING: This will destroy all infrastructure resources!'
    );
    console.warn(`Environment: ${config.environment}`);
    console.warn('This action cannot be undone.');
    throw new Error('Destroy requires --auto-approve flag');
  }

  console.log(
    `Destroying infrastructure for environment: ${config.environment}`
  );

  // Destroy in reverse order of creation
  // DNS first
  try {
    console.log('Destroying DNS records and zones...');
    for (const zoneName of resourceNames.dnsZones) {
      const zones = await apiDns.listDNSZones({ domain: zoneName });
      if (zones.dnsZones && zones.dnsZones.length > 0) {
        const zone = zones.dnsZones[0];
        if (zone) {
          const records = await apiDns.listDNSZoneRecords({
            dnsZone: zone.domain,
            name: '',
          });
          for (const record of records.records || []) {
            await apiDns.updateDNSZoneRecords({
              dnsZone: zone.domain,
              changes: [
                {
                  delete: {
                    idFields: {
                      name: record.name,
                      type: record.type,
                    },
                  },
                },
              ],
              disallowNewZoneCreation: false,
            });
          }
          await apiDns.deleteDNSZone({ dnsZone: zone.domain });
        }
      }
    }
  } catch (error) {
    console.error('Error destroying DNS:', error);
  }

  // Load Balancer
  try {
    console.log('Destroying Load Balancer...');
    const lbs = await apiLb.listLbs({ name: resourceNames.loadBalancer });
    if (lbs.lbs && lbs.lbs.length > 0) {
      const lb = lbs.lbs[0];
      if (lb) {
        const frontends = await apiLb.listFrontends({ lbId: lb.id });
        for (const frontend of frontends.frontends || []) {
          await apiLb.deleteFrontend({ frontendId: frontend.id });
        }
        const backends = await apiLb.listBackends({ lbId: lb.id });
        for (const backend of backends.backends || []) {
          await apiLb.deleteBackend({ backendId: backend.id });
        }
        await apiLb.deleteLb({ lbId: lb.id, releaseIp: false });
      }
    }
  } catch (error) {
    console.error('Error destroying Load Balancer:', error);
  }

  // Queues
  // try {
  //   console.log('Destroying Queues...');
  //   for (const queueName of resourceNames.queues) {
  //     const queues = await apiMnqSqs.getSqsInfo({ name: queueName });
  //     if (queues.queues && queues.queues.length > 0) {
  //       await apiMnqSqs.deactivateSqs({ queueId: queues.queues[0].id });
  //     }
  //     // Delete DLQ
  //     const dlqName = `${queueName}-dlq`;
  //     const dlqs = await apiMnqSqs.getSqsInfo({ name: dlqName });
  //     if (dlqs.queues && dlqs.queues.length > 0) {
  //       await apiMnqSqs.deactivateSqs({ queueId: dlqs.queues[0].id });
  //     }
  //   }
  // } catch (error) {
  //   console.error('Error destroying Queues:', error);
  // }

  // Storage (placeholder - not managed via SDK)
  console.log('Skipping Object Storage (not managed via SDK)');

  // Cache
  try {
    console.log('Destroying Redis...');
    const clusters = await apiRedis.listClusters({
      name: resourceNames.redisInstance,
    });
    if (clusters.clusters && clusters.clusters.length > 0) {
      const cluster = clusters.clusters[0];
      if (cluster) {
        await apiRedis.deleteCluster({
          clusterId: cluster.id,
        });
      }
    }
  } catch (error) {
    console.error('Error destroying Redis:', error);
  }

  // Database
  try {
    console.log('Destroying Database...');
    const instances = await apiRdb.listInstances({
      name: resourceNames.postgresInstance,
    });
    if (instances.instances && instances.instances.length > 0) {
      const instance = instances.instances[0];
      if (instance) {
        await apiRdb.deleteInstance({
          instanceId: instance.id,
        });
      }
    }
  } catch (error) {
    console.error('Error destroying Database:', error);
  }

  // Compute
  try {
    console.log('Destroying Instances...');
    for (let i = 1; i <= 10; i++) {
      const name = resourceNames.instance(i);
      const servers = await apiInstance.listServers({ name });
      if (servers.servers && servers.servers.length > 0) {
        const server = servers.servers[0];
        if (server) {
          await apiInstance.deleteServer({
            serverId: server.id,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error destroying Instances:', error);
  }

  // Security Groups
  try {
    console.log('Destroying Security Groups...');
    const backendSg = await apiInstance.listSecurityGroups({
      name: resourceNames.securityGroupBackend,
    });
    if (backendSg.securityGroups && backendSg.securityGroups.length > 0) {
      const sg = backendSg.securityGroups[0];
      if (sg) {
        await apiInstance.deleteSecurityGroup({
          securityGroupId: sg.id,
        });
      }
    }
    const dbSg = await apiInstance.listSecurityGroups({
      name: resourceNames.securityGroupDb,
    });
    if (dbSg.securityGroups && dbSg.securityGroups.length > 0) {
      const sg = dbSg.securityGroups[0];
      if (sg) {
        await apiInstance.deleteSecurityGroup({
          securityGroupId: sg.id,
        });
      }
    }
    const redisSg = await apiInstance.listSecurityGroups({
      name: resourceNames.securityGroupRedis,
    });
    if (redisSg.securityGroups && redisSg.securityGroups.length > 0) {
      const sg = redisSg.securityGroups[0];
      if (sg) {
        await apiInstance.deleteSecurityGroup({
          securityGroupId: sg.id,
        });
      }
    }
  } catch (error) {
    console.error('Error destroying Security Groups:', error);
  }

  // Public Gateway
  try {
    console.log('Destroying Public Gateway...');
    const gateways = await apiVpcGw.listGateways({
      name: resourceNames.publicGateway,
    });
    if (gateways.gateways && gateways.gateways.length > 0) {
      const gateway = gateways.gateways[0];
      if (gateway) {
        // Detach from private network first
        const gatewayNetworks = await apiVpcGw.listGatewayNetworks({
          gatewayId: gateway.id,
        });
        for (const gwNetwork of gatewayNetworks.gatewayNetworks || []) {
          await apiVpcGw.deleteGatewayNetwork({
            gatewayNetworkId: gwNetwork.id,
            cleanupDhcp: true,
          });
        }
        await apiVpcGw.deleteGateway({
          gatewayId: gateway.id,
          cleanupDhcp: true,
        });
      }
    }
  } catch (error) {
    console.error('Error destroying Public Gateway:', error);
  }

  // Private Network
  try {
    console.log('Destroying Private Network...');
    const pns = await apiVpc.listPrivateNetworks({
      name: resourceNames.privateNetwork,
    });
    if (pns.privateNetworks && pns.privateNetworks.length > 0) {
      const pn = pns.privateNetworks[0];
      if (pn) {
        await apiVpc.deletePrivateNetwork({
          privateNetworkId: pn.id,
        });
      }
    }
  } catch (error) {
    console.error('Error destroying Private Network:', error);
  }

  // VPC
  try {
    console.log('Destroying VPC...');
    const vpcs = await apiVpc.listVPCs({ name: resourceNames.vpc });
    if (vpcs.vpcs && vpcs.vpcs.length > 0) {
      const vpc = vpcs.vpcs[0];
      if (vpc) {
        await apiVpc.deleteVPC({ vpcId: vpc.id });
      }
    }
  } catch (error) {
    console.error('Error destroying VPC:', error);
  }

  console.log('✅ Destruction complete');
}
