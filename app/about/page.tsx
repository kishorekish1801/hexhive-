"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();

  const text =
    language === "en"
      ? {
          about: "About RD nordform AB",
          heroTitle: "We make ideas printable.",
          heroDescription:
            "RD nordform AB is a 3D-printing brand creating unique, practical, and customizable products. We believe that anything you can imagine can become something you can hold, use, display, or gift.",

          exploreProducts: "Explore Our Products",
          createCustom: "Create Something Custom",

          ourIdea: "Our idea",
          imaginationTitle:
            "From imagination to something real.",
          imaginationText1:
            "3D printing gives us the ability to turn digital ideas into physical objects. Instead of producing thousands of identical products, we can create useful and interesting objects one print at a time.",
          imaginationText2:
            "That's what inspires RD nordform AB — creating products that are different, useful, personal, and made with purpose.",

          designedDigitally: "Designed digitally.",
          madePhysically: "Made physically.",

          whatWeDo: "What we do",
          moreThanPrinting:
            "More than just 3D printing.",
          whatWeDoDescription:
            "We combine design, creativity and 3D printing to create products that have a purpose.",

          printingTitle: "3D Printing",
          printingDescription:
            "We create physical products using modern 3D-printing techniques and carefully selected materials.",

          uniqueProducts: "Unique Products",
          uniqueDescription:
            "Our products are designed to be useful, interesting and different from ordinary mass-produced items.",

          customPrinting: "Custom Printing",
          customPrintingDescription:
            "Have your own idea? We can help transform your design or concept into a real 3D-printed object.",

          whyPrinting: "Why 3D printing?",
          differentWay:
            "A different way to make things.",

          personal: "Personal",
          personalDescription:
            "Products can be customized to fit individual needs and ideas.",

          flexible: "Flexible",
          flexibleDescription:
            "Designs can be changed and improved without traditional manufacturing processes.",

          creative: "Creative",
          creativeDescription:
            "Complex shapes and unusual ideas can become physical objects.",

          practical: "Practical",
          practicalDescription:
            "We focus on making things that people can actually use in everyday life.",

          yourIdea: "Your idea",
          whatWillYouMake: "What will you make?",
          finalDescription:
            "Explore our products or bring us your own idea. Let's turn something digital into something real.",

          exploreProductsShort: "Explore Products",
          rights: "All rights reserved.",
        }
      : {
          about: "Om RD nordform AB",
          heroTitle: "Vi gör idéer utskrivbara.",
          heroDescription:
            "RD nordform AB är ett 3D-utskriftsvarumärke som skapar unika, praktiska och anpassningsbara produkter. Vi tror att allt du kan föreställa dig kan bli något du kan hålla i, använda, visa upp eller ge bort.",

          exploreProducts: "Utforska våra produkter",
          createCustom: "Skapa något personligt",

          ourIdea: "Vår idé",
          imaginationTitle:
            "Från fantasi till något verkligt.",
          imaginationText1:
            "3D-utskrift ger oss möjligheten att omvandla digitala idéer till fysiska objekt. I stället för att producera tusentals identiska produkter kan vi skapa användbara och intressanta föremål, en utskrift i taget.",
          imaginationText2:
            "Det är det som inspirerar RD nordform AB — att skapa produkter som är annorlunda, användbara, personliga och tillverkade med ett tydligt syfte.",

          designedDigitally: "Designad digitalt.",
          madePhysically: "Tillverkad fysiskt.",

          whatWeDo: "Vad vi gör",
          moreThanPrinting:
            "Mer än bara 3D-utskrift.",
          whatWeDoDescription:
            "Vi kombinerar design, kreativitet och 3D-utskrift för att skapa produkter med ett tydligt syfte.",

          printingTitle: "3D-utskrift",
          printingDescription:
            "Vi skapar fysiska produkter med moderna 3D-utskriftstekniker och noggrant utvalda material.",

          uniqueProducts: "Unika produkter",
          uniqueDescription:
            "Våra produkter är utformade för att vara användbara, intressanta och annorlunda jämfört med vanliga massproducerade produkter.",

          customPrinting: "Anpassad utskrift",
          customPrintingDescription:
            "Har du en egen idé? Vi kan hjälpa dig att omvandla din design eller ditt koncept till ett riktigt 3D-utskrivet objekt.",

          whyPrinting: "Varför 3D-utskrift?",
          differentWay:
            "Ett annorlunda sätt att skapa saker.",

          personal: "Personlig",
          personalDescription:
            "Produkter kan anpassas efter individuella behov och idéer.",

          flexible: "Flexibel",
          flexibleDescription:
            "Designer kan ändras och förbättras utan traditionella tillverkningsprocesser.",

          creative: "Kreativ",
          creativeDescription:
            "Komplexa former och ovanliga idéer kan bli fysiska objekt.",

          practical: "Praktisk",
          practicalDescription:
            "Vi fokuserar på att skapa saker som människor faktiskt kan använda i vardagen.",

          yourIdea: "Din idé",
          whatWillYouMake: "Vad vill du skapa?",
          finalDescription:
            "Utforska våra produkter eller kom till oss med din egen idé. Låt oss omvandla något digitalt till något verkligt.",

          exploreProductsShort: "Utforska produkter",
          rights: "Alla rättigheter förbehållna.",
        };

  return (
    <main
      className="min-h-screen transition-colors"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="border-b px-6 py-20 text-center transition-colors sm:px-8"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{
              color: "var(--muted)",
            }}
          >
            {text.about}
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            {text.heroTitle}
          </h1>

          <p
            className="mx-auto mt-6 max-w-3xl text-lg leading-8"
            style={{
              color: "var(--muted)",
            }}
          >
            {text.heroDescription}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="rounded-xl px-6 py-3 font-semibold transition hover:opacity-80"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {text.exploreProducts}
            </Link>

            <Link
              href="/custom-print"
              className="rounded-xl border px-6 py-3 font-semibold transition hover:opacity-80"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              {text.createCustom}
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Text */}
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.3em]"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.ourIdea}
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                {text.imaginationTitle}
              </h2>

              <p
                className="mt-6 leading-8"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.imaginationText1}
              </p>

              <p
                className="mt-4 leading-8"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.imaginationText2}
              </p>
            </div>

            {/* 3D Printing Video */}
            <div
              className="relative min-h-[320px] overflow-hidden rounded-3xl border transition-colors"
              style={{
                backgroundColor: "var(--surface-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source
                  src="/videos/about-3d-printing.webm"
                  type="video/webm"
                />

                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT WE DO
      ===================================================== */}

      <section
        className="border-y px-6 py-20 transition-colors sm:px-8"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{
                color: "var(--muted)",
              }}
            >
              {text.whatWeDo}
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              {text.moreThanPrinting}
            </h2>

            <p
              className="mx-auto mt-5 max-w-2xl leading-7"
              style={{
                color: "var(--muted)",
              }}
            >
              {text.whatWeDoDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Printing */}
            <div
              className="rounded-2xl border p-8 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-4xl">
                🖨️
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {text.printingTitle}
              </h3>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.printingDescription}
              </p>
            </div>

            {/* Unique Products */}
            <div
              className="rounded-2xl border p-8 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-4xl">
                ✦
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {text.uniqueProducts}
              </h3>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.uniqueDescription}
              </p>
            </div>

            {/* Custom Printing */}
            <div
              className="rounded-2xl border p-8 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-4xl">
                ⚙
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {text.customPrinting}
              </h3>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.customPrintingDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY 3D PRINTING
      ===================================================== */}

      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{
                color: "var(--muted)",
              }}
            >
              {text.whyPrinting}
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              {text.differentWay}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Personal */}
            <div
              className="rounded-2xl border p-7 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-bold">
                {text.personal}
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.personalDescription}
              </p>
            </div>

            {/* Flexible */}
            <div
              className="rounded-2xl border p-7 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-bold">
                {text.flexible}
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.flexibleDescription}
              </p>
            </div>

            {/* Creative */}
            <div
              className="rounded-2xl border p-7 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-bold">
                {text.creative}
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.creativeDescription}
              </p>
            </div>

            {/* Practical */}
            <div
              className="rounded-2xl border p-7 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-bold">
                {text.practical}
              </h3>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.practicalDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-6 pb-20 sm:px-8">
        <div
          className="mx-auto max-w-6xl rounded-3xl border px-8 py-16 text-center transition-colors"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{
              color: "var(--muted)",
            }}
          >
            {text.yourIdea}
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            {text.whatWillYouMake}
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl leading-7"
            style={{
              color: "var(--muted)",
            }}
          >
            {text.finalDescription}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="rounded-xl px-6 py-3 font-semibold transition hover:opacity-80"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {text.exploreProductsShort}
            </Link>

            <Link
              href="/custom-print"
              className="rounded-xl border px-6 py-3 font-semibold transition hover:opacity-80"
              style={{
                backgroundColor: "var(--surface-secondary)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              {text.createCustom}
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="border-t px-6 py-12 text-center transition-colors sm:px-8"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="mx-auto max-w-3xl border-t pt-6 text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            © 2026 RD nordform AB. {text.rights}
          </div>
        </div>
      </footer>
    </main>
  );
}