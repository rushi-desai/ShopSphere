import prisma from "../config/prisma";

export const getProducts = async () => {
  return prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const createProduct = async (data: {
  name: string;
  slug: string;
  price: number;
  stock: number;
}) => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      price: data.price,
      stock: data.stock,
      images: [],
    },
  });

  return product;
};

// console.log("PRODUCT SERVICE LOADED");
// console.log({ getProducts, createProduct });


export const getProductById = async (id: string) => {
  return prisma.product.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null,
    },
  });
};



export const updateProduct = async(
  id:string,
  data:{
    name?:string,
    price?:number;
    stock?:number;
  }
)=>{
  return prisma.product.update({
    where:{
      id,
    }, 
    data,
  })
}



export const deleteProduct = async (id: string) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
};