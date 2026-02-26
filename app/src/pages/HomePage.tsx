import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Hero from '../sections/public/Hero';
import SearchSection from '../sections/public/SearchSection';
import ProjectsCarousel from '../sections/public/ProjectsCarousel';
import MapSection from '../sections/public/MapSection';
import ReviewsSection from '../sections/public/ReviewsSection';
import InquirySection from '../sections/public/InquirySection';
import Footer from '../sections/public/Footer';

export default function HomePage() {
  const { fetchProjects, fetchApprovedReviews, fetchSettings } = useData();

  useEffect(() => {
    fetchProjects();
    fetchApprovedReviews();
    fetchSettings();
  }, [fetchProjects, fetchApprovedReviews, fetchSettings]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main>
        <Hero />
        <SearchSection />
        <ProjectsCarousel />
        <MapSection />
        <ReviewsSection />
        <InquirySection />
      </main>
      <Footer />
    </div>
  );
}
