import { IsOptional, validate } from 'class-validator';

import { isValidDateOnlyString } from './date-only.util';
import { IsDateOnly } from './is-date-only.validator';
import { IsDateOnOrAfter } from './is-date-on-or-after.validator';
import { IsDateRange } from './is-date-range.validator';

class DateOnlyFixture {
  @IsDateOnly()
  value!: string;
}

class DateOnOrAfterFixture {
  @IsDateOnly()
  startDate!: string;

  @IsDateOnly()
  @IsDateOnOrAfter('startDate')
  endDate!: string;
}

class DateRangeFixture {
  @IsDateRange('fromDate', 'toDate')
  private readonly dateRange?: never;

  @IsOptional()
  @IsDateOnly()
  fromDate?: string;

  @IsOptional()
  @IsDateOnly()
  toDate?: string;
}

describe('date-only validators', () => {
  describe(isValidDateOnlyString.name, () => {
    it.each(['2026-06-03', '2024-02-29'])(
      'should accept valid date-only string %s',
      (value) => {
        expect(isValidDateOnlyString(value)).toBe(true);
      },
    );

    it.each([
      '2026-02-29',
      '2026-02-31',
      '2026-6-03',
      '2026-06-3',
      '2026-06-03T00:00:00Z',
      '2026/06/03',
      '',
      null,
      undefined,
    ])('should reject invalid date-only value %s', (value) => {
      expect(isValidDateOnlyString(value)).toBe(false);
    });
  });

  describe(IsDateOnly.name, () => {
    it('should validate an exact YYYY-MM-DD date', async () => {
      const fixture = Object.assign(new DateOnlyFixture(), {
        value: '2026-06-03',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(0);
    });

    it('should reject an ISO date-time string', async () => {
      const fixture = Object.assign(new DateOnlyFixture(), {
        value: '2026-06-03T00:00:00Z',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isDateOnly');
    });
  });

  describe(IsDateOnOrAfter.name, () => {
    it('should accept an end date on or after the start date', async () => {
      const fixture = Object.assign(new DateOnOrAfterFixture(), {
        startDate: '2026-06-03',
        endDate: '2026-06-03',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(0);
    });

    it('should reject an end date before the start date', async () => {
      const fixture = Object.assign(new DateOnOrAfterFixture(), {
        startDate: '2026-06-03',
        endDate: '2026-06-02',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isDateOnOrAfter');
    });

    it('should skip ordering validation when a date value is invalid', async () => {
      const fixture = Object.assign(new DateOnOrAfterFixture(), {
        startDate: 'not-a-date',
        endDate: '2026-06-02',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('startDate');
      expect(errors[0].constraints).toHaveProperty('isDateOnly');
    });
  });

  describe(IsDateRange.name, () => {
    it('should accept a range where fromDate is on or before toDate', async () => {
      const fixture = Object.assign(new DateRangeFixture(), {
        fromDate: '2026-06-01',
        toDate: '2026-06-30',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(0);
    });

    it('should reject a range where fromDate is after toDate', async () => {
      const fixture = Object.assign(new DateRangeFixture(), {
        fromDate: '2026-06-30',
        toDate: '2026-06-01',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isDateRange');
    });

    it('should skip ordering validation when one side is missing', async () => {
      const fixture = Object.assign(new DateRangeFixture(), {
        fromDate: '2026-06-01',
      });

      const errors = await validate(fixture);

      expect(errors).toHaveLength(0);
    });
  });
});
