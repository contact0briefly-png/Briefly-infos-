import MentionsLegales from "@/views/mentionslegales";

export const metadata = { 
  title: "Mentions Légales | Briefly",
  description: "Informations légales concernant l'édition, l'hébergement et le développement de la plateforme Briefly.",
  alternates: {
    canonical: "/mentions-legales", // Vérifie que ton dossier s'appelle bien ainsi
  },
};

export default function Page() { 
  return <MentionsLegales B24_BLUE="#0077b5" />; 
}
