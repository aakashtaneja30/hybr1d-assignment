import { uuid } from '@loopback/core';
import {Entity, model, property} from '@loopback/repository';

@model({
  name:"orders"
})
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    name:'placed_on'
  })
  placedOn?: string;

  @property({
    type: 'string',
    name:'buyer_id'
  })
  buyerId: string;

  @property({
    type: 'string',
    name:'seller_id'
  })
  sellerId: string;


  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
