import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Map from "@/components/home/Map";
import Offers from "@/components/home/OffersList";
import RecentPurchaseList from "@/components/home/RecentPurchaseList";

export default function Home() {
  return (
    <div>
      <Hero />
      <Offers />
      <Map />
      <RecentPurchaseList />
      <Footer />
    </div>
  );
}
