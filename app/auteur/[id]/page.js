import { getAuthor } from "../../../lib/news";
import AuthorPage from "../../../views/auteur/[id]";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata({ params }) {

    const { id } = params;

    try {

        const author = await getAuthor(id);

        if (author) {

            return {
                title: `${author.name || "Auteur"} | Briefly Infos`,
                description:
                    author.bio ||
                    `Découvrez les articles publiés par ${author.name || "cet auteur"} sur Briefly Infos.`,

                alternates: {
                    canonical: `https://briefly-lilac.vercel.app/auteur/${id}`,
                },

                openGraph: {

                    title: `${author.name || "Auteur"} | Briefly Infos`,

                    description:
                        author.bio ||
                        "Profil auteur Briefly Infos.",

                    url:
                        `https://briefly-lilac.vercel.app/auteur/${id}`,

                    siteName: "Briefly Infos",

                    images: author.photoUrl
                        ? [
                            {
                                url: author.photoUrl,
                                width: 500,
                                height: 500,
                                alt: author.name,
                            },
                        ]
                        : [],

                    type: "profile",
                },

                twitter: {

                    card: "summary",

                    title:
                        `${author.name || "Auteur"} | Briefly Infos`,

                    description:
                        author.bio ||
                        "Profil auteur Briefly Infos.",

                    images:
                        author.photoUrl
                            ? [author.photoUrl]
                            : [],
                },
            };

        }


    } catch (error) {

        console.error(
            "Erreur metadata auteur :",
            error
        );

    }


    return {
        title: "Auteur | Briefly Infos",
    };
}



export default function Page({ params }) {

    return (

        <AuthorPage
            params={params}
            B24_BLUE="#0047FF"
        />

    );

}