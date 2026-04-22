import Contact from "@/views/Contact";

export const metadata = { 
  title: "Contact | Briefly",
  description: "Une question ou une suggestion ? Contactez l'équipe de Briefly via notre formulaire sécurisé.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Page() { 
  return <Contact B24_BLUE="#0077b5" />; 
}
