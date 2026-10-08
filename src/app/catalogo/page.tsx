import { PrismaClient } from "@prisma/client";
import CatalogClient from "./CatalogClient";

const prisma = new PrismaClient();

export default async function Catalogo() {
  const products = await prisma.product.findMany();
  
  // Transform products: Apply 68% markup
  const productsWithMarkup = products.map((p) => ({
    ...p,
    price: Math.round(p.price * 1.68), // +68% recargo
  }));

  return <CatalogClient products={productsWithMarkup} />;
}
