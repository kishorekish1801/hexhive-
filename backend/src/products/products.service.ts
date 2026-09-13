import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  async create(data: any) {
    const nameSv = await this.translateToSwedish(
      data.name
    );

    const descriptionSv =
      await this.translateToSwedish(
        data.description
      );

    return this.prisma.product.create({
      data: {
        ...data,

        nameSv:
          nameSv || data.name,

        descriptionSv:
          descriptionSv ||
          data.description,
      },
    });
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  async update(slug: string, data: any) {
    const existingProduct =
      await this.findOne(slug);

    const updateData = {
      ...data,
    };

    /*
     * If English product name changes,
     * regenerate Swedish name.
     */
    if (
      data.name &&
      data.name !== existingProduct.name
    ) {
      const translatedName =
        await this.translateToSwedish(
          data.name
        );

      updateData.nameSv =
        translatedName || data.name;
    }

    /*
     * If English description changes,
     * regenerate Swedish description.
     */
    if (
      data.description &&
      data.description !==
        existingProduct.description
    ) {
      const translatedDescription =
        await this.translateToSwedish(
          data.description
        );

      updateData.descriptionSv =
        translatedDescription ||
        data.description;
    }

    const updatedProduct =
      await this.prisma.product.update({
        where: {
          slug,
        },

        data: updateData,
      });

    // Delete old image if a new image was uploaded
    if (
      data.imageUrl &&
      existingProduct.imageUrl &&
      data.imageUrl !==
        existingProduct.imageUrl
    ) {
      this.deleteImageFile(
        existingProduct.imageUrl
      );
    }

    return updatedProduct;
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  async remove(slug: string) {
    const product =
      await this.findOne(slug);

    const deletedProduct =
      await this.prisma.product.delete({
        where: {
          slug,
        },
      });

    if (product.imageUrl) {
      this.deleteImageFile(
        product.imageUrl
      );
    }

    return deletedProduct;
  }

  // =====================================================
  // DEEPL TRANSLATION
  // =====================================================

  private async translateToSwedish(
    text: string
  ): Promise<string | null> {
    if (!text || !text.trim()) {
      return null;
    }

    const apiKey =
      process.env.DEEPL_API_KEY;

    const apiUrl =
      process.env.DEEPL_API_URL ||
      "https://api-free.deepl.com";

    /*
     * IMPORTANT:
     * If DeepL is not configured,
     * product creation still works.
     */
    if (!apiKey) {
      console.warn(
        "DEEPL_API_KEY is not configured. Using English fallback."
      );

      return null;
    }

    try {
      const response = await fetch(
        `${apiUrl}/v2/translate`,
        {
          method: "POST",

          headers: {
            Authorization:
              `DeepL-Auth-Key ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text: [text],

            source_lang: "EN",

            target_lang: "SV",
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "DeepL translation failed:",
          response.status,
          errorText
        );

        return null;
      }

      const result =
        await response.json();

      return (
        result.translations?.[0]?.text ??
        null
      );
    } catch (error) {
      console.error(
        "DeepL translation error:",
        error
      );

      return null;
    }
  }

  // =====================================================
  // DELETE IMAGE FILE
  // =====================================================

  private deleteImageFile(
    imageUrl: string
  ) {
    if (
      !imageUrl.startsWith(
        "/uploads/products/"
      )
    ) {
      return;
    }

    const filename =
      imageUrl.split("/").pop();

    if (!filename) {
      return;
    }

    const filePath = join(
      process.cwd(),
      "uploads",
      "products",
      filename
    );

    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);

        console.log(
          `Deleted old product image: ${filename}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to delete product image: ${filename}`,
        error
      );
    }
  }
}