import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const GetMeDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'get the logged in user',
    }),
    ApiOkResponse({
      description: 'return the logged in user',
    }),
    ApiUnauthorizedResponse({
      description: 'when you are not logged in or the token expired.',
    }),
  );
};

export const FindAllDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'get All the users',
      description: 'admin permission required.',
    }),
    ApiQuery({ name: 'take', required: false, type: Number }),
    ApiQuery({ name: 'skip', required: false, type: Number }),
    ApiOkResponse({
      description: 'return All users',
    }),
    ApiForbiddenResponse({
      description: 'if you are not a registered admin.',
    }),
    ApiBadRequestResponse({
      description: 'if the query params are not valid numbers',
    }),
  );
};

export const FindOneDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'get one user by id.',
      description: 'admin permission required.',
    }),
    ApiQuery({ name: 'id', required: true, type: Number }),
    ApiOkResponse({
      description: 'return the user',
    }),
    ApiForbiddenResponse({
      description: 'if you are not a registered admin.',
    }),
    ApiBadRequestResponse({
      description: 'if the query param are not a valid number',
    }),
  );
};

export const UpdateDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'update your user',
      description: 'the user should be logged in user.',
    }),
    ApiOkResponse({
      description: 'return the updated user',
    }),
    ApiForbiddenResponse({
      description: 'if the user in not logged in',
    }),
    ApiNotFoundResponse({
      description: 'if the user not found with the given id.',
    }),
    ApiBadRequestResponse({
      description: 'if the body data is not valid.',
    }),
  );
};

export const DeleteDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'delete the user with the given id. ',
      description: 'admin permission required. ',
    }),
    ApiOkResponse({
      description: 'return the deleted user, if there is no user return null.',
    }),
    ApiForbiddenResponse({
      description: 'if the requested user in not an admin',
    }),
  );
};
