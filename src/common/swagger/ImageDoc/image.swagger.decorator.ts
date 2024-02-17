import { applyDecorators } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export const AddImageToProductDoc = () => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
          productId: {
            type: 'number',
          },
          isCover: {
            type: 'boolean',
          },
        },
      },
    }),
    ApiOperation({
      summary: 'upload an image to a product.',
    }),
    ApiCreatedResponse({
      description: 'return the information of the created image',
    }),
    ApiBadRequestResponse({
      description: 'if the input data and files is not valuable.',
    }),
    ApiNotFoundResponse({
      description: 'if the product Id is not correct product id.',
    }),
  );
};

export const DeleteImageFromProductDoc = () => {
  return applyDecorators(
    ApiParam({ name: 'href', required: true, type: String }),
    ApiOperation({
      summary: 'delete an image from a product.',
      description:
        'delete the image from the storage and database. and delete the relation',
    }),
    ApiNotFoundResponse({
      description: 'if the image href in not valid or not found.',
    }),
    ApiBadGatewayResponse({
      description: 'couldnt delete the image',
    }),
  );
};
