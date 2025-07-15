import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const location = this.getErrorOrigin(exception);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resBody = exception.getResponse();

      this.logger.warn(
        `[${request.method}] ${request.url}\ncode: ${status}\ncontent: ${JSON.stringify(resBody)}\nlocation: ${location}`,
      );

      response.status(status).json(resBody);
    } else {
      this.logger.error(
        `[${request.method}] ${request.url}\ncode: 500\ncontent: ${String(exception)}\nlocation: ${location}`,
      );

      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  private getErrorOrigin(exception: unknown): string {
    const stack =
      exception instanceof Error ? exception.stack : new Error().stack;
    if (!stack) return 'Unknown origin';

    const lines = stack.split('\n');

    const userCodeLine = lines.find(
      (line) => !line.includes('node_modules') && line.includes('/src/'),
    );

    return userCodeLine?.trim() ?? lines[1]?.trim() ?? 'Unknown origin';
  }
}
