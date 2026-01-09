import { ActivityTypeEnum } from './activity-type.enum';

describe('ActivityTypeEnum', () => {
  it('should expose known types', () => {
    expect(ActivityTypeEnum.BOOK_CREATED).toBe('BOOK_CREATED');
  });
});
