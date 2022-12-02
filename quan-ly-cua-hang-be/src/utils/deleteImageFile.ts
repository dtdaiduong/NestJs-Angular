import { InternalServerErrorException } from "@nestjs/common";
import { unlinkSync } from "fs";

export function DeleteImageFile(path: string) {
  try {
    unlinkSync(path);
  } catch (error) {
    throw new InternalServerErrorException("Can't delete image");
  }
}
