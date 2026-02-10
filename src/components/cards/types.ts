export interface BaseCardProps {
  id: string;
  title: string;
  pricePerDay: number;
  photos: string[];
  hand: 'left_handed' | 'right_handed';
  city?: string;
  state?: string;
}

export interface ListingCardProps extends BaseCardProps {
  isPublished: boolean;
  onEdit?: (id: string) => void;
  onPause?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface RentalCardProps extends BaseCardProps {
  status: 'pending' | 'active' | 'completed';
  rating?: number;
  location?: string;
}

export interface FavoriteCardProps extends BaseCardProps {
  rating?: number;
  location?: string;
  isFavorited: boolean;
  onToggleFavorite?: (id: string) => void;
}