import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export const CreateOrderDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'create an order',
      description:
        'create an order based on the given card and delete the card. ',
    }),
    ApiCreatedResponse({
      description: 'return the created order.',
    }),
    ApiBadRequestResponse({
      description: 'if the input data is not valid.',
    }),
    ApiNotFoundResponse({
      description: 'if the cart not Found',
    }),
    ApiForbiddenResponse({
      description: 'if the cart doesnt belong to the user.',
    }),
  );
};

export const FindAllOrdersDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'return All orders ',
      description: 'Admin user can access.',
    }),
    ApiOkResponse({
      description: 'return All orders.',
    }),
    ApiNotFoundResponse({
      description: 'if  Orders not Found',
    }),
    ApiForbiddenResponse({
      description: 'if user is not an admin.',
    }),
  );
};

export const FindByUserOrderDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'return All orders of one user.',
    }),
    ApiOkResponse({
      description: 'return All orders of one user.',
    }),
    ApiNotFoundResponse({
      description: 'if  Orders not Found',
    }),
    ApiForbiddenResponse({
      description: 'if user is not logged in.',
    }),
  );
};

export const FindOneOrderDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'return order with the given id.',
    }),
    ApiParam({ name: 'id', required: true }),
    ApiOkResponse({
      description: 'return order with the given id.',
    }),
    ApiBadRequestResponse({
      description: 'if the given Id is not valid',
    }),
    ApiNotFoundResponse({
      description: 'if  Order not Found',
    }),
    ApiForbiddenResponse({
      description: 'if user is not logged in and admin.',
    }),
  );
};

export const UpdateOrderDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'update order with the given id.',
      description: 'this route just update the status of the order.',
    }),
    ApiOkResponse({
      description: 'update and return order with the given id.',
    }),
    ApiBadRequestResponse({
      description: 'if the given input data is not valid',
    }),
    ApiNotFoundResponse({
      description: 'if  Order not Found',
    }),
    ApiForbiddenResponse({
      description: 'if user is not logged in and admin.',
    }),
  );
};

export const DeleteOrderDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'delete order with the given id.',
    }),
    ApiOkResponse({
      description: 'delete and return order with the given id.',
    }),
    ApiBadRequestResponse({
      description: 'if the given input data is not valid',
    }),
    ApiNotFoundResponse({
      description: 'if  Order not Found',
    }),
    ApiForbiddenResponse({
      description: 'if user is not logged in and admin.',
    }),
  );
};
