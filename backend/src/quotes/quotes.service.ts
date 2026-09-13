import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CUSTOMER - CREATE QUOTE REQUEST
  // =========================================================

  async create(data: {
    customerName: string;
    email: string;
    phone?: string;

    modelFiles?: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    }>;

    referenceImages?: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    }>;

    material: string;
    color: string;
    quantity: number;
    printQuality: string;
    additionalNotes?: string;
  }) {
    // -------------------------------------------------------
    // Basic validation
    // -------------------------------------------------------

    if (!data.customerName?.trim()) {
      throw new BadRequestException(
        "Customer name is required",
      );
    }

    if (!data.email?.trim()) {
      throw new BadRequestException(
        "Email is required",
      );
    }

    if (!data.material?.trim()) {
      throw new BadRequestException(
        "Material is required",
      );
    }

    if (!data.color?.trim()) {
      throw new BadRequestException(
        "Color is required",
      );
    }

    if (!data.printQuality?.trim()) {
      throw new BadRequestException(
        "Print quality is required",
      );
    }

    if (
      !Number.isInteger(data.quantity) ||
      data.quantity < 1
    ) {
      throw new BadRequestException(
        "Quantity must be a whole number greater than 0",
      );
    }

    // -------------------------------------------------------
    // 3D MODEL VALIDATION
    // -------------------------------------------------------

    const MAX_MODEL_FILES = 10;

    const MAX_MODEL_SIZE =
      100 * 1024 * 1024; // 100 MB

    const MAX_TOTAL_MODEL_SIZE =
      500 * 1024 * 1024; // 500 MB

    if (
      !data.modelFiles ||
      data.modelFiles.length === 0
    ) {
      throw new BadRequestException(
        "At least one 3D model is required",
      );
    }

    if (
      data.modelFiles.length >
      MAX_MODEL_FILES
    ) {
      throw new BadRequestException(
        "Maximum 10 3D model files are allowed",
      );
    }

    // Validate every model file
    for (const file of data.modelFiles) {
      if (
        !Number.isFinite(file.fileSize) ||
        file.fileSize <= 0
      ) {
        throw new BadRequestException(
          `Invalid file size for ${file.fileName}`,
        );
      }

      if (
        file.fileSize >
        MAX_MODEL_SIZE
      ) {
        throw new BadRequestException(
          `${file.fileName} exceeds the 100 MB maximum file size`,
        );
      }
    }

    // Calculate total model size
    const totalModelSize =
      data.modelFiles.reduce(
        (total, file) =>
          total + file.fileSize,
        0,
      );

    if (
      totalModelSize >
      MAX_TOTAL_MODEL_SIZE
    ) {
      throw new BadRequestException(
        "Total 3D model upload size cannot exceed 500 MB",
      );
    }

    // -------------------------------------------------------
    // REFERENCE IMAGE VALIDATION
    // -------------------------------------------------------

    const MAX_REFERENCE_IMAGES = 5;

    if (
      data.referenceImages &&
      data.referenceImages.length >
        MAX_REFERENCE_IMAGES
    ) {
      throw new BadRequestException(
        "Maximum 5 reference images are allowed",
      );
    }

    // -------------------------------------------------------
    // CREATE QUOTE
    // -------------------------------------------------------

    return this.prisma.customPrintQuote.create({
      data: {
        // Customer
        customerName:
          data.customerName.trim(),

        email:
          data.email.trim(),

        phone:
          data.phone?.trim() || null,

        // Multiple 3D models
        modelFiles:
          data.modelFiles ?? [],

        // Reference images
        referenceImages:
          data.referenceImages ?? [],

        // Printing requirements
        material:
          data.material.trim(),

        color:
          data.color.trim(),

        quantity:
          data.quantity,

        printQuality:
          data.printQuality.trim(),

        additionalNotes:
          data.additionalNotes?.trim() ||
          null,

        // Initial status
        status: "NEW",
      },
    });
  }

  // =========================================================
  // ADMIN - GET ALL QUOTES
  // =========================================================

  async findAll() {
    return this.prisma.customPrintQuote.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =========================================================
  // ADMIN - GET ONE QUOTE
  // =========================================================

  async findOne(id: number) {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new BadRequestException(
        "Invalid quote ID",
      );
    }

    const quote =
      await this.prisma.customPrintQuote.findUnique({
        where: {
          id,
        },
      });

    if (!quote) {
      throw new NotFoundException(
        "Quote request not found",
      );
    }

    return quote;
  }

  // =========================================================
  // ADMIN - UPDATE QUOTE
  // =========================================================

  async update(
    id: number,
    data: {
      status?: string;
      quotedPrice?: number | null;
      estimatedDelivery?: string | null;
      adminNotes?: string | null;
    },
  ) {
    // Make sure quote exists
    await this.findOne(id);

    // -------------------------------------------------------
    // Validate status
    // -------------------------------------------------------

    const allowedStatuses = [
      "NEW",
      "REVIEWING",
      "QUOTED",
      "ACCEPTED",
      "REJECTED",
      "COMPLETED",
    ];

    if (
      data.status !== undefined &&
      !allowedStatuses.includes(
        data.status,
      )
    ) {
      throw new BadRequestException(
        `Invalid status. Allowed statuses: ${allowedStatuses.join(
          ", ",
        )}`,
      );
    }

    // -------------------------------------------------------
    // Validate quoted price
    // -------------------------------------------------------

    let quotedPrice:
      | Prisma.Decimal
      | null
      | undefined;

    if (data.quotedPrice === null) {
      quotedPrice = null;
    } else if (
      data.quotedPrice !== undefined
    ) {
      if (
        typeof data.quotedPrice !==
          "number" ||
        !Number.isFinite(
          data.quotedPrice,
        ) ||
        data.quotedPrice < 0
      ) {
        throw new BadRequestException(
          "Quoted price must be a valid number greater than or equal to 0",
        );
      }

      quotedPrice =
        new Prisma.Decimal(
          data.quotedPrice,
        );
    }

    // -------------------------------------------------------
    // Update quote
    // -------------------------------------------------------

    return this.prisma.customPrintQuote.update({
      where: {
        id,
      },

      data: {
        ...(data.status !==
          undefined && {
          status: data.status,
        }),

        ...(quotedPrice !==
          undefined && {
          quotedPrice,
        }),

        ...(data.estimatedDelivery !==
          undefined && {
          estimatedDelivery:
            data.estimatedDelivery?.trim() ||
            null,
        }),

        ...(data.adminNotes !==
          undefined && {
          adminNotes:
            data.adminNotes?.trim() ||
            null,
        }),
      },
    });
  }

  // =========================================================
  // ADMIN - DELETE QUOTE
  // =========================================================

  async remove(id: number) {
    // Make sure quote exists
    await this.findOne(id);

    return this.prisma.customPrintQuote.delete({
      where: {
        id,
      },
    });
  }
}