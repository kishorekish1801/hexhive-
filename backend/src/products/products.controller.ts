import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  // =====================================================
  // PUBLIC ENDPOINTS
  // =====================================================

  // Get all products
  // Customers can access this without logging in
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Get one product
  // Customers can access this without logging in
  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.productsService.findOne(slug);
  }

  // =====================================================
  // ADMIN ENDPOINTS
  // =====================================================

  // Upload product image
  // ADMIN ONLY
  @Post("upload")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/products",

        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),

      // Maximum image size: 5 MB
      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      // Allowed image formats
      fileFilter: (_req, file, callback) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];

        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              "Only JPG, PNG, WEBP and GIF images are allowed"
            ),
            false
          );
        }
      },
    })
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      return {
        success: false,
        message: "No image uploaded",
      };
    }

    return {
      success: true,
      filename: file.filename,
      imageUrl: `/uploads/products/${file.filename}`,
    };
  }

  // Create product
  // ADMIN ONLY
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  // Update product
  // ADMIN ONLY
  @Patch(":slug")
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param("slug") slug: string,
    @Body() body: any
  ) {
    return this.productsService.update(
      slug,
      body
    );
  }

  // Delete product
  // ADMIN ONLY
  @Delete(":slug")
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param("slug") slug: string) {
    return this.productsService.remove(slug);
  }
}
