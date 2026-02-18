import { Package } from 'src/package/entities/package.entity';

export class Game {
  id: string;
  name: string;
  category: string;
  videoUrl?: string;
  imageUrl?: string;
  isActive?: boolean;
  packages?: Package[];
  imageBannerUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
