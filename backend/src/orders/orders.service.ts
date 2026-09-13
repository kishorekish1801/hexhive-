
import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // Create a new order
  async createOrder(data: any) {
    // Validate customer information
    if (
      !data.customerName ||
      !data.email ||
      !data.address ||
      !data.city ||
      !data.postalCode ||
      !data.country
    ) {
      throw new BadRequestException(
        "Customer information is incomplete"
      );
    }

    // Validate order items
    if (
      !Array.isArray(data.items) ||
      data.items.length === 0
    ) {
      throw new BadRequestException(
        "Order must contain at least one item"
      );
    }

    // Get product IDs
    const productIds = data.items.map(
      (item: any) => Number(item.productId)
    );

    // Get products from PostgreSQL
    const products =
      await this.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

    // Make sure every product exists
    if (products.length !== productIds.length) {
      throw new BadRequestException(
        "One or more products were not found"
      );
    }

    let total = 0;

    // Create order items
    const orderItems = data.items.map(
      (item: any) => {
        const product = products.find(
          (p) =>
            p.id === Number(item.productId)
        );

        if (!product) {
          throw new BadRequestException(
            "Product not found"
          );
        }

        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new BadRequestException(
            "Invalid product quantity"
          );
        }

        const price = Number(product.price);

        total += price * quantity;

        return {
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
        };
      }
    );

    // Create order in PostgreSQL
    const order =
      await this.prisma.order.create({
        data: {
          customerName: data.customerName,
          email: data.email,
          phone: data.phone || null,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,

          // Total is calculated from database prices
          total,

          // New orders always start as PENDING
          status: "PENDING",

          items: {
            create: orderItems,
          },
        },

        // Include product information
        // so the frontend receives imageUrl
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

    return order;
  }

  // Get all orders
  async findAll() {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      // Include the related product
      // including its imageUrl
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Get one order
  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },

      // Include the related product
      // including its imageUrl
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Update order status
  async updateStatus(
    id: number,
    status: string
  ) {
    // Allowed order statuses
    const allowedStatuses = [
      "PENDING",
      "PROCESSING",
      "COMPLETED",
      "CANCELLED",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        "Invalid order status"
      );
    }

    // Check if order exists
    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },
      });

    if (!order) {
      throw new BadRequestException(
        "Order not found"
      );
    }

    // Update status
    return this.prisma.order.update({
      where: {
        id,
      },

      data: {
        status,
      },

      // Include the product after updating
      // so the frontend keeps the image
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Delete an order
  async remove(id: number) {
    // Check if order exists
    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },
      });

    if (!order) {
      throw new BadRequestException(
        "Order not found"
      );
    }

    // Delete order
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}

