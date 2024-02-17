import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const RegisterDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'register user',
      description:
        'register a new user to the api. and create a new user in DB',
    }),
    ApiCreatedResponse({
      description: 'return the created user from DB.',
    }),
    ApiBadRequestResponse({
      description: 'return BadRequest if the data is not allowed.',
    }),
  );
};

export const loginDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'login user',
      description: 'log in user to the api. and return a cookie',
    }),
    ApiOkResponse({
      description: 'return the created user from DB.',
    }),
    ApiBadRequestResponse({
      description:
        'return BadRequest if the username or password in not correct.',
    }),
  );
};

export const logOutDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'log out user',
      description: 'log out user from the api. and clear  cookie',
    }),
    ApiOkResponse({}),
  );
};
