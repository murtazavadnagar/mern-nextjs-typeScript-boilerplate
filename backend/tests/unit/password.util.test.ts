import { comparePassword, hashPassword } from '../../src/utils/password';
import { describe, expect, it } from '@jest/globals';

describe('password util', () => {
  it('hashes and compares password correctly', async () => {
    const plain = 'ComplexPwd@123';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    await expect(comparePassword(plain, hashed)).resolves.toBe(true);
    await expect(comparePassword('wrongPassword', hashed)).resolves.toBe(false);
  });
});
