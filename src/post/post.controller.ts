import {Controller, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('post')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController{

}