import { getArticle, getNewsList } from "../../../lib/news";
import ArticleView from "../../../views/ArticleView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { slug } = params;
    try {
        const article = await getArticle(slug);
        if (article) {
            const description = article.summary || article.content?.replace(/<[^>]*>/g, '').slice(0, 150);
            const articleUrl = `/article/${slug}`;

            return {
                title: article.title,
                description: description,
                alternates: { canonical: articleUrl },
                openGraph: {
                    title: article.title,
                    description: description,
                    url: `https://briefly-lilac.vercel.app${articleUrl}`,
                    images: article.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630 }] : [],
                    type: 'article',
                    siteName: 'Briefly',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: article.title,
                    description: description,
                    images: article.imageUrl ? [article.imageUrl] : [],
                },
            };
        }
    } catch (e) {
        return { title: "Briefly | Article" };
    }
    return { title: "Briefly | Article" };
}

export default async function Page({ params }) {
    const { slug } = params;

    const [article, allNews] = await Promise.all([getArticle(slug), getNewsList()]);

    if (!article) {
        return <div className="p-10 text-center font-bold">Article introuvable</div>;
    }

    return <ArticleView article={article} news={allNews} B24_BLUE="#0047FF" />;
}
