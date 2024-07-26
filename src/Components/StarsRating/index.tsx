// src/components/StarRating.tsx

import {
  faStar,
  faStarHalfAlt,
  faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = (rating / 100) * 5;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars - fullStars >= 0.5;

  return (
    <div>
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <FontAwesomeIcon key={index} icon={faStar} color="gold" />;
        } else if (index === fullStars && hasHalfStar) {
          return (
            <FontAwesomeIcon key={index} icon={faStarHalfAlt} color="gold" />
          );
        } else {
          return (
            <FontAwesomeIcon key={index} icon={faStarEmpty} color="lightgray" />
          );
        }
      })}
    </div>
  );
};

export default StarRating;
