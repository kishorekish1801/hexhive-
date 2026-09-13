import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { FileFieldsInterceptor } from "@nestjs/platform-express";

import { diskStorage } from "multer";

import {
  extname,
  join,
} from "path";

import {
  existsSync,
  mkdirSync,
} from "fs";

import { QuotesService } from "./quotes.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const MODEL_EXTENSIONS = [
  ".stl",
  ".obj",
  ".3mf",
  ".step",
  ".stp",
];

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const MAX_MODEL_SIZE =
  100 * 1024 * 1024;

const MAX_TOTAL_MODEL_SIZE =
  500 * 1024 * 1024;

const MAX_MODEL_FILES = 10;

const MAX_REFERENCE_IMAGES = 5;

const QUOTES_UPLOAD_DIR = join(
  process.cwd(),
  "uploads",
  "quotes",
);

if (!existsSync(QUOTES_UPLOAD_DIR)) {
  mkdirSync(QUOTES_UPLOAD_DIR, {
    recursive: true,
  });
}

@Controller("quotes")
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: "modelFiles",
          maxCount: MAX_MODEL_FILES,
        },
        {
          name: "referenceImages",
          maxCount: MAX_REFERENCE_IMAGES,
        },
      ],
      {
        storage: diskStorage({
          destination: QUOTES_UPLOAD_DIR,

          filename: (
            _req,
            file,
            callback,
          ) => {
            const safeName =
              file.originalname
                .replace(/\s+/g, "-")
                .replace(
                  /[^a-zA-Z0-9.-]/g,
                  "",
                );

            const uniqueName =
              `${Date.now()}-${Math.round(
                Math.random() * 1e9,
              )}-${safeName}`;

            callback(
              null,
              uniqueName,
            );
          },
        }),

        limits: {
          fileSize:
            MAX_MODEL_SIZE,

          files:
            MAX_MODEL_FILES +
            MAX_REFERENCE_IMAGES,
        },

        fileFilter: (
          _req,
          file,
          callback,
        ) => {
          const extension =
            extname(
              file.originalname,
            ).toLowerCase();

          if (
            file.fieldname ===
            "modelFiles"
          ) {
            if (
              !MODEL_EXTENSIONS.includes(
                extension,
              )
            ) {
              return callback(
                new BadRequestException(
                  "Invalid 3D model format. Allowed: STL, OBJ, 3MF, STEP, STP",
                ),
                false,
              );
            }

            return callback(
              null,
              true,
            );
          }

          if (
            file.fieldname ===
            "referenceImages"
          ) {
            if (
              !IMAGE_EXTENSIONS.includes(
                extension,
              )
            ) {
              return callback(
                new BadRequestException(
                  "Invalid image format. Allowed: JPG, JPEG, PNG, WEBP",
                ),
                false,
              );
            }

            return callback(
              null,
              true,
            );
          }

          return callback(
            new BadRequestException(
              "Invalid upload field",
            ),
            false,
          );
        },
      },
    ),
  )
  createQuote(
    @Body() body: any,

    @UploadedFiles()
    files: {
      modelFiles?: Express.Multer.File[];

      referenceImages?: Express.Multer.File[];
    },
  ) {
    const modelFiles =
      files?.modelFiles ?? [];

    const referenceImages =
      files?.referenceImages ?? [];

    if (
      modelFiles.length === 0
    ) {
      throw new BadRequestException(
        "Please upload at least one 3D model",
      );
    }

    if (
      modelFiles.length >
      MAX_MODEL_FILES
    ) {
      throw new BadRequestException(
        "Maximum 10 3D model files are allowed",
      );
    }

    if (
      referenceImages.length >
      MAX_REFERENCE_IMAGES
    ) {
      throw new BadRequestException(
        "Maximum 5 reference images are allowed",
      );
    }

    const totalModelSize =
      modelFiles.reduce(
        (total, file) =>
          total + file.size,
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

    return this.quotesService.create({
      customerName:
        body.customerName,

      email:
        body.email,

      phone:
        body.phone,

      modelFiles:
        modelFiles.map(
          (file) => ({
            fileName:
              file.originalname,

            fileUrl:
              `/uploads/quotes/${file.filename}`,

            fileType:
              extname(
                file.originalname,
              ).toLowerCase(),

            fileSize:
              file.size,
          }),
        ),

      referenceImages:
        referenceImages.map(
          (file) => ({
            fileName:
              file.originalname,

            fileUrl:
              `/uploads/quotes/${file.filename}`,

            fileType:
              extname(
                file.originalname,
              ).toLowerCase(),

            fileSize:
              file.size,
          }),
        ),

      material:
        body.material,

      color:
        body.color,

      quantity:
        Number(body.quantity),

      printQuality:
        body.printQuality,

      additionalNotes:
        body.additionalNotes,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param("id") id: string,
  ) {
    return this.quotesService.findOne(
      Number(id),
    );
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,

    @Body()
    body: {
      status?: string;
      quotedPrice?: number | null;
      estimatedDelivery?: string | null;
      adminNotes?: string | null;
    },
  ) {
    return this.quotesService.update(
      Number(id),
      body,
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(
    @Param("id") id: string,
  ) {
    return this.quotesService.remove(
      Number(id),
    );
  }
}
