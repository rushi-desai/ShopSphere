import prisma from "../config/prisma";

export const getCategories = async () => {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    include: {
      products: {
        where: {
          isActive: true,
          deletedAt: null,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isActive: true,
    },
    include: {
      products: {
        where: {
          isActive: true,
          deletedAt: null,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
}) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug: data.slug },
      ],
    },
  });

  if (existingCategory) {
    throw new Error("Category name or slug already exists");
  }

  return prisma.category.create({
    data,
  });
};

export const updateCategory = async (
  categoryId: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
  }
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (data.name || data.slug) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          data.name
            ? { name: data.name }
            : undefined,
          data.slug
            ? { slug: data.slug }
            : undefined,
        ].filter(Boolean) as any,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Category name or slug already exists");
    }
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });
};

export const deleteCategory = async (
  categoryId: string
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.products.length > 0) {
    throw new Error(
      "Cannot delete category with products"
    );
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isActive: false,
    },
  });

  return {
    message: "Category deleted successfully",
  };
};