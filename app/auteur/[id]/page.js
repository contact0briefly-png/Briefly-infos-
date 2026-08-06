import AuteurPage from "@/views/auteur/[id]";

export default function Page({ params }) {
    return <AuteurPage id={params.id} />;
}