type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {eyebrow && (
          <div className="inline-block bg-white/15 px-4 py-1 rounded-full text-sm font-semibold mb-5">
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl text-orange-100 max-w-3xl mx-auto">{description}</p>
      </div>
    </section>
  );
}
