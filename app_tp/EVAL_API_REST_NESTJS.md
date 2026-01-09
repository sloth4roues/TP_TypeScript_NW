# TP Noté - Application de Gestion de Bibliothèque

**Durée : 8 heures**  
**Note sur 20 points**

---

## 📋 Contexte

Vous devez développer une API REST complète pour la gestion d'une bibliothèque universitaire.

L'application doit permettre de gérer les utilisateurs, les livres, les emprunts et les réservations avec un système d'authentification basé sur les rôles et une whitelist d'utilisateurs autorisés.

---

## 🎯 Objectifs

Votre application devra démontrer la maîtrise des concepts suivants :

- Organisation modulaire du code
- Séparation des responsabilités (logique métier, accès aux données, contrôleurs)
- Validation des données d'entrée
- Transformation et sérialisation des données de sortie
- Gestion de l'authentification et des autorisations
- Gestion des relations entre entités (1-to-Many et Many-to-Many)

---

## 📚 Modèle de Données

### Entités à Gérer

#### User (Utilisateur)

L'application doit stocker les informations suivantes pour chaque utilisateur :

- Identifiant unique
- Email (unique)
- Mot de passe (doit être sécurisé)
- Prénom et nom
- Rôle : STUDENT, LIBRARIAN ou ADMIN
- Statut whitelist (indique si l'utilisateur est autorisé à se connecter)
- Dates de création et de modification

**Relations fonctionnelles :**

- Un utilisateur peut effectuer plusieurs emprunts
- Un utilisateur peut réserver plusieurs livres
- Un utilisateur peut avoir plusieurs réservations simultanées
- Un utilisateur peut donner plusieurs avis (un par livre emprunté)
- Un utilisateur peut avoir plusieurs entrées dans l'historique d'activité

#### Book (Livre)

L'application doit stocker les informations suivantes pour chaque livre :

- Identifiant unique
- ISBN (unique)
- Titre, auteur, éditeur
- Année de publication
- Nombre d'exemplaires disponibles (doit être mis à jour automatiquement)
- Nombre total d'exemplaires

**Relations fonctionnelles :**

- Un livre peut être emprunté plusieurs fois (historique des emprunts)
- Un livre peut être réservé par plusieurs utilisateurs simultanément
- Un livre peut recevoir plusieurs avis de différents utilisateurs

#### Borrowing (Emprunt)

L'application doit enregistrer chaque emprunt avec :

- Identifiant unique
- Date d'emprunt
- Date d'échéance (calculée automatiquement : date d'emprunt + 30 jours)
- Date de retour (null si non retourné)
- Statut : ACTIVE, RETURNED, OVERDUE

**Relations fonctionnelles :**

- Chaque emprunt est associé à un utilisateur
- Chaque emprunt concerne un livre spécifique

#### Review (Avis)

L'application doit enregistrer les avis des utilisateurs sur les livres avec :

- Identifiant unique
- Note (de 1 à 5)
- Commentaire (optionnel, texte libre)
- Date de création
- Date de modification

**Relations fonctionnelles :**

- Chaque avis est associé à un utilisateur
- Chaque avis concerne un livre spécifique
- Un utilisateur ne peut avoir qu'un seul avis par livre

#### ActivityLog (Historique d'Activité)

L'application doit enregistrer l'historique des actions importantes avec :

- Identifiant unique
- Type d'action (enum : BOOK_CREATED, BOOK_UPDATED, BOOK_DELETED, BORROWING_CREATED, BORROWING_RETURNED, RESERVATION_CREATED, RESERVATION_CANCELLED, USER_ROLE_UPDATED, USER_WHITELIST_UPDATED, etc.)
- Utilisateur ayant effectué l'action
- Détails de l'action (JSON ou texte)
- Date et heure de l'action

**Relations fonctionnelles :**

- Chaque entrée d'historique est associée à l'utilisateur ayant effectué l'action

---

## 🔐 Système d'Authentification et de Rôles

### Rôles et Permissions

L'application doit gérer trois rôles avec les permissions suivantes :

- **STUDENT** : Utilisateur standard
  - Peut consulter les livres disponibles
  - Peut emprunter des livres disponibles
  - Peut réserver des livres non disponibles
  - Peut consulter ses propres emprunts et réservations
  - Peut consulter ses propres statistiques
  - Peut noter et commenter les livres qu'il a empruntés
  - Peut consulter les avis des autres utilisateurs sur les livres

- **LIBRARIAN** : Bibliothécaire
  - Toutes les permissions d'un STUDENT
  - Peut créer, modifier et supprimer des livres
  - Peut consulter tous les emprunts et réservations
  - Peut enregistrer le retour d'un livre
  - Peut satisfaire une réservation
  - Peut consulter les statistiques sur les livres, emprunts et réservations
  - Peut supprimer n'importe quel avis
  - Peut consulter l'historique d'activité

- **ADMIN** : Administrateur
  - Toutes les permissions d'un LIBRARIAN
  - Peut consulter, modifier et supprimer tous les utilisateurs
  - Peut gérer la whitelist des utilisateurs
  - Peut modifier les rôles des utilisateurs
  - Peut consulter toutes les statistiques (livres, emprunts, réservations, utilisateurs)
  - Peut exporter les données (emprunts, utilisateurs, statistiques)
  - Peut consulter l'historique d'activité complet

### Règles Métier d'Authentification

1. **Inscription** :
   - Tous les utilisateurs peuvent s'inscrire librement
   - À l'inscription, le rôle par défaut est STUDENT
   - À l'inscription, l'utilisateur n'est pas whitelisté (ne peut pas se connecter)
   - Les administrateurs créés sont automatiquement whitelistés

2. **Connexion** :
   - Seuls les utilisateurs whitelistés peuvent se connecter
   - Un utilisateur non whitelisté ne peut pas accéder à l'application
   - La session doit être maintenue après connexion

3. **Gestion de la Whitelist** :
   - Seuls les administrateurs peuvent modifier le statut whitelist des utilisateurs
   - Un administrateur ne peut pas être retiré de la whitelist
   - Un administrateur ne peut pas modifier son propre statut whitelist

---

## 🛠️ Fonctionnalités Requises

### Authentification

**Inscription**

- Permettre à un utilisateur de créer un compte
- Valider l'unicité de l'email
- Sécuriser le mot de passe avant stockage
- Retourner les informations de l'utilisateur créé (sans le mot de passe)

**Connexion**

- Vérifier les identifiants fournis
- Vérifier que l'utilisateur est whitelisté
- Créer une session pour l'utilisateur connecté
- Retourner les informations de l'utilisateur connecté

**Déconnexion**

- Détruire la session de l'utilisateur

**Utilisateur connecté**

- Permettre à un utilisateur connecté de consulter ses propres informations

### Gestion des Utilisateurs (Réservé aux ADMIN)

**Consultation**

- Lister tous les utilisateurs du système
- Consulter les détails d'un utilisateur spécifique

**Modification**

- Modifier les informations d'un utilisateur (prénom, nom)
- Modifier le rôle d'un utilisateur
- Ajouter un utilisateur à la whitelist
- Retirer un utilisateur de la whitelist (sauf les administrateurs)

**Suppression**

- Supprimer un utilisateur du système

### Gestion des Livres (Réservé aux LIBRARIAN et ADMIN)

**Consultation**

- Consulter la liste de tous les livres (accessible à tous)
- Filtrer les livres par disponibilité (optionnel)
- Consulter les détails d'un livre spécifique

**Création et Modification**

- Créer un nouveau livre dans le catalogue
- Modifier les informations d'un livre existant
- Supprimer un livre du catalogue

### Gestion des Emprunts

**Création d'un emprunt**

- Permettre à un utilisateur connecté d'emprunter un livre
- Vérifier que le livre est disponible (au moins un exemplaire disponible)
- Vérifier que l'utilisateur n'a pas déjà un emprunt actif pour ce livre
- Calculer automatiquement la date d'échéance (30 jours après l'emprunt)
- Décrémenter le nombre d'exemplaires disponibles du livre

**Consultation**

- Permettre à un utilisateur de consulter ses propres emprunts
- Permettre aux bibliothécaires et administrateurs de consulter tous les emprunts
- Filtrer les emprunts par statut (optionnel)
- Filtrer les emprunts par utilisateur ou par livre (optionnel)

**Retour d'un livre**

- Permettre aux bibliothécaires et administrateurs d'enregistrer le retour d'un livre
- Mettre à jour la date de retour
- Changer le statut de l'emprunt à RETURNED
- Incrémenter le nombre d'exemplaires disponibles du livre

**Emprunts en retard**

- Permettre de consulter la liste des emprunts en retard
- Un emprunt est en retard si la date d'échéance est dépassée et qu'il n'a pas été retourné

### Gestion des Réservations

**Création d'une réservation**

- Permettre à un utilisateur connecté de réserver un livre
- Vérifier que le livre n'est pas disponible (aucun exemplaire disponible)
- Vérifier que l'utilisateur n'a pas déjà réservé ce livre
- Enregistrer la réservation avec la date de création

**Consultation**

- Permettre à un utilisateur de consulter ses propres réservations
- Permettre aux bibliothécaires et administrateurs de consulter toutes les réservations

**Annulation**

- Permettre à un utilisateur d'annuler sa propre réservation
- Permettre aux bibliothécaires et administrateurs d'annuler n'importe quelle réservation

**Satisfaction d'une réservation**

- Permettre aux bibliothécaires et administrateurs de satisfaire une réservation
- Quand un livre redevient disponible, créer automatiquement un emprunt pour le premier utilisateur en liste d'attente
- Supprimer la réservation satisfaite

### Statistiques

L'application doit fournir des routes de statistiques dont l'accès est restreint selon les rôles des utilisateurs.

**Statistiques pour STUDENT (utilisateur connecté)**

- Nombre d'emprunts actifs de l'utilisateur connecté
- Nombre de réservations actives de l'utilisateur connecté
- Nombre d'emprunts en retard de l'utilisateur connecté
- Historique du nombre total d'emprunts effectués par l'utilisateur connecté

**Statistiques pour LIBRARIAN et ADMIN**

- Nombre total d'emprunts actifs dans la bibliothèque
- Nombre total d'emprunts en retard
- Nombre total de réservations actives
- Liste des livres les plus empruntés (top N, avec N configurable)
- Nombre de livres disponibles vs non disponibles
- Statistiques par livre (nombre d'emprunts, nombre de réservations)

**Statistiques pour ADMIN uniquement**

- Nombre total d'utilisateurs par rôle (STUDENT, LIBRARIAN, ADMIN)
- Nombre d'utilisateurs whitelistés vs non whitelistés
- Liste des utilisateurs les plus actifs (top N utilisateurs avec le plus d'emprunts)
- Statistiques globales sur les emprunts (nombre total, nombre retournés, nombre en retard)
- Statistiques sur les réservations (nombre total, nombre satisfaites, nombre annulées)

### Système d'Avis et de Notes

L'application doit permettre aux utilisateurs de noter et commenter les livres qu'ils ont empruntés.

**Création d'un avis**

- Permettre à un utilisateur connecté de noter un livre (note de 1 à 5)
- Permettre d'ajouter un commentaire optionnel avec la note
- Un utilisateur ne peut noter que les livres qu'il a empruntés au moins une fois
- Un utilisateur ne peut donner qu'un seul avis par livre (peut modifier son avis existant)

**Consultation des avis**

- Consulter tous les avis d'un livre (accessible à tous)
- Consulter la note moyenne d'un livre
- Consulter ses propres avis (utilisateur connecté)
- Filtrer les avis par note (optionnel)

**Modification et suppression**

- Permettre à un utilisateur de modifier son propre avis
- Permettre à un utilisateur de supprimer son propre avis
- Permettre aux bibliothécaires et administrateurs de supprimer n'importe quel avis

### Pagination et Tri

**Pagination**

- Toutes les listes (livres, emprunts, réservations, utilisateurs, avis) doivent supporter la pagination
- Paramètres de pagination : `page` (numéro de page) et `limit` (nombre d'éléments par page)
- Les réponses doivent inclure les métadonnées de pagination (page actuelle, nombre total de pages, nombre total d'éléments)

**Tri**

- Les listes doivent supporter le tri par différents critères
- Paramètre de tri : `sortBy` (champ) et `order` (ASC ou DESC)
- Exemples de tri :
  - Livres : par titre, auteur, année de publication, nombre d'emprunts
  - Emprunts : par date d'emprunt, date d'échéance, statut
  - Utilisateurs : par nom, email, date de création

### Export de Données (Réservé aux ADMIN)

L'application doit permettre aux administrateurs d'exporter certaines données.

**Export des emprunts**

- Exporter la liste des emprunts au format CSV ou JSON
- Filtrer les emprunts à exporter (par statut, par date, par utilisateur, par livre)
- Inclure les informations complètes (utilisateur, livre, dates, statut)

**Export des utilisateurs**

- Exporter la liste des utilisateurs au format CSV ou JSON
- Filtrer les utilisateurs à exporter (par rôle, par statut whitelist)
- Inclure les informations utilisateur (sans les mots de passe)

**Export des statistiques**

- Exporter les statistiques globales au format JSON
- Inclure toutes les statistiques disponibles pour les administrateurs

### Historique d'Activité (Audit Log)

L'application doit enregistrer un historique des actions importantes effectuées dans le système.

**Enregistrement automatique**

- Enregistrer automatiquement les actions suivantes :
  - Création, modification, suppression de livres
  - Création et retour d'emprunts
  - Création et annulation de réservations
  - Modifications de rôles d'utilisateurs
  - Modifications de la whitelist
- Chaque entrée doit contenir : type d'action, utilisateur ayant effectué l'action, date/heure, détails de l'action

**Consultation de l'historique**

- Permettre aux bibliothécaires et administrateurs de consulter l'historique d'activité
- Filtrer l'historique par type d'action (optionnel)
- Filtrer l'historique par utilisateur (optionnel)
- Filtrer l'historique par date (optionnel)
- Paginer les résultats de l'historique

---

## 📝 Contraintes Fonctionnelles

### Sécurité

**Protection des données sensibles**

- Les mots de passe ne doivent jamais apparaître dans les réponses de l'API
- Les mots de passe doivent être stockés de manière sécurisée (hashage avec salt)

**Gestion des sessions**

- L'application doit maintenir une session pour les utilisateurs connectés
- Les routes protégées doivent vérifier la validité de la session

**Contrôle d'accès**

- Les routes doivent être protégées selon les rôles des utilisateurs
- Un utilisateur non connecté ne peut accéder qu'aux routes publiques
- Un utilisateur connecté ne peut accéder qu'aux routes autorisées pour son rôle

### Validation des Données

**Données d'entrée**

- Toutes les données reçues par l'API doivent être validées
- Les données invalides doivent être rejetées avec un message d'erreur approprié
- Les champs obligatoires doivent être présents
- Les formats de données doivent être respectés (email, dates, nombres, etc.)

**Données de sortie**

- Les réponses de l'API doivent être structurées et cohérentes
- Seules les données nécessaires doivent être retournées
- Les relations entre entités doivent être correctement représentées

### Gestion des Erreurs

- L'application doit gérer les cas d'erreur de manière appropriée
- Les messages d'erreur doivent être clairs et informatifs
- Les codes de statut HTTP doivent être utilisés correctement (200, 201, 400, 401, 403, 404, etc.)

### Intégrité des Données

**Cohérence des données**

- Le nombre d'exemplaires disponibles d'un livre doit toujours être cohérent avec les emprunts actifs
- Un utilisateur ne peut pas emprunter un livre non disponible
- Un utilisateur ne peut pas réserver un livre disponible
- Les dates d'échéance doivent être calculées automatiquement

**Relations entre entités**

- Les relations entre utilisateurs, livres, emprunts et réservations doivent être maintenues
- La suppression d'une entité doit gérer correctement les relations associées

---

## 🚀 Environnement Technique

### Technologies Recommandées

- Framework backend Node.js (NestJS recommandé)
- ORM pour la gestion de la base de données
- Base de données SQLite pour le développement
- Système de validation des données
- Système de transformation/sérialisation des données
- Gestion des sessions

### Configuration

- La base de données doit être configurée pour le développement local
- La validation des données doit être activée globalement
- La gestion des sessions doit être configurée

---

## 📤 Livrables

1. **Code source complet** sur un dépôt Git
2. **Tests unitaires** pour les services principaux (au minimum pour les services d'authentification, de gestion des utilisateurs, des livres, des emprunts et des réservations)
3. **README.md** avec :
   - Instructions d'installation et de démarrage
   - Description des endpoints de l'API
   - Exemples de requêtes
   - Instructions pour exécuter les tests
4. **Fichier requests.http** ou collection Postman avec des exemples de requêtes
5. **Base de données SQLite** avec des données de test
6. **Configuration du projet** : Le projet doit être utilisable immédiatement après un simple `npm install` suivi de `npm run start` (toutes les dépendances doivent être correctement configurées dans le `package.json` et la base de données doit être initialisée automatiquement si nécessaire)

---

## ⚠️ Remarques Importantes

- Respecter les bonnes pratiques de développement d'API REST
- Gérer tous les cas d'erreur de manière appropriée
- Le code doit être propre, lisible et bien organisé
- Les relations entre entités doivent être correctement gérées
- La sécurité des données sensibles (mots de passe) doit être assurée
- Les règles métier doivent être respectées (whitelist, rôles, disponibilité des livres, etc.)

---

**Bon travail !**
