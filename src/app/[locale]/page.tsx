import { setRequestLocale } from "next-intl/server";
import { TopBar } from "@/components/TopBar";
import { SecondaryNav } from "@/components/SecondaryNav";
import { ScrollHero } from "@/components/ScrollHero";
import { ProductsStrip } from "@/components/ProductsStrip";
import { CraftSection } from "@/components/CraftSection";
import { Footer } from "@/components/Footer";

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <TopBar />
      <div className="fixed inset-x-0 top-[64px] z-30 md:top-[68px]">
        <SecondaryNav />
      </div>
      <ScrollHero />
      <CraftSection />
      <ProductsStrip />
      <Footer />
    </main>
  );
}
