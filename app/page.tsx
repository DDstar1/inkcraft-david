import Image from "next/image";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";

const PRODUCTS = [
  {
    id: 1,
    slug: "artisan-heavy-hoodie",
    name: "Artisan Heavy Hoodie",
    price: "$58.00",
    badge: "Best Seller",
    src: "https://lh3.googleusercontent.com/aida/AP1WRLuRROPOVPvTU8xskuZQOIFrTVUldbw1rKyR9k86JHfUxk9YfoEHzyMNmAVE2vM2MhKCmUK_6-NAp6vLroLuiwSq7TYbnUEce3CrNn7uq0smEotUKxjtPZw8IHZnFzb8yWNuAoF5GjiNXJFj5VzVJ9iAmLcACW7_DUY6V_Ww4VosJFBL7QRNwazYDP38kEqxCm5jusXAjmKpXUa7oBjbvuLkqKuQBbFRS4BRDroh3IWzolyJ_89wj9qrJgr9",
    alt: "Premium Hoodie",
  },
  {
    id: 2,
    slug: "signature-crewneck",
    name: "Signature Crewneck",
    price: "$42.00",
    badge: null,
    src: "https://lh3.googleusercontent.com/aida/AP1WRLvkhORFab1pV-ig6iOeFydThQlZwIZFLy0GxCiJ8VNxfudVxe87VHGwaDI10nvLjUBVZxMR4USfmpISrCyCdN0oT3wA02ebeuTqIvOttk2VzjdChnlCnhF3mfIrKw7Na45Uon5kZ6FubI6-kmVBX6H5_WLwlM_rHi4yCDr1KlQFlBDjVZECJ-bd0G5rYM7C1OlkmYeRd_5wGsgd238xL1SbituaTApFaSgTWSSrSQLBerw8CHqN9SSmJSs",
    alt: "White Crewneck",
  },
  {
    id: 3,
    slug: "essential-boxy-tee",
    name: "Essential Boxy Tee",
    price: "$34.00",
    badge: null,
    src: "https://lh3.googleusercontent.com/aida/AP1WRLs24fxUmY7vt4i_xqFGgv01Y6WuQufEZy1tNJyKYJHlczqkAWoGfivZnqG2ljB9An5nQZ-KKL5mXAwrggLVp7GpkIEUQbyvgUPza5afLNh90Djw5PUyfFtY4U-rrWo_QjdJvftDO049M9B1bO1kGdEYR3Mb_BluIH9e1i-F31lpPrlBAhKzsEZYBSFH6m-2H8fD7ooR5Jfs1iasXjFvKL-VqzzooycgFPQKwl_i1aj6l0pGFfBBX4pwFkE",
    alt: "Black T-shirt",
  },
  {
    id: 4,
    slug: "classic-zip-hoodie",
    name: "Classic Zip Hoodie",
    price: "$64.00",
    badge: null,
    src: "https://lh3.googleusercontent.com/aida/AP1WRLtgd5GkpB5ZFa-cNpTQaZsQNTAH3Ka5A9-urLzGR77VYjUPPnmW29wdIIQBwSG5jDLehTINZ23YrSc26sd8AaRirf5c68Zgo48b6XIyu-XMjg4DUZKlE8Zng5my2RTlR4fMPSickAte2rJtqiyadpImOpFHZm9iopF2e2b-PsLhOvdZ2Baw8cuSjJUK42AQh_n_77VnjYE3MxB1I0C06cAWPy18w4vvkYnc8Wt4WSoHavuKRKaMcBNQY_8",
    alt: "Zip Hoodie",
  },
  {
    id: 5,
    slug: "heritage-pocket-tee",
    name: "Heritage Pocket Tee",
    price: "$38.00",
    badge: null,
    src: "https://lh3.googleusercontent.com/aida/AP1WRLsLA-0ArF2j0cphSm0LQT-M0YA8MxX_1tlF41AV83HMR_nR4s1ltjCuO9JLhlAjBNPzq-WsmPzcYFrJtd8lcthNDmh2DsQBMUu1vJ6lXoiqvg6rgua9NSCM1dUFiO0Cc2M1x7GlDh5Tf-bUohJRhcPWM2v6UXluDVQcLQt78uscJfzr3lwrzUqmZFxbeWIJDLAz2SYVVw5T3x8nVTibPtHfL2ElpX-2I9oHyk8bQsAndMFxr_LCCa8kwD97",
    alt: "Pocket Tee",
  },
];

export default function Home() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-margin-desktop h-16 w-full max-w-7xl mx-auto">
          <div className="text-title-md font-bold text-primary">InkCraft by David</div>
          <div className="hidden md:flex gap-lg items-center">
            <Link className="text-primary font-bold border-b-2 border-primary pb-1 text-body-md" href="/">Shop</Link>
            <Link className="text-on-surface hover:text-primary transition-colors duration-200 text-body-md" href="/design">Design</Link>
            <Link className="text-on-surface hover:text-primary transition-colors duration-200 text-body-md" href="/admin">Admin</Link>
          </div>
          <div className="flex items-center gap-md">
            <CartBadge />
            <button className="material-symbols-outlined text-on-surface hover:text-primary transition-all active:opacity-80">
              account_circle
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-xl">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] flex items-center overflow-hidden bg-[#0D2B3E] px-margin-desktop">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-xl w-full">
            <div className="z-10">
              <h1 className="text-display text-primary mb-base">Premium Canvas.</h1>
              <h2 className="text-headline-lg text-on-surface mb-md">
                Your Art,{" "}
                <span className="text-primary-container">Exquisitely Printed.</span>
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-md mb-lg">
                Elevate your brand with professional-grade print-on-demand. High-fidelity
                production for artists who refuse to compromise on quality.
              </p>
              <button className="bg-primary-container text-on-tertiary px-lg py-md rounded-lg text-label-md hover:brightness-110 transition-all active:scale-95">
                VIEW NEW ARRIVALS
              </button>
            </div>
            <div className="relative h-full flex justify-center items-center">
              <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <Image
                src="https://lh3.googleusercontent.com/aida/AP1WRLuG-NYDFZaMtDAQtoYsn7hZBLgRm1JDE2nI_U4slEIjXLvoGmV_L7H-UP5QgRCyj2_alaH5LD8hU3KTcmZxSBWkN2RVYlL8dD3Es1WMgZprdyhKVnzd9YNWdBBspbsyzeKkR3YmzNH1JRpW1TQsOwC2sjYnGhbN005E74vDUxYvKqOyMl4ziZdZAcmSs6z6P5AJCd_HLv4FyM246yOClWwx4JmVLrp9t8SjGZAR94yEX9E61qWpa5NwV-Dq"
                alt="Premium White T-shirt Mockup"
                width={400}
                height={500}
                priority
                className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Product Explorer */}
        <div className="max-w-7xl mx-auto px-margin-desktop mt-xl">
          <div className="flex flex-col md:flex-row gap-lg">

            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 space-y-lg">
              <div className="glass-card p-md rounded-lg">
                <h3 className="text-title-md text-primary mb-md">Filters</h3>

                {/* Garment Type */}
                <div className="space-y-sm">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-widest">
                    Garment Type
                  </span>
                  <div className="space-y-xs mt-base">
                    {["T-shirts", "Crewnecks", "Accessories"].map((item) => (
                      <label key={item} className="flex items-center gap-sm cursor-pointer group">
                        <input
                          type="checkbox"
                          className="rounded border-outline bg-transparent text-primary focus:ring-primary w-4 h-4"
                        />
                        <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                          {item}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-outline bg-transparent text-primary focus:ring-primary w-4 h-4"
                      />
                      <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                        Hoodies
                      </span>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mt-lg space-y-sm">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-widest">
                    Price Range
                  </span>
                  <div className="mt-base">
                    <input
                      type="range"
                      className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-xs text-caption text-on-surface-variant">
                      <span>$20</span>
                      <span>$150</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-primary-container p-md rounded-lg text-on-primary">
                <span
                  className="material-symbols-outlined mb-base block"
                  style={{ fontSize: "64px", fontVariationSettings: "'FILL' 1" }}
                >
                  local_shipping
                </span>
                <h4 className="text-title-md font-bold mb-xs">Free Shipping</h4>
                <p className="text-body-md opacity-90">
                  On all orders over $75. Professional packaging guaranteed.
                </p>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-lg">
                <span className="text-body-md text-on-surface-variant">
                  Showing 12 Premium Items
                </span>
                <div className="flex items-center gap-base">
                  <span className="text-label-md text-on-surface-variant">Sort by:</span>
                  <select className="bg-transparent border-none text-primary text-label-md focus:ring-0 cursor-pointer">
                    <option>Popularity</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="glass-card glass-card-hover rounded-lg overflow-hidden group"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-high">
                      <Image
                        src={product.src}
                        alt={product.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.badge && (
                        <div className="absolute top-md right-md bg-secondary-container px-base py-xs rounded-full text-caption text-white z-10">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-md">
                      <h3 className="text-title-md text-on-surface">{product.name}</h3>
                      <p className="text-body-md text-on-surface-variant mt-xs">{product.price}</p>
                      <Link
                        href={`/design?garment=${product.slug}`}
                        className="block w-full mt-md bg-primary-container text-on-primary py-sm rounded-lg text-label-md text-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                      >
                        Start Designing
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Custom Request Card */}
                <div className="glass-card glass-card-hover rounded-lg overflow-hidden border-2 border-primary/20">
                  <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-high flex items-center justify-center bg-gradient-to-br from-surface-container-high to-[#0D2B3E]">
                    <div className="text-center p-md">
                      <span
                        className="material-symbols-outlined text-primary mb-md block"
                        style={{ fontSize: "64px" }}
                      >
                        add_circle
                      </span>
                      <p className="text-title-md text-on-surface">Custom Request</p>
                      <p className="text-caption text-on-surface-variant mt-base">
                        Need a specific garment type?
                      </p>
                    </div>
                  </div>
                  <div className="p-md text-center">
                    <button className="w-full bg-transparent border border-primary text-primary py-sm rounded-lg text-label-md hover:bg-primary/10 transition-colors">
                      Inquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-lg mt-auto border-t border-white/5 bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-base px-margin-desktop w-full max-w-7xl mx-auto">
          <div className="text-body-lg text-primary mb-md font-bold">InkCraft by David</div>
          <div className="flex flex-wrap justify-center gap-lg mb-lg">
            {["Terms of Service", "Contact Us", "Privacy Policy", "Shipping"].map((link) => (
              <a
                key={link}
                className="text-on-surface-variant hover:text-on-surface transition-colors text-caption"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-on-surface-variant text-caption">
            © 2024 InkCraft by David. All rights reserved.
          </p>
        </div>
      </footer>

      {/* FAB */}
      <button className="fixed bottom-margin-mobile right-margin-mobile md:bottom-md md:right-md bg-primary-container text-on-tertiary w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 active:scale-90 transition-transform">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          edit_note
        </span>
      </button>
    </>
  );
}
