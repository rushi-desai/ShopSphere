import prisma from "../config/prisma";

export const createAddress = async (
  userId: string,
  data: {
    label?: string;
    fullName: string;
    phone?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
  }
) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const getAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: {
    label?: string;
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
  }
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
        NOT: {
          id: addressId,
        },
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data,
  });
};

export const deleteAddress = async (
  userId: string,
  addressId: string
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  return {
    message: "Address deleted successfully",
  };
};