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

export type AdminAllowWaitlistInput = {
  waitingListId: Scalars['ID']['input'];
};

export type AdminAppendCollectivityNoteInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  stage?: InputMaybe<Scalars['String']['input']>;
};

export type AdminCollectivityById = {
  id: Scalars['ID']['input'];
};

export type AdminContentLocaleInput = {
  body_plain?: InputMaybe<Scalars['String']['input']>;
  locale: Scalars['String']['input'];
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type AdminCreateOrganizationInput = {
  cityId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  siret?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  type: OrganizationType;
};

export type AdminCreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type AdminInviteInput = {
  email: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

export type AdminTranslateContentInput = {
  contentId: Scalars['ID']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  sourceLocale: Scalars['String']['input'];
  targetLocale: Scalars['String']['input'];
};

export type AdminUpsertContentInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  locales: Array<AdminContentLocaleInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  type: ContentType;
};

export type AdminUserAddress = {
  __typename?: 'AdminUserAddress';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type AdminUserDetails = {
  __typename?: 'AdminUserDetails';
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  kyc?: Maybe<AdminUserKyc>;
  lastLoginAt?: Maybe<Scalars['Date']['output']>;
  metrics?: Maybe<AdminUserMetrics>;
  name?: Maybe<Scalars['String']['output']>;
  organizations?: Maybe<Array<AdminUserOrganization>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  phoneVerified?: Maybe<Scalars['Boolean']['output']>;
  profile?: Maybe<AdminUserProfile>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type AdminUserDocument = {
  __typename?: 'AdminUserDocument';
  documentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reviewNotes?: Maybe<Scalars['String']['output']>;
  status: DocumentStatus;
  updatedAt: Scalars['Date']['output'];
  verifiedAt?: Maybe<Scalars['Date']['output']>;
};

export type AdminUserKyc = {
  __typename?: 'AdminUserKYC';
  documents?: Maybe<Array<AdminUserDocument>>;
  lastReviewAt?: Maybe<Scalars['Date']['output']>;
  level?: Maybe<Scalars['Int']['output']>;
  reviewNotes?: Maybe<Scalars['String']['output']>;
  reviewedBy?: Maybe<Scalars['String']['output']>;
  riskScore?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['Date']['output']>;
};

export type AdminUserMetrics = {
  __typename?: 'AdminUserMetrics';
  documentsUploaded?: Maybe<Scalars['Int']['output']>;
  lastActivityAt?: Maybe<Scalars['Date']['output']>;
  lifetimeValue?: Maybe<Scalars['Int']['output']>;
  organizationsCount?: Maybe<Scalars['Int']['output']>;
  subscriptionStatus?: Maybe<Scalars['String']['output']>;
  totalLogins?: Maybe<Scalars['Int']['output']>;
};

export type AdminUserOrganization = {
  __typename?: 'AdminUserOrganization';
  id?: Maybe<Scalars['ID']['output']>;
  joinedAt?: Maybe<Scalars['Date']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type AdminUserProfile = {
  __typename?: 'AdminUserProfile';
  address?: Maybe<AdminUserAddress>;
  companyName?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  profession?: Maybe<Scalars['String']['output']>;
  siret?: Maybe<Scalars['String']['output']>;
};

export type AdminUserWithCompliance = {
  __typename?: 'AdminUserWithCompliance';
  complianceBadge: ComplianceBadgeStatus;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  lastUploadAt?: Maybe<Scalars['Date']['output']>;
  uploadedDocCount?: Maybe<Scalars['Int']['output']>;
};

export type AdminUsersPage = {
  __typename?: 'AdminUsersPage';
  items?: Maybe<Array<AdminUserWithCompliance>>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type AdminWaitingList = {
  __typename?: 'AdminWaitingList';
  items?: Maybe<Array<WaitingListRow>>;
};

export type AvailabilitiesByCityDateInput = {
  cityId?: InputMaybe<Scalars['ID']['input']>;
  date: Scalars['Date']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type AvailabilityDefinitionByIdInput = {
  id: Scalars['ID']['input'];
};

export type AvailabilityDefinitionBySpotDefinitionInput = {
  spotDefinitionId: Scalars['ID']['input'];
};

export type BBoxInput = {
  maxLat: Scalars['Float']['input'];
  maxLng: Scalars['Float']['input'];
  minLat: Scalars['Float']['input'];
  minLng: Scalars['Float']['input'];
};

export type BookAvailabilityInput = {
  availabilityId: Scalars['ID']['input'];
};

export type Booking = {
  __typename?: 'Booking';
  bookedAt?: Maybe<Scalars['Date']['output']>;
  cancelledAt?: Maybe<Scalars['Date']['output']>;
  complianceBadgeAtBooking?: Maybe<ComplianceBadgeStatus>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  seller: Organization;
  sellerId?: Maybe<Scalars['String']['output']>;
  spotAvailability: SpotAvailability;
  spotAvailabilityId: Scalars['String']['output'];
  spotDefinition: SpotDefinition;
  status: BookingStatus;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export enum BookingStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
}

export type CancelBookingInput = {
  id: Scalars['ID']['input'];
};

export type City = {
  __typename?: 'City';
  code?: Maybe<Scalars['String']['output']>;
  countryId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CommercePoint = {
  __typename?: 'CommercePoint';
  address?: Maybe<PublicAddress>;
  amenities?: Maybe<Array<Scalars['String']['output']>>;
  businessName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  nafCode?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  siret?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
};

export type CompleteOnboardingResult = {
  __typename?: 'CompleteOnboardingResult';
  createdNewOrganization?: Maybe<Scalars['Boolean']['output']>;
  invitationsSent?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['ID']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  userType?: Maybe<Scalars['String']['output']>;
};

export enum ComplianceBadgeStatus {
  Complete = 'COMPLETE',
  Expiring = 'EXPIRING',
  Incomplete = 'INCOMPLETE',
  MissingCore = 'MISSING_CORE',
}

export type ConnectionStatus = {
  __typename?: 'ConnectionStatus';
  linkedProviders?: Maybe<Array<Scalars['String']['output']>>;
};

export type Content = {
  __typename?: 'Content';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  isPublished?: Maybe<Scalars['Boolean']['output']>;
  locales?: Maybe<Array<ContentLocale>>;
  publishedAt?: Maybe<Scalars['Date']['output']>;
  tags?: Maybe<Array<ContentTag>>;
  type?: Maybe<ContentType>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ContentLocale = {
  __typename?: 'ContentLocale';
  humanReviewedAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  mtAt?: Maybe<Scalars['Date']['output']>;
  mtProvider?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  translationStatus?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ContentTag = {
  __typename?: 'ContentTag';
  contentId?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Tag>;
  tagId?: Maybe<Scalars['String']['output']>;
};

export enum ContentType {
  Academy = 'ACADEMY',
  Help = 'HELP',
  Tutorial = 'TUTORIAL',
}

export type CreateSpotWithAvailabilityInput = {
  addressId?: InputMaybe<Scalars['ID']['input']>;
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  byMonthday?: InputMaybe<Array<Scalars['Int']['input']>>;
  byWeekday?: InputMaybe<Array<Weekday>>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  countryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['Date']['input']>;
  endsCount?: InputMaybe<Scalars['Int']['input']>;
  feeReference?: InputMaybe<Scalars['String']['input']>;
  frequency: RecurrenceFrequency;
  interval?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  latitude?: InputMaybe<Scalars['Latitude']['input']>;
  longitude?: InputMaybe<Scalars['Longitude']['input']>;
  maxCapacity?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['NonEmptyString']['input'];
  publishDefinition?: InputMaybe<Scalars['Boolean']['input']>;
  startDate: Scalars['Date']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  timezone: Scalars['TimeZone']['input'];
};

export type DashboardData = {
  __typename?: 'DashboardData';
  currentDate?: Maybe<Scalars['String']['output']>;
};

export type DateRangeInput = {
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export enum DocumentStatus {
  Expired = 'EXPIRED',
  Expiring = 'EXPIRING',
  Missing = 'MISSING',
  Uploaded = 'UPLOADED',
  Verified = 'VERIFIED',
}

export enum DocumentType {
  Haccp = 'HACCP',
  IdCard = 'ID_CARD',
  ItinerantCard = 'ITINERANT_CARD',
  Kbis = 'KBIS',
  Other = 'OTHER',
  SirenSiret = 'SIREN_SIRET',
}

export type GdprRequest = {
  __typename?: 'GdprRequest';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type GdprRequestPayload = {
  __typename?: 'GdprRequestPayload';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum GeoAdminLevel {
  Arrondissement = 'ARRONDISSEMENT',
  Canton = 'CANTON',
  City = 'CITY',
  Commune = 'COMMUNE',
  Continent = 'CONTINENT',
  Country = 'COUNTRY',
  County = 'COUNTY',
  Department = 'DEPARTMENT',
  District = 'DISTRICT',
  Neighbourhood = 'NEIGHBOURHOOD',
  Province = 'PROVINCE',
  Region = 'REGION',
  Ward = 'WARD',
}

export type GeoArea = {
  __typename?: 'GeoArea';
  code?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  level: GeoAdminLevel;
  name: Scalars['String']['output'];
};

export type GeoAreaFeature = {
  __typename?: 'GeoAreaFeature';
  centerLat?: Maybe<Scalars['Float']['output']>;
  centerLng?: Maybe<Scalars['Float']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  geometry?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  level: GeoAdminLevel;
  name: Scalars['String']['output'];
};

export type H3CellFeature = {
  __typename?: 'H3CellFeature';
  count?: Maybe<Scalars['Int']['output']>;
  geometry?: Maybe<Scalars['JSON']['output']>;
  h3Index?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adminAllowWaitlistEntry?: Maybe<Scalars['Boolean']['output']>;
  adminAppendCollectivityNote?: Maybe<Scalars['Boolean']['output']>;
  adminCreateOrganization?: Maybe<Organization>;
  adminCreateUser?: Maybe<Scalars['ID']['output']>;
  adminInviteToCollectivity?: Maybe<Scalars['ID']['output']>;
  adminTranslateContent?: Maybe<Content>;
  adminUpsertContent?: Maybe<Content>;
  aiRewrite?: Maybe<Scalars['String']['output']>;
  aiSummarize?: Maybe<Scalars['String']['output']>;
  bookAvailability?: Maybe<Booking>;
  cancelBooking?: Maybe<Booking>;
  completeOnboarding?: Maybe<CompleteOnboardingResult>;
  createSpotWithAvailability?: Maybe<SpotDefinition>;
  deleteOnboardingDraft?: Maybe<Scalars['Boolean']['output']>;
  markWholesaleOrderPaid?: Maybe<WholesaleOrder>;
  publishAvailability?: Maybe<SpotAvailability>;
  requestAccountDeletion?: Maybe<GdprRequestPayload>;
  requestDataExport?: Maybe<GdprRequestPayload>;
  reviewDocument?: Maybe<StritDocument>;
  reviewKYC?: Maybe<ReviewedKyc>;
  runExpiryReminderJob?: Maybe<Scalars['Int']['output']>;
  saveOnboardingDraft?: Maybe<OnboardingDraftPayload>;
  sendBookingConfirmation?: Maybe<Scalars['Boolean']['output']>;
  sendKycCompleteIfEligible?: Maybe<Scalars['Boolean']['output']>;
  setAvailabilityStatus?: Maybe<SpotAvailability>;
  setSpotDefinitionPublish?: Maybe<SpotDefinition>;
  setUserMetadata?: Maybe<Scalars['Boolean']['output']>;
  unlinkProvider?: Maybe<Scalars['Boolean']['output']>;
  updateProfile?: Maybe<User>;
  updateUserProfile?: Maybe<UpdatedUserProfile>;
  uploadDocument?: Maybe<StritDocument>;
  upsertAvailabilityDefinition?: Maybe<SpotAvailabilityDefinition>;
  upsertSpotDefinition?: Maybe<SpotDefinition>;
  wholesaleCheckout?: Maybe<WholesaleOrder>;
};

export type MutationAdminAllowWaitlistEntryArgs = {
  input: AdminAllowWaitlistInput;
};

export type MutationAdminAppendCollectivityNoteArgs = {
  input: AdminAppendCollectivityNoteInput;
};

export type MutationAdminCreateOrganizationArgs = {
  input: AdminCreateOrganizationInput;
};

export type MutationAdminCreateUserArgs = {
  input: AdminCreateUserInput;
};

export type MutationAdminInviteToCollectivityArgs = {
  input: AdminInviteInput;
};

export type MutationAdminTranslateContentArgs = {
  input: AdminTranslateContentInput;
};

export type MutationAdminUpsertContentArgs = {
  input: AdminUpsertContentInput;
};

export type MutationAiRewriteArgs = {
  text: Scalars['String']['input'];
};

export type MutationAiSummarizeArgs = {
  text: Scalars['String']['input'];
};

export type MutationBookAvailabilityArgs = {
  input: BookAvailabilityInput;
};

export type MutationCancelBookingArgs = {
  input: CancelBookingInput;
};

export type MutationCompleteOnboardingArgs = {
  input: Scalars['JSON']['input'];
};

export type MutationCreateSpotWithAvailabilityArgs = {
  input: CreateSpotWithAvailabilityInput;
};

export type MutationMarkWholesaleOrderPaidArgs = {
  id: Scalars['ID']['input'];
};

export type MutationPublishAvailabilityArgs = {
  input: PublishSpotAvailabilityInput;
};

export type MutationRequestAccountDeletionArgs = {
  input: RequestAccountDeletionInput;
};

export type MutationReviewDocumentArgs = {
  input: ReviewDocumentInput;
};

export type MutationReviewKycArgs = {
  input: ReviewKycInput;
  userId: Scalars['ID']['input'];
};

export type MutationSaveOnboardingDraftArgs = {
  data: Scalars['JSON']['input'];
};

export type MutationSendBookingConfirmationArgs = {
  bookingId: Scalars['ID']['input'];
};

export type MutationSendKycCompleteIfEligibleArgs = {
  sellerId?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationSetAvailabilityStatusArgs = {
  input: SetAvailabilityStatusInput;
};

export type MutationSetSpotDefinitionPublishArgs = {
  input: SetSpotDefinitionPublishInput;
};

export type MutationSetUserMetadataArgs = {
  json: Scalars['String']['input'];
};

export type MutationUnlinkProviderArgs = {
  providerId: Scalars['String']['input'];
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
  userId: Scalars['ID']['input'];
};

export type MutationUploadDocumentArgs = {
  input: UploadDocumentInput;
};

export type MutationUpsertAvailabilityDefinitionArgs = {
  input: UpsertAvailabilityDefinitionInput;
};

export type MutationUpsertSpotDefinitionArgs = {
  input: UpsertSpotDefinitionInput;
};

export type MutationWholesaleCheckoutArgs = {
  input: WholesaleCheckoutInput;
};

export type OccurrencesByAvailabilityDefinitionInput = {
  availabilityDefinitionId: Scalars['ID']['input'];
  end: Scalars['Date']['input'];
  start: Scalars['Date']['input'];
};

export type OnboardingDraftMetadata = {
  __typename?: 'OnboardingDraftMetadata';
  createdAt?: Maybe<Scalars['Date']['output']>;
  daysSinceUpdate?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type OnboardingDraftPayload = {
  __typename?: 'OnboardingDraftPayload';
  data?: Maybe<Scalars['JSON']['output']>;
  metadata?: Maybe<OnboardingDraftMetadata>;
};

export type Organization = {
  __typename?: 'Organization';
  cityId?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  complianceBadge: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  onboardingCompleted: Scalars['Boolean']['output'];
  onboardingStep?: Maybe<Scalars['String']['output']>;
  siret?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  type?: Maybe<OrganizationType>;
};

export enum OrganizationType {
  Collectivity = 'COLLECTIVITY',
  PlatformAdmin = 'PLATFORM_ADMIN',
  Seller = 'SELLER',
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PublicAddress = {
  __typename?: 'PublicAddress';
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  cityId?: Maybe<Scalars['String']['output']>;
  countryId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
};

export type PublicCountry = {
  __typename?: 'PublicCountry';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PublishSpotAvailabilityInput = {
  id: Scalars['ID']['input'];
  publish: Scalars['Boolean']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminBookings?: Maybe<QueryAdminBookingsConnection>;
  adminCollectivities?: Maybe<Array<Organization>>;
  adminCollectivity?: Maybe<Organization>;
  adminContentList?: Maybe<Array<Content>>;
  adminSellers?: Maybe<Array<Organization>>;
  adminUserDetails?: Maybe<AdminUserDetails>;
  adminUserDocuments?: Maybe<Array<AdminUserDocument>>;
  adminUsersWithCompliance?: Maybe<AdminUsersPage>;
  adminWaitingList?: Maybe<AdminWaitingList>;
  adminWholesaleOrders?: Maybe<QueryAdminWholesaleOrdersConnection>;
  availabilitiesByCityDate?: Maybe<Array<SpotAvailability>>;
  availabilityDefinition?: Maybe<SpotAvailabilityDefinition>;
  availabilityDefinitionBySpotDefinition?: Maybe<SpotAvailabilityDefinition>;
  availabilityHeatmap?: Maybe<Array<H3CellFeature>>;
  bookingsHeatmap?: Maybe<Array<H3CellFeature>>;
  cities?: Maybe<Array<City>>;
  collectivityMetricsSnapshot?: Maybe<Array<StritMetricsCard>>;
  connectionStatus?: Maybe<ConnectionStatus>;
  dashboardData?: Maybe<DashboardData>;
  geoAreaGeometry?: Maybe<Scalars['JSON']['output']>;
  geoAreasByLevel?: Maybe<Array<GeoAreaFeature>>;
  geoAreasInBBox?: Maybe<Array<GeoAreaFeature>>;
  geoAreasSearch?: Maybe<Array<GeoAreaFeature>>;
  me?: Maybe<User>;
  myActiveOrganization?: Maybe<Organization>;
  myBookings?: Maybe<Array<Booking>>;
  myDocuments?: Maybe<Array<StritDocument>>;
  myGdprRequests?: Maybe<Array<GdprRequest>>;
  myOrganizations?: Maybe<Array<Organization>>;
  myWholesaleOrders?: Maybe<Array<WholesaleOrder>>;
  occurrencesByAvailabilityDefinition?: Maybe<Array<SpotAvailability>>;
  onboardingDraft?: Maybe<OnboardingDraftPayload>;
  sellerCompliance?: Maybe<SellerCompliance>;
  sellerKycStatus?: Maybe<SellerKycStatus>;
  spotDefinition?: Maybe<SpotDefinition>;
  spotDefinitions?: Maybe<Array<SpotDefinition>>;
  userKycStatus?: Maybe<UserKycStatus>;
  wholesaleProducts?: Maybe<Array<WholesaleProduct>>;
};

export type QueryAdminBookingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryAdminCollectivityArgs = {
  input: AdminCollectivityById;
};

export type QueryAdminUserDetailsArgs = {
  userId: Scalars['ID']['input'];
};

export type QueryAdminUserDocumentsArgs = {
  userId: Scalars['ID']['input'];
};

export type QueryAdminUsersWithComplianceArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryAdminWholesaleOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryAvailabilitiesByCityDateArgs = {
  input: AvailabilitiesByCityDateInput;
};

export type QueryAvailabilityDefinitionArgs = {
  input: AvailabilityDefinitionByIdInput;
};

export type QueryAvailabilityDefinitionBySpotDefinitionArgs = {
  input: AvailabilityDefinitionBySpotDefinitionInput;
};

export type QueryAvailabilityHeatmapArgs = {
  bbox: BBoxInput;
  date: Scalars['String']['input'];
  resolution: Scalars['Int']['input'];
};

export type QueryBookingsHeatmapArgs = {
  bbox: BBoxInput;
  dateRange: DateRangeInput;
  resolution: Scalars['Int']['input'];
};

export type QueryCitiesArgs = {
  input: SearchCitiesInput;
};

export type QueryGeoAreaGeometryArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGeoAreasByLevelArgs = {
  level: GeoAdminLevel;
  limit: Scalars['Int']['input'];
  maxLat: Scalars['Float']['input'];
  maxLng: Scalars['Float']['input'];
  minLat: Scalars['Float']['input'];
  minLng: Scalars['Float']['input'];
};

export type QueryGeoAreasInBBoxArgs = {
  limit: Scalars['Int']['input'];
  maxLat: Scalars['Float']['input'];
  maxLng: Scalars['Float']['input'];
  minLat: Scalars['Float']['input'];
  minLng: Scalars['Float']['input'];
};

export type QueryGeoAreasSearchArgs = {
  limit: Scalars['Int']['input'];
  q: Scalars['String']['input'];
};

export type QueryOccurrencesByAvailabilityDefinitionArgs = {
  input: OccurrencesByAvailabilityDefinitionInput;
};

export type QuerySellerComplianceArgs = {
  sellerId?: InputMaybe<Scalars['ID']['input']>;
};

export type QuerySellerKycStatusArgs = {
  sellerId?: InputMaybe<Scalars['ID']['input']>;
};

export type QuerySpotDefinitionArgs = {
  input: SpotDefinitionByIdInput;
};

export type QuerySpotDefinitionsArgs = {
  input: SpotDefinitionsSearchInput;
};

export type QueryWholesaleProductsArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
};

export type QueryAdminBookingsConnection = {
  __typename?: 'QueryAdminBookingsConnection';
  edges?: Maybe<Array<Maybe<QueryAdminBookingsConnectionEdge>>>;
  pageInfo: PageInfo;
};

export type QueryAdminBookingsConnectionEdge = {
  __typename?: 'QueryAdminBookingsConnectionEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Booking>;
};

export type QueryAdminWholesaleOrdersConnection = {
  __typename?: 'QueryAdminWholesaleOrdersConnection';
  edges?: Maybe<Array<Maybe<QueryAdminWholesaleOrdersConnectionEdge>>>;
  pageInfo: PageInfo;
};

export type QueryAdminWholesaleOrdersConnectionEdge = {
  __typename?: 'QueryAdminWholesaleOrdersConnectionEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<WholesaleOrder>;
};

export enum RecurrenceFrequency {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
}

export type RequestAccountDeletionInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  handlingSpots?: InputMaybe<Scalars['String']['input']>;
  impactAcknowledged?: InputMaybe<Scalars['Boolean']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewDocumentInput = {
  documentId: Scalars['ID']['input'];
  reviewNotes?: InputMaybe<Scalars['String']['input']>;
  status: DocumentStatus;
};

export type ReviewKycInput = {
  level: Scalars['Int']['input'];
  reviewNotes?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type ReviewedKyc = {
  __typename?: 'ReviewedKYC';
  id?: Maybe<Scalars['ID']['output']>;
  level?: Maybe<Scalars['Int']['output']>;
  reviewNotes?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['Date']['output']>;
};

export type SearchCitiesInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};

export type SellerCompliance = {
  __typename?: 'SellerCompliance';
  badge?: Maybe<ComplianceBadgeStatus>;
  expiring?: Maybe<Scalars['Boolean']['output']>;
  hasVerifiedKBIS?: Maybe<Scalars['Boolean']['output']>;
  hasVerifiedUser?: Maybe<Scalars['Boolean']['output']>;
  missingCore?: Maybe<Scalars['Boolean']['output']>;
  pendingCore?: Maybe<Scalars['Int']['output']>;
  sellerId?: Maybe<Scalars['ID']['output']>;
  uploadedCount?: Maybe<Scalars['Int']['output']>;
  verifiedCore?: Maybe<Scalars['Boolean']['output']>;
};

export type SellerKycStatus = {
  __typename?: 'SellerKycStatus';
  hasVerifiedKBIS?: Maybe<Scalars['Boolean']['output']>;
  hasVerifiedUser?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
};

export type SetAvailabilityStatusInput = {
  id: Scalars['ID']['input'];
  status: SpotAvailabilityStatus;
};

export type SetSpotDefinitionPublishInput = {
  id: Scalars['ID']['input'];
  publish: Scalars['Boolean']['input'];
};

export type SpotAvailability = {
  __typename?: 'SpotAvailability';
  bookings?: Maybe<Array<Booking>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  currentCapacity?: Maybe<Scalars['Int']['output']>;
  date?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  organization?: Maybe<Organization>;
  publishedAt?: Maybe<Scalars['Date']['output']>;
  publishedBy?: Maybe<Scalars['String']['output']>;
  spotAvailabilityDefinition: SpotAvailabilityDefinition;
  spotDefinition: SpotDefinition;
  status: SpotAvailabilityStatus;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type SpotAvailabilityDefinition = {
  __typename?: 'SpotAvailabilityDefinition';
  availabilities?: Maybe<Array<SpotAvailability>>;
  byMonthday?: Maybe<Array<Scalars['Int']['output']>>;
  byWeekday?: Maybe<Array<Weekday>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  endsAt?: Maybe<Scalars['Date']['output']>;
  endsCount?: Maybe<Scalars['Int']['output']>;
  feeReference?: Maybe<Scalars['String']['output']>;
  frequency?: Maybe<RecurrenceFrequency>;
  id: Scalars['ID']['output'];
  interval?: Maybe<Scalars['Int']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  maxCapacity?: Maybe<Scalars['Int']['output']>;
  organization?: Maybe<Organization>;
  spotDefinition: SpotDefinition;
  startDate?: Maybe<Scalars['Date']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export enum SpotAvailabilityStatus {
  Booked = 'BOOKED',
  Cancelled = 'CANCELLED',
  Published = 'PUBLISHED',
}

export type SpotDefinition = {
  __typename?: 'SpotDefinition';
  address?: Maybe<PublicAddress>;
  amenities?: Maybe<Array<Scalars['String']['output']>>;
  city: City;
  country: PublicCountry;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  nearbyCommercePoints?: Maybe<Array<CommercePoint>>;
  organization?: Maybe<Organization>;
  spotAvailabilities?: Maybe<Array<SpotAvailability>>;
  spotAvailabilityDefinition?: Maybe<SpotAvailabilityDefinition>;
  status: SpotDefinitionStatus;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type SpotDefinitionByIdInput = {
  id: Scalars['ID']['input'];
};

export enum SpotDefinitionStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Unpublished = 'UNPUBLISHED',
}

export type SpotDefinitionsSearchInput = {
  cityId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
};

export type StritDocument = {
  __typename?: 'StritDocument';
  createdAt?: Maybe<Scalars['Date']['output']>;
  documentType: DocumentType;
  expiryDate?: Maybe<Scalars['Date']['output']>;
  fileId?: Maybe<Scalars['String']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  reminderSent?: Maybe<Scalars['Boolean']['output']>;
  reviewNotes?: Maybe<Scalars['String']['output']>;
  sellerId?: Maybe<Scalars['String']['output']>;
  status: DocumentStatus;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  verifiedAt?: Maybe<Scalars['Date']['output']>;
  verifiedBy?: Maybe<Scalars['String']['output']>;
};

export type StritMetricsCard = {
  __typename?: 'StritMetricsCard';
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type UpdateProfileInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  profession?: InputMaybe<Scalars['String']['input']>;
  siret?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatedUserProfile = {
  __typename?: 'UpdatedUserProfile';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type UploadDocumentInput = {
  documentType: DocumentType;
  expiryDate?: InputMaybe<Scalars['Date']['input']>;
  fileId: Scalars['ID']['input'];
  fileName: Scalars['String']['input'];
};

export type UpsertAvailabilityDefinitionInput = {
  byMonthday?: InputMaybe<Array<Scalars['Int']['input']>>;
  byWeekday?: InputMaybe<Array<Weekday>>;
  endsAt?: InputMaybe<Scalars['Date']['input']>;
  endsCount?: InputMaybe<Scalars['Int']['input']>;
  feeReference?: InputMaybe<Scalars['String']['input']>;
  frequency: RecurrenceFrequency;
  id?: InputMaybe<Scalars['ID']['input']>;
  interval?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxCapacity?: InputMaybe<Scalars['Int']['input']>;
  spotDefinitionId: Scalars['ID']['input'];
  startDate: Scalars['Date']['input'];
  timezone: Scalars['TimeZone']['input'];
};

export type UpsertSpotDefinitionInput = {
  addressId?: InputMaybe<Scalars['ID']['input']>;
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  countryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  latitude?: InputMaybe<Scalars['Latitude']['input']>;
  longitude?: InputMaybe<Scalars['Longitude']['input']>;
  name: Scalars['NonEmptyString']['input'];
  status?: InputMaybe<SpotDefinitionStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type UserKycStatus = {
  __typename?: 'UserKycStatus';
  hasVerifiedIdDocument?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  phoneVerified?: Maybe<Scalars['Boolean']['output']>;
};

export type WaitingListRow = {
  __typename?: 'WaitingListRow';
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export enum Weekday {
  Fr = 'FR',
  Mo = 'MO',
  Sa = 'SA',
  Su = 'SU',
  Th = 'TH',
  Tu = 'TU',
  We = 'WE',
}

export type WholesaleCheckoutInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  items: Array<WholesaleCheckoutItemInput>;
};

export type WholesaleCheckoutItemInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type WholesaleOrder = {
  __typename?: 'WholesaleOrder';
  createdAt?: Maybe<Scalars['Date']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items?: Maybe<Array<WholesaleOrderItem>>;
  sellerId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type WholesaleOrderItem = {
  __typename?: 'WholesaleOrderItem';
  id: Scalars['ID']['output'];
  orderId?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export type WholesaleProduct = {
  __typename?: 'WholesaleProduct';
  category?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  packSize?: Maybe<Scalars['String']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  stockQuantity?: Maybe<Scalars['Int']['output']>;
  subcategory?: Maybe<Scalars['String']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type Page_CollectivityDashboardMetricsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_CollectivityDashboardMetricsQueryQuery = {
  __typename?: 'Query';
  collectivityMetricsSnapshot?: Array<{
    __typename?: 'StritMetricsCard';
    label?: string | null;
    value?: number | null;
  }> | null;
};

export type Page_CollectivityMetricsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_CollectivityMetricsQueryQuery = {
  __typename?: 'Query';
  collectivityMetricsSnapshot?: Array<{
    __typename?: 'StritMetricsCard';
    label?: string | null;
    value?: number | null;
  }> | null;
};

export type Page_CollectivityOverview_CitiesQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type Page_CollectivityOverview_CitiesQuery = {
  __typename?: 'Query';
  cities?: Array<{
    __typename?: 'City';
    id: string;
    name: string;
    code?: string | null;
  }> | null;
};

export type CityOverviewFragment = {
  __typename?: 'City';
  id: string;
  name: string;
} & { ' $fragmentName'?: 'CityOverviewFragment' };

export type Page_CollectivityOverview_AvailabilitiesQueryVariables = Exact<{
  date: Scalars['Date']['input'];
  cityId?: InputMaybe<Scalars['ID']['input']>;
}>;

export type Page_CollectivityOverview_AvailabilitiesQuery = {
  __typename?: 'Query';
  availabilitiesByCityDate?: Array<
    { __typename?: 'SpotAvailability' } & {
      ' $fragmentRefs'?: {
        SpotAvailability_ListItemFragment: SpotAvailability_ListItemFragment;
      };
    }
  > | null;
};

export type CollectivityPrivacy_MyGdprRequestsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type CollectivityPrivacy_MyGdprRequestsQueryQuery = {
  __typename?: 'Query';
  myGdprRequests?: Array<{
    __typename?: 'GdprRequest';
    id?: string | null;
    type?: string | null;
    status?: string | null;
    createdAt?: any | null;
    metadata?: any | null;
  }> | null;
};

export type CollectivityPrivacy_RequestDataExportMutationMutationVariables =
  Exact<{ [key: string]: never }>;

export type CollectivityPrivacy_RequestDataExportMutationMutation = {
  __typename?: 'Mutation';
  requestDataExport?: {
    __typename?: 'GdprRequestPayload';
    id?: string | null;
    type?: string | null;
    status?: string | null;
    createdAt?: any | null;
  } | null;
};

export type CollectivityPrivacy_RequestAccountDeletionMutationMutationVariables =
  Exact<{
    input: RequestAccountDeletionInput;
  }>;

export type CollectivityPrivacy_RequestAccountDeletionMutationMutation = {
  __typename?: 'Mutation';
  requestAccountDeletion?: {
    __typename?: 'GdprRequestPayload';
    id?: string | null;
    type?: string | null;
    status?: string | null;
    createdAt?: any | null;
  } | null;
};

export type Page_CollectivitySpotDefinitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type Page_CollectivitySpotDefinitionQuery = {
  __typename?: 'Query';
  spotDefinition?: {
    __typename?: 'SpotDefinition';
    id: string;
    name: string;
    status: SpotDefinitionStatus;
    description?: string | null;
    city: { __typename?: 'City'; id: string; name: string };
  } | null;
};

export type Page_CollectivityCitiesQueryQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type Page_CollectivityCitiesQueryQuery = {
  __typename?: 'Query';
  cities?: Array<{
    __typename?: 'City';
    id: string;
    name: string;
    code?: string | null;
  }> | null;
};

export type Page_CollectivitySpots_AvailabilitiesQueryVariables = Exact<{
  date: Scalars['Date']['input'];
  cityId?: InputMaybe<Scalars['ID']['input']>;
}>;

export type Page_CollectivitySpots_AvailabilitiesQuery = {
  __typename?: 'Query';
  availabilitiesByCityDate?: Array<
    { __typename?: 'SpotAvailability' } & {
      ' $fragmentRefs'?: {
        SpotAvailability_ListItemFragment: SpotAvailability_ListItemFragment;
      };
    }
  > | null;
};

export type Page_CollectivitySpotDefinitionsQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']['input']>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type Page_CollectivitySpotDefinitionsQuery = {
  __typename?: 'Query';
  spotDefinitions?: Array<
    {
      __typename?: 'SpotDefinition';
      spotAvailabilityDefinition?: {
        __typename?: 'SpotAvailabilityDefinition';
        id: string;
        timezone?: string | null;
        startDate?: any | null;
        frequency?: RecurrenceFrequency | null;
        interval?: number | null;
        byWeekday?: Array<Weekday> | null;
        byMonthday?: Array<number> | null;
        endsCount?: number | null;
        endsAt?: any | null;
        isActive?: boolean | null;
        feeReference?: string | null;
        maxCapacity?: number | null;
      } | null;
    } & {
      ' $fragmentRefs'?: {
        SpotDefinition_BasicFragment: SpotDefinition_BasicFragment;
      };
    }
  > | null;
};

export type Page_CollectivitySetSpotDefinitionPublishMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  publish: Scalars['Boolean']['input'];
}>;

export type Page_CollectivitySetSpotDefinitionPublishMutation = {
  __typename?: 'Mutation';
  setSpotDefinitionPublish?: {
    __typename?: 'SpotDefinition';
    id: string;
    status: SpotDefinitionStatus;
    updatedAt?: any | null;
  } | null;
};

export type Page_PlatformAdminBookingsQueryQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type Page_PlatformAdminBookingsQueryQuery = {
  __typename?: 'Query';
  adminBookings?: {
    __typename?: 'QueryAdminBookingsConnection';
    edges?: Array<{
      __typename?: 'QueryAdminBookingsConnectionEdge';
      node?: {
        __typename?: 'Booking';
        id: string;
        status: BookingStatus;
        bookedAt?: any | null;
        spotAvailability: {
          __typename?: 'SpotAvailability';
          date?: any | null;
        };
        spotDefinition: {
          __typename?: 'SpotDefinition';
          name: string;
          latitude?: number | null;
          longitude?: number | null;
          city: { __typename?: 'City'; name: string };
        };
        seller: { __typename?: 'Organization'; name: string };
      } | null;
    } | null> | null;
    pageInfo: {
      __typename?: 'PageInfo';
      endCursor?: string | null;
      hasNextPage: boolean;
    };
  } | null;
};

export type Page_AdminCollectivityDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type Page_AdminCollectivityDetailsQuery = {
  __typename?: 'Query';
  adminCollectivity?: {
    __typename?: 'Organization';
    id: string;
    name: string;
    siret?: string | null;
  } | null;
};

export type Page_AdminInviteMutationVariables = Exact<{
  input: AdminInviteInput;
}>;

export type Page_AdminInviteMutation = {
  __typename?: 'Mutation';
  adminInviteToCollectivity?: string | null;
};

export type Page_AdminAppendNoteMutationVariables = Exact<{
  input: AdminAppendCollectivityNoteInput;
}>;

export type Page_AdminAppendNoteMutation = {
  __typename?: 'Mutation';
  adminAppendCollectivityNote?: boolean | null;
};

export type Page_AdminCollectivitiesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_AdminCollectivitiesQuery = {
  __typename?: 'Query';
  adminCollectivities?: Array<{
    __typename?: 'Organization';
    id: string;
    name: string;
    siret?: string | null;
  }> | null;
};

export type Page_AdminCreateOrgMutationVariables = Exact<{
  input: AdminCreateOrganizationInput;
}>;

export type Page_AdminCreateOrgMutation = {
  __typename?: 'Mutation';
  adminCreateOrganization?: { __typename?: 'Organization'; id: string } | null;
};

export type AdminContentListQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type AdminContentListQueryQuery = {
  __typename?: 'Query';
  adminContentList?: Array<{
    __typename?: 'Content';
    id: string;
    isPublished?: boolean | null;
    locales?: Array<{
      __typename?: 'ContentLocale';
      locale?: string | null;
      slug?: string | null;
      title?: string | null;
      summary?: string | null;
    }> | null;
  }> | null;
};

export type AdminUpsertContentMutationMutationVariables = Exact<{
  input: AdminUpsertContentInput;
}>;

export type AdminUpsertContentMutationMutation = {
  __typename?: 'Mutation';
  adminUpsertContent?: { __typename?: 'Content'; id: string } | null;
};

export type AdminTranslateContentMutationMutationVariables = Exact<{
  input: AdminTranslateContentInput;
}>;

export type AdminTranslateContentMutationMutation = {
  __typename?: 'Mutation';
  adminTranslateContent?: { __typename?: 'Content'; id: string } | null;
};

export type Page_PlatformAdminDashboardMetricsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_PlatformAdminDashboardMetricsQueryQuery = {
  __typename?: 'Query';
  collectivityMetricsSnapshot?: Array<{
    __typename?: 'StritMetricsCard';
    label?: string | null;
    value?: number | null;
  }> | null;
};

export type Page_PlatformAdminUsersQueryQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type Page_PlatformAdminUsersQueryQuery = {
  __typename?: 'Query';
  adminUsersWithCompliance?: {
    __typename?: 'AdminUsersPage';
    totalItems?: number | null;
    totalPages?: number | null;
    items?: Array<{
      __typename?: 'AdminUserWithCompliance';
      id?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      uploadedDocCount?: number | null;
      lastUploadAt?: any | null;
      complianceBadge: ComplianceBadgeStatus;
    }> | null;
  } | null;
};

export type Page_PlatformAdminMetricsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_PlatformAdminMetricsQueryQuery = {
  __typename?: 'Query';
  collectivityMetricsSnapshot?: Array<{
    __typename?: 'StritMetricsCard';
    label?: string | null;
    value?: number | null;
  }> | null;
};

export type Page_PlatformAdminOrdersQueryQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type Page_PlatformAdminOrdersQueryQuery = {
  __typename?: 'Query';
  adminWholesaleOrders?: {
    __typename?: 'QueryAdminWholesaleOrdersConnection';
    edges?: Array<{
      __typename?: 'QueryAdminWholesaleOrdersConnectionEdge';
      node?: {
        __typename?: 'WholesaleOrder';
        id: string;
        createdAt?: any | null;
        totalAmount?: number | null;
        currency?: string | null;
        status?: string | null;
        sellerId?: string | null;
      } | null;
    } | null> | null;
    pageInfo: {
      __typename?: 'PageInfo';
      endCursor?: string | null;
      hasNextPage: boolean;
    };
  } | null;
};

export type Page_AdminSellersQueryVariables = Exact<{ [key: string]: never }>;

export type Page_AdminSellersQuery = {
  __typename?: 'Query';
  adminSellers?: Array<{
    __typename?: 'Organization';
    id: string;
    name: string;
    siret?: string | null;
    createdAt?: any | null;
    complianceBadge: string;
  }> | null;
};

export type Page_Admin_CitiesQueryQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type Page_Admin_CitiesQueryQuery = {
  __typename?: 'Query';
  cities?: Array<{
    __typename?: 'City';
    id: string;
    name: string;
    code?: string | null;
  }> | null;
};

export type Page_Admin_AvailabilitiesByCityDateQueryQueryVariables = Exact<{
  date: Scalars['Date']['input'];
  cityId?: InputMaybe<Scalars['ID']['input']>;
}>;

export type Page_Admin_AvailabilitiesByCityDateQueryQuery = {
  __typename?: 'Query';
  availabilitiesByCityDate?: Array<{
    __typename?: 'SpotAvailability';
    id: string;
    date?: any | null;
    status: SpotAvailabilityStatus;
    spotAvailabilityDefinition: {
      __typename?: 'SpotAvailabilityDefinition';
      spotDefinition: {
        __typename?: 'SpotDefinition';
        id: string;
        name: string;
        latitude?: number | null;
        longitude?: number | null;
        status: SpotDefinitionStatus;
        city: { __typename?: 'City'; id: string; name: string };
      };
    };
  }> | null;
};

export type Page_AdminSetSpotDefinitionPublishMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  publish: Scalars['Boolean']['input'];
}>;

export type Page_AdminSetSpotDefinitionPublishMutation = {
  __typename?: 'Mutation';
  setSpotDefinitionPublish?: {
    __typename?: 'SpotDefinition';
    id: string;
    status: SpotDefinitionStatus;
    updatedAt?: any | null;
  } | null;
};

export type AdminUserDetailsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type AdminUserDetailsQuery = {
  __typename?: 'Query';
  adminUserDetails?: {
    __typename?: 'AdminUserDetails';
    id?: string | null;
    email?: string | null;
    name?: string | null;
    phoneNumber?: string | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    lastLoginAt?: any | null;
    status?: string | null;
    emailVerified?: boolean | null;
    phoneVerified?: boolean | null;
    profile?: {
      __typename?: 'AdminUserProfile';
      firstName?: string | null;
      lastName?: string | null;
      dateOfBirth?: any | null;
      profession?: string | null;
      companyName?: string | null;
      siret?: string | null;
      address?: {
        __typename?: 'AdminUserAddress';
        street?: string | null;
        city?: string | null;
        postalCode?: string | null;
        country?: string | null;
      } | null;
    } | null;
    kyc?: {
      __typename?: 'AdminUserKYC';
      status?: string | null;
      level?: number | null;
      verifiedAt?: any | null;
      reviewedBy?: string | null;
      reviewNotes?: string | null;
      riskScore?: number | null;
      lastReviewAt?: any | null;
      documents?: Array<{
        __typename?: 'AdminUserDocument';
        id: string;
        documentType: string;
        status: DocumentStatus;
        fileName: string;
        updatedAt: any;
      }> | null;
    } | null;
    metrics?: {
      __typename?: 'AdminUserMetrics';
      totalLogins?: number | null;
      lastActivityAt?: any | null;
      documentsUploaded?: number | null;
      organizationsCount?: number | null;
      subscriptionStatus?: string | null;
      lifetimeValue?: number | null;
    } | null;
    organizations?: Array<{
      __typename?: 'AdminUserOrganization';
      id?: string | null;
      name?: string | null;
      role?: string | null;
      joinedAt?: any | null;
    }> | null;
  } | null;
};

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  input: UpdateUserProfileInput;
}>;

export type UpdateUserProfileMutation = {
  __typename?: 'Mutation';
  updateUserProfile?: {
    __typename?: 'UpdatedUserProfile';
    id?: string | null;
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    status?: string | null;
  } | null;
};

export type ReviewKycMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  input: ReviewKycInput;
}>;

export type ReviewKycMutation = {
  __typename?: 'Mutation';
  reviewKYC?: {
    __typename?: 'ReviewedKYC';
    id?: string | null;
    status?: string | null;
    level?: number | null;
    reviewNotes?: string | null;
    verifiedAt?: any | null;
  } | null;
};

export type ReviewDocumentMutationVariables = Exact<{
  input: ReviewDocumentInput;
}>;

export type ReviewDocumentMutation = {
  __typename?: 'Mutation';
  reviewDocument?: {
    __typename?: 'StritDocument';
    id: string;
    status: DocumentStatus;
    verifiedAt?: any | null;
    reviewNotes?: string | null;
  } | null;
};

export type Page_AdminCreateUserMutationVariables = Exact<{
  input: AdminCreateUserInput;
}>;

export type Page_AdminCreateUserMutation = {
  __typename?: 'Mutation';
  adminCreateUser?: string | null;
};

export type Page_PlatformAdminWaitingListQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_PlatformAdminWaitingListQueryQuery = {
  __typename?: 'Query';
  adminWaitingList?: {
    __typename?: 'AdminWaitingList';
    items?: Array<{
      __typename?: 'WaitingListRow';
      id?: string | null;
      email?: string | null;
      createdAt?: any | null;
      firstName?: string | null;
      lastName?: string | null;
    }> | null;
  } | null;
};

export type AdminAllowWaitlistMutationVariables = Exact<{
  input: AdminAllowWaitlistInput;
}>;

export type AdminAllowWaitlistMutation = {
  __typename?: 'Mutation';
  adminAllowWaitlistEntry?: boolean | null;
};

export type Dashboard_SellerComplianceQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Dashboard_SellerComplianceQueryQuery = {
  __typename?: 'Query';
  sellerCompliance?: {
    __typename?: 'SellerCompliance';
    sellerId?: string | null;
    badge?: ComplianceBadgeStatus | null;
    missingCore?: boolean | null;
    expiring?: boolean | null;
    uploadedCount?: number | null;
    hasVerifiedKBIS?: boolean | null;
    hasVerifiedUser?: boolean | null;
  } | null;
};

export type Page_SellerDocsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_SellerDocsQueryQuery = {
  __typename?: 'Query';
  myDocuments?: Array<{
    __typename?: 'StritDocument';
    id: string;
    documentType: DocumentType;
    status: DocumentStatus;
    expiryDate?: any | null;
  }> | null;
};

export type Page_UploadDocMutationMutationVariables = Exact<{
  input: UploadDocumentInput;
}>;

export type Page_UploadDocMutationMutation = {
  __typename?: 'Mutation';
  uploadDocument?: {
    __typename?: 'StritDocument';
    id: string;
    status: DocumentStatus;
  } | null;
};

export type Profile_UserKycStatusQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Profile_UserKycStatusQueryQuery = {
  __typename?: 'Query';
  userKycStatus?: {
    __typename?: 'UserKycStatus';
    phoneVerified?: boolean | null;
    hasVerifiedIdDocument?: boolean | null;
    isVerified?: boolean | null;
  } | null;
};

export type SellerPrivacy_MyGdprRequestsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SellerPrivacy_MyGdprRequestsQueryQuery = {
  __typename?: 'Query';
  myGdprRequests?: Array<{
    __typename?: 'GdprRequest';
    id?: string | null;
    type?: string | null;
    status?: string | null;
    createdAt?: any | null;
  }> | null;
};

export type SellerPrivacy_RequestDataExportMutationMutationVariables = Exact<{
  [key: string]: never;
}>;

export type SellerPrivacy_RequestDataExportMutationMutation = {
  __typename?: 'Mutation';
  requestDataExport?: {
    __typename?: 'GdprRequestPayload';
    id?: string | null;
    type?: string | null;
    status?: string | null;
    createdAt?: any | null;
  } | null;
};

export type SellerPrivacy_RequestAccountDeletionMutationMutationVariables =
  Exact<{
    input: RequestAccountDeletionInput;
  }>;

export type SellerPrivacy_RequestAccountDeletionMutationMutation = {
  __typename?: 'Mutation';
  requestAccountDeletion?: {
    __typename?: 'GdprRequestPayload';
    id?: string | null;
    type?: string | null;
    status?: string | null;
    createdAt?: any | null;
  } | null;
};

export type SellerSpot_DetailFragment = {
  __typename?: 'SpotDefinition';
  id: string;
  name: string;
  description?: string | null;
  status: SpotDefinitionStatus;
  city: { __typename?: 'City'; id: string } & {
    ' $fragmentRefs'?: { City_BasicFragment: City_BasicFragment };
  };
} & { ' $fragmentName'?: 'SellerSpot_DetailFragment' };

export type Page_SellerSpotDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type Page_SellerSpotDetailQuery = {
  __typename?: 'Query';
  spotDefinition?:
    | ({ __typename?: 'SpotDefinition' } & {
        ' $fragmentRefs'?: {
          SellerSpot_DetailFragment: SellerSpot_DetailFragment;
        };
      })
    | null;
};

export type Page_SellerBookSpotMutationVariables = Exact<{
  availabilityId: Scalars['ID']['input'];
}>;

export type Page_SellerBookSpotMutation = {
  __typename?: 'Mutation';
  bookAvailability?: {
    __typename?: 'Booking';
    id: string;
    status: BookingStatus;
    bookedAt?: any | null;
  } | null;
};

export type Page_SellerAvailabilitiesQueryQueryVariables = Exact<{
  date: Scalars['Date']['input'];
  q?: InputMaybe<Scalars['String']['input']>;
}>;

export type Page_SellerAvailabilitiesQueryQuery = {
  __typename?: 'Query';
  availabilitiesByCityDate?: Array<{
    __typename?: 'SpotAvailability';
    id: string;
    date?: any | null;
    status: SpotAvailabilityStatus;
    spotAvailabilityDefinition: {
      __typename?: 'SpotAvailabilityDefinition';
      spotDefinition: {
        __typename?: 'SpotDefinition';
        id: string;
        name: string;
        latitude?: number | null;
        longitude?: number | null;
        city: { __typename?: 'City'; name: string };
      };
    };
  }> | null;
};

export type Page_SellerAvailabilities_BookMutationVariables = Exact<{
  availabilityId: Scalars['ID']['input'];
}>;

export type Page_SellerAvailabilities_BookMutation = {
  __typename?: 'Mutation';
  bookAvailability?: {
    __typename?: 'Booking';
    id: string;
    status: BookingStatus;
  } | null;
};

export type Page_WholesaleCheckoutMutationMutationVariables = Exact<{
  input: WholesaleCheckoutInput;
}>;

export type Page_WholesaleCheckoutMutationMutation = {
  __typename?: 'Mutation';
  wholesaleCheckout?: {
    __typename?: 'WholesaleOrder';
    id: string;
    status?: string | null;
    totalAmount?: number | null;
    currency?: string | null;
  } | null;
};

export type Country_BasicFragment = {
  __typename?: 'PublicCountry';
  id: string;
  name: string;
  code: string;
} & { ' $fragmentName'?: 'Country_BasicFragment' };

export type City_BasicFragment = {
  __typename?: 'City';
  id: string;
  name: string;
  code?: string | null;
} & { ' $fragmentName'?: 'City_BasicFragment' };

export type Address_BasicFragment = {
  __typename?: 'PublicAddress';
  id: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
} & { ' $fragmentName'?: 'Address_BasicFragment' };

export type SpotDefinition_BasicFragment = {
  __typename?: 'SpotDefinition';
  id: string;
  name: string;
  description?: string | null;
  status: SpotDefinitionStatus;
  latitude?: number | null;
  longitude?: number | null;
  updatedAt?: any | null;
  city: { __typename?: 'City' } & {
    ' $fragmentRefs'?: { City_BasicFragment: City_BasicFragment };
  };
} & { ' $fragmentName'?: 'SpotDefinition_BasicFragment' };

export type SpotAvailability_ListItemFragment = {
  __typename?: 'SpotAvailability';
  id: string;
  date?: any | null;
  status: SpotAvailabilityStatus;
  spotDefinition: { __typename?: 'SpotDefinition'; id: string } & {
    ' $fragmentRefs'?: {
      SpotDefinition_BasicFragment: SpotDefinition_BasicFragment;
    };
  };
} & { ' $fragmentName'?: 'SpotAvailability_ListItemFragment' };

export type Booking_ListItemFragment = {
  __typename?: 'Booking';
  id: string;
  status: BookingStatus;
  bookedAt?: any | null;
  complianceBadgeAtBooking?: ComplianceBadgeStatus | null;
} & { ' $fragmentName'?: 'Booking_ListItemFragment' };

export type Page_StritMeForOnboardingManagerQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_StritMeForOnboardingManagerQuery = {
  __typename?: 'Query';
  me?: {
    __typename?: 'User';
    id: string;
    onboardingCompleted?: boolean | null;
    onboardingStep?: string | null;
    metadata?: string | null;
  } | null;
  myOrganizations?: Array<{
    __typename?: 'Organization';
    id: string;
    name: string;
    type?: OrganizationType | null;
    onboardingCompleted: boolean;
    onboardingStep?: string | null;
  }> | null;
};

export type Auth_UnlinkMutationVariables = Exact<{
  providerId: Scalars['String']['input'];
}>;

export type Auth_UnlinkMutation = {
  __typename?: 'Mutation';
  unlinkProvider?: boolean | null;
};

export type Auth_ConnectionStatusQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Auth_ConnectionStatusQuery = {
  __typename?: 'Query';
  connectionStatus?: {
    __typename?: 'ConnectionStatus';
    linkedProviders?: Array<string> | null;
  } | null;
};

export type Page_SellerBookingsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type Page_SellerBookingsQueryQuery = {
  __typename?: 'Query';
  myBookings?: Array<{
    __typename?: 'Booking';
    id: string;
    status: BookingStatus;
    bookedAt?: any | null;
    spotAvailability: {
      __typename?: 'SpotAvailability';
      date?: any | null;
      spotAvailabilityDefinition: {
        __typename?: 'SpotAvailabilityDefinition';
        feeReference?: string | null;
        maxCapacity?: number | null;
      };
    };
    spotDefinition: {
      __typename?: 'SpotDefinition';
      name: string;
      latitude?: number | null;
      longitude?: number | null;
      city: { __typename?: 'City'; name: string };
    };
  }> | null;
};

export type Page_SellerBookings_CancelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type Page_SellerBookings_CancelMutation = {
  __typename?: 'Mutation';
  cancelBooking?: {
    __typename?: 'Booking';
    id: string;
    status: BookingStatus;
    cancelledAt?: any | null;
  } | null;
};

export type SpotDetailHeader_SpotFragment = {
  __typename?: 'SpotDefinition';
  id: string;
  name: string;
  status: SpotDefinitionStatus;
} & { ' $fragmentName'?: 'SpotDetailHeader_SpotFragment' };

export type SpotDetailHeader_PrimaryDefFragment = {
  __typename?: 'SpotAvailabilityDefinition';
  timezone?: string | null;
  startDate?: any | null;
  frequency?: RecurrenceFrequency | null;
  interval?: number | null;
  byWeekday?: Array<Weekday> | null;
  byMonthday?: Array<number> | null;
  endsCount?: number | null;
  endsAt?: any | null;
} & { ' $fragmentName'?: 'SpotDetailHeader_PrimaryDefFragment' };

export type SpotMeta_SpotFragment = {
  __typename?: 'SpotDefinition';
  id: string;
  status: SpotDefinitionStatus;
  city: { __typename?: 'City' } & {
    ' $fragmentRefs'?: { City_BasicFragment: City_BasicFragment };
  };
} & { ' $fragmentName'?: 'SpotMeta_SpotFragment' };

export type SpotLocation_SpotFragment = {
  __typename?: 'SpotDefinition';
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
} & { ' $fragmentName'?: 'SpotLocation_SpotFragment' };

export type SpotOccurrenceItemFragment = {
  __typename?: 'SpotAvailability';
  id: string;
  date?: any | null;
  status: SpotAvailabilityStatus;
} & { ' $fragmentName'?: 'SpotOccurrenceItemFragment' };

export type SpotDetail_DefinitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type SpotDetail_DefinitionQuery = {
  __typename?: 'Query';
  spotDefinition?: {
    __typename?: 'SpotDefinition';
    id: string;
    name: string;
    description?: string | null;
    status: SpotDefinitionStatus;
    latitude?: number | null;
    longitude?: number | null;
    city: { __typename?: 'City'; id: string; name: string };
    spotAvailabilityDefinition?: {
      __typename?: 'SpotAvailabilityDefinition';
      id: string;
      timezone?: string | null;
      startDate?: any | null;
      frequency?: RecurrenceFrequency | null;
      interval?: number | null;
      byWeekday?: Array<Weekday> | null;
      byMonthday?: Array<number> | null;
      endsCount?: number | null;
      endsAt?: any | null;
      isActive?: boolean | null;
      maxCapacity?: number | null;
    } | null;
  } | null;
};

export type SpotDetail_OccurrencesQueryVariables = Exact<{
  availabilityDefinitionId: Scalars['ID']['input'];
  start: Scalars['Date']['input'];
  end: Scalars['Date']['input'];
}>;

export type SpotDetail_OccurrencesQuery = {
  __typename?: 'Query';
  occurrencesByAvailabilityDefinition?: Array<{
    __typename?: 'SpotAvailability';
    id: string;
    date?: any | null;
    status: SpotAvailabilityStatus;
  }> | null;
};

export type SpotDetail_SetPublishMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  publish: Scalars['Boolean']['input'];
}>;

export type SpotDetail_SetPublishMutation = {
  __typename?: 'Mutation';
  setSpotDefinitionPublish?: {
    __typename?: 'SpotDefinition';
    id: string;
    status: SpotDefinitionStatus;
    updatedAt?: any | null;
  } | null;
};

export type EditSpot_SpotDefinitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type EditSpot_SpotDefinitionQuery = {
  __typename?: 'Query';
  spotDefinition?:
    | ({ __typename?: 'SpotDefinition' } & {
        ' $fragmentRefs'?: {
          SellerSpot_DetailFragment: SellerSpot_DetailFragment;
        };
      })
    | null;
};

export type EditSpot_AvailabilityDefQueryVariables = Exact<{
  spotDefinitionId: Scalars['ID']['input'];
}>;

export type EditSpot_AvailabilityDefQuery = {
  __typename?: 'Query';
  availabilityDefinitionBySpotDefinition?: {
    __typename?: 'SpotAvailabilityDefinition';
    id: string;
    timezone?: string | null;
    startDate?: any | null;
    frequency?: RecurrenceFrequency | null;
    interval?: number | null;
    byWeekday?: Array<Weekday> | null;
    byMonthday?: Array<number> | null;
    endsCount?: number | null;
    endsAt?: any | null;
    isActive?: boolean | null;
    feeReference?: string | null;
    maxCapacity?: number | null;
  } | null;
};

export type EditSpot_UpsertAvailabilityDefinitionMutationVariables = Exact<{
  input: UpsertAvailabilityDefinitionInput;
}>;

export type EditSpot_UpsertAvailabilityDefinitionMutation = {
  __typename?: 'Mutation';
  upsertAvailabilityDefinition?: {
    __typename?: 'SpotAvailabilityDefinition';
    id: string;
  } | null;
};

export type Page_AvailabilityHeatmapQueryVariables = Exact<{
  bbox: BBoxInput;
  date: Scalars['String']['input'];
  resolution: Scalars['Int']['input'];
}>;

export type Page_AvailabilityHeatmapQuery = {
  __typename?: 'Query';
  availabilityHeatmap?: Array<{
    __typename?: 'H3CellFeature';
    id?: string | null;
    count?: number | null;
    geometry?: any | null;
    h3Index?: string | null;
  }> | null;
};

export type Page_BookingsHeatmapQueryVariables = Exact<{
  bbox: BBoxInput;
  dateRange: DateRangeInput;
  resolution: Scalars['Int']['input'];
}>;

export type Page_BookingsHeatmapQuery = {
  __typename?: 'Query';
  bookingsHeatmap?: Array<{
    __typename?: 'H3CellFeature';
    id?: string | null;
    count?: number | null;
    geometry?: any | null;
    h3Index?: string | null;
  }> | null;
};

export type Page_CollectivityNewSpot_CitiesQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type Page_CollectivityNewSpot_CitiesQuery = {
  __typename?: 'Query';
  cities?: Array<
    { __typename?: 'City' } & {
      ' $fragmentRefs'?: { City_BasicFragment: City_BasicFragment };
    }
  > | null;
};

export type NewSpot_ConflictsQueryVariables = Exact<{
  cityId?: InputMaybe<Scalars['ID']['input']>;
  date: Scalars['Date']['input'];
}>;

export type NewSpot_ConflictsQuery = {
  __typename?: 'Query';
  availabilitiesByCityDate?: Array<{
    __typename?: 'SpotAvailability';
    id: string;
    spotDefinition: { __typename?: 'SpotDefinition'; id: string; name: string };
  }> | null;
};

export type NewSpot_UpsertSpotDefinitionMutationVariables = Exact<{
  input: UpsertSpotDefinitionInput;
}>;

export type NewSpot_UpsertSpotDefinitionMutation = {
  __typename?: 'Mutation';
  upsertSpotDefinition?: {
    __typename?: 'SpotDefinition';
    id: string;
    name: string;
    city: { __typename?: 'City'; id: string };
  } | null;
};

export type NewSpot_UpsertAvailabilityDefinitionMutationVariables = Exact<{
  input: UpsertAvailabilityDefinitionInput;
}>;

export type NewSpot_UpsertAvailabilityDefinitionMutation = {
  __typename?: 'Mutation';
  upsertAvailabilityDefinition?: {
    __typename?: 'SpotAvailabilityDefinition';
    id: string;
  } | null;
};

export type NewSpot_CreateSpotWithAvailabilityMutationVariables = Exact<{
  input: CreateSpotWithAvailabilityInput;
}>;

export type NewSpot_CreateSpotWithAvailabilityMutation = {
  __typename?: 'Mutation';
  createSpotWithAvailability?: {
    __typename?: 'SpotDefinition';
    id: string;
  } | null;
};

export type AvailabilityHeatmapQueryVariables = Exact<{
  bbox: BBoxInput;
  date: Scalars['String']['input'];
  resolution: Scalars['Int']['input'];
}>;

export type AvailabilityHeatmapQuery = {
  __typename?: 'Query';
  availabilityHeatmap?: Array<{
    __typename?: 'H3CellFeature';
    id?: string | null;
    h3Index?: string | null;
    count?: number | null;
    geometry?: any | null;
  }> | null;
};

export type BookingsHeatmapQueryVariables = Exact<{
  bbox: BBoxInput;
  dateRange: DateRangeInput;
  resolution: Scalars['Int']['input'];
}>;

export type BookingsHeatmapQuery = {
  __typename?: 'Query';
  bookingsHeatmap?: Array<{
    __typename?: 'H3CellFeature';
    id?: string | null;
    h3Index?: string | null;
    count?: number | null;
    geometry?: any | null;
  }> | null;
};

export type WholesaleProductsQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type WholesaleProductsQuery = {
  __typename?: 'Query';
  wholesaleProducts?: Array<{
    __typename?: 'WholesaleProduct';
    id: string;
    name?: string | null;
    sku?: string | null;
    description?: string | null;
    packSize?: string | null;
    unitPrice?: number | null;
    stockQuantity?: number | null;
    category?: string | null;
    subcategory?: string | null;
    isActive?: boolean | null;
  }> | null;
};

export type MyWholesaleOrdersQueryVariables = Exact<{ [key: string]: never }>;

export type MyWholesaleOrdersQuery = {
  __typename?: 'Query';
  myWholesaleOrders?: Array<{
    __typename?: 'WholesaleOrder';
    id: string;
    sellerId?: string | null;
    totalAmount?: number | null;
    currency?: string | null;
    status?: string | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    items?: Array<{
      __typename?: 'WholesaleOrderItem';
      id: string;
      productId?: string | null;
      quantity?: number | null;
      unitPrice?: number | null;
      totalPrice?: number | null;
    }> | null;
  }> | null;
};

export type CitiesQueryVariables = Exact<{
  input: SearchCitiesInput;
}>;

export type CitiesQuery = {
  __typename?: 'Query';
  cities?: Array<{
    __typename?: 'City';
    id: string;
    name: string;
    code?: string | null;
    countryId?: string | null;
  }> | null;
};

export type AvailabilitiesByCityDateQueryVariables = Exact<{
  date: Scalars['Date']['input'];
  cityId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type AvailabilitiesByCityDateQuery = {
  __typename?: 'Query';
  availabilitiesByCityDate?: Array<{
    __typename?: 'SpotAvailability';
    id: string;
    date?: any | null;
    status: SpotAvailabilityStatus;
    spotAvailabilityDefinition: {
      __typename?: 'SpotAvailabilityDefinition';
      spotDefinition: {
        __typename?: 'SpotDefinition';
        id: string;
        name: string;
        latitude?: number | null;
        longitude?: number | null;
        status: SpotDefinitionStatus;
        city: { __typename?: 'City'; id: string; name: string };
      };
    };
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
export const CityOverviewFragmentDoc = new TypedDocumentString(
  `
    fragment CityOverview on City {
  id
  name
}
    `,
  { fragmentName: 'CityOverview' }
) as unknown as TypedDocumentString<CityOverviewFragment, unknown>;
export const City_BasicFragmentDoc = new TypedDocumentString(
  `
    fragment City_Basic on City {
  id
  name
  code
}
    `,
  { fragmentName: 'City_Basic' }
) as unknown as TypedDocumentString<City_BasicFragment, unknown>;
export const SellerSpot_DetailFragmentDoc = new TypedDocumentString(
  `
    fragment SellerSpot_Detail on SpotDefinition {
  id
  name
  description
  status
  city {
    id
    ...City_Basic
  }
}
    fragment City_Basic on City {
  id
  name
  code
}`,
  { fragmentName: 'SellerSpot_Detail' }
) as unknown as TypedDocumentString<SellerSpot_DetailFragment, unknown>;
export const Country_BasicFragmentDoc = new TypedDocumentString(
  `
    fragment Country_Basic on PublicCountry {
  id
  name
  code
}
    `,
  { fragmentName: 'Country_Basic' }
) as unknown as TypedDocumentString<Country_BasicFragment, unknown>;
export const Address_BasicFragmentDoc = new TypedDocumentString(
  `
    fragment Address_Basic on PublicAddress {
  id
  addressLine1
  addressLine2
  postalCode
}
    `,
  { fragmentName: 'Address_Basic' }
) as unknown as TypedDocumentString<Address_BasicFragment, unknown>;
export const SpotDefinition_BasicFragmentDoc = new TypedDocumentString(
  `
    fragment SpotDefinition_Basic on SpotDefinition {
  id
  name
  description
  status
  latitude
  longitude
  updatedAt
  city {
    ...City_Basic
  }
}
    fragment City_Basic on City {
  id
  name
  code
}`,
  { fragmentName: 'SpotDefinition_Basic' }
) as unknown as TypedDocumentString<SpotDefinition_BasicFragment, unknown>;
export const SpotAvailability_ListItemFragmentDoc = new TypedDocumentString(
  `
    fragment SpotAvailability_ListItem on SpotAvailability {
  id
  date
  status
  spotDefinition {
    id
    ...SpotDefinition_Basic
  }
}
    fragment City_Basic on City {
  id
  name
  code
}
fragment SpotDefinition_Basic on SpotDefinition {
  id
  name
  description
  status
  latitude
  longitude
  updatedAt
  city {
    ...City_Basic
  }
}`,
  { fragmentName: 'SpotAvailability_ListItem' }
) as unknown as TypedDocumentString<SpotAvailability_ListItemFragment, unknown>;
export const Booking_ListItemFragmentDoc = new TypedDocumentString(
  `
    fragment Booking_ListItem on Booking {
  id
  status
  bookedAt
  complianceBadgeAtBooking
}
    `,
  { fragmentName: 'Booking_ListItem' }
) as unknown as TypedDocumentString<Booking_ListItemFragment, unknown>;
export const SpotDetailHeader_SpotFragmentDoc = new TypedDocumentString(
  `
    fragment SpotDetailHeader_Spot on SpotDefinition {
  id
  name
  status
}
    `,
  { fragmentName: 'SpotDetailHeader_Spot' }
) as unknown as TypedDocumentString<SpotDetailHeader_SpotFragment, unknown>;
export const SpotDetailHeader_PrimaryDefFragmentDoc = new TypedDocumentString(
  `
    fragment SpotDetailHeader_PrimaryDef on SpotAvailabilityDefinition {
  timezone
  startDate
  frequency
  interval
  byWeekday
  byMonthday
  endsCount
  endsAt
}
    `,
  { fragmentName: 'SpotDetailHeader_PrimaryDef' }
) as unknown as TypedDocumentString<
  SpotDetailHeader_PrimaryDefFragment,
  unknown
>;
export const SpotMeta_SpotFragmentDoc = new TypedDocumentString(
  `
    fragment SpotMeta_Spot on SpotDefinition {
  id
  status
  city {
    ...City_Basic
  }
}
    fragment City_Basic on City {
  id
  name
  code
}`,
  { fragmentName: 'SpotMeta_Spot' }
) as unknown as TypedDocumentString<SpotMeta_SpotFragment, unknown>;
export const SpotLocation_SpotFragmentDoc = new TypedDocumentString(
  `
    fragment SpotLocation_Spot on SpotDefinition {
  id
  name
  latitude
  longitude
}
    `,
  { fragmentName: 'SpotLocation_Spot' }
) as unknown as TypedDocumentString<SpotLocation_SpotFragment, unknown>;
export const SpotOccurrenceItemFragmentDoc = new TypedDocumentString(
  `
    fragment SpotOccurrenceItem on SpotAvailability {
  id
  date
  status
}
    `,
  { fragmentName: 'SpotOccurrenceItem' }
) as unknown as TypedDocumentString<SpotOccurrenceItemFragment, unknown>;
export const Page_CollectivityDashboardMetricsQueryDocument =
  new TypedDocumentString(`
    query page_CollectivityDashboardMetricsQuery {
  collectivityMetricsSnapshot {
    label
    value
  }
}
    `) as unknown as TypedDocumentString<
    Page_CollectivityDashboardMetricsQueryQuery,
    Page_CollectivityDashboardMetricsQueryQueryVariables
  >;
export const Page_CollectivityMetricsQueryDocument = new TypedDocumentString(`
    query page_CollectivityMetricsQuery {
  collectivityMetricsSnapshot {
    label
    value
  }
}
    `) as unknown as TypedDocumentString<
  Page_CollectivityMetricsQueryQuery,
  Page_CollectivityMetricsQueryQueryVariables
>;
export const Page_CollectivityOverview_CitiesDocument =
  new TypedDocumentString(`
    query page_CollectivityOverview_Cities($q: String, $limit: Int) {
  cities(input: {q: $q, limit: $limit}) {
    id
    name
    code
  }
}
    `) as unknown as TypedDocumentString<
    Page_CollectivityOverview_CitiesQuery,
    Page_CollectivityOverview_CitiesQueryVariables
  >;
export const Page_CollectivityOverview_AvailabilitiesDocument =
  new TypedDocumentString(`
    query page_CollectivityOverview_Availabilities($date: Date!, $cityId: ID) {
  availabilitiesByCityDate(input: {date: $date, cityId: $cityId}) {
    ...SpotAvailability_ListItem
  }
}
    fragment City_Basic on City {
  id
  name
  code
}
fragment SpotDefinition_Basic on SpotDefinition {
  id
  name
  description
  status
  latitude
  longitude
  updatedAt
  city {
    ...City_Basic
  }
}
fragment SpotAvailability_ListItem on SpotAvailability {
  id
  date
  status
  spotDefinition {
    id
    ...SpotDefinition_Basic
  }
}`) as unknown as TypedDocumentString<
    Page_CollectivityOverview_AvailabilitiesQuery,
    Page_CollectivityOverview_AvailabilitiesQueryVariables
  >;
export const CollectivityPrivacy_MyGdprRequestsQueryDocument =
  new TypedDocumentString(`
    query CollectivityPrivacy_MyGdprRequestsQuery {
  myGdprRequests {
    id
    type
    status
    createdAt
    metadata
  }
}
    `) as unknown as TypedDocumentString<
    CollectivityPrivacy_MyGdprRequestsQueryQuery,
    CollectivityPrivacy_MyGdprRequestsQueryQueryVariables
  >;
export const CollectivityPrivacy_RequestDataExportMutationDocument =
  new TypedDocumentString(`
    mutation CollectivityPrivacy_RequestDataExportMutation {
  requestDataExport {
    id
    type
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    CollectivityPrivacy_RequestDataExportMutationMutation,
    CollectivityPrivacy_RequestDataExportMutationMutationVariables
  >;
export const CollectivityPrivacy_RequestAccountDeletionMutationDocument =
  new TypedDocumentString(`
    mutation CollectivityPrivacy_RequestAccountDeletionMutation($input: RequestAccountDeletionInput!) {
  requestAccountDeletion(input: $input) {
    id
    type
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    CollectivityPrivacy_RequestAccountDeletionMutationMutation,
    CollectivityPrivacy_RequestAccountDeletionMutationMutationVariables
  >;
export const Page_CollectivitySpotDefinitionDocument = new TypedDocumentString(`
    query page_CollectivitySpotDefinition($id: ID!) {
  spotDefinition(input: {id: $id}) {
    id
    name
    status
    description
    city {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<
  Page_CollectivitySpotDefinitionQuery,
  Page_CollectivitySpotDefinitionQueryVariables
>;
export const Page_CollectivityCitiesQueryDocument = new TypedDocumentString(`
    query page_CollectivityCitiesQuery($q: String, $limit: Int) {
  cities(input: {q: $q, limit: $limit}) {
    id
    name
    code
  }
}
    `) as unknown as TypedDocumentString<
  Page_CollectivityCitiesQueryQuery,
  Page_CollectivityCitiesQueryQueryVariables
>;
export const Page_CollectivitySpots_AvailabilitiesDocument =
  new TypedDocumentString(`
    query page_CollectivitySpots_Availabilities($date: Date!, $cityId: ID) {
  availabilitiesByCityDate(input: {date: $date, cityId: $cityId}) {
    ...SpotAvailability_ListItem
  }
}
    fragment City_Basic on City {
  id
  name
  code
}
fragment SpotDefinition_Basic on SpotDefinition {
  id
  name
  description
  status
  latitude
  longitude
  updatedAt
  city {
    ...City_Basic
  }
}
fragment SpotAvailability_ListItem on SpotAvailability {
  id
  date
  status
  spotDefinition {
    id
    ...SpotDefinition_Basic
  }
}`) as unknown as TypedDocumentString<
    Page_CollectivitySpots_AvailabilitiesQuery,
    Page_CollectivitySpots_AvailabilitiesQueryVariables
  >;
export const Page_CollectivitySpotDefinitionsDocument =
  new TypedDocumentString(`
    query page_CollectivitySpotDefinitions($q: String, $cityId: ID, $limit: Int) {
  spotDefinitions(input: {q: $q, cityId: $cityId, limit: $limit}) {
    ...SpotDefinition_Basic
    spotAvailabilityDefinition {
      id
      timezone
      startDate
      frequency
      interval
      byWeekday
      byMonthday
      endsCount
      endsAt
      isActive
      feeReference
      maxCapacity
    }
  }
}
    fragment City_Basic on City {
  id
  name
  code
}
fragment SpotDefinition_Basic on SpotDefinition {
  id
  name
  description
  status
  latitude
  longitude
  updatedAt
  city {
    ...City_Basic
  }
}`) as unknown as TypedDocumentString<
    Page_CollectivitySpotDefinitionsQuery,
    Page_CollectivitySpotDefinitionsQueryVariables
  >;
export const Page_CollectivitySetSpotDefinitionPublishDocument =
  new TypedDocumentString(`
    mutation page_CollectivitySetSpotDefinitionPublish($id: ID!, $publish: Boolean!) {
  setSpotDefinitionPublish(input: {id: $id, publish: $publish}) {
    id
    status
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
    Page_CollectivitySetSpotDefinitionPublishMutation,
    Page_CollectivitySetSpotDefinitionPublishMutationVariables
  >;
export const Page_PlatformAdminBookingsQueryDocument = new TypedDocumentString(`
    query page_PlatformAdminBookingsQuery($first: Int, $after: String) {
  adminBookings(first: $first, after: $after) {
    edges {
      node {
        id
        status
        bookedAt
        spotAvailability {
          date
        }
        spotDefinition {
          name
          latitude
          longitude
          city {
            name
          }
        }
        seller {
          name
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `) as unknown as TypedDocumentString<
  Page_PlatformAdminBookingsQueryQuery,
  Page_PlatformAdminBookingsQueryQueryVariables
>;
export const Page_AdminCollectivityDetailsDocument = new TypedDocumentString(`
    query Page_AdminCollectivityDetails($id: ID!) {
  adminCollectivity(input: {id: $id}) {
    id
    name
    siret
  }
}
    `) as unknown as TypedDocumentString<
  Page_AdminCollectivityDetailsQuery,
  Page_AdminCollectivityDetailsQueryVariables
>;
export const Page_AdminInviteDocument = new TypedDocumentString(`
    mutation Page_AdminInvite($input: AdminInviteInput!) {
  adminInviteToCollectivity(input: $input)
}
    `) as unknown as TypedDocumentString<
  Page_AdminInviteMutation,
  Page_AdminInviteMutationVariables
>;
export const Page_AdminAppendNoteDocument = new TypedDocumentString(`
    mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {
  adminAppendCollectivityNote(input: $input)
}
    `) as unknown as TypedDocumentString<
  Page_AdminAppendNoteMutation,
  Page_AdminAppendNoteMutationVariables
>;
export const Page_AdminCollectivitiesDocument = new TypedDocumentString(`
    query Page_AdminCollectivities {
  adminCollectivities {
    id
    name
    siret
  }
}
    `) as unknown as TypedDocumentString<
  Page_AdminCollectivitiesQuery,
  Page_AdminCollectivitiesQueryVariables
>;
export const Page_AdminCreateOrgDocument = new TypedDocumentString(`
    mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {
  adminCreateOrganization(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  Page_AdminCreateOrgMutation,
  Page_AdminCreateOrgMutationVariables
>;
export const AdminContentListQueryDocument = new TypedDocumentString(`
    query AdminContentListQuery {
  adminContentList {
    id
    isPublished
    locales {
      locale
      slug
      title
      summary
    }
  }
}
    `) as unknown as TypedDocumentString<
  AdminContentListQueryQuery,
  AdminContentListQueryQueryVariables
>;
export const AdminUpsertContentMutationDocument = new TypedDocumentString(`
    mutation AdminUpsertContentMutation($input: AdminUpsertContentInput!) {
  adminUpsertContent(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  AdminUpsertContentMutationMutation,
  AdminUpsertContentMutationMutationVariables
>;
export const AdminTranslateContentMutationDocument = new TypedDocumentString(`
    mutation AdminTranslateContentMutation($input: AdminTranslateContentInput!) {
  adminTranslateContent(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  AdminTranslateContentMutationMutation,
  AdminTranslateContentMutationMutationVariables
>;
export const Page_PlatformAdminDashboardMetricsQueryDocument =
  new TypedDocumentString(`
    query page_PlatformAdminDashboardMetricsQuery {
  collectivityMetricsSnapshot {
    label
    value
  }
}
    `) as unknown as TypedDocumentString<
    Page_PlatformAdminDashboardMetricsQueryQuery,
    Page_PlatformAdminDashboardMetricsQueryQueryVariables
  >;
export const Page_PlatformAdminUsersQueryDocument = new TypedDocumentString(`
    query page_PlatformAdminUsersQuery($page: Int, $limit: Int) {
  adminUsersWithCompliance(page: $page, limit: $limit) {
    items {
      id
      firstName
      lastName
      email
      uploadedDocCount
      lastUploadAt
      complianceBadge
    }
    totalItems
    totalPages
  }
}
    `) as unknown as TypedDocumentString<
  Page_PlatformAdminUsersQueryQuery,
  Page_PlatformAdminUsersQueryQueryVariables
>;
export const Page_PlatformAdminMetricsQueryDocument = new TypedDocumentString(`
    query page_PlatformAdminMetricsQuery {
  collectivityMetricsSnapshot {
    label
    value
  }
}
    `) as unknown as TypedDocumentString<
  Page_PlatformAdminMetricsQueryQuery,
  Page_PlatformAdminMetricsQueryQueryVariables
>;
export const Page_PlatformAdminOrdersQueryDocument = new TypedDocumentString(`
    query page_PlatformAdminOrdersQuery($first: Int, $after: String) {
  adminWholesaleOrders(first: $first, after: $after) {
    edges {
      node {
        id
        createdAt
        totalAmount
        currency
        status
        sellerId
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `) as unknown as TypedDocumentString<
  Page_PlatformAdminOrdersQueryQuery,
  Page_PlatformAdminOrdersQueryQueryVariables
>;
export const Page_AdminSellersDocument = new TypedDocumentString(`
    query Page_AdminSellers {
  adminSellers {
    id
    name
    siret
    createdAt
    complianceBadge
  }
}
    `) as unknown as TypedDocumentString<
  Page_AdminSellersQuery,
  Page_AdminSellersQueryVariables
>;
export const Page_Admin_CitiesQueryDocument = new TypedDocumentString(`
    query page_Admin_CitiesQuery($q: String, $limit: Int) {
  cities(input: {q: $q, limit: $limit}) {
    id
    name
    code
  }
}
    `) as unknown as TypedDocumentString<
  Page_Admin_CitiesQueryQuery,
  Page_Admin_CitiesQueryQueryVariables
>;
export const Page_Admin_AvailabilitiesByCityDateQueryDocument =
  new TypedDocumentString(`
    query page_Admin_AvailabilitiesByCityDateQuery($date: Date!, $cityId: ID) {
  availabilitiesByCityDate(input: {date: $date, cityId: $cityId}) {
    id
    date
    status
    spotAvailabilityDefinition {
      spotDefinition {
        id
        name
        city {
          id
          name
        }
        latitude
        longitude
        status
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
    Page_Admin_AvailabilitiesByCityDateQueryQuery,
    Page_Admin_AvailabilitiesByCityDateQueryQueryVariables
  >;
export const Page_AdminSetSpotDefinitionPublishDocument =
  new TypedDocumentString(`
    mutation page_AdminSetSpotDefinitionPublish($id: ID!, $publish: Boolean!) {
  setSpotDefinitionPublish(input: {id: $id, publish: $publish}) {
    id
    status
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
    Page_AdminSetSpotDefinitionPublishMutation,
    Page_AdminSetSpotDefinitionPublishMutationVariables
  >;
export const AdminUserDetailsDocument = new TypedDocumentString(`
    query AdminUserDetails($userId: ID!) {
  adminUserDetails(userId: $userId) {
    id
    email
    name
    phoneNumber
    createdAt
    updatedAt
    lastLoginAt
    status
    emailVerified
    phoneVerified
    profile {
      firstName
      lastName
      dateOfBirth
      address {
        street
        city
        postalCode
        country
      }
      profession
      companyName
      siret
    }
    kyc {
      status
      level
      verifiedAt
      reviewedBy
      reviewNotes
      documents {
        id
        documentType
        status
        fileName
        updatedAt
      }
      riskScore
      lastReviewAt
    }
    metrics {
      totalLogins
      lastActivityAt
      documentsUploaded
      organizationsCount
      subscriptionStatus
      lifetimeValue
    }
    organizations {
      id
      name
      role
      joinedAt
    }
  }
}
    `) as unknown as TypedDocumentString<
  AdminUserDetailsQuery,
  AdminUserDetailsQueryVariables
>;
export const UpdateUserProfileDocument = new TypedDocumentString(`
    mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {
  updateUserProfile(userId: $userId, input: $input) {
    id
    name
    email
    phoneNumber
    status
  }
}
    `) as unknown as TypedDocumentString<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
>;
export const ReviewKycDocument = new TypedDocumentString(`
    mutation ReviewKYC($userId: ID!, $input: ReviewKYCInput!) {
  reviewKYC(userId: $userId, input: $input) {
    id
    status
    level
    reviewNotes
    verifiedAt
  }
}
    `) as unknown as TypedDocumentString<
  ReviewKycMutation,
  ReviewKycMutationVariables
>;
export const ReviewDocumentDocument = new TypedDocumentString(`
    mutation ReviewDocument($input: ReviewDocumentInput!) {
  reviewDocument(input: $input) {
    id
    status
    verifiedAt
    reviewNotes
  }
}
    `) as unknown as TypedDocumentString<
  ReviewDocumentMutation,
  ReviewDocumentMutationVariables
>;
export const Page_AdminCreateUserDocument = new TypedDocumentString(`
    mutation Page_AdminCreateUser($input: AdminCreateUserInput!) {
  adminCreateUser(input: $input)
}
    `) as unknown as TypedDocumentString<
  Page_AdminCreateUserMutation,
  Page_AdminCreateUserMutationVariables
>;
export const Page_PlatformAdminWaitingListQueryDocument =
  new TypedDocumentString(`
    query page_PlatformAdminWaitingListQuery {
  adminWaitingList {
    items {
      id
      email
      createdAt
      firstName
      lastName
    }
  }
}
    `) as unknown as TypedDocumentString<
    Page_PlatformAdminWaitingListQueryQuery,
    Page_PlatformAdminWaitingListQueryQueryVariables
  >;
export const AdminAllowWaitlistDocument = new TypedDocumentString(`
    mutation AdminAllowWaitlist($input: AdminAllowWaitlistInput!) {
  adminAllowWaitlistEntry(input: $input)
}
    `) as unknown as TypedDocumentString<
  AdminAllowWaitlistMutation,
  AdminAllowWaitlistMutationVariables
>;
export const Dashboard_SellerComplianceQueryDocument = new TypedDocumentString(`
    query Dashboard_SellerComplianceQuery {
  sellerCompliance {
    sellerId
    badge
    missingCore
    expiring
    uploadedCount
    hasVerifiedKBIS
    hasVerifiedUser
  }
}
    `) as unknown as TypedDocumentString<
  Dashboard_SellerComplianceQueryQuery,
  Dashboard_SellerComplianceQueryQueryVariables
>;
export const Page_SellerDocsQueryDocument = new TypedDocumentString(`
    query page_SellerDocsQuery {
  myDocuments {
    id
    documentType
    status
    expiryDate
  }
}
    `) as unknown as TypedDocumentString<
  Page_SellerDocsQueryQuery,
  Page_SellerDocsQueryQueryVariables
>;
export const Page_UploadDocMutationDocument = new TypedDocumentString(`
    mutation page_UploadDocMutation($input: UploadDocumentInput!) {
  uploadDocument(input: $input) {
    id
    status
  }
}
    `) as unknown as TypedDocumentString<
  Page_UploadDocMutationMutation,
  Page_UploadDocMutationMutationVariables
>;
export const Profile_UserKycStatusQueryDocument = new TypedDocumentString(`
    query Profile_UserKycStatusQuery {
  userKycStatus {
    phoneVerified
    hasVerifiedIdDocument
    isVerified
  }
}
    `) as unknown as TypedDocumentString<
  Profile_UserKycStatusQueryQuery,
  Profile_UserKycStatusQueryQueryVariables
>;
export const SellerPrivacy_MyGdprRequestsQueryDocument =
  new TypedDocumentString(`
    query SellerPrivacy_MyGdprRequestsQuery {
  myGdprRequests {
    id
    type
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    SellerPrivacy_MyGdprRequestsQueryQuery,
    SellerPrivacy_MyGdprRequestsQueryQueryVariables
  >;
export const SellerPrivacy_RequestDataExportMutationDocument =
  new TypedDocumentString(`
    mutation SellerPrivacy_RequestDataExportMutation {
  requestDataExport {
    id
    type
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    SellerPrivacy_RequestDataExportMutationMutation,
    SellerPrivacy_RequestDataExportMutationMutationVariables
  >;
export const SellerPrivacy_RequestAccountDeletionMutationDocument =
  new TypedDocumentString(`
    mutation SellerPrivacy_RequestAccountDeletionMutation($input: RequestAccountDeletionInput!) {
  requestAccountDeletion(input: $input) {
    id
    type
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    SellerPrivacy_RequestAccountDeletionMutationMutation,
    SellerPrivacy_RequestAccountDeletionMutationMutationVariables
  >;
export const Page_SellerSpotDetailDocument = new TypedDocumentString(`
    query page_SellerSpotDetail($id: ID!) {
  spotDefinition(input: {id: $id}) {
    ...SellerSpot_Detail
  }
}
    fragment SellerSpot_Detail on SpotDefinition {
  id
  name
  description
  status
  city {
    id
    ...City_Basic
  }
}
fragment City_Basic on City {
  id
  name
  code
}`) as unknown as TypedDocumentString<
  Page_SellerSpotDetailQuery,
  Page_SellerSpotDetailQueryVariables
>;
export const Page_SellerBookSpotDocument = new TypedDocumentString(`
    mutation page_SellerBookSpot($availabilityId: ID!) {
  bookAvailability(input: {availabilityId: $availabilityId}) {
    id
    status
    bookedAt
  }
}
    `) as unknown as TypedDocumentString<
  Page_SellerBookSpotMutation,
  Page_SellerBookSpotMutationVariables
>;
export const Page_SellerAvailabilitiesQueryDocument = new TypedDocumentString(`
    query page_SellerAvailabilitiesQuery($date: Date!, $q: String) {
  availabilitiesByCityDate(input: {date: $date}) {
    id
    date
    status
    spotAvailabilityDefinition {
      spotDefinition {
        id
        name
        latitude
        longitude
        city {
          name
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  Page_SellerAvailabilitiesQueryQuery,
  Page_SellerAvailabilitiesQueryQueryVariables
>;
export const Page_SellerAvailabilities_BookDocument = new TypedDocumentString(`
    mutation page_SellerAvailabilities_Book($availabilityId: ID!) {
  bookAvailability(input: {availabilityId: $availabilityId}) {
    id
    status
  }
}
    `) as unknown as TypedDocumentString<
  Page_SellerAvailabilities_BookMutation,
  Page_SellerAvailabilities_BookMutationVariables
>;
export const Page_WholesaleCheckoutMutationDocument = new TypedDocumentString(`
    mutation page_WholesaleCheckoutMutation($input: WholesaleCheckoutInput!) {
  wholesaleCheckout(input: $input) {
    id
    status
    totalAmount
    currency
  }
}
    `) as unknown as TypedDocumentString<
  Page_WholesaleCheckoutMutationMutation,
  Page_WholesaleCheckoutMutationMutationVariables
>;
export const Page_StritMeForOnboardingManagerDocument =
  new TypedDocumentString(`
    query page_StritMeForOnboardingManager {
  me {
    id
    onboardingCompleted
    onboardingStep
    metadata
  }
  myOrganizations {
    id
    name
    type
    onboardingCompleted
    onboardingStep
  }
}
    `) as unknown as TypedDocumentString<
    Page_StritMeForOnboardingManagerQuery,
    Page_StritMeForOnboardingManagerQueryVariables
  >;
export const Auth_UnlinkDocument = new TypedDocumentString(`
    mutation Auth_Unlink($providerId: String!) {
  unlinkProvider(providerId: $providerId)
}
    `) as unknown as TypedDocumentString<
  Auth_UnlinkMutation,
  Auth_UnlinkMutationVariables
>;
export const Auth_ConnectionStatusDocument = new TypedDocumentString(`
    query Auth_ConnectionStatus {
  connectionStatus {
    linkedProviders
  }
}
    `) as unknown as TypedDocumentString<
  Auth_ConnectionStatusQuery,
  Auth_ConnectionStatusQueryVariables
>;
export const Page_SellerBookingsQueryDocument = new TypedDocumentString(`
    query page_SellerBookingsQuery {
  myBookings {
    id
    status
    bookedAt
    spotAvailability {
      date
      spotAvailabilityDefinition {
        feeReference
        maxCapacity
      }
    }
    spotDefinition {
      name
      latitude
      longitude
      city {
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  Page_SellerBookingsQueryQuery,
  Page_SellerBookingsQueryQueryVariables
>;
export const Page_SellerBookings_CancelDocument = new TypedDocumentString(`
    mutation page_SellerBookings_Cancel($id: ID!) {
  cancelBooking(input: {id: $id}) {
    id
    status
    cancelledAt
  }
}
    `) as unknown as TypedDocumentString<
  Page_SellerBookings_CancelMutation,
  Page_SellerBookings_CancelMutationVariables
>;
export const SpotDetail_DefinitionDocument = new TypedDocumentString(`
    query SpotDetail_Definition($id: ID!) {
  spotDefinition(input: {id: $id}) {
    id
    name
    description
    status
    latitude
    longitude
    city {
      id
      name
    }
    spotAvailabilityDefinition {
      id
      timezone
      startDate
      frequency
      interval
      byWeekday
      byMonthday
      endsCount
      endsAt
      isActive
      maxCapacity
    }
  }
}
    `) as unknown as TypedDocumentString<
  SpotDetail_DefinitionQuery,
  SpotDetail_DefinitionQueryVariables
>;
export const SpotDetail_OccurrencesDocument = new TypedDocumentString(`
    query SpotDetail_Occurrences($availabilityDefinitionId: ID!, $start: Date!, $end: Date!) {
  occurrencesByAvailabilityDefinition(
    input: {availabilityDefinitionId: $availabilityDefinitionId, start: $start, end: $end}
  ) {
    id
    date
    status
  }
}
    `) as unknown as TypedDocumentString<
  SpotDetail_OccurrencesQuery,
  SpotDetail_OccurrencesQueryVariables
>;
export const SpotDetail_SetPublishDocument = new TypedDocumentString(`
    mutation SpotDetail_SetPublish($id: ID!, $publish: Boolean!) {
  setSpotDefinitionPublish(input: {id: $id, publish: $publish}) {
    id
    status
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
  SpotDetail_SetPublishMutation,
  SpotDetail_SetPublishMutationVariables
>;
export const EditSpot_SpotDefinitionDocument = new TypedDocumentString(`
    query EditSpot_SpotDefinition($id: ID!) {
  spotDefinition(input: {id: $id}) {
    ...SellerSpot_Detail
  }
}
    fragment SellerSpot_Detail on SpotDefinition {
  id
  name
  description
  status
  city {
    id
    ...City_Basic
  }
}
fragment City_Basic on City {
  id
  name
  code
}`) as unknown as TypedDocumentString<
  EditSpot_SpotDefinitionQuery,
  EditSpot_SpotDefinitionQueryVariables
>;
export const EditSpot_AvailabilityDefDocument = new TypedDocumentString(`
    query EditSpot_AvailabilityDef($spotDefinitionId: ID!) {
  availabilityDefinitionBySpotDefinition(
    input: {spotDefinitionId: $spotDefinitionId}
  ) {
    id
    timezone
    startDate
    frequency
    interval
    byWeekday
    byMonthday
    endsCount
    endsAt
    isActive
    feeReference
    maxCapacity
  }
}
    `) as unknown as TypedDocumentString<
  EditSpot_AvailabilityDefQuery,
  EditSpot_AvailabilityDefQueryVariables
>;
export const EditSpot_UpsertAvailabilityDefinitionDocument =
  new TypedDocumentString(`
    mutation EditSpot_UpsertAvailabilityDefinition($input: UpsertAvailabilityDefinitionInput!) {
  upsertAvailabilityDefinition(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
    EditSpot_UpsertAvailabilityDefinitionMutation,
    EditSpot_UpsertAvailabilityDefinitionMutationVariables
  >;
export const Page_AvailabilityHeatmapDocument = new TypedDocumentString(`
    query page_AvailabilityHeatmap($bbox: BBoxInput!, $date: String!, $resolution: Int!) {
  availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {
    id
    count
    geometry
    h3Index
  }
}
    `) as unknown as TypedDocumentString<
  Page_AvailabilityHeatmapQuery,
  Page_AvailabilityHeatmapQueryVariables
>;
export const Page_BookingsHeatmapDocument = new TypedDocumentString(`
    query page_BookingsHeatmap($bbox: BBoxInput!, $dateRange: DateRangeInput!, $resolution: Int!) {
  bookingsHeatmap(bbox: $bbox, dateRange: $dateRange, resolution: $resolution) {
    id
    count
    geometry
    h3Index
  }
}
    `) as unknown as TypedDocumentString<
  Page_BookingsHeatmapQuery,
  Page_BookingsHeatmapQueryVariables
>;
export const Page_CollectivityNewSpot_CitiesDocument = new TypedDocumentString(`
    query page_CollectivityNewSpot_Cities($q: String, $limit: Int) {
  cities(input: {q: $q, limit: $limit}) {
    ...City_Basic
  }
}
    fragment City_Basic on City {
  id
  name
  code
}`) as unknown as TypedDocumentString<
  Page_CollectivityNewSpot_CitiesQuery,
  Page_CollectivityNewSpot_CitiesQueryVariables
>;
export const NewSpot_ConflictsDocument = new TypedDocumentString(`
    query NewSpot_Conflicts($cityId: ID, $date: Date!) {
  availabilitiesByCityDate(input: {cityId: $cityId, date: $date}) {
    id
    spotDefinition {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<
  NewSpot_ConflictsQuery,
  NewSpot_ConflictsQueryVariables
>;
export const NewSpot_UpsertSpotDefinitionDocument = new TypedDocumentString(`
    mutation NewSpot_UpsertSpotDefinition($input: UpsertSpotDefinitionInput!) {
  upsertSpotDefinition(input: $input) {
    id
    name
    city {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<
  NewSpot_UpsertSpotDefinitionMutation,
  NewSpot_UpsertSpotDefinitionMutationVariables
>;
export const NewSpot_UpsertAvailabilityDefinitionDocument =
  new TypedDocumentString(`
    mutation NewSpot_UpsertAvailabilityDefinition($input: UpsertAvailabilityDefinitionInput!) {
  upsertAvailabilityDefinition(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
    NewSpot_UpsertAvailabilityDefinitionMutation,
    NewSpot_UpsertAvailabilityDefinitionMutationVariables
  >;
export const NewSpot_CreateSpotWithAvailabilityDocument =
  new TypedDocumentString(`
    mutation NewSpot_CreateSpotWithAvailability($input: CreateSpotWithAvailabilityInput!) {
  createSpotWithAvailability(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
    NewSpot_CreateSpotWithAvailabilityMutation,
    NewSpot_CreateSpotWithAvailabilityMutationVariables
  >;
export const AvailabilityHeatmapDocument = new TypedDocumentString(`
    query AvailabilityHeatmap($bbox: BBoxInput!, $date: String!, $resolution: Int!) {
  availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {
    id
    h3Index
    count
    geometry
  }
}
    `) as unknown as TypedDocumentString<
  AvailabilityHeatmapQuery,
  AvailabilityHeatmapQueryVariables
>;
export const BookingsHeatmapDocument = new TypedDocumentString(`
    query BookingsHeatmap($bbox: BBoxInput!, $dateRange: DateRangeInput!, $resolution: Int!) {
  bookingsHeatmap(bbox: $bbox, dateRange: $dateRange, resolution: $resolution) {
    id
    h3Index
    count
    geometry
  }
}
    `) as unknown as TypedDocumentString<
  BookingsHeatmapQuery,
  BookingsHeatmapQueryVariables
>;
export const WholesaleProductsDocument = new TypedDocumentString(`
    query WholesaleProducts($category: String, $activeOnly: Boolean) {
  wholesaleProducts(category: $category, activeOnly: $activeOnly) {
    id
    name
    sku
    description
    packSize
    unitPrice
    stockQuantity
    category
    subcategory
    isActive
  }
}
    `) as unknown as TypedDocumentString<
  WholesaleProductsQuery,
  WholesaleProductsQueryVariables
>;
export const MyWholesaleOrdersDocument = new TypedDocumentString(`
    query MyWholesaleOrders {
  myWholesaleOrders {
    id
    sellerId
    totalAmount
    currency
    status
    createdAt
    updatedAt
    items {
      id
      productId
      quantity
      unitPrice
      totalPrice
    }
  }
}
    `) as unknown as TypedDocumentString<
  MyWholesaleOrdersQuery,
  MyWholesaleOrdersQueryVariables
>;
export const CitiesDocument = new TypedDocumentString(`
    query Cities($input: SearchCitiesInput!) {
  cities(input: $input) {
    id
    name
    code
    countryId
  }
}
    `) as unknown as TypedDocumentString<CitiesQuery, CitiesQueryVariables>;
export const AvailabilitiesByCityDateDocument = new TypedDocumentString(`
    query AvailabilitiesByCityDate($date: Date!, $cityId: ID, $limit: Int) {
  availabilitiesByCityDate(input: {date: $date, cityId: $cityId, limit: $limit}) {
    id
    date
    status
    spotAvailabilityDefinition {
      spotDefinition {
        id
        name
        latitude
        longitude
        city {
          id
          name
        }
        status
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  AvailabilitiesByCityDateQuery,
  AvailabilitiesByCityDateQueryVariables
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
