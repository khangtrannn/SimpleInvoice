import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isValidDateOnlyString } from '../utils/date-only.util';

@ValidatorConstraint({ name: 'isDateOnly', async: false })
export class IsDateOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return isValidDateOnlyString(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid date in YYYY-MM-DD format`;
  }
}

export function IsDateOnly(validationOptions?: ValidationOptions) {
  return function decorate(object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsDateOnlyConstraint,
    });
  };
}
