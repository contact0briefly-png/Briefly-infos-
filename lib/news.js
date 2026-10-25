import { supabase } from './supabase';

const LIST_COLS =
    'id,title,category,image_url,author_id,author_name,author_photo_url,tags,date_label,views,created_at,updated_at,author:author_id(photo_url)';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const sec = (iso) => (iso ? { seconds: Math.floor(new Date(iso).getTime() / 1000) } : null);

// Même forme que les anciennes données Firestore pour que les pages n'aient presque rien à changer
export const mapNews = (r) => ({
    id: r.id,
    title: r.title,
    content: r.content,           // absent des listes
    category: r.category,
    imageUrl: r.image_url || '',
    authorId: r.author_id || '',
    authorName: r.author_name || '',
    authorPhotoUrl: r.author_photo_url || r.author?.photo_url || '',
    tags: r.tags || [],
    date: r.date_label || '',
    views: r.views || 0,
    timestamp: sec(r.created_at),
    lastUpdate: sec(r.updated_at),
});

export async function getNewsList() {
    const { data, error } = await supabase.from('news').select(LIST_COLS).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapNews);
}

export async function getArticle(id) {
    const { data, error } = await supabase
        .from('news').select(`*,author:author_id(photo_url)`).eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapNews(data) : null;
}

// Accepte un identifiant de profil (uuid) OU un ancien identifiant Firebase
export async function getAuthor(idOrLegacy) {
    if (!idOrLegacy) return null;
    let query = supabase.from('profiles').select('*');
    if (UUID.test(idOrLegacy)) {
        query = query.or(`id.eq.${idOrLegacy},user_id.eq.${idOrLegacy}`);
    } else {
        query = query.eq('legacy_uid', idOrLegacy);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return null;

    let parsedSocials = {};
    if (data.socials) {
        if (typeof data.socials === 'string') {
            try { parsedSocials = JSON.parse(data.socials); } catch (e) {}
        } else if (typeof data.socials === 'object') {
            parsedSocials = data.socials;
        }
    }

    return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        role: data.role,
        photoUrl: data.photo_url || '',
        bio: data.bio || '',
        location: data.location || '',
        socials: parsedSocials,
    };
}

export async function getNewsByAuthor(profileId) {
    const { data, error } = await supabase
        .from('news').select(LIST_COLS).eq('author_id', profileId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapNews);
}

export const addView = (id) => supabase.rpc('increment_views', { p_id: id });
