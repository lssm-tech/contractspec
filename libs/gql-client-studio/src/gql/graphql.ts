/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  CountryCode: { input: any; output: any };
  Currency: { input: any; output: any };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  EmailAddress: { input: any; output: any };
  /** Unvalidated float scalar */
  Float_unsecure: { input: any; output: any };
  /** A GeoJSON object as defined by RFC 7946: https://datatracker.ietf.org/doc/html/rfc7946 */
  GeoJSON: {
    input:
      | {
          type: 'Point';
          coordinates: [number, number] | [number, number, number];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPoint';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'LineString';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiLineString';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Polygon';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPolygon';
          coordinates: [number, number] | [number, number, number][][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'GeometryCollection';
          geometries: (
            | {
                type: 'Point';
                coordinates: [number, number] | [number, number, number];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPoint';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'LineString';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiLineString';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'Polygon';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPolygon';
                coordinates: [number, number] | [number, number, number][][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
          )[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Feature';
          geometry:
            | (
                | {
                    type: 'Point';
                    coordinates: [number, number] | [number, number, number];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPoint';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'LineString';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiLineString';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'Polygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPolygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'GeometryCollection';
                    geometries: (
                      | {
                          type: 'Point';
                          coordinates:
                            | [number, number]
                            | [number, number, number];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPoint';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'LineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiLineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'Polygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPolygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                    )[];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
              )
            | null;
          properties: { [key: string]: any } | null;
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'FeatureCollection';
          features: {
            type: 'Feature';
            geometry:
              | (
                  | {
                      type: 'Point';
                      coordinates: [number, number] | [number, number, number];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPoint';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'LineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiLineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'Polygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPolygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'GeometryCollection';
                      geometries: (
                        | {
                            type: 'Point';
                            coordinates:
                              | [number, number]
                              | [number, number, number];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPoint';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'LineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiLineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'Polygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPolygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                      )[];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                )
              | null;
            properties: { [key: string]: any } | null;
            bbox?:
              | [number, number, number, number]
              | [number, number, number, number, number, number];
          }[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        };
    output:
      | {
          type: 'Point';
          coordinates: [number, number] | [number, number, number];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPoint';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'LineString';
          coordinates: [number, number] | [number, number, number][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiLineString';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Polygon';
          coordinates: [number, number] | [number, number, number][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'MultiPolygon';
          coordinates: [number, number] | [number, number, number][][][];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'GeometryCollection';
          geometries: (
            | {
                type: 'Point';
                coordinates: [number, number] | [number, number, number];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPoint';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'LineString';
                coordinates: [number, number] | [number, number, number][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiLineString';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'Polygon';
                coordinates: [number, number] | [number, number, number][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
            | {
                type: 'MultiPolygon';
                coordinates: [number, number] | [number, number, number][][][];
                bbox?:
                  | [number, number, number, number]
                  | [number, number, number, number, number, number];
              }
          )[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'Feature';
          geometry:
            | (
                | {
                    type: 'Point';
                    coordinates: [number, number] | [number, number, number];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPoint';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'LineString';
                    coordinates: [number, number] | [number, number, number][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiLineString';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'Polygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'MultiPolygon';
                    coordinates:
                      | [number, number]
                      | [number, number, number][][][];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
                | {
                    type: 'GeometryCollection';
                    geometries: (
                      | {
                          type: 'Point';
                          coordinates:
                            | [number, number]
                            | [number, number, number];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPoint';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'LineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiLineString';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'Polygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                      | {
                          type: 'MultiPolygon';
                          coordinates:
                            | [number, number]
                            | [number, number, number][][][];
                          bbox?:
                            | [number, number, number, number]
                            | [number, number, number, number, number, number];
                        }
                    )[];
                    bbox?:
                      | [number, number, number, number]
                      | [number, number, number, number, number, number];
                  }
              )
            | null;
          properties: { [key: string]: any } | null;
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        }
      | {
          type: 'FeatureCollection';
          features: {
            type: 'Feature';
            geometry:
              | (
                  | {
                      type: 'Point';
                      coordinates: [number, number] | [number, number, number];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPoint';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'LineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiLineString';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'Polygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'MultiPolygon';
                      coordinates:
                        | [number, number]
                        | [number, number, number][][][];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                  | {
                      type: 'GeometryCollection';
                      geometries: (
                        | {
                            type: 'Point';
                            coordinates:
                              | [number, number]
                              | [number, number, number];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPoint';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'LineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiLineString';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'Polygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                        | {
                            type: 'MultiPolygon';
                            coordinates:
                              | [number, number]
                              | [number, number, number][][][];
                            bbox?:
                              | [number, number, number, number]
                              | [
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                  number,
                                ];
                          }
                      )[];
                      bbox?:
                        | [number, number, number, number]
                        | [number, number, number, number, number, number];
                    }
                )
              | null;
            properties: { [key: string]: any } | null;
            bbox?:
              | [number, number, number, number]
              | [number, number, number, number, number, number];
          }[];
          bbox?:
            | [number, number, number, number]
            | [number, number, number, number, number, number];
        };
  };
  /** Unvalidated integer scalar */
  Int_unsecure: { input: any; output: any };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
  Latitude: { input: any; output: any };
  Locale: { input: any; output: any };
  Longitude: { input: any; output: any };
  NonEmptyString: { input: any; output: any };
  PhoneNumber: { input: any; output: any };
  /** Unvalidated string scalar */
  String_unsecure: { input: any; output: any };
  Time: { input: any; output: any };
  TimeZone: { input: any; output: any };
  URL: { input: any; output: any };
};

export type CanvasVersion = {
  __typename?: 'CanvasVersion';
  createdAt?: Maybe<Scalars['Date']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  nodes?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<CanvasVersionStatusEnum>;
};

export enum CanvasVersionStatusEnum {
  Deployed = 'DEPLOYED',
  Draft = 'DRAFT',
}

export type ConnectIntegrationInput = {
  config: Scalars['JSON']['input'];
  credentials?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  ownershipMode: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  provider: IntegrationProviderEnum;
  secretProvider: Scalars['String']['input'];
  secretRef: Scalars['String']['input'];
};

export type ConnectionStatus = {
  __typename?: 'ConnectionStatus';
  linkedProviders?: Maybe<Array<Scalars['String']['output']>>;
};

export type CreateProjectInput = {
  byokEnabled: Scalars['Boolean']['input'];
  deploymentMode?: InputMaybe<DeploymentModeEnum>;
  description: Scalars['String']['input'];
  evolutionEnabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  teamIds?: InputMaybe<Array<Scalars['String']['input']>>;
  tier: ProjectTierEnum;
};

export type CreateSpecInput = {
  content: Scalars['JSON']['input'];
  metadata: Scalars['JSON']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  type: SpecTypeEnum;
  version: Scalars['String']['input'];
};

export type DeployCanvasVersionInput = {
  canvasId: Scalars['String']['input'];
  versionId: Scalars['String']['input'];
};

export type DeployProjectInput = {
  environment: EnvironmentEnum;
  projectId: Scalars['String']['input'];
};

export enum DeploymentModeEnum {
  Dedicated = 'DEDICATED',
  Shared = 'SHARED',
}

export enum DeploymentStatusEnum {
  Deployed = 'DEPLOYED',
  Deploying = 'DEPLOYING',
  Failed = 'FAILED',
  Pending = 'PENDING',
  RolledBack = 'ROLLED_BACK',
}

export enum EnvironmentEnum {
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
  Staging = 'STAGING',
}

export type EvolutionSession = {
  __typename?: 'EvolutionSession';
  appliedChanges?: Maybe<Scalars['JSON']['output']>;
  completedAt?: Maybe<Scalars['Date']['output']>;
  context?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  signals?: Maybe<Scalars['JSON']['output']>;
  startedAt?: Maybe<Scalars['Date']['output']>;
  status?: Maybe<EvolutionStatusEnum>;
  suggestions?: Maybe<Scalars['JSON']['output']>;
  trigger?: Maybe<EvolutionTriggerEnum>;
};

export enum EvolutionStatusEnum {
  Analyzing = 'ANALYZING',
  Applying = 'APPLYING',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  SuggestionsReady = 'SUGGESTIONS_READY',
}

export enum EvolutionTriggerEnum {
  AnomalyDetected = 'ANOMALY_DETECTED',
  LifecycleStageChange = 'LIFECYCLE_STAGE_CHANGE',
  Manual = 'MANUAL',
  Scheduled = 'SCHEDULED',
  UsagePattern = 'USAGE_PATTERN',
}

export type IndexKnowledgeInput = {
  collection: Scalars['String']['input'];
  documents: Array<KnowledgeDocumentInput>;
  metadata: Scalars['JSON']['input'];
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  type: KnowledgeSourceTypeEnum;
};

export type IntegrationConnection = {
  __typename?: 'IntegrationConnection';
  config?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  environment?: Maybe<Scalars['String']['output']>;
  externalAccountId?: Maybe<Scalars['String']['output']>;
  healthCheckedAt?: Maybe<Scalars['Date']['output']>;
  healthErrorCode?: Maybe<Scalars['String']['output']>;
  healthErrorMessage?: Maybe<Scalars['String']['output']>;
  healthLatencyMs?: Maybe<Scalars['Float']['output']>;
  healthStatus?: Maybe<IntegrationConnectionStatusEnum>;
  id: Scalars['ID']['output'];
  integrationKey?: Maybe<Scalars['String']['output']>;
  integrationVersion?: Maybe<Scalars['Int']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  ownershipMode?: Maybe<IntegrationOwnershipModeEnum>;
  secretProvider?: Maybe<Scalars['String']['output']>;
  secretRef?: Maybe<Scalars['String']['output']>;
  status?: Maybe<IntegrationConnectionStatusEnum>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  usageErrorCount?: Maybe<Scalars['Int']['output']>;
  usageLastErrorAt?: Maybe<Scalars['Date']['output']>;
  usageLastErrorCode?: Maybe<Scalars['String']['output']>;
  usageLastSuccessAt?: Maybe<Scalars['Date']['output']>;
  usageLastUsedAt?: Maybe<Scalars['Date']['output']>;
  usageRequestCount?: Maybe<Scalars['Int']['output']>;
  usageSuccessCount?: Maybe<Scalars['Int']['output']>;
};

export enum IntegrationConnectionStatusEnum {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Error = 'error',
  Unknown = 'unknown',
}

export enum IntegrationOwnershipModeEnum {
  Byok = 'byok',
  Managed = 'managed',
}

export enum IntegrationProviderEnum {
  Airtable = 'AIRTABLE',
  Anthropic = 'ANTHROPIC',
  Custom = 'CUSTOM',
  Github = 'GITHUB',
  Notion = 'NOTION',
  Openai = 'OPENAI',
  Posthog = 'POSTHOG',
  Slack = 'SLACK',
  Stripe = 'STRIPE',
}

export type IntegrationSyncResult = {
  __typename?: 'IntegrationSyncResult';
  integrationId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  syncedAt?: Maybe<Scalars['Date']['output']>;
  usageCount?: Maybe<Scalars['Int']['output']>;
};

export type InviteResult = {
  __typename?: 'InviteResult';
  emailSent?: Maybe<Scalars['Boolean']['output']>;
  invitationId?: Maybe<Scalars['String']['output']>;
  inviteUrl?: Maybe<Scalars['String']['output']>;
};

export type KnowledgeAnswer = {
  __typename?: 'KnowledgeAnswer';
  answer?: Maybe<Scalars['String']['output']>;
  references?: Maybe<Scalars['JSON']['output']>;
  usage?: Maybe<Scalars['JSON']['output']>;
};

export type KnowledgeDocumentInput = {
  id: Scalars['String']['input'];
  metadata: Scalars['JSON']['input'];
  mimeType: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type KnowledgeSourceRecord = {
  __typename?: 'KnowledgeSourceRecord';
  content?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  indexed?: Maybe<Scalars['Boolean']['output']>;
  lastIndexed?: Maybe<Scalars['Date']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<KnowledgeSourceTypeEnum>;
  url?: Maybe<Scalars['String']['output']>;
};

export enum KnowledgeSourceTypeEnum {
  ApiSpec = 'API_SPEC',
  CodeRepository = 'CODE_REPOSITORY',
  Custom = 'CUSTOM',
  Documentation = 'DOCUMENTATION',
  NotionDatabase = 'NOTION_DATABASE',
}

export type LifecycleAction = {
  __typename?: 'LifecycleAction';
  category?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effortLevel?: Maybe<Scalars['String']['output']>;
  estimatedImpact?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  recommendedLibraries?: Maybe<Array<Scalars['String']['output']>>;
  stage?: Maybe<LifecycleStageEnum>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LifecycleAssessmentInput = {
  axes?: InputMaybe<Scalars['JSON']['input']>;
  metrics?: InputMaybe<Scalars['JSON']['input']>;
  questionnaireAnswers?: InputMaybe<Scalars['JSON']['input']>;
  signals?: InputMaybe<Scalars['JSON']['input']>;
};

export type LifecycleAssessmentRecord = {
  __typename?: 'LifecycleAssessmentRecord';
  confidence?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  focusAreas?: Maybe<Array<Scalars['String']['output']>>;
  id?: Maybe<Scalars['ID']['output']>;
  profileId?: Maybe<Scalars['String']['output']>;
  signals?: Maybe<Scalars['JSON']['output']>;
  stage?: Maybe<LifecycleStageEnum>;
};

export type LifecycleCeremony = {
  __typename?: 'LifecycleCeremony';
  copy?: Maybe<Scalars['String']['output']>;
  cues?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LifecycleMilestone = {
  __typename?: 'LifecycleMilestone';
  actionItems?: Maybe<Array<Scalars['String']['output']>>;
  category?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  guideContent?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  stage?: Maybe<LifecycleStageEnum>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LifecycleMilestoneProgress = {
  __typename?: 'LifecycleMilestoneProgress';
  category?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  milestoneId?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['Date']['output']>;
  status?: Maybe<MilestoneStatusEnum>;
};

export type LifecycleRecommendation = {
  __typename?: 'LifecycleRecommendation';
  actions?: Maybe<Array<LifecycleAction>>;
  ceremony?: Maybe<LifecycleCeremony>;
  stage?: Maybe<LifecycleStageEnum>;
  upcomingMilestones?: Maybe<Array<LifecycleMilestone>>;
};

export enum LifecycleStageEnum {
  ExpansionPlatform = 'EXPANSION_PLATFORM',
  Exploration = 'EXPLORATION',
  GrowthScaleUp = 'GROWTH_SCALE_UP',
  MaturityOptimization = 'MATURITY_OPTIMIZATION',
  MvpEarlyTraction = 'MVP_EARLY_TRACTION',
  ProblemSolutionFit = 'PROBLEM_SOLUTION_FIT',
  ProductMarketFit = 'PRODUCT_MARKET_FIT',
}

export enum MilestoneStatusEnum {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED',
  Skipped = 'SKIPPED',
}

export type Mutation = {
  __typename?: 'Mutation';
  connectIntegration?: Maybe<StudioIntegration>;
  createStudioProject?: Maybe<StudioProject>;
  createStudioSpec?: Maybe<StudioSpec>;
  createTeam?: Maybe<Team>;
  deleteStudioProject?: Maybe<StudioProject>;
  deleteTeam?: Maybe<Scalars['Boolean']['output']>;
  deployCanvasVersion?: Maybe<CanvasVersion>;
  deployStudioProject?: Maybe<StudioDeployment>;
  disconnectIntegration?: Maybe<Scalars['Boolean']['output']>;
  dismissOnboardingTrack?: Maybe<OnboardingProgress>;
  indexKnowledgeSource?: Maybe<KnowledgeSourceRecord>;
  inviteToOrganization?: Maybe<InviteResult>;
  platformAdminIntegrationConnectionCreate?: Maybe<IntegrationConnection>;
  platformAdminIntegrationConnectionDelete?: Maybe<
    Scalars['Boolean']['output']
  >;
  platformAdminIntegrationConnectionUpdate?: Maybe<IntegrationConnection>;
  platformAdminSecretCheck?: Maybe<Scalars['Boolean']['output']>;
  recordLearningEvent?: Maybe<StudioLearningEvent>;
  renameTeam?: Maybe<Team>;
  runLifecycleAssessment?: Maybe<LifecycleAssessmentRecord>;
  saveCanvasDraft?: Maybe<CanvasVersion>;
  saveTemplateToStudio?: Maybe<SaveTemplateResult>;
  setProjectTeams?: Maybe<Scalars['Boolean']['output']>;
  setUserMetadata?: Maybe<Scalars['Boolean']['output']>;
  startEvolutionSession?: Maybe<EvolutionSession>;
  syncIntegration?: Maybe<IntegrationSyncResult>;
  trackLifecycleMilestone?: Maybe<LifecycleMilestoneProgress>;
  undoCanvasVersion?: Maybe<CanvasVersion>;
  unlinkProvider?: Maybe<Scalars['Boolean']['output']>;
  updateEvolutionSession?: Maybe<EvolutionSession>;
  updateProfile?: Maybe<User>;
  updateStudioProject?: Maybe<StudioProject>;
  updateStudioSpec?: Maybe<StudioSpec>;
};

export type MutationConnectIntegrationArgs = {
  input: ConnectIntegrationInput;
};

export type MutationCreateStudioProjectArgs = {
  input: CreateProjectInput;
};

export type MutationCreateStudioSpecArgs = {
  input: CreateSpecInput;
};

export type MutationCreateTeamArgs = {
  name: Scalars['String']['input'];
};

export type MutationDeleteStudioProjectArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteTeamArgs = {
  teamId: Scalars['String']['input'];
};

export type MutationDeployCanvasVersionArgs = {
  input: DeployCanvasVersionInput;
};

export type MutationDeployStudioProjectArgs = {
  input: DeployProjectInput;
};

export type MutationDisconnectIntegrationArgs = {
  id: Scalars['String']['input'];
};

export type MutationDismissOnboardingTrackArgs = {
  trackKey: Scalars['String']['input'];
};

export type MutationIndexKnowledgeSourceArgs = {
  input: IndexKnowledgeInput;
};

export type MutationInviteToOrganizationArgs = {
  email: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPlatformAdminIntegrationConnectionCreateArgs = {
  input: PlatformIntegrationConnectionCreateInput;
};

export type MutationPlatformAdminIntegrationConnectionDeleteArgs = {
  connectionId: Scalars['String']['input'];
  targetOrganizationId: Scalars['String']['input'];
};

export type MutationPlatformAdminIntegrationConnectionUpdateArgs = {
  input: PlatformIntegrationConnectionUpdateInput;
};

export type MutationPlatformAdminSecretCheckArgs = {
  secretRef: Scalars['String']['input'];
};

export type MutationRecordLearningEventArgs = {
  input: RecordLearningEventInput;
};

export type MutationRenameTeamArgs = {
  name: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};

export type MutationRunLifecycleAssessmentArgs = {
  input: LifecycleAssessmentInput;
};

export type MutationSaveCanvasDraftArgs = {
  input: SaveCanvasDraftInput;
};

export type MutationSaveTemplateToStudioArgs = {
  input: SaveTemplateInput;
};

export type MutationSetProjectTeamsArgs = {
  projectId: Scalars['String']['input'];
  teamIds: Array<Scalars['String']['input']>;
};

export type MutationSetUserMetadataArgs = {
  json: Scalars['String']['input'];
};

export type MutationStartEvolutionSessionArgs = {
  input: StartEvolutionSessionInput;
};

export type MutationSyncIntegrationArgs = {
  id: Scalars['String']['input'];
};

export type MutationTrackLifecycleMilestoneArgs = {
  category: Scalars['String']['input'];
  milestoneId: Scalars['String']['input'];
  status: MilestoneStatusEnum;
};

export type MutationUndoCanvasVersionArgs = {
  input: UndoCanvasInput;
};

export type MutationUnlinkProviderArgs = {
  providerId: Scalars['String']['input'];
};

export type MutationUpdateEvolutionSessionArgs = {
  id: Scalars['String']['input'];
  input: UpdateEvolutionSessionInput;
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationUpdateStudioProjectArgs = {
  id: Scalars['String']['input'];
  input: UpdateProjectInput;
};

export type MutationUpdateStudioSpecArgs = {
  id: Scalars['String']['input'];
  input: UpdateSpecInput;
};

export type MyOnboardingTracks = {
  __typename?: 'MyOnboardingTracks';
  progress?: Maybe<Array<OnboardingProgress>>;
  tracks?: Maybe<Array<OnboardingTrack>>;
};

export type OnboardingProgress = {
  __typename?: 'OnboardingProgress';
  completedAt?: Maybe<Scalars['Date']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  dismissedAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isDismissed?: Maybe<Scalars['Boolean']['output']>;
  lastActivityAt?: Maybe<Scalars['Date']['output']>;
  learnerId?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  progress?: Maybe<Scalars['Int']['output']>;
  startedAt?: Maybe<Scalars['Date']['output']>;
  stepCompletions?: Maybe<Array<OnboardingStepCompletion>>;
  trackId?: Maybe<Scalars['String']['output']>;
  trackKey?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  xpEarned?: Maybe<Scalars['Int']['output']>;
};

export type OnboardingStep = {
  __typename?: 'OnboardingStep';
  actionLabel?: Maybe<Scalars['String']['output']>;
  actionUrl?: Maybe<Scalars['String']['output']>;
  availability?: Maybe<Scalars['JSON']['output']>;
  canSkip?: Maybe<Scalars['Boolean']['output']>;
  completionCondition?: Maybe<Scalars['JSON']['output']>;
  completionEvent?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  helpUrl?: Maybe<Scalars['String']['output']>;
  highlightSelector?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  instructions?: Maybe<Scalars['String']['output']>;
  isRequired?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  stepKey?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  tooltipPosition?: Maybe<Scalars['String']['output']>;
  trackId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  xpReward?: Maybe<Scalars['Int']['output']>;
};

export type OnboardingStepCompletion = {
  __typename?: 'OnboardingStepCompletion';
  completedAt?: Maybe<Scalars['Date']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  eventPayload?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  progressId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  stepId?: Maybe<Scalars['String']['output']>;
  stepKey?: Maybe<Scalars['String']['output']>;
  triggeringEvent?: Maybe<Scalars['String']['output']>;
  xpEarned?: Maybe<Scalars['Int']['output']>;
};

export type OnboardingTrack = {
  __typename?: 'OnboardingTrack';
  canSkip?: Maybe<Scalars['Boolean']['output']>;
  completionBadgeKey?: Maybe<Scalars['String']['output']>;
  completionXpBonus?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isRequired?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  steps?: Maybe<Array<OnboardingStep>>;
  streakBonusXp?: Maybe<Scalars['Int']['output']>;
  streakHoursWindow?: Maybe<Scalars['Int']['output']>;
  targetRole?: Maybe<Scalars['String']['output']>;
  targetUserSegment?: Maybe<Scalars['String']['output']>;
  totalXp?: Maybe<Scalars['Int']['output']>;
  trackKey?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type Organization = {
  __typename?: 'Organization';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  type?: Maybe<OrganizationType>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type OrganizationInvitation = {
  __typename?: 'OrganizationInvitation';
  acceptedAt?: Maybe<Scalars['Date']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  inviterId?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  teamId?: Maybe<Scalars['String']['output']>;
};

export type OrganizationLifecycleProfile = {
  __typename?: 'OrganizationLifecycleProfile';
  assessments?: Maybe<Array<LifecycleAssessmentRecord>>;
  capitalPhase?: Maybe<Scalars['String']['output']>;
  companyPhase?: Maybe<Scalars['String']['output']>;
  confidence?: Maybe<Scalars['Float']['output']>;
  currentStage?: Maybe<LifecycleStageEnum>;
  detectedStage?: Maybe<LifecycleStageEnum>;
  id?: Maybe<Scalars['ID']['output']>;
  lastAssessment?: Maybe<Scalars['Date']['output']>;
  metrics?: Maybe<Scalars['JSON']['output']>;
  milestones?: Maybe<Array<LifecycleMilestoneProgress>>;
  nextAssessment?: Maybe<Scalars['Date']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  productPhase?: Maybe<Scalars['String']['output']>;
  signals?: Maybe<Scalars['JSON']['output']>;
};

export type OrganizationMember = {
  __typename?: 'OrganizationMember';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export enum OrganizationType {
  ContractSpecCustomer = 'CONTRACT_SPEC_CUSTOMER',
  PlatformAdmin = 'PLATFORM_ADMIN',
}

export type PlatformIntegrationConnectionCreateInput = {
  config: Scalars['JSON']['input'];
  environment: Scalars['String']['input'];
  externalAccountId: Scalars['String']['input'];
  integrationKey: Scalars['String']['input'];
  integrationVersion: Scalars['Int']['input'];
  label: Scalars['String']['input'];
  ownershipMode: IntegrationOwnershipModeEnum;
  secretProvider: Scalars['String']['input'];
  secretRef: Scalars['String']['input'];
  secretWrite: PlatformSecretWriteInput;
  status: IntegrationConnectionStatusEnum;
  targetOrganizationId: Scalars['String']['input'];
};

export type PlatformIntegrationConnectionListInput = {
  category: Scalars['String']['input'];
  status: IntegrationConnectionStatusEnum;
  targetOrganizationId: Scalars['String']['input'];
};

export type PlatformIntegrationConnectionUpdateInput = {
  config: Scalars['JSON']['input'];
  connectionId: Scalars['String']['input'];
  environment: Scalars['String']['input'];
  externalAccountId: Scalars['String']['input'];
  label: Scalars['String']['input'];
  ownershipMode: IntegrationOwnershipModeEnum;
  secretProvider: Scalars['String']['input'];
  secretRef: Scalars['String']['input'];
  secretWrite: PlatformSecretWriteInput;
  status: IntegrationConnectionStatusEnum;
  targetOrganizationId: Scalars['String']['input'];
};

export type PlatformIntegrationSpec = {
  __typename?: 'PlatformIntegrationSpec';
  byokSetup?: Maybe<Scalars['JSON']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  configSchema?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  docsUrl?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  secretSchema?: Maybe<Scalars['JSON']['output']>;
  supportedModes?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type PlatformSecretWriteInput = {
  data: Scalars['String']['input'];
  encoding: Scalars['String']['input'];
};

export enum ProjectTierEnum {
  Enterprise = 'ENTERPRISE',
  Professional = 'PROFESSIONAL',
  Starter = 'STARTER',
}

export type Query = {
  __typename?: 'Query';
  canvasVersions?: Maybe<Array<CanvasVersion>>;
  connectionStatus?: Maybe<ConnectionStatus>;
  evolutionSessions?: Maybe<Array<EvolutionSession>>;
  knowledgeSources?: Maybe<Array<KnowledgeSourceRecord>>;
  lifecycleAssessments?: Maybe<Array<LifecycleAssessmentRecord>>;
  lifecycleProfile?: Maybe<OrganizationLifecycleProfile>;
  lifecycleRecommendations?: Maybe<LifecycleRecommendation>;
  me?: Maybe<User>;
  myActiveOrganization?: Maybe<Organization>;
  myLearningEvents?: Maybe<Array<StudioLearningEvent>>;
  myOnboardingProgress?: Maybe<OnboardingProgress>;
  myOnboardingTracks?: Maybe<MyOnboardingTracks>;
  myOrganizations?: Maybe<Array<Organization>>;
  myStudioProjects?: Maybe<Array<StudioProject>>;
  myTeams?: Maybe<Array<Team>>;
  organizationInvitations?: Maybe<Array<OrganizationInvitation>>;
  organizationMembers?: Maybe<Array<OrganizationMember>>;
  platformAdminIntegrationConnections?: Maybe<Array<IntegrationConnection>>;
  platformAdminIntegrationSpecs?: Maybe<Array<PlatformIntegrationSpec>>;
  platformAdminOrganizations?: Maybe<Array<Organization>>;
  projectSpecs?: Maybe<Array<StudioSpec>>;
  projectTeams?: Maybe<Array<Team>>;
  queryKnowledge?: Maybe<KnowledgeAnswer>;
  registryTemplate?: Maybe<RegistryTemplate>;
  registryTemplates?: Maybe<Array<RegistryTemplate>>;
  studioCanvas?: Maybe<Scalars['JSON']['output']>;
  studioIntegrations?: Maybe<Array<StudioIntegration>>;
  studioProject?: Maybe<StudioProject>;
  studioProjectBySlug?: Maybe<StudioProjectSlugResolution>;
  studioSpec?: Maybe<StudioSpec>;
};

export type QueryCanvasVersionsArgs = {
  canvasId: Scalars['String']['input'];
};

export type QueryEvolutionSessionsArgs = {
  projectId: Scalars['String']['input'];
};

export type QueryKnowledgeSourcesArgs = {
  projectId: Scalars['String']['input'];
};

export type QueryLifecycleAssessmentsArgs = {
  limit: Scalars['Int']['input'];
};

export type QueryMyLearningEventsArgs = {
  limit: Scalars['Int']['input'];
  projectId: Scalars['String']['input'];
};

export type QueryMyOnboardingProgressArgs = {
  trackKey: Scalars['String']['input'];
};

export type QueryMyOnboardingTracksArgs = {
  includeProgress?: InputMaybe<Scalars['Boolean']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPlatformAdminIntegrationConnectionsArgs = {
  input: PlatformIntegrationConnectionListInput;
};

export type QueryPlatformAdminOrganizationsArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  search: Scalars['String']['input'];
};

export type QueryProjectSpecsArgs = {
  projectId: Scalars['String']['input'];
};

export type QueryProjectTeamsArgs = {
  projectId: Scalars['String']['input'];
};

export type QueryQueryKnowledgeArgs = {
  input: QueryKnowledgeInput;
};

export type QueryRegistryTemplateArgs = {
  id: Scalars['String']['input'];
};

export type QueryStudioCanvasArgs = {
  projectId: Scalars['String']['input'];
};

export type QueryStudioIntegrationsArgs = {
  projectId: Scalars['String']['input'];
};

export type QueryStudioProjectArgs = {
  id: Scalars['String']['input'];
};

export type QueryStudioProjectBySlugArgs = {
  slug: Scalars['String']['input'];
};

export type QueryStudioSpecArgs = {
  id: Scalars['String']['input'];
};

export type QueryKnowledgeInput = {
  collection: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  query: Scalars['String']['input'];
  systemPrompt: Scalars['String']['input'];
  topK: Scalars['Int']['input'];
};

export type RecordLearningEventInput = {
  name: Scalars['String']['input'];
  payload: Scalars['JSON']['input'];
  projectId?: InputMaybe<Scalars['String']['input']>;
};

export type RegistryTemplate = {
  __typename?: 'RegistryTemplate';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  registryUrl?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type SaveCanvasDraftInput = {
  canvasId: Scalars['String']['input'];
  label: Scalars['String']['input'];
  nodes: Scalars['JSON']['input'];
};

export type SaveTemplateInput = {
  description: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  payload: Scalars['String']['input'];
  projectName: Scalars['String']['input'];
  templateId: Scalars['String']['input'];
};

export type SaveTemplateResult = {
  __typename?: 'SaveTemplateResult';
  projectId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export enum SpecTypeEnum {
  Capability = 'CAPABILITY',
  Component = 'COMPONENT',
  Dataview = 'DATAVIEW',
  Policy = 'POLICY',
  Workflow = 'WORKFLOW',
}

export type StartEvolutionSessionInput = {
  context: Scalars['JSON']['input'];
  projectId: Scalars['String']['input'];
  signals: Scalars['JSON']['input'];
  suggestions: Scalars['JSON']['input'];
  trigger: EvolutionTriggerEnum;
};

export type StudioDeployment = {
  __typename?: 'StudioDeployment';
  createdAt?: Maybe<Scalars['Date']['output']>;
  deployedAt?: Maybe<Scalars['Date']['output']>;
  environment?: Maybe<EnvironmentEnum>;
  id?: Maybe<Scalars['ID']['output']>;
  infrastructureId?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<DeploymentStatusEnum>;
  url?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type StudioIntegration = {
  __typename?: 'StudioIntegration';
  config?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastUsed?: Maybe<Scalars['Date']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<IntegrationProviderEnum>;
  usageCount?: Maybe<Scalars['Int']['output']>;
};

export type StudioLearningEvent = {
  __typename?: 'StudioLearningEvent';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['JSON']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
};

export type StudioProject = {
  __typename?: 'StudioProject';
  byokEnabled?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  deploymentMode?: Maybe<DeploymentModeEnum>;
  deployments?: Maybe<Array<StudioDeployment>>;
  description?: Maybe<Scalars['String']['output']>;
  evolutionEnabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  specs?: Maybe<Array<StudioSpec>>;
  tier?: Maybe<ProjectTierEnum>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type StudioProjectSlugResolution = {
  __typename?: 'StudioProjectSlugResolution';
  canonicalSlug?: Maybe<Scalars['String']['output']>;
  project?: Maybe<StudioProject>;
  wasRedirect?: Maybe<Scalars['Boolean']['output']>;
};

export type StudioSpec = {
  __typename?: 'StudioSpec';
  content?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<SpecTypeEnum>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type Team = {
  __typename?: 'Team';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type UndoCanvasInput = {
  canvasId: Scalars['String']['input'];
};

export type UpdateEvolutionSessionInput = {
  appliedChanges: Scalars['JSON']['input'];
  completedAt: Scalars['Date']['input'];
  status: EvolutionStatusEnum;
};

export type UpdateProfileInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  byokEnabled: Scalars['Boolean']['input'];
  deploymentMode: DeploymentModeEnum;
  description: Scalars['String']['input'];
  evolutionEnabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  tier: ProjectTierEnum;
};

export type UpdateSpecInput = {
  content: Scalars['JSON']['input'];
  metadata: Scalars['JSON']['input'];
  name: Scalars['String']['input'];
  version: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  onboardingCompleted?: Maybe<Scalars['Boolean']['output']>;
  onboardingStep?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type PlatformAdminOrganizationsQueryVariables = Exact<{
  search: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;

export type PlatformAdminOrganizationsQuery = {
  __typename?: 'Query';
  platformAdminOrganizations?: Array<{
    __typename?: 'Organization';
    id: string;
    name: string;
    slug?: string | null;
    type?: OrganizationType | null;
    createdAt?: any | null;
  }> | null;
};

export type PlatformAdminIntegrationSpecsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type PlatformAdminIntegrationSpecsQuery = {
  __typename?: 'Query';
  platformAdminIntegrationSpecs?: Array<{
    __typename?: 'PlatformIntegrationSpec';
    key?: string | null;
    version?: number | null;
    category?: string | null;
    title?: string | null;
    description?: string | null;
    supportedModes?: Array<string> | null;
    docsUrl?: string | null;
    configSchema?: any | null;
    secretSchema?: any | null;
    byokSetup?: any | null;
  }> | null;
};

export type PlatformAdminIntegrationConnectionsQueryVariables = Exact<{
  input: PlatformIntegrationConnectionListInput;
}>;

export type PlatformAdminIntegrationConnectionsQuery = {
  __typename?: 'Query';
  platformAdminIntegrationConnections?: Array<{
    __typename?: 'IntegrationConnection';
    id: string;
    organizationId?: string | null;
    integrationKey?: string | null;
    integrationVersion?: number | null;
    label?: string | null;
    environment?: string | null;
    ownershipMode?: IntegrationOwnershipModeEnum | null;
    externalAccountId?: string | null;
    secretProvider?: string | null;
    secretRef?: string | null;
    config?: any | null;
    status?: IntegrationConnectionStatusEnum | null;
    createdAt?: any | null;
    updatedAt?: any | null;
  }> | null;
};

export type PlatformAdminIntegrationConnectionCreateMutationVariables = Exact<{
  input: PlatformIntegrationConnectionCreateInput;
}>;

export type PlatformAdminIntegrationConnectionCreateMutation = {
  __typename?: 'Mutation';
  platformAdminIntegrationConnectionCreate?: {
    __typename?: 'IntegrationConnection';
    id: string;
    organizationId?: string | null;
    integrationKey?: string | null;
    integrationVersion?: number | null;
    label?: string | null;
    environment?: string | null;
    ownershipMode?: IntegrationOwnershipModeEnum | null;
    externalAccountId?: string | null;
    secretProvider?: string | null;
    secretRef?: string | null;
    config?: any | null;
    status?: IntegrationConnectionStatusEnum | null;
    createdAt?: any | null;
    updatedAt?: any | null;
  } | null;
};

export type PlatformAdminIntegrationConnectionUpdateMutationVariables = Exact<{
  input: PlatformIntegrationConnectionUpdateInput;
}>;

export type PlatformAdminIntegrationConnectionUpdateMutation = {
  __typename?: 'Mutation';
  platformAdminIntegrationConnectionUpdate?: {
    __typename?: 'IntegrationConnection';
    id: string;
    organizationId?: string | null;
    integrationKey?: string | null;
    integrationVersion?: number | null;
    label?: string | null;
    environment?: string | null;
    ownershipMode?: IntegrationOwnershipModeEnum | null;
    externalAccountId?: string | null;
    secretProvider?: string | null;
    secretRef?: string | null;
    config?: any | null;
    status?: IntegrationConnectionStatusEnum | null;
    createdAt?: any | null;
    updatedAt?: any | null;
  } | null;
};

export type PlatformAdminIntegrationConnectionDeleteMutationVariables = Exact<{
  targetOrganizationId: Scalars['String']['input'];
  connectionId: Scalars['String']['input'];
}>;

export type PlatformAdminIntegrationConnectionDeleteMutation = {
  __typename?: 'Mutation';
  platformAdminIntegrationConnectionDelete?: boolean | null;
};

export type SaveCanvasDraftMutationVariables = Exact<{
  input: SaveCanvasDraftInput;
}>;

export type SaveCanvasDraftMutation = {
  __typename?: 'Mutation';
  saveCanvasDraft?: {
    __typename?: 'CanvasVersion';
    id?: string | null;
    label?: string | null;
    status?: CanvasVersionStatusEnum | null;
    nodes?: any | null;
    createdAt?: any | null;
    createdBy?: string | null;
  } | null;
};

export type DeployCanvasVersionMutationVariables = Exact<{
  input: DeployCanvasVersionInput;
}>;

export type DeployCanvasVersionMutation = {
  __typename?: 'Mutation';
  deployCanvasVersion?: {
    __typename?: 'CanvasVersion';
    id?: string | null;
    label?: string | null;
    status?: CanvasVersionStatusEnum | null;
    nodes?: any | null;
    createdAt?: any | null;
    createdBy?: string | null;
  } | null;
};

export type UndoCanvasVersionMutationVariables = Exact<{
  input: UndoCanvasInput;
}>;

export type UndoCanvasVersionMutation = {
  __typename?: 'Mutation';
  undoCanvasVersion?: {
    __typename?: 'CanvasVersion';
    id?: string | null;
    label?: string | null;
    status?: CanvasVersionStatusEnum | null;
    nodes?: any | null;
    createdAt?: any | null;
    createdBy?: string | null;
  } | null;
};

export type CreateStudioProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;

export type CreateStudioProjectMutation = {
  __typename?: 'Mutation';
  createStudioProject?: {
    __typename?: 'StudioProject';
    id?: string | null;
    slug?: string | null;
    name?: string | null;
    tier?: ProjectTierEnum | null;
    deploymentMode?: DeploymentModeEnum | null;
  } | null;
};

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;

export type CreateTeamMutation = {
  __typename?: 'Mutation';
  createTeam?: {
    __typename?: 'Team';
    id?: string | null;
    name?: string | null;
    organizationId?: string | null;
  } | null;
};

export type DeleteStudioProjectMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteStudioProjectMutation = {
  __typename?: 'Mutation';
  deleteStudioProject?: {
    __typename?: 'StudioProject';
    id?: string | null;
    slug?: string | null;
    name?: string | null;
  } | null;
};

export type DeleteTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
}>;

export type DeleteTeamMutation = {
  __typename?: 'Mutation';
  deleteTeam?: boolean | null;
};

export type DeployStudioProjectMutationVariables = Exact<{
  input: DeployProjectInput;
}>;

export type DeployStudioProjectMutation = {
  __typename?: 'Mutation';
  deployStudioProject?: {
    __typename?: 'StudioDeployment';
    id?: string | null;
    environment?: EnvironmentEnum | null;
    status?: DeploymentStatusEnum | null;
    url?: string | null;
  } | null;
};

export type DismissOnboardingTrackMutationVariables = Exact<{
  trackKey: Scalars['String']['input'];
}>;

export type DismissOnboardingTrackMutation = {
  __typename?: 'Mutation';
  dismissOnboardingTrack?: {
    __typename?: 'OnboardingProgress';
    id?: string | null;
    trackKey?: string | null;
    isDismissed?: boolean | null;
    dismissedAt?: any | null;
  } | null;
};

export type StartEvolutionSessionMutationVariables = Exact<{
  input: StartEvolutionSessionInput;
}>;

export type StartEvolutionSessionMutation = {
  __typename?: 'Mutation';
  startEvolutionSession?: {
    __typename?: 'EvolutionSession';
    id?: string | null;
  } | null;
};

export type UpdateEvolutionSessionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateEvolutionSessionInput;
}>;

export type UpdateEvolutionSessionMutation = {
  __typename?: 'Mutation';
  updateEvolutionSession?: {
    __typename?: 'EvolutionSession';
    id?: string | null;
  } | null;
};

export type ConnectIntegrationMutationVariables = Exact<{
  input: ConnectIntegrationInput;
}>;

export type ConnectIntegrationMutation = {
  __typename?: 'Mutation';
  connectIntegration?: {
    __typename?: 'StudioIntegration';
    id?: string | null;
  } | null;
};

export type DisconnectIntegrationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DisconnectIntegrationMutation = {
  __typename?: 'Mutation';
  disconnectIntegration?: boolean | null;
};

export type InviteToOrganizationMutationVariables = Exact<{
  email: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  teamId?: InputMaybe<Scalars['String']['input']>;
}>;

export type InviteToOrganizationMutation = {
  __typename?: 'Mutation';
  inviteToOrganization?: {
    __typename?: 'InviteResult';
    invitationId?: string | null;
    inviteUrl?: string | null;
    emailSent?: boolean | null;
  } | null;
};

export type RecordLearningEventMutationVariables = Exact<{
  input: RecordLearningEventInput;
}>;

export type RecordLearningEventMutation = {
  __typename?: 'Mutation';
  recordLearningEvent?: {
    __typename?: 'StudioLearningEvent';
    id?: string | null;
  } | null;
};

export type RenameTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;

export type RenameTeamMutation = {
  __typename?: 'Mutation';
  renameTeam?: {
    __typename?: 'Team';
    id?: string | null;
    name?: string | null;
    organizationId?: string | null;
  } | null;
};

export type CreateStudioSpecMutationVariables = Exact<{
  input: CreateSpecInput;
}>;

export type CreateStudioSpecMutation = {
  __typename?: 'Mutation';
  createStudioSpec?: {
    __typename?: 'StudioSpec';
    id?: string | null;
    projectId?: string | null;
    type?: SpecTypeEnum | null;
    name?: string | null;
    version?: string | null;
    content?: any | null;
    metadata?: any | null;
    updatedAt?: any | null;
  } | null;
};

export type UpdateStudioSpecMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateSpecInput;
}>;

export type UpdateStudioSpecMutation = {
  __typename?: 'Mutation';
  updateStudioSpec?: {
    __typename?: 'StudioSpec';
    id?: string | null;
    projectId?: string | null;
    type?: SpecTypeEnum | null;
    name?: string | null;
    version?: string | null;
    content?: any | null;
    metadata?: any | null;
    updatedAt?: any | null;
  } | null;
};

export type UpdateStudioProjectMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateProjectInput;
}>;

export type UpdateStudioProjectMutation = {
  __typename?: 'Mutation';
  updateStudioProject?: {
    __typename?: 'StudioProject';
    id?: string | null;
    slug?: string | null;
    name?: string | null;
    description?: string | null;
    updatedAt?: any | null;
  } | null;
};

export type CanvasVersionsQueryVariables = Exact<{
  canvasId: Scalars['String']['input'];
}>;

export type CanvasVersionsQuery = {
  __typename?: 'Query';
  canvasVersions?: Array<{
    __typename?: 'CanvasVersion';
    id?: string | null;
    label?: string | null;
    status?: CanvasVersionStatusEnum | null;
    nodes?: any | null;
    createdAt?: any | null;
    createdBy?: string | null;
  }> | null;
};

export type EvolutionSessionsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;

export type EvolutionSessionsQuery = {
  __typename?: 'Query';
  evolutionSessions?: Array<{
    __typename?: 'EvolutionSession';
    id?: string | null;
    projectId?: string | null;
    trigger?: EvolutionTriggerEnum | null;
    status?: EvolutionStatusEnum | null;
    signals?: any | null;
    context?: any | null;
    suggestions?: any | null;
    appliedChanges?: any | null;
    startedAt?: any | null;
    completedAt?: any | null;
  }> | null;
};

export type LifecycleProfileQueryVariables = Exact<{ [key: string]: never }>;

export type LifecycleProfileQuery = {
  __typename?: 'Query';
  lifecycleProfile?: {
    __typename?: 'OrganizationLifecycleProfile';
    id?: string | null;
    organizationId?: string | null;
    currentStage?: LifecycleStageEnum | null;
    detectedStage?: LifecycleStageEnum | null;
    confidence?: number | null;
    productPhase?: string | null;
    companyPhase?: string | null;
    capitalPhase?: string | null;
    metrics?: any | null;
    signals?: any | null;
    lastAssessment?: any | null;
    nextAssessment?: any | null;
  } | null;
};

export type MyLearningEventsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
}>;

export type MyLearningEventsQuery = {
  __typename?: 'Query';
  myLearningEvents?: Array<{
    __typename?: 'StudioLearningEvent';
    id?: string | null;
    organizationId?: string | null;
    projectId?: string | null;
    name?: string | null;
    payload?: any | null;
    createdAt?: any | null;
  }> | null;
};

export type MyOnboardingProgressQueryVariables = Exact<{
  trackKey: Scalars['String']['input'];
}>;

export type MyOnboardingProgressQuery = {
  __typename?: 'Query';
  myOnboardingProgress?: {
    __typename?: 'OnboardingProgress';
    id?: string | null;
    learnerId?: string | null;
    trackId?: string | null;
    trackKey?: string | null;
    progress?: number | null;
    isCompleted?: boolean | null;
    xpEarned?: number | null;
    startedAt?: any | null;
    completedAt?: any | null;
    lastActivityAt?: any | null;
    isDismissed?: boolean | null;
    dismissedAt?: any | null;
    metadata?: any | null;
    stepCompletions?: Array<{
      __typename?: 'OnboardingStepCompletion';
      id?: string | null;
      progressId?: string | null;
      stepId?: string | null;
      stepKey?: string | null;
      status?: string | null;
      xpEarned?: number | null;
      completedAt?: any | null;
    }> | null;
  } | null;
};

export type MyOnboardingTracksQueryVariables = Exact<{
  productId?: InputMaybe<Scalars['String']['input']>;
  includeProgress: Scalars['Boolean']['input'];
}>;

export type MyOnboardingTracksQuery = {
  __typename?: 'Query';
  myOnboardingTracks?: {
    __typename?: 'MyOnboardingTracks';
    tracks?: Array<{
      __typename?: 'OnboardingTrack';
      id?: string | null;
      trackKey?: string | null;
      productId?: string | null;
      name?: string | null;
      description?: string | null;
      targetUserSegment?: string | null;
      targetRole?: string | null;
      isActive?: boolean | null;
      isRequired?: boolean | null;
      canSkip?: boolean | null;
      totalXp?: number | null;
      completionXpBonus?: number | null;
      completionBadgeKey?: string | null;
      streakHoursWindow?: number | null;
      streakBonusXp?: number | null;
      metadata?: any | null;
      steps?: Array<{
        __typename?: 'OnboardingStep';
        id?: string | null;
        trackId?: string | null;
        stepKey?: string | null;
        title?: string | null;
        description?: string | null;
        instructions?: string | null;
        helpUrl?: string | null;
        order?: number | null;
        completionEvent?: string | null;
        completionCondition?: any | null;
        availability?: any | null;
        xpReward?: number | null;
        isRequired?: boolean | null;
        canSkip?: boolean | null;
        actionUrl?: string | null;
        actionLabel?: string | null;
        highlightSelector?: string | null;
        tooltipPosition?: string | null;
        metadata?: any | null;
      }> | null;
    }> | null;
    progress?: Array<{
      __typename?: 'OnboardingProgress';
      id?: string | null;
      learnerId?: string | null;
      trackId?: string | null;
      trackKey?: string | null;
      progress?: number | null;
      isCompleted?: boolean | null;
      xpEarned?: number | null;
      startedAt?: any | null;
      completedAt?: any | null;
      lastActivityAt?: any | null;
      isDismissed?: boolean | null;
      dismissedAt?: any | null;
      metadata?: any | null;
      stepCompletions?: Array<{
        __typename?: 'OnboardingStepCompletion';
        id?: string | null;
        progressId?: string | null;
        stepId?: string | null;
        stepKey?: string | null;
        status?: string | null;
        xpEarned?: number | null;
        completedAt?: any | null;
      }> | null;
    }> | null;
  } | null;
};

export type MyTeamsQueryVariables = Exact<{ [key: string]: never }>;

export type MyTeamsQuery = {
  __typename?: 'Query';
  myTeams?: Array<{
    __typename?: 'Team';
    id?: string | null;
    name?: string | null;
    organizationId?: string | null;
  }> | null;
};

export type OrganizationInvitationsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type OrganizationInvitationsQuery = {
  __typename?: 'Query';
  organizationInvitations?: Array<{
    __typename?: 'OrganizationInvitation';
    id?: string | null;
    organizationId?: string | null;
    email?: string | null;
    role?: string | null;
    status?: string | null;
    teamId?: string | null;
    inviterId?: string | null;
    createdAt?: any | null;
    acceptedAt?: any | null;
    expiresAt?: any | null;
  }> | null;
};

export type ProjectSpecsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;

export type ProjectSpecsQuery = {
  __typename?: 'Query';
  projectSpecs?: Array<{
    __typename?: 'StudioSpec';
    id?: string | null;
    projectId?: string | null;
    type?: SpecTypeEnum | null;
    name?: string | null;
    version?: string | null;
    content?: any | null;
    metadata?: any | null;
    updatedAt?: any | null;
  }> | null;
};

export type StudioCanvasQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;

export type StudioCanvasQuery = {
  __typename?: 'Query';
  studioCanvas?: any | null;
};

export type StudioIntegrationsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;

export type StudioIntegrationsQuery = {
  __typename?: 'Query';
  studioIntegrations?: Array<{
    __typename?: 'StudioIntegration';
    id?: string | null;
    organizationId?: string | null;
    projectId?: string | null;
    provider?: IntegrationProviderEnum | null;
    name?: string | null;
    enabled?: boolean | null;
    usageCount?: number | null;
    lastUsed?: any | null;
    config?: any | null;
    createdAt?: any | null;
  }> | null;
};

export type StudioProjectBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;

export type StudioProjectBySlugQuery = {
  __typename?: 'Query';
  studioProjectBySlug?: {
    __typename?: 'StudioProjectSlugResolution';
    canonicalSlug?: string | null;
    wasRedirect?: boolean | null;
    project?: {
      __typename?: 'StudioProject';
      id?: string | null;
      slug?: string | null;
      name?: string | null;
      description?: string | null;
      tier?: ProjectTierEnum | null;
      deploymentMode?: DeploymentModeEnum | null;
      byokEnabled?: boolean | null;
      evolutionEnabled?: boolean | null;
      createdAt?: any | null;
      updatedAt?: any | null;
      deployments?: Array<{
        __typename?: 'StudioDeployment';
        id?: string | null;
        environment?: EnvironmentEnum | null;
        status?: DeploymentStatusEnum | null;
        version?: string | null;
        url?: string | null;
        createdAt?: any | null;
        deployedAt?: any | null;
      }> | null;
    } | null;
  } | null;
};

export type StudioProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type StudioProjectsQuery = {
  __typename?: 'Query';
  myStudioProjects?: Array<{
    __typename?: 'StudioProject';
    id?: string | null;
    slug?: string | null;
    name?: string | null;
    description?: string | null;
    tier?: ProjectTierEnum | null;
    deploymentMode?: DeploymentModeEnum | null;
    byokEnabled?: boolean | null;
    evolutionEnabled?: boolean | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    specs?: Array<{
      __typename?: 'StudioSpec';
      id?: string | null;
      type?: SpecTypeEnum | null;
      version?: string | null;
    }> | null;
    deployments?: Array<{
      __typename?: 'StudioDeployment';
      id?: string | null;
      environment?: EnvironmentEnum | null;
      status?: DeploymentStatusEnum | null;
      deployedAt?: any | null;
    }> | null;
  }> | null;
};

export type Hooks_MyActiveOrgQueryVariables = Exact<{ [key: string]: never }>;

export type Hooks_MyActiveOrgQuery = {
  __typename?: 'Query';
  myActiveOrganization?: {
    __typename?: 'Organization';
    id: string;
    name: string;
    slug?: string | null;
    type?: OrganizationType | null;
  } | null;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<
    DocumentTypeDecoration<TResult, TVariables>['__apiType']
  >;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const PlatformAdminOrganizationsDocument = new TypedDocumentString(`
    query PlatformAdminOrganizations($search: String!, $limit: Int!, $offset: Int!) {
  platformAdminOrganizations(search: $search, limit: $limit, offset: $offset) {
    id
    name
    slug
    type
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
  PlatformAdminOrganizationsQuery,
  PlatformAdminOrganizationsQueryVariables
>;
export const PlatformAdminIntegrationSpecsDocument = new TypedDocumentString(`
    query PlatformAdminIntegrationSpecs {
  platformAdminIntegrationSpecs {
    key
    version
    category
    title
    description
    supportedModes
    docsUrl
    configSchema
    secretSchema
    byokSetup
  }
}
    `) as unknown as TypedDocumentString<
  PlatformAdminIntegrationSpecsQuery,
  PlatformAdminIntegrationSpecsQueryVariables
>;
export const PlatformAdminIntegrationConnectionsDocument =
  new TypedDocumentString(`
    query PlatformAdminIntegrationConnections($input: PlatformIntegrationConnectionListInput!) {
  platformAdminIntegrationConnections(input: $input) {
    id
    organizationId
    integrationKey
    integrationVersion
    label
    environment
    ownershipMode
    externalAccountId
    secretProvider
    secretRef
    config
    status
    createdAt
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
    PlatformAdminIntegrationConnectionsQuery,
    PlatformAdminIntegrationConnectionsQueryVariables
  >;
export const PlatformAdminIntegrationConnectionCreateDocument =
  new TypedDocumentString(`
    mutation PlatformAdminIntegrationConnectionCreate($input: PlatformIntegrationConnectionCreateInput!) {
  platformAdminIntegrationConnectionCreate(input: $input) {
    id
    organizationId
    integrationKey
    integrationVersion
    label
    environment
    ownershipMode
    externalAccountId
    secretProvider
    secretRef
    config
    status
    createdAt
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
    PlatformAdminIntegrationConnectionCreateMutation,
    PlatformAdminIntegrationConnectionCreateMutationVariables
  >;
export const PlatformAdminIntegrationConnectionUpdateDocument =
  new TypedDocumentString(`
    mutation PlatformAdminIntegrationConnectionUpdate($input: PlatformIntegrationConnectionUpdateInput!) {
  platformAdminIntegrationConnectionUpdate(input: $input) {
    id
    organizationId
    integrationKey
    integrationVersion
    label
    environment
    ownershipMode
    externalAccountId
    secretProvider
    secretRef
    config
    status
    createdAt
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
    PlatformAdminIntegrationConnectionUpdateMutation,
    PlatformAdminIntegrationConnectionUpdateMutationVariables
  >;
export const PlatformAdminIntegrationConnectionDeleteDocument =
  new TypedDocumentString(`
    mutation PlatformAdminIntegrationConnectionDelete($targetOrganizationId: String!, $connectionId: String!) {
  platformAdminIntegrationConnectionDelete(
    targetOrganizationId: $targetOrganizationId
    connectionId: $connectionId
  )
}
    `) as unknown as TypedDocumentString<
    PlatformAdminIntegrationConnectionDeleteMutation,
    PlatformAdminIntegrationConnectionDeleteMutationVariables
  >;
export const SaveCanvasDraftDocument = new TypedDocumentString(`
    mutation SaveCanvasDraft($input: SaveCanvasDraftInput!) {
  saveCanvasDraft(input: $input) {
    id
    label
    status
    nodes
    createdAt
    createdBy
  }
}
    `) as unknown as TypedDocumentString<
  SaveCanvasDraftMutation,
  SaveCanvasDraftMutationVariables
>;
export const DeployCanvasVersionDocument = new TypedDocumentString(`
    mutation DeployCanvasVersion($input: DeployCanvasVersionInput!) {
  deployCanvasVersion(input: $input) {
    id
    label
    status
    nodes
    createdAt
    createdBy
  }
}
    `) as unknown as TypedDocumentString<
  DeployCanvasVersionMutation,
  DeployCanvasVersionMutationVariables
>;
export const UndoCanvasVersionDocument = new TypedDocumentString(`
    mutation UndoCanvasVersion($input: UndoCanvasInput!) {
  undoCanvasVersion(input: $input) {
    id
    label
    status
    nodes
    createdAt
    createdBy
  }
}
    `) as unknown as TypedDocumentString<
  UndoCanvasVersionMutation,
  UndoCanvasVersionMutationVariables
>;
export const CreateStudioProjectDocument = new TypedDocumentString(`
    mutation CreateStudioProject($input: CreateProjectInput!) {
  createStudioProject(input: $input) {
    id
    slug
    name
    tier
    deploymentMode
  }
}
    `) as unknown as TypedDocumentString<
  CreateStudioProjectMutation,
  CreateStudioProjectMutationVariables
>;
export const CreateTeamDocument = new TypedDocumentString(`
    mutation CreateTeam($name: String!) {
  createTeam(name: $name) {
    id
    name
    organizationId
  }
}
    `) as unknown as TypedDocumentString<
  CreateTeamMutation,
  CreateTeamMutationVariables
>;
export const DeleteStudioProjectDocument = new TypedDocumentString(`
    mutation DeleteStudioProject($id: String!) {
  deleteStudioProject(id: $id) {
    id
    slug
    name
  }
}
    `) as unknown as TypedDocumentString<
  DeleteStudioProjectMutation,
  DeleteStudioProjectMutationVariables
>;
export const DeleteTeamDocument = new TypedDocumentString(`
    mutation DeleteTeam($teamId: String!) {
  deleteTeam(teamId: $teamId)
}
    `) as unknown as TypedDocumentString<
  DeleteTeamMutation,
  DeleteTeamMutationVariables
>;
export const DeployStudioProjectDocument = new TypedDocumentString(`
    mutation DeployStudioProject($input: DeployProjectInput!) {
  deployStudioProject(input: $input) {
    id
    environment
    status
    url
  }
}
    `) as unknown as TypedDocumentString<
  DeployStudioProjectMutation,
  DeployStudioProjectMutationVariables
>;
export const DismissOnboardingTrackDocument = new TypedDocumentString(`
    mutation DismissOnboardingTrack($trackKey: String!) {
  dismissOnboardingTrack(trackKey: $trackKey) {
    id
    trackKey
    isDismissed
    dismissedAt
  }
}
    `) as unknown as TypedDocumentString<
  DismissOnboardingTrackMutation,
  DismissOnboardingTrackMutationVariables
>;
export const StartEvolutionSessionDocument = new TypedDocumentString(`
    mutation StartEvolutionSession($input: StartEvolutionSessionInput!) {
  startEvolutionSession(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  StartEvolutionSessionMutation,
  StartEvolutionSessionMutationVariables
>;
export const UpdateEvolutionSessionDocument = new TypedDocumentString(`
    mutation UpdateEvolutionSession($id: String!, $input: UpdateEvolutionSessionInput!) {
  updateEvolutionSession(id: $id, input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  UpdateEvolutionSessionMutation,
  UpdateEvolutionSessionMutationVariables
>;
export const ConnectIntegrationDocument = new TypedDocumentString(`
    mutation ConnectIntegration($input: ConnectIntegrationInput!) {
  connectIntegration(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  ConnectIntegrationMutation,
  ConnectIntegrationMutationVariables
>;
export const DisconnectIntegrationDocument = new TypedDocumentString(`
    mutation DisconnectIntegration($id: String!) {
  disconnectIntegration(id: $id)
}
    `) as unknown as TypedDocumentString<
  DisconnectIntegrationMutation,
  DisconnectIntegrationMutationVariables
>;
export const InviteToOrganizationDocument = new TypedDocumentString(`
    mutation InviteToOrganization($email: String!, $role: String, $teamId: String) {
  inviteToOrganization(email: $email, role: $role, teamId: $teamId) {
    invitationId
    inviteUrl
    emailSent
  }
}
    `) as unknown as TypedDocumentString<
  InviteToOrganizationMutation,
  InviteToOrganizationMutationVariables
>;
export const RecordLearningEventDocument = new TypedDocumentString(`
    mutation RecordLearningEvent($input: RecordLearningEventInput!) {
  recordLearningEvent(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  RecordLearningEventMutation,
  RecordLearningEventMutationVariables
>;
export const RenameTeamDocument = new TypedDocumentString(`
    mutation RenameTeam($teamId: String!, $name: String!) {
  renameTeam(teamId: $teamId, name: $name) {
    id
    name
    organizationId
  }
}
    `) as unknown as TypedDocumentString<
  RenameTeamMutation,
  RenameTeamMutationVariables
>;
export const CreateStudioSpecDocument = new TypedDocumentString(`
    mutation CreateStudioSpec($input: CreateSpecInput!) {
  createStudioSpec(input: $input) {
    id
    projectId
    type
    name
    version
    content
    metadata
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
  CreateStudioSpecMutation,
  CreateStudioSpecMutationVariables
>;
export const UpdateStudioSpecDocument = new TypedDocumentString(`
    mutation UpdateStudioSpec($id: String!, $input: UpdateSpecInput!) {
  updateStudioSpec(id: $id, input: $input) {
    id
    projectId
    type
    name
    version
    content
    metadata
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
  UpdateStudioSpecMutation,
  UpdateStudioSpecMutationVariables
>;
export const UpdateStudioProjectDocument = new TypedDocumentString(`
    mutation UpdateStudioProject($id: String!, $input: UpdateProjectInput!) {
  updateStudioProject(id: $id, input: $input) {
    id
    slug
    name
    description
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
  UpdateStudioProjectMutation,
  UpdateStudioProjectMutationVariables
>;
export const CanvasVersionsDocument = new TypedDocumentString(`
    query CanvasVersions($canvasId: String!) {
  canvasVersions(canvasId: $canvasId) {
    id
    label
    status
    nodes
    createdAt
    createdBy
  }
}
    `) as unknown as TypedDocumentString<
  CanvasVersionsQuery,
  CanvasVersionsQueryVariables
>;
export const EvolutionSessionsDocument = new TypedDocumentString(`
    query EvolutionSessions($projectId: String!) {
  evolutionSessions(projectId: $projectId) {
    id
    projectId
    trigger
    status
    signals
    context
    suggestions
    appliedChanges
    startedAt
    completedAt
  }
}
    `) as unknown as TypedDocumentString<
  EvolutionSessionsQuery,
  EvolutionSessionsQueryVariables
>;
export const LifecycleProfileDocument = new TypedDocumentString(`
    query LifecycleProfile {
  lifecycleProfile {
    id
    organizationId
    currentStage
    detectedStage
    confidence
    productPhase
    companyPhase
    capitalPhase
    metrics
    signals
    lastAssessment
    nextAssessment
  }
}
    `) as unknown as TypedDocumentString<
  LifecycleProfileQuery,
  LifecycleProfileQueryVariables
>;
export const MyLearningEventsDocument = new TypedDocumentString(`
    query MyLearningEvents($projectId: String!, $limit: Int!) {
  myLearningEvents(projectId: $projectId, limit: $limit) {
    id
    organizationId
    projectId
    name
    payload
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
  MyLearningEventsQuery,
  MyLearningEventsQueryVariables
>;
export const MyOnboardingProgressDocument = new TypedDocumentString(`
    query MyOnboardingProgress($trackKey: String!) {
  myOnboardingProgress(trackKey: $trackKey) {
    id
    learnerId
    trackId
    trackKey
    progress
    isCompleted
    xpEarned
    startedAt
    completedAt
    lastActivityAt
    isDismissed
    dismissedAt
    metadata
    stepCompletions {
      id
      progressId
      stepId
      stepKey
      status
      xpEarned
      completedAt
    }
  }
}
    `) as unknown as TypedDocumentString<
  MyOnboardingProgressQuery,
  MyOnboardingProgressQueryVariables
>;
export const MyOnboardingTracksDocument = new TypedDocumentString(`
    query MyOnboardingTracks($productId: String, $includeProgress: Boolean!) {
  myOnboardingTracks(productId: $productId, includeProgress: $includeProgress) {
    tracks {
      id
      trackKey
      productId
      name
      description
      targetUserSegment
      targetRole
      isActive
      isRequired
      canSkip
      totalXp
      completionXpBonus
      completionBadgeKey
      streakHoursWindow
      streakBonusXp
      metadata
      steps {
        id
        trackId
        stepKey
        title
        description
        instructions
        helpUrl
        order
        completionEvent
        completionCondition
        availability
        xpReward
        isRequired
        canSkip
        actionUrl
        actionLabel
        highlightSelector
        tooltipPosition
        metadata
      }
    }
    progress {
      id
      learnerId
      trackId
      trackKey
      progress
      isCompleted
      xpEarned
      startedAt
      completedAt
      lastActivityAt
      isDismissed
      dismissedAt
      metadata
      stepCompletions {
        id
        progressId
        stepId
        stepKey
        status
        xpEarned
        completedAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  MyOnboardingTracksQuery,
  MyOnboardingTracksQueryVariables
>;
export const MyTeamsDocument = new TypedDocumentString(`
    query MyTeams {
  myTeams {
    id
    name
    organizationId
  }
}
    `) as unknown as TypedDocumentString<MyTeamsQuery, MyTeamsQueryVariables>;
export const OrganizationInvitationsDocument = new TypedDocumentString(`
    query OrganizationInvitations {
  organizationInvitations {
    id
    organizationId
    email
    role
    status
    teamId
    inviterId
    createdAt
    acceptedAt
    expiresAt
  }
}
    `) as unknown as TypedDocumentString<
  OrganizationInvitationsQuery,
  OrganizationInvitationsQueryVariables
>;
export const ProjectSpecsDocument = new TypedDocumentString(`
    query ProjectSpecs($projectId: String!) {
  projectSpecs(projectId: $projectId) {
    id
    projectId
    type
    name
    version
    content
    metadata
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
  ProjectSpecsQuery,
  ProjectSpecsQueryVariables
>;
export const StudioCanvasDocument = new TypedDocumentString(`
    query StudioCanvas($projectId: String!) {
  studioCanvas(projectId: $projectId)
}
    `) as unknown as TypedDocumentString<
  StudioCanvasQuery,
  StudioCanvasQueryVariables
>;
export const StudioIntegrationsDocument = new TypedDocumentString(`
    query StudioIntegrations($projectId: String!) {
  studioIntegrations(projectId: $projectId) {
    id
    organizationId
    projectId
    provider
    name
    enabled
    usageCount
    lastUsed
    config
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
  StudioIntegrationsQuery,
  StudioIntegrationsQueryVariables
>;
export const StudioProjectBySlugDocument = new TypedDocumentString(`
    query StudioProjectBySlug($slug: String!) {
  studioProjectBySlug(slug: $slug) {
    canonicalSlug
    wasRedirect
    project {
      id
      slug
      name
      description
      tier
      deploymentMode
      byokEnabled
      evolutionEnabled
      createdAt
      updatedAt
      deployments {
        id
        environment
        status
        version
        url
        createdAt
        deployedAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  StudioProjectBySlugQuery,
  StudioProjectBySlugQueryVariables
>;
export const StudioProjectsDocument = new TypedDocumentString(`
    query StudioProjects {
  myStudioProjects {
    id
    slug
    name
    description
    tier
    deploymentMode
    byokEnabled
    evolutionEnabled
    createdAt
    updatedAt
    specs {
      id
      type
      version
    }
    deployments {
      id
      environment
      status
      deployedAt
    }
  }
}
    `) as unknown as TypedDocumentString<
  StudioProjectsQuery,
  StudioProjectsQueryVariables
>;
export const Hooks_MyActiveOrgDocument = new TypedDocumentString(`
    query Hooks_MyActiveOrg {
  myActiveOrganization {
    id
    name
    slug
    type
  }
}
    `) as unknown as TypedDocumentString<
  Hooks_MyActiveOrgQuery,
  Hooks_MyActiveOrgQueryVariables
>;
