import { uuid } from '@loopback/core';
import {Entity, model, property} from '@loopback/repository';

@model({name:'products'})
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name:'seller_id'
  })
  sellerId: string;

  @property({
    type: 'string',
    name:'name'
  })
  name?: string;

  @property({
    type: 'string',
    name:'picture_url'
  })
  pictureUrl?: string;


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
