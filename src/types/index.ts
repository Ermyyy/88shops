export type AuthenticityType = "ORIGINAL" | "REPLICA";

export type ProductCondition =
  | "NEW_WITH_TAGS"
  | "NEW_WITHOUT_TAGS"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR";

export type ProductStatus = "DRAFT" | "ACTIVE" | "RESERVED" | "SOLD" | "ARCHIVED";

export type DealMethod = "PERSONAL_MEETING" | "DIRECT" | "SAFE_DEAL";

export type DealStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CONFIRMED"
  | "DISPUTED"
  | "CANCELLED"
  | "COMPLETED";

export type UserRole = "USER" | "SELLER" | "SHOP_OWNER" | "ADMIN";

export type ProductImage = {
  id: string;
  url?: string;
  alt: string;
};

export type UserCustomization = {
  nicknameColor: string;
  avatarFrame: "none" | "graphite" | "lime" | "silver";
  emoji: string;
  coverStyle: "static" | "animated-coming-soon";
};

export type User = {
  id: string;
  email?: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emoji: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  city?: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  purchasesCount: number;
  listingsCount: number;
  favoritesCount: number;
  verified: boolean;
  roles: UserRole[];
  createdAt: string;
  customization: UserCustomization;
};

export type Shop = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  coverUrl?: string;
  description: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  salesCount: number;
  listingsCount: number;
  createdAt: string;
};

export type Product = {
  id: string;
  sellerId: string;
  shopId?: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  clothingSize?: string;
  shoeSize?: string;
  priceKopecks: number;
  condition: ProductCondition;
  authenticityType: AuthenticityType;
  city: string;
  description: string;
  status: ProductStatus;
  dealMethods: DealMethod[];
  images: ProductImage[];
  popularityScore: number;
  createdAt: string;
};

export type Review = {
  id: string;
  authorId: string;
  targetUserId?: string;
  targetShopId?: string;
  productId?: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Deal = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  amountKopecks: number;
  commissionPercent: number;
  commissionAmountKopecks: number;
  method: DealMethod;
  status: DealStatus;
  providerPaymentId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CatalogFilters = {
  query: string;
  brand: string;
  category: string;
  priceFrom: string;
  priceTo: string;
  clothingSize: string;
  shoeSize: string;
  condition: string;
  city: string;
  authenticityType: string;
  dealMethod: string;
};

export type CatalogSort = "new" | "price-asc" | "price-desc" | "popular";

export type ShopSort = "popular" | "new" | "rating" | "sales";
