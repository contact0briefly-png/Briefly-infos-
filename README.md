# Briefly Admin — Application Mobile Android

Application mobile Android installable pour l'administration de Briefly Infos (`tg.BrieflyInfos.admin`), alimentée par Supabase et Firebase Cloud Messaging.

## 🚀 Fonctionnalités principales

1. **Protection par verrouillage système (vélo / verrou)** :
   - Au lancement et au retour en arrière-plan, l'application sollicite le système de verrouillage natif du téléphone (empreinte digitale, reconnaissance faciale ou code PIN / schéma).
   - Masque de sécurité empêchant toute consultation non autorisée des données sensibles.

2. **Navigation optimisée du bouton Retour matériel** :
   - L'appui sur le bouton Retour ne quitte pas immédiatement l'application :
     - Si le menu latéral ou le volet de notification est ouvert, il le referme.
     - Si une modale ou un sous-onglet est actif, il revient à la vue principale.
     - Si vous êtes sur un autre onglet, il revient à l'onglet principal des statistiques.
     - Sur la page d'accueil, une confirmation par double appui est requise pour quitter.

3. **Système de notifications push & Volet intégré** :
   - Intégration Firebase Cloud Messaging avec le projet `bbriefly-7e3b8`.
   - Notification push instantanée lors de la réception d'un message depuis le formulaire Contact du site web.
   - Volet de notification déroulant pour consulter rapidement les messages et alertes système.

4. **Nouveau menu en haut à gauche (Tiroir latéral)** :
   - Remplacement de la barre de navigation inférieure par un menu latéral élégant.
   - En-tête avec photo de profil de l'utilisateur connecté, son nom, son rôle et un bouton « Modifier mon profil ».

## 📦 Compilation automatique de l'APK (GitHub Actions)

L'APK signé Release est généré automatiquement par GitHub Actions :
- Rendez-vous dans l'onglet **Actions** du dépôt GitHub.
- Téléchargez l'artefact **BrieflyAdmin-APK** ou rendez-vous dans la section **Releases** pour installer `BrieflyAdmin.apk` sur votre téléphone Android.
