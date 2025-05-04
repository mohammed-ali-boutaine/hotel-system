# Cahier des Charges: Hotel Management Web App

## Présentation Générale du Projet

### Titre du Projet

**Hotel Management Web App**

### Objectif du Projet

Développer une application web complète pour faciliter la gestion et la réservation d'hébergements hôteliers, permettant aux utilisateurs de rechercher, réserver des chambres, et gérer leurs réservations, tout en offrant un panneau d'administration pour les gestionnaires d'hôtel.

### Contexte

Ce projet vise à simplifier le processus de réservation hôtelière et à fournir une plateforme centralisée pour la gestion des hôtels et des réservations.

### Enjeux

- Offrir une expérience utilisateur intuitive et fluide.
- Garantir la sécurité des données des utilisateurs et des transactions.
- Fournir des outils efficaces pour la gestion des hôtels et des réservations.

### Problématiques

- Assurer la disponibilité des chambres en temps réel pour éviter les doubles réservations.
- Gérer efficacement les annulations et modifications de réservations.
- Fournir une interface utilisateur simple et accessible pour les clients et administrateurs.
- Intégrer une solution de géolocalisation fiable pour les hôtels.
- Gérer les contenus multimédias (images des chambres, hôtels) sans alourdir le système.
- Offrir une évolutivité pour répondre à l'ajout de nouveaux hôtels ou fonctionnalités.
- Navigation vers un hôtel via Google Maps API.

## Description des Besoins

### Guest User Stories

- **Rechercher des hôtels** : Recherche par localisation, date et budget.
- **Consulter les détails des hôtels** : Affichage des équipements, types de chambres, localisation.
- **Vérifier la disponibilité des chambres** : Consultation des disponibilités selon les dates choisies.
- **Consulter les détails des chambres** : Affichage des photos, descriptions, prix.
- **Réserver une chambre** : Sélection des dates d'arrivée et de départ.
- **Paiement sécurisé** : (À confirmer) Paiement en ligne pour finaliser la réservation.
- **Afficher l'emplacement sur une carte** : (À confirmer) Intégration d'une carte pour visualiser la localisation.
- **Historique des réservations** : Consultation des réservations passées.
- **Modifier/Annuler une réservation** : Gestion des réservations en cas de changement de plans.

### Owner User Stories

- **Gérer les hôtels** : Ajouter, modifier ou supprimer des informations.
- **Gérer les chambres** : Ajouter, modifier ou supprimer des chambres (type, disponibilité, prix).
- **Gérer les réservations** : Visualiser et organiser toutes les réservations.
- **Consulter la disponibilité des chambres** : Éviter les sur-réservations.
- **Gérer les images des chambres** : Téléchargement et gestion des photos.
- **Générer des rapports** : (À confirmer) Suivi des performances (occupations, revenus).
- **Gérer les comptes utilisateurs** : Administration des comptes invités.
- **Envoyer des notifications** : (À confirmer) Notifications sur les réservations.
- **Chat** : (À confirmer)

### Admin User Stories

- **Gérer les hôtels** : Voir ou supprimer tous les hôtels.
- **Gérer les chambres** : Voir ou supprimer toutes les chambres.
- **Gérer les réservations** : Visualiser toutes les réservations.
- **Consulter la disponibilité des chambres** : Éviter les sur-réservations.
- **Gérer les comptes utilisateurs** : Administration des comptes invités.

## Technologies

- **Frontend** : React/Zustand, TypeScript, Tailwind
- **Backend** : Laravel (MVC) - API
- **Base de données** : PostgreSQL
- **Sécurité** : Authentification avec clé API (JWT)
- **Hébergement** : (À confirmer) Docker + Azure ou AWS

## Planning du Projet

| Lot                               | Taches | Signification                     | Durée | Prédécesseur |
| --------------------------------- | ------ | --------------------------------- | ----- | ------------ |
| **Phase d'Analyse et Conception** | A      | Analyse                           | 3     | -            |
|                                   | B      | UML                               | 7     | A            |
|                                   | C      | Design UI (Figma)                 | 10    | B            |
| **Développement**                 | D      | Développement Frontend            | 40    | C            |
|                                   | E      | Développement Backend             | 40    | C            |
| **Tests et Déploiement**          | F      | Tests et corrections              | 7     | D,E          |
|                                   | G      | Déploiement et mise en production | 5     | F            |
| **Totale**                        |        | 2 mois et 3 jours                 |       |              |

