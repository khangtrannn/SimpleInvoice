import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isValidDateOnlyString } from './date-only.util';

@ValidatorConstraint({ name: 'isDateRange', async: false })
export class IsDateRangeConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const [startPropertyName, endPropertyName] = args.constraints as [
      string,
      string,
    ];
    const object = args.object as Record<string, unknown>;
    const startValue = object[startPropertyName];
    const endValue = object[endPropertyName];

    if (startValue === undefined || endValue === undefined) {
      return true;
    }

    if (
      !isValidDateOnlyString(startValue) ||
      !isValidDateOnlyString(endValue)
    ) {
      return true;
    }

    return startValue <= endValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [startPropertyName, endPropertyName] = args.constraints as [
      string,
      string,
    ];

    return `${startPropertyName} must be on or before ${endPropertyName}`;
  }
}

export function IsDateRange(
  startPropertyName: string,
  endPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function decorate(object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [startPropertyName, endPropertyName],
      options: validationOptions,
      validator: IsDateRangeConstraint,
    });
  };
}
