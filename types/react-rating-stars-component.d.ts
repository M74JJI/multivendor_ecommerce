declare module "react-rating-stars-component" {
  import { ComponentType, ReactNode } from "react";

  interface ReactStarsProps {
    count?: number; // The number of stars to display
    value?: number; // The current rating value
    onChange?: (newRating: number) => void; // Function triggered when rating changes
    size?: number; // The size of the stars
    isHalf?: boolean; // If true, allows half-star ratings
    edit?: boolean; // If false, the rating is read-only
    activeColor?: string; // The color of the active (filled) stars
    color?: string; // The color of the inactive (empty) stars
    emptyIcon?: ReactNode; // Custom icon for the empty star
    halfIcon?: ReactNode; // Custom icon for the half-filled star
    filledIcon?: ReactNode; // Custom icon for the filled star
  }

  const ReactStars: ComponentType<ReactStarsProps>;
  export default ReactStars;
}
