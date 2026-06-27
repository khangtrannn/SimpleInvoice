import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isValidDateOnlyString } from './date-only.util';

@ValidatorConstraint({ name: 'isDateOnOrAfter', async: false })
export class IsDateOnOrAfterConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const object = args.object as Record<string, unknown>;
    const relatedValue = object[relatedPropertyName];

    if (!isValidDateOnlyString(value) || !isValidDateOnlyString(relatedValue)) {
      return true;
    }

    return value >= relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as [string];

    return `${args.property} must be on or after ${relatedPropertyName}`;
  }
}

export function IsDateOnOrAfter(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function decorate(object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [relatedPropertyName],
      options: validationOptions,
      validator: IsDateOnOrAfterConstraint,
    });
  };
}
