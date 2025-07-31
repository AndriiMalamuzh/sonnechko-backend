import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export const UserAgent = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const agent = request.headers['user-agent'];
  const parser = new UAParser(agent);
  return {
    agent: parser.getUA(),
    browser:
      parser.getBrowser().name && parser.getBrowser().version
        ? parser.getBrowser().name + ' ' + parser.getBrowser().version
        : null,
    os:
      parser.getOS().name && parser.getOS().version
        ? parser.getOS().name + ' ' + parser.getOS().version
        : null,
    device:
      parser.getDevice().model && parser.getDevice().vendor
        ? parser.getDevice().model + ' ' + parser.getDevice().vendor
        : null,
  };
});
