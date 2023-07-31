import {inject} from '@loopback/core';
import {
  AnyObject,
  DataObject,
  DefaultCrudRepository,
} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {SqlDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.sql') dataSource: SqlDataSource) {
    super(User, dataSource);
  }
  create(
    entity: DataObject<User>,
    options?: AnyObject | undefined,
  ): Promise<User> {
    entity.id = uuidv4();
    return super.create(entity, options);
  }
}
