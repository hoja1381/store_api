import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const CreateCartDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'create a new shopping cart for the user.',
    }),
    ApiCreatedResponse({
      description: 'return the created cart',
    }),
    ApiBadRequestResponse({
      description: 'if the input data is not valid.',
    }),
    ApiNotFoundResponse({
      description: 'if one of the products is no found',
    }),
    ApiUnauthorizedResponse({
      description: 'if the user is not logged in',
    }),
  );
};

export const FindCartByUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'return all the carts of the logged in user',
    }),
    ApiOkResponse({
      description: 'return the carts of the logged in user',
    }),
    ApiNotFoundResponse({
      description: 'if there is no carts for that user.',
    }),
    ApiUnauthorizedResponse({
      description: 'if the user is not logged in',
    }),
  );
};

export const FindOneCartDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'return one cart of the user',
    }),
    ApiOkResponse({
      description: 'return the cart of the logged in user with the given id.',
    }),
    ApiNotFoundResponse({
      description: 'if there is no cart with that id.',
    }),
    ApiUnauthorizedResponse({
      description: 'if the user is not logged in',
    }),
  );
};

export const AddProductToCartDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'add product to the cart',
      description: 'add one kind product with the given quantity to the cart',
    }),
    ApiOkResponse({
      description: 'return the updated cart.',
    }),
    ApiBadRequestResponse({
      description: 'if the input data is not valid',
    }),
    ApiNotFoundResponse({
      description: 'if the cart or the product not found',
    }),
    ApiUnauthorizedResponse({
      description: 'if the user is not logged in',
    }),
  );
};

export const RemoveProductFromCartDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'remove product to the cart',
      description:
        'remove one kind product with the given quantity to the cart',
    }),
    ApiOkResponse({
      description: 'return the updated cart.',
    }),
    ApiBadRequestResponse({
      description: 'if the input data is not valid',
    }),
    ApiNotFoundResponse({
      description: 'if the cart or the product not found',
    }),
    ApiUnauthorizedResponse({
      description: 'if the user is not logged in',
    }),
  );
};

export const RemoveCartDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'remove the cart',
    }),
    ApiOkResponse({
      description: 'return the remove cart.',
    }),
    ApiBadRequestResponse({
      description: 'if the input id is not valid',
    }),
    ApiNotFoundResponse({
      description: 'if the cart not found',
    }),
    ApiUnauthorizedResponse({
      description: 'if the user is not logged in',
    }),
  );
};
