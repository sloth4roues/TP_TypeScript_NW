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

## Tests rapides
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- Admin users: `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/whitelist`
- Fichier de requetes: `app_tp/requests.http`
