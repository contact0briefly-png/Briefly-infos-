export const metadata = {
  title: "À propos | Briefly",
  description: "Briefly est un média d'actualités concises sur le Togo et le monde. Découvrez notre mission, notre ligne éditoriale et notre équipe.",
  alternates: { canonical: "/a-propos" },
};

const B24_BLUE = "#0077b5";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-800">
      <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: B24_BLUE }}>À propos</span>
      <h1 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter mt-3 mb-8">
        Briefly<span style={{ color: B24_BLUE }}>.</span> L'info à l'essentiel
      </h1>

      <section className="space-y-4 leading-relaxed text-lg">
        <p>
          Briefly est un média d'actualités en ligne basé à Lomé, au Togo. Nous résumons l'information du Togo, de l'Afrique et du monde
          en articles clairs et rapides à lire, pour que chacun puisse se tenir informé en quelques minutes, depuis son téléphone.
        </p>
        <h2 className="text-2xl font-black mt-10">Notre mission</h2>
        <p>
          Rendre l'actualité accessible : des faits vérifiés, un langage simple, et des sources citées lorsque c'est possible.
        </p>
        <h2 className="text-2xl font-black mt-10">Ligne éditoriale</h2>
        <p>
          Nous publions des articles par catégories (politique, économie, société, sport, technologie, culture…). Chaque article est signé
          par son auteur. Nous corrigeons toute erreur signalée : écrivez-nous via la page <a className="underline" href="/contact">Contact</a>.
        </p>
        <h2 className="text-2xl font-black mt-10">L'équipe</h2>
        <p>
          Briefly est édité par KJ Technologies. Les rédacteurs sont présentés sur leur page auteur, accessible depuis chaque article.
          Voir aussi nos <a className="underline" href="/mentionslegales">mentions légales</a> et notre <a className="underline" href="/confidentialite">politique de confidentialité</a>.
        </p>
        <h2 className="text-2xl font-black mt-10">Nous contacter</h2>
        <p>
          <a className="underline" href="mailto:contact0briefly@gmail.com">contact0briefly@gmail.com</a>
        </p>
      </section>
    </main>
  );
}
