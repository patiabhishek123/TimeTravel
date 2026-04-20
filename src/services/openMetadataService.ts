import axios from 'axios';

const OM_API_URL = process.env.OPENMETADATA_API_URL || 'http://localhost:8585/api/v1';
const OM_JWT_TOKEN = process.env.OPENMETADATA_JWT_TOKEN || 'dummy_token';

const apiClient = axios.create({
  baseURL: OM_API_URL,
  headers: {
    Authorization: `Bearer ${OM_JWT_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export class OpenMetadataService {
  static async listDatasets() {
    const response = await apiClient.get('/tables');
    return response.data.data.map((table: any) => ({
      id: table.id,
      name: table.name,
      fullyQualifiedName: table.fullyQualifiedName,
    }));
  }

  static async getDatasetDetails(fqn: string) {
    const response = await apiClient.get(`/tables/name/${encodeURIComponent(fqn)}`, {
      params: { fields: 'columns,tableSchema,description' }
    });
    return {
      columns: response.data.columns || [],
      tableSchema: response.data.tableSchema || {},
      description: response.data.description || ''
    };
  }

  static async getLineage(fqn: string) {
    const response = await apiClient.get(`/lineage/table/name/${encodeURIComponent(fqn)}`, {
      params: { upstreamDepth: 1, downstreamDepth: 1 }
    });
    return {
      upstreamEdges: response.data.upstreamEdges || [],
      downstreamEdges: response.data.downstreamEdges || []
    };
  }

  static getMockMetadata(fqn: string) {
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
        upstreamEdges: [
          {
            fromEntity: 'source_table_a',
            toEntity: fqn
          }
        ],
        downstreamEdges: [
          {
            fromEntity: fqn,
            toEntity: 'reporting_dashboard_b'
          }
        ]
      }
    };
  }
}
