import {Model, model, property} from '@loopback/repository';

@model()
export class PlaceOrderDto extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  productIds: string[];


  constructor(data?: Partial<PlaceOrderDto>) {
    super(data);
  }
}

export interface PlaceOrderDtoRelations {
  // describe navigational properties here
}

export type PlaceOrderDtoWithRelations = PlaceOrderDto & PlaceOrderDtoRelations;
