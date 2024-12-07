'use client';

import Image from 'next/image';
import { IconType } from 'react-icons';
import { GiCoffeeBeans, GiCoffeeCup, GiCakeSlice } from 'react-icons/gi';
import { FaUsers } from 'react-icons/fa';

interface FeatureCard {
  icon: IconType;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  tagline?: string;
  title?: string;
  backgroundColor?: string;
  popColor?: string;
  cards?: FeatureCard[];
}

export default function WhyChooseUsComponent({
  tagline = 'OUR SERVICES',
  title = 'WHY CHOOSE EARTHBREW',
  backgroundColor = '#f6f7f9',
  popColor = '#56382E',
  cards = [
    {
      icon: GiCoffeeBeans,
      title: 'Premium Coffee Beans',
      description: 'We source the finest single-origin beans and craft unique blends, roasted in small batches to ensure peak flavor and freshness.'
    },
    {
      icon: GiCoffeeCup,
      title: 'Artisanal Brewing',
      description: 'Our expert baristas use state-of-the-art equipment and precise techniques to bring out the best in every cup we serve.'
    },
    {
      icon: FaUsers,
      title: 'Expert Baristas',
      description: 'Our certified baristas are passionate about coffee and dedicated to creating the perfect cup tailored to your taste.'
    },
    {
      icon: GiCakeSlice,
      title: 'Fresh Pastries Daily',
      description: 'Complement your coffee with our selection of freshly baked pastries and treats, made from scratch every morning.'
    }
  ]
}: WhyChooseUsProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Section */}
        <div className="h-[500px] overflow-hidden flex" style={{ backgroundColor: popColor }}>
            <div className="grid grid-cols-5 h-full w-full">
              <div className="col-span-3 pt-8 px-8 lg:p-12">
                <p className="text-sm font-bold tracking-wider mb-1 text-white/90">
                  {tagline}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-3xl xl:text-5xl font-bold text-white">
                  {title}
                </h2>
              </div>
              <div className="relative col-span-2 w-full h-full">
                <Image
                  src="/images/transparent-coffee.png"
                  alt="Why Choose Us"
                  width={1000}
                  height={1000}
                  className="absolute right-0 aspect-[3/4] w-auto h-[110%] -top-8 md:-top-12 lg:-top-20 min-w-[350px] md:min-w-[400px] lg:min-w-[450px] object-contain translate-x-0 lg:translate-x-12"
                  priority
                />
              </div>
            </div>
        </div>

        {/* Right Section - Grid of Cards */}
        <div className="grid grid-cols-2 h-[500px]">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="p-6 flex flex-col relative group/card"
                style={{
                  backgroundColor: index === 0 || index === 3 ? backgroundColor : '#2b2b2b',
                  borderRight: index % 2 === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}
              >
                <div 
                  aria-hidden="true"
                  className="absolute inset-0 bg-black opacity-0 transition-opacity duration-[250ms] ease-in-out group-hover/card:opacity-20 group-hover/card:duration-500 -z-10"
                />
                <div 
                  className="w-12 h-12 flex items-center justify-center mb-4 transition-all duration-[250ms] group-hover/card:duration-500 ease-in-out [border-radius:0.5rem] group-hover/card:[border-radius:50%]"
                  style={{ backgroundColor: popColor }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2 relative w-fit after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-[250ms] after:ease-in-out group-hover/card:after:w-full group-hover/card:after:duration-500" 
                  style={{ color: index === 0 || index === 3 ? '#2b2b2b' : 'white' }}
                >
                  {card.title}
                </h3>
                <p className={`text-sm relative ${index === 0 || index === 3 ? 'text-gray-600' : 'text-gray-400'}`}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 