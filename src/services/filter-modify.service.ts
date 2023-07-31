import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { AnyObject, Filter, FilterBuilder, WhereBuilder } from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})
export class FilterModifyService {
  constructor(/* Add @inject to inject parameters */) {}

  addRoleConstraintToFilter(
    constraint: AnyObject,
    filter?: Filter,
  ): Filter {
    const filterBuilder = new FilterBuilder();
    const whereBuilder = new WhereBuilder();
    if (!filter) {
      return filterBuilder.where(constraint).build();
    } else if (!filter.where) {
      filter.where = constraint;
      return filter;
    } else if (filter.where) {
      const where = whereBuilder
        .and([constraint, ...this.getWhereWithAnd(filter.where)])
        .build();
      filter.where = where;
      return filter;
    } else {
      return filter;
    }
  }
  getWhereWithAnd(where: AnyObject) {
    if (where?.and) {
      return where?.and;
    } else {
      return [where];
    }
  }
}
