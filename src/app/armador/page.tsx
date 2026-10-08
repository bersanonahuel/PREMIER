import { PrismaClient } from "@prisma/client";
import ArmadorClient from "./ArmadorClient";

const prisma = new PrismaClient();

export default async function ArmadorPage() {
  const products = await prisma.product.findMany();
  
  const productsWithMarkup = products.map((p) => ({
    ...p,
    price: Math.round(p.price * 1.68),
  }));

  return <ArmadorClient products={productsWithMarkup} />;
}
