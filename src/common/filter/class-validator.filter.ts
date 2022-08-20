import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * @description class-validator 에서 던져지는 에러 filtering
 */
@Catch(ValidationError)
export class ClassValidatorFilter implements ExceptionFilter {
  async catch(exception: ValidationError, host: ArgumentsHost): Promise<void> {
    const response = host.switchToHttp().getResponse();
    const message = exception.toString().replace(/(\n|\r|\t)/g, ' ');

    response.status(HttpStatus.BAD_REQUEST).send(message);
  }
}
