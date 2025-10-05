// "use client";
import { getFeaturedCars } from "@/actions/home";
import { serializedCarData } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/ui/CarCard";
import { bodyTypes, carMakes, featuredCars, faqItems } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Car, Calendar, Shield } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; 
import { SignedOut } from "@clerk/nextjs";
import HomeSearch from "@/components/ui/HomeSearch";

export default async function Home() {
  const featuredCars= await getFeaturedCars()
  return (
    <div className="pt-20 flex flex-col">
      {/* Hero */}
      <section className="relative py-16 md:py-28 dotted-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-8xl mb-4 gradient-title">
              Find your Dream Car With Gear Vana
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              Advanced AI Car Search and test drive from thousands of Cars.
            </p>
          </div>
          <HomeSearch/>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-12 px-4 sm:px-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Featured Cars</h2>
              <Button variant="ghost" className="flex items-center" asChild>
                <Link href="/cars">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse By Make */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Browse By Make</h2>
              <Button variant="ghost" className="flex items-center" asChild>
                <Link href="/cars">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {carMakes.map((make) => (
                <Link
                  key={make.name}
                  href={`/cars?make=${make.name}`}
                  className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
                >
                  <div className="relative w-full h-20 mb-2">
                    <Image
                      src={make.image}
                      alt={make.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium">{make.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of verified vehicles from trusted dealerships and private sellers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
              <p className="text-gray-600">
                Schedule a test drive at your convenience directly through our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 text-purple-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Process</h3>
              <p className="text-gray-600">
                Verified listing and secure transactions for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse By Body Type */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Browse By Body Type</h2>
              <Button variant="ghost" className="flex items-center" asChild>
                <Link href="/cars">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bodyTypes.map((type) => (
                <Link
                  key={type.name}
                  href={`/cars?bodyTypes=${type.name}`}
                  className="relative group cursor-pointer"
                >
                  <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                    <h3 className="text-white text-xl font-bold pl-4 pb-2">{type.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg bg-white shadow-md w-full"
              >
                <AccordionTrigger className="px-6 py-5 text-left text-lg font-semibold text-gray-800 hover:bg-gray-100 w-full flex justify-between items-center">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600 border-t border-gray-200">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 dotted-background text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready To Find Your Dream Car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join Thousands of Happy Customers and Start Your Journey with Gaadi Dekho Today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}

