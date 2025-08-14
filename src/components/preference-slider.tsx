import { useEffect, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface PreferenceSliderProps {
  children: React.ReactNode[];
  title: string;
}

export function PreferenceSlider({ children, title }: PreferenceSliderProps) {
  const [isClient, setIsClient] = useState(false);
  const [slider, setSlider] = useState<Slider | null>(null);

  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-1">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => slider?.slickPrev()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => slider?.slickNext()}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden">
        <Slider ref={(c) => setSlider(c)} {...settings}>
          {children.map((child, index) => (
            <div key={index} className="px-1">
              {child}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
