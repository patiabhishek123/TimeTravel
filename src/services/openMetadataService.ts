import axios from 'axios';

// Environment variables for OpenMetadata connection
const OM_API_URL = process.env.OPENMETADATA_API_URL || 'http://localhost:8585/api/v1';
const OM_JWT_TOKEN = process.env.OPENMETADATA_JWT_TOKEN || 'dummy_token';

// Configure Axios client for OpenMetadata API
const apiClient = axios.create({
  baseURL: OM_API_URL,
  headers: {
    Authorization: `Bearer ${OM_JWT_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export interface OpenMetadataResponse {
  schema: any;
  columns: any;
  lineage: any;
}

/**
 * Fetches dataset metadata (schema, columns, lineage) from OpenMetadata.
 * If the actual OpenMetadata API is not available, it currently returns a mocked realistic response.
 *
 * @param datasetName - The Fully Qualified Name (FQN) of the dataset in OpenMetadata
 * @returns An object containing schema, columns, and lineage data
 */
export const fetchDatasetMetadata = async (datasetName: string): Promise<OpenMetadataResponse> => {
  try {
    console.log(`[OpenMetadata Service] Fetching metadata for dataset: ${datasetName}`);

    // ============================================================================
    // REAL IMPLEMENTATION (Commented out until actual OpenMetadata is available)
    // ============================================================================
    /*
    // 1. Fetch table details (contains schema and columns)
    const tableRes = await apiClient.get(`/tables/name/${encodeURIComponent(datasetName)}`, {
      params: { fields: 'columns,databaseSchema' }
    });
    
    // 2. Fetch lineage details
    const lineageRes = await apiClient.get(`/lineage/table/name/${encodeURIComponent(datasetName)}`, {
      params: { upstreamDepth: 1, downstreamDepth: 1 }
    });

    return {
      schema: tableRes.data.databaseSchema || {},
      columns: tableRes.data.columns || [],
      lineage: lineageRes.data || {},
    };
    */

    // ============================================================================
    // MOCK RESPONSE
    // ============================================================================
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      schema: {
        name: 'public',
        database: {
          name: 'default_db'
        }
      },
      columns: [
        {
          name: 'id',
          dataType: 'UUID',
          description: 'Unique identifier for the record',
          constraint: 'PRIMARY_KEY'
        },
        {
          name: 'name',
          dataType: 'VARCHAR',
          description: 'Name of the entity',
          dataLength: 255
        },
        {
          name: 'createdAt',
          dataType: 'TIMESTAMP',
          description: 'Timestamp when the record was created'
        }
      ],
      lineage: {
        entity: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'table',
          name: datasetName,
          fullyQualifiedName: datasetName,
        },
        upstreamEdges: [
          {
            fromEntity: 'source_table_a',
            toEntity: datasetName
          }
        ],
        downstreamEdges: [
          {
            fromEntity: datasetName,
            toEntity: 'reporting_dashboard_b'
          }
        ]
      }
    };
  } catch (error) {
    console.error(`[OpenMetadata Service] Error fetching metadata for ${datasetName}:`, error);
    throw new Error(`Failed to fetch metadata for ${datasetName}`);
  }
};
