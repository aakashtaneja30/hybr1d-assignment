import { uuid } from '@loopback/core';
import {Entity, model, property} from '@loopback/repository';

@model({name:"order_product"})
export class OrderProduct extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    name:'order_id'
  })
  orderId: string;

  @property({
    type: 'string',
    name:'product_id'
  })
  productId: string;


  constructor(data?: Partial<OrderProduct>) {
    super(data);
  }
}

export interface OrderProductRelations {
  // describe navigational properties here
}

export type OrderProductWithRelations = OrderProduct & OrderProductRelations;
