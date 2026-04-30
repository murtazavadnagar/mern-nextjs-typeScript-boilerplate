import { Types } from 'mongoose';
import { IRefreshToken, RefreshTokenModel } from '../models/RefreshToken';

export class RefreshTokenRepository {
  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdByIp?: string;
  }): Promise<IRefreshToken> {
    return RefreshTokenModel.create({
      userId: new Types.ObjectId(data.userId),
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      createdByIp: data.createdByIp,
    });
  }

  async findByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ tokenHash });
  }

  async revokeByHash(tokenHash: string, replacedByTokenHash?: string): Promise<void> {
    await RefreshTokenModel.updateOne(
      { tokenHash },
      {
        revokedAt: new Date(),
        replacedByTokenHash: replacedByTokenHash ?? null,
      },
    );
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await RefreshTokenModel.updateMany(
      { userId: new Types.ObjectId(userId), revokedAt: null },
      { revokedAt: new Date() },
    );
  }
}
