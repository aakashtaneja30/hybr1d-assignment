import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SqlDataSource} from '../datasources';
import {UserCredentials} from '../models';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id
> {
  constructor(
    @inject('datasources.sql') dataSource: SqlDataSource,
  ) {
    super(UserCredentials, dataSource);
  }
}
