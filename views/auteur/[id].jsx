"use client";

import React, { useEffect, useState } from "react";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { Clock } from "lucide-react";


const firebaseConfig = {
    apiKey: "AIzaSyDOPeLjRRM88dE665rKZigk2JmA-J9YXek",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.firebasestorage.app",
    messagingSenderId: "634935431290",
    appId: "1:634935431290:web:1dcb513aafc3011133ebc3"
};


const app =
    getApps().length === 0
        ? initializeApp(firebaseConfig)
        : getApps()[0];

const db = getFirestore(app);



const SOCIAL_ICONS = {
    twitter: {
        label: "X / Twitter",
        color: "#000",
        d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },

    facebook: {
        label: "Facebook",
        color: "#1877f2",
        d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },

    instagram: {
        label: "Instagram",
        color: "#e1306c",
        d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919..."
    },

    linkedin: {
        label: "LinkedIn",
        color: "#0077b5",
        d: "M19 0h-14c-2.761 0-5 2.239-5 5v14..."
    },

    tiktok: {
        label: "TikTok",
        color: "#010101",
        d: "M12.525.02c1.31-.02..."
    },

    whatsapp: {
        label: "WhatsApp",
        color: "#25d366",
        d: "M17.472 14.382c-.297..."
    }
};



const AuthorPage = ({ params, B24_BLUE }) => {

    const [author, setAuthor] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);


    // récupération de l'identifiant depuis /auteur/[id]
    const authorId = params?.id;



    useEffect(() => {

        if (!authorId) return;


        const loadAuthor = async () => {

            try {

                // récupération du profil auteur
                const authorSnap = await getDoc(
                    doc(db, "admins", authorId)
                );


                if (authorSnap.exists()) {

                    setAuthor({
                        id: authorSnap.id,
                        ...authorSnap.data()
                    });

                }



                // récupération des articles de cet auteur

                const articlesQuery = query(
                    collection(
                        db,
                        "artifacts",
                        "bbriefly-7e3b8",
                        "public",
                        "data",
                        "news"
                    ),
                    where("authorId", "==", authorId),
                    orderBy("timestamp", "desc")
                );


                const articlesSnap = await getDocs(articlesQuery);


                setArticles(
                    articlesSnap.docs.map((item) => ({
                        id: item.id,
                        ...item.data()
                    }))
                );



            } catch (error) {

                console.error(
                    "Erreur chargement auteur :",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadAuthor();


    }, [authorId]);



    const formatDate = (item) => {

        const timestamp =
            item.timestamp?.seconds ||
            item.lastUpdate?.seconds;


        if (timestamp) {

            return new Date(timestamp * 1000)
                .toLocaleDateString(
                    "fr-FR",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        }


        return "Récemment";

    };
 id="7r2qhp"
    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">
                    Chargement…
                </div>
            </div>
        );
    }


    if (!author) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">

                    <div className="text-[40px] mb-4">
                        ∅
                    </div>

                    <p className="text-[13px] text-slate-500">
                        Auteur introuvable.
                    </p>

                    <a
                        href="/"
                        className="text-[11px] font-bold text-slate-900 underline mt-4 block"
                    >
                        ← Retour à l'accueil
                    </a>

                </div>
            </div>
        );
    }



    const socials = author.socials || {};



    return (

        <div className="bg-white min-h-screen">


            <div className="h-16 md:h-[113px]" />



            {/* HERO PROFIL */}

            <div className="border-b border-slate-200">

                <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">


                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">



                        {/* PHOTO */}

                        <div className="flex-shrink-0">

                            {author.photoUrl ? (

                                <img
                                    src={author.photoUrl}
                                    alt={author.name}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                                />

                            ) : (

                                <div
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-white text-[40px] font-bold shadow-lg"
                                    style={{
                                        backgroundColor:
                                            B24_BLUE || "#0f172a"
                                    }}
                                >

                                    {author.name
                                        ? author.name[0].toUpperCase()
                                        : "B"}

                                </div>

                            )}

                        </div>




                        {/* INFORMATIONS */}

                        <div className="flex-1 text-center md:text-left">


                            <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400 mb-2">

                                {
                                    author.role === "admin_general"
                                        ? "Administrateur"
                                        : "Rédacteur"
                                }

                            </div>



                            <h1
                                className="font-serif font-bold text-[32px] md:text-[40px] text-slate-950 leading-tight mb-3"
                                style={{
                                    fontFamily: "Georgia, serif"
                                }}
                            >

                                {author.name}

                            </h1>




                            {author.bio && (

                                <p className="text-[14px] text-slate-600 leading-relaxed max-w-xl mb-5">

                                    {author.bio}

                                </p>

                            )}






                            {/* STATISTIQUES */}

                            <div className="flex items-center justify-center md:justify-start gap-6 mb-5">


                                <div className="text-center">

                                    <div className="font-serif font-bold text-[24px] text-slate-950">

                                        {articles.length}

                                    </div>

                                    <div className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">

                                        Articles

                                    </div>

                                </div>





                                {author.location && (

                                    <div className="text-center border-l border-slate-200 pl-6">

                                        <div className="text-[13px] font-bold text-slate-700">

                                            {author.location}

                                        </div>


                                        <div className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">

                                            Localisation

                                        </div>

                                    </div>

                                )}



                            </div>






                            {/* RESEAUX SOCIAUX */}


                            {
                                Object.keys(socials).length > 0 && (

                                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">


                                        {
                                            Object.entries(socials).map(
                                                ([key, url]) => {


                                                    if (
                                                        !url ||
                                                        !SOCIAL_ICONS[key]
                                                    )
                                                        return null;



                                                    const {
                                                        label,
                                                        color,
                                                        d
                                                    } = SOCIAL_ICONS[key];



                                                    return (

                                                        <a
                                                            key={key}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={label}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-900 transition-all text-[10px] font-bold text-slate-600 hover:text-slate-900"
                                                        >

                                                            <svg
                                                                width="13"
                                                                height="13"
                                                                viewBox="0 0 24 24"
                                                                fill={color}
                                                            >

                                                                <path d={d} />

                                                            </svg>


                                                            {label}


                                                        </a>

                                                    );


                                                }
                                            )
                                        }


                                    </div>

                                )
                            }



                        </div>


                    </div>


                </div>


            </div>








            {/* ARTICLES */}


            <div className="max-w-[1280px] mx-auto px-4 py-12">


                <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">

                    Articles publiés ({articles.length})

                </div>





                {
                    articles.length === 0 ? (

                        <div className="text-center py-16 text-slate-400">

                            <p className="text-[13px]">

                                Aucun article publié pour le moment.

                            </p>

                        </div>


                    ) : (


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


                            {
                                articles.map((article) => (

                                    <a
                                        key={article.id}
                                        href={`/article/${article.id}`}
                                        className="group block no-underline"
                                    >


                                        <div className="aspect-[16/10] overflow-hidden mb-3">


                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                            />


                                        </div>




                                        <div className="text-[9px] font-black uppercase tracking-[.12em] text-slate-400 mb-1">

                                            {article.category}

                                        </div>





                                        <h3 className="font-serif font-bold text-[16px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors mb-2">


                                            {article.title}


                                        </h3>





                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">


                                            <Clock size={10} />

                                            {formatDate(article)}


                                        </span>




                                    </a>


                                ))
                            }



                        </div>


                    )

                }



            </div>


        </div>

    );

};


export default AuthorPage;