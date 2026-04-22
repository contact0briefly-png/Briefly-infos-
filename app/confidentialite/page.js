import Confidentialite from "@/views/confidentialite";

export const metadata = { 
  title: "Confidentialité | Briefly",
  description: "Consultez notre politique de confidentialité pour comprendre comment Briefly protège vos données personnelles.",
  alternates: {
    canonical: "/confidentialite",
  },
};

export default function Page() { 
  return <Confidentialite B24_BLUE="#0077b5" />; 
}
