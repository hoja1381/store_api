import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export const CreateProductDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'create a new product',
      description: 'admin user only allowed to do this.',
    }),
    ApiCreatedResponse({
      description: 'return the create product',
    }),
    ApiBadRequestResponse({
      description: 'if the input data are not valid',
    }),
  );
};

export const FindAllProductsDoc = () => {
  return applyDecorators(
    ApiQuery({ name: 'skip', required: false, type: Number }),
    ApiQuery({ name: 'take', required: false, type: Number }),
    ApiOperation({
      summary: 'return all the products',
    }),
    ApiOkResponse({
      description: 'return all the products , with pagination and count',
    }),
    ApiNotFoundResponse({
      description: 'if there is no product in db.',
    }),
  );
};

export const FindOneProductDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'find one product with the given id.',
    }),
    ApiOkResponse({
      description: 'return the product with the given id. with its images.',
    }),
    ApiBadRequestResponse({
      description: 'if the input id is not valid.',
    }),
    ApiNotFoundResponse({
      description: 'if the product with the given id is not found.',
    }),
  );
};

export const UpdateProductDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'update the product with the given id',
      description: 'admin user allowed to call this',
    }),
    ApiOkResponse({
      description: 'return the updated product.',
    }),
    ApiBadRequestResponse({
      description: 'input data not valid',
    }),
    ApiNotFoundResponse({
      description: 'product not found with the given id.',
    }),
  );
};

export const DeleteProductDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'delete the product with the given id.',
    }),
    ApiOkResponse({
      description: 'return the deleted product.',
    }),
    ApiBadRequestResponse({
      description: 'input data not valid',
    }),
    ApiNotFoundResponse({
      description: 'product not found with the given id.',
    }),
  );
};
