import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SqlDataSource} from '../datasources';
import {Order, OrderRelations} from '../models';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  constructor(
    @inject('datasources.sql') dataSource: SqlDataSource,
  ) {
    super(Order, dataSource);
  }
}
