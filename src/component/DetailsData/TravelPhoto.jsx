import Image from "next/image";

export default function TravelerPhoto() {
  return (
    <section className="max-w-3xl   py-6">
      <h2 className="font-bold text-3xl mb-6">Traveler Photos</h2>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left big image */}
        <div className="relative col-span-2 h-[420px] rounded-xl overflow-hidden">
          <Image
            src="/images/bangkok1.webp"
            alt="Traveler"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right images */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative h-[200px] rounded-xl overflow-hidden">
            <Image
              src="/images/bangkok2.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative h-[200px] rounded-xl overflow-hidden">
            <Image
              src="/images/bangkok3.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative h-[200px] rounded-xl overflow-hidden">
            <Image
              src="/images/bangkok4.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* See more */}
          <div className="relative h-[200px] rounded-xl overflow-hidden group cursor-pointer">
            <Image
              src="/images/dubai.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
