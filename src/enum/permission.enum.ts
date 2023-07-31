export enum Permission {
 CreateOrder="CreateOrder",
 ViewOrder="ViewOrder",

 CreateProduct="CreateProduct",
 ViewProduct="ViewProduct",
 ViewSellers="ViewSellers"
}

export const sellerPermissions = [
  Permission.ViewOrder,
  Permission.CreateProduct
];

export const buyerPermissions = [
  Permission.CreateOrder,
  Permission.ViewProduct,
  Permission.ViewSellers
];
