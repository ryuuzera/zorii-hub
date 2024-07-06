import { RecentGame } from '@prisma/client';
import prisma from '../../infra/db/prismaclient';

class RecentGameRepository {
  constructor() {}

  async list(): Promise<RecentGame[]> {
    try {
      return await prisma.recentGame.findMany({
        distinct: 'appId',
        orderBy: {
          launchedAt: 'desc',
        },
      });
    } catch (error) {
      return [];
    }
  }

  async create(dataObj: Omit<RecentGame, 'id' | 'launchedAt'>) {
    return await prisma.recentGame.create({
      data: dataObj,
    });
  }
}
export default RecentGameRepository;
