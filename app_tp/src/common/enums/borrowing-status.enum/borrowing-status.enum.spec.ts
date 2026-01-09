import { BorrowingStatusEnum } from './borrowing-status.enum';

describe('BorrowingStatusEnum', () => {
  it('should expose known statuses', () => {
    expect(BorrowingStatusEnum.ACTIVE).toBe('ACTIVE');
  });
});
