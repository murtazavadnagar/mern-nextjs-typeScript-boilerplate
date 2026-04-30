import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from '../dto/auth.dto';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../utils/token';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/User';

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

const getExpirationFromToken = (token: string): Date => {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === 'string' || !('exp' in decoded) || typeof decoded.exp !== 'number') {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Unable to decode token expiration');
  }

  return new Date(decoded.exp * 1000);
};

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  private async issueTokens(user: IUser, ipAddress?: string): Promise<AuthResult> {
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);
    const tokenHash = hashToken(refreshToken);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt: getExpirationFromToken(refreshToken),
      createdByIp: ipAddress,
    });

    return { accessToken, refreshToken, user };
  }

  async login(dto: LoginDto, ipAddress?: string): Promise<AuthResult> {
    const user = await this.userRepository.findByUsername(dto.username);

    if (!user || user.isDeleted || !user.isActive) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const isPasswordValid = await comparePassword(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    await this.userRepository.markLogin(user.id);

    return this.issueTokens(user, ipAddress);
  }

  async refresh(rawRefreshToken: string, ipAddress?: string): Promise<AuthResult> {
    const payload = verifyRefreshToken(rawRefreshToken);

    if (payload.type !== 'refresh') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token type');
    }

    const currentHash = hashToken(rawRefreshToken);
    const tokenRecord = await this.refreshTokenRepository.findByHash(currentHash);

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token expired or revoked');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || user.isDeleted || !user.isActive) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User is unavailable');
    }

    const nextTokens = await this.issueTokens(user, ipAddress);
    const replacementHash = hashToken(nextTokens.refreshToken);
    await this.refreshTokenRepository.revokeByHash(currentHash, replacementHash);

    return nextTokens;
  }

  async logout(refreshToken: string): Promise<void> {
    const refreshTokenHash = hashToken(refreshToken);
    await this.refreshTokenRepository.revokeByHash(refreshTokenHash);
  }
}
