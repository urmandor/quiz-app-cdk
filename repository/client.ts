import {
  Client,
  generateClientPK,
  generateClientSK,
  IClient,
} from "../entities/Client";
import { S3Repository } from "./s3";

type ClientName = { clientName: string };
export type DeleteClient = Partial<IClient> & Required<ClientName>;
export type UpdateClient = DeleteClient & { newClientName: string };

export class ClientRepository {
  static async getAllClients(
    limit?: number,
    offset?: { [x: string]: any }
  ): Promise<{
    data: IClient[];
    offset?: {
      [x: string]: any;
    };
    count?: number;
  }> {
    const options: { [name: string]: any } = {};
    if (limit) {
      options.limit = limit;
    }
    if (offset) {
      options.startKey = offset;
    }
    const results = await Client.query(generateClientPK(), options);
    const items = await Promise.all(
      (results.Items as IClient[])?.map(async (item) => {
        let presignedUrl = item.imageUrl;
        if (item.imageUrl) {
          presignedUrl = await S3Repository.createPresignedUrl(item.imageUrl);
        }
        return { ...item, imageUrl: presignedUrl };
      })
    );

    return {
      data: items,
      offset: results.LastEvaluatedKey,
      count: results.Count,
    };
  }

  static async getClientByName(clientName: string): Promise<IClient | null> {
    const result = await Client.get({ clientName });
    if (!result.Item) {
      return null;
    }
    return <IClient>result.Item;
  }

  static async saveClient(client: IClient): Promise<void> {
    await Client.put(client);
  }

  static async updateClient(client: UpdateClient): Promise<void> {
    await Client.delete({ clientName: client.clientName });
    await Client.put({
      clientName: client.newClientName,
      ...(client.imageUrl && { imageUrl: client.imageUrl }),
    });
  }

  static async deleteClient(client: DeleteClient): Promise<void> {
    await Client.delete(client);
  }
}
