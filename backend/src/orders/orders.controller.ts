
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) {}

  // Create order
  // Public because customers need to checkout
  @Post()
  createOrder(@Body() body: any) {
    return this.ordersService.createOrder(body);
  }

  // Get all orders
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  // Get one order
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(
      Number(id)
    );
  }

  // Update order status
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: string
  ) {
    return this.ordersService.updateStatus(
      Number(id),
      status
    );
  }

  // Delete an order
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) {
    return this.ordersService.remove(
      Number(id)
    );
  }
}

