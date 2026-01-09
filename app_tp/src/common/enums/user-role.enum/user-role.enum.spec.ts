import { UserRoleEnum } from './user-role.enum';

describe('UserRoleEnum', () => {
  it('should expose known roles', () => {
    expect(UserRoleEnum.STUDENT).toBe('STUDENT');
  });
});
