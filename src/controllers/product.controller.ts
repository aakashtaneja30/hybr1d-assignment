import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {Product, User} from '../models';
import {ProductRepository} from '../repositories';
import { inject, service } from '@loopback/core';
import { FilterModifyService } from '../services';
import { Permission } from '../enum';
import { AuthenticationBindings, STRATEGY, authenticate } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository : ProductRepository,
    @service(FilterModifyService)
    public filterModifyService:FilterModifyService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: User,
  ) {}


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permission.CreateProduct]})
  @post('/seller/create-catalog')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id', 'sellerId'],
          }),
        },
      },
    })
    product: Omit<Product, 'id' | 'sellerId'>,
  ): Promise<Product> {
    return this.productRepository.create({...product, sellerId:this.currentUser.id});
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permission.ViewProduct]})
  @get('/buyer/seller-catalog/{sellerId}')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('sellerId') sellerId: string,
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    filter= this.filterModifyService.addRoleConstraintToFilter({sellerId},filter) as Filter<Product>
    return this.productRepository.find(filter);
  }
}
