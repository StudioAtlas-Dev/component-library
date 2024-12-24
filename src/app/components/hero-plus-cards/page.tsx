import HeroPlusCardsComponent from './HeroPlusCardsComponent';
import { FiTarget, FiTrendingUp, FiUsers, FiShield, FiAward, FiClock, FiGlobe, FiHeart } from 'react-icons/fi';

export default function Page() {
  // Full set of 8 cards
  const allCards = [
    {
      icon: FiTarget,
      title: '100% Success Rate',
      description: 'We consistently deliver results that exceed expectations, ensuring your business goals are met with precision and excellence.'
    },
    {
      icon: FiUsers,
      title: 'Expert Services',
      description: 'Our team of seasoned professionals brings decades of combined experience to deliver top-tier consulting solutions.'
    },
    {
      icon: FiTrendingUp,
      title: 'Business Strategy',
      description: 'Develop comprehensive strategies that drive growth, optimize operations, and maximize your competitive advantage.'
    },
    {
      icon: FiShield,
      title: 'Highly Recommend',
      description: 'Join our satisfied clients who consistently rate our services as exceptional and recommend us to their network.'
    },
    {
      icon: FiAward,
      title: 'Industry Leading',
      description: 'Recognized as a leader in our field, setting the standard for excellence and innovation in business solutions.'
    },
    {
      icon: FiClock,
      title: 'Time Efficient',
      description: 'Our streamlined processes ensure quick implementation while maintaining the highest quality standards.'
    },
    {
      icon: FiGlobe,
      title: 'Global Reach',
      description: 'Serve clients worldwide with localized solutions that consider cultural and market-specific needs.'
    },
    {
      icon: FiHeart,
      title: 'Client Focused',
      description: 'Put our clients first with personalized attention and dedicated support throughout every engagement.'
    }
  ];

  // To test different quantities, slice the array
  // Example: for 4 cards use allCards.slice(0, 4)
  const numberOfCardsToShow = 8;
  const cards = allCards.slice(0, numberOfCardsToShow);

  return (
    <div className="min-h-screen">
      <HeroPlusCardsComponent cards={cards}/>
    </div>
  );
} 