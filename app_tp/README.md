# TP TypeScript NW

API REST de gestion de bibliotheque (NestJS + TypeORM + SQLite).

Enonce: `app_tp/EVAL_API_REST_NESTJS.md`

## Fonctionnalites attendues (evaluation)
- Authentification par session + whitelist
- RBAC (STUDENT / LIBRARIAN / ADMIN)
- Gestion utilisateurs (ADMIN)
- Gestion livres (LIBRARIAN/ADMIN)
- Gestion emprunts (STUDENT/LIBRARIAN/ADMIN)
- Gestion reservations + file d'attente
- Avis et notes
- Statistiques par role
- Export des donnees (ADMIN)
- Historique d'activite (audit)
- Pagination + tri sur les listes

## Etat actuel (ce qui existe)
- Auth: inscription, connexion, deconnexion, `me`
- Whitelist appliquee (login refuse si non whitelist)
- Bootstrap admin configurable via `.env` (email)
- RBAC actif sur les routes sensibles existantes (auth `me/logout`, toutes routes `users`)
- Users (ADMIN): liste, detail, update profil, update role, whitelist on/off, suppression
- Books: `GET /books`, `GET /books/:id`, `POST /books` (LIBRARIAN+)
- Validation globale (ValidationPipe)
- Models TypeORM complets + enums metier

## Manquant / a faire (assume)
- Books: update, delete, disponibilites calculees
- Borrowings: create, list, return, overdue
- Reservations: create, list, cancel, fulfill
- Reviews: create, list, update, delete
- Stats (student/library/admin)
- Export (admin)
- Activity log auto
- Pagination/tri sur toutes les listes (actuel: users, books)
- Guards roles/session sur tous les nouveaux endpoints

## Lancer le projet
Depuis `app_tp`:

```bash
npm install
npm run start:dev
```

## Variables d'environnement
Il faut impérativement créer son propre .env (qui peut être un copié collé exact du .env.example)

Il faut modifier le "adimin@example.com" par l'adresse mail qui permettra la création d'un utilisateur ADMIN et Whitelisté, automatiquement.
NOTE : Dans le requests.http actuel, les tests sont prévu pour cette adresse email, si l'on décide de la changer, il faut également changer les requêtes associées.

```env
NODE_ENV=development
PORT=3000
DB_PATH=./db.sqlite
SESSION_SECRET=change_me_dev_secret
SESSION_NAME=sid
SESSION_TTL_SECONDS=86400
BCRYPT_SALT_ROUNDS=10
BOOTSTRAP_ADMIN_EMAIL=adimin@example.com
```

## Tests manuels
Fichier de requetes: `app_tp/requests.http`
