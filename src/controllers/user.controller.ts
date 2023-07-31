import { Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {User} from '../models';
import {UserRepository} from '../repositories';
import { Permission, Role } from '../enum';
import { service } from '@loopback/core';
import { FilterModifyService } from '../services';
import { STRATEGY, authenticate } from 'loopback4-authentication';


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(FilterModifyService)
    public filterModifyService:FilterModifyService
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permission.ViewSellers]})
  @get('/buyer/list-of-sellers')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    filter= this.filterModifyService.addRoleConstraintToFilter({role:Role.SELLER}, filter) as Filter<User>
    return this.userRepository.find(filter);
  }

}
