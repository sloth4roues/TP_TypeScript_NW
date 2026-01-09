# TP TypeScript NW

API REST de gestion de bibliotheque (NestJS + TypeORM + SQLite) avec authentification par session et gestion des roles.

Enonce: `app_tp/EVAL_API_REST_NESTJS.md`

## Fonctionnalites presentes
- Authentification: inscription, connexion, deconnexion, `me`
- Session serveur avec persistance SQLite
- Gestion utilisateurs (ADMIN):
  - liste + detail
  - modifier profil
  - changer role
  - whitelist on/off (avec regles)
  - suppression
- Modeles TypeORM complets: User, Book, Borrowing, Reservation, Review, ActivityLog, Session
- Enums metier: roles, statut emprunt, statut reservation, types d'activite
- Validation globale active (ValidationPipe)
- RBAC actif sur les routes sensibles existantes (auth `me/logout`, toutes routes `users`)

## A faire (reste du sujet)
- CRUD livres + gestion des exemplaires
- Emprunts (creation, retour, retard)
- Reservations (creation, annulation, satisfaction)
- Avis (creation, modification, suppression)
- Statistiques par role
- Export des donnees (ADMIN)
- Historique d'activite automatique
- Guards roles/session sur toutes les routes
- requests.http complet + exemples finaux

## Lancer le projet
Depuis `app_tp`:

```bash
npm install
npm run start:dev
```

## Variables d'environnement
Exemple minimal:

```env
NODE_ENV=development
PORT=3000
DB_PATH=./db.sqlite
SESSION_SECRET=change_me_dev_secret
SESSION_NAME=sid
SESSION_TTL_SECONDS=86400
```

## Sessions (details)
- Cookie: `sid`
- Stockage: table `sessions` (SQLite)
- TTL par defaut: 86400s (24h)
- Logout: suppression logique (soft delete) dans `sessions`

## Whitelist (regles)
- Un utilisateur non whitelisté ne peut pas se connecter
- Seul un ADMIN peut modifier la whitelist
- Un ADMIN ne peut pas se retirer lui-meme de la whitelist
- Un ADMIN ne peut pas etre retiré de la whitelist

## Endpoints exposes (etat actuel)
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- Users (ADMIN): `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `PATCH /users/:id/role`, `PATCH /users/:id/whitelist`, `DELETE /users/:id`

## Endpoints a venir (selon l'enonce)
- Books, Borrowings, Reservations, Reviews
- Stats, Export, Activity-log

## Donnees retournees
- Les reponses utilisateurs ne contiennent jamais le mot de passe

## Fichier de requetes
- Tests manuels: `app_tp/requests.http`

## Tests rapides
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- Admin users: `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/whitelist`
- Fichier de requetes: `app_tp/requests.http`

## RBAC (etat actuel)
- Public: aucun endpoint public expose pour l'instant
- Session requise: `GET /auth/me`, `POST /auth/logout`
- ADMIN requis: toutes les routes `users` (`GET /users`, `GET /users/:id`, `PATCH /users/:id`, `PATCH /users/:id/role`, `PATCH /users/:id/whitelist`, `DELETE /users/:id`)
- En attente: RBAC sur `books`, `borrowings`, `reservations`, `reviews`, `stats`, `export`, `activity-log` (controllers a remplir)
