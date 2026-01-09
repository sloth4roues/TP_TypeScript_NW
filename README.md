# TP TypeScript NW

## Objectif
Mettre en place une API REST pour la gestion d'une bibliotheque avec authentification par session, controle des roles et audit des actions.

## Stack technique
- NestJS (API REST)
- TypeORM + SQLite
- Sessions serveur (express-session)
- Validation et serialization (class-validator, class-transformer)
- Hash des mots de passe (bcrypt)
- RBAC : STUDENT / LIBRARIAN / ADMIN

## Initialisation du projet
### Dependances principales
- ORM et base de donnees : TypeORM + SQLite
- Gestion des sessions serveur
- Validation des entrees et serialization des sorties
- Securite des mots de passe
- Configuration via variables d'environnement

## Architecture modulaire
Modules metier :
- auth : inscription, connexion, deconnexion, session
- users : gestion des utilisateurs (ADMIN)
- books : catalogue de livres
- borrowings : gestion des emprunts
- reservations : reservations et file d'attente
- reviews : avis utilisateurs
- stats : statistiques selon les roles
- export : export des donnees (ADMIN)
- activity-log : audit des actions
- common : guards, decorators, pagination, enums

## Modele de donnees
Entites TypeORM :
- User
- Book
- Borrowing
- Reservation
- Review
- ActivityLog

## Validation et securite
- DTOs pour toutes les routes principales
- Guards pour la session et les roles
- Decorators personnalises (@Roles, @CurrentUser)
- Enums globaux pour les roles, statuts et types d'actions

## Tests unitaires
Generation des tests unitaires pour les services principaux :
- auth
- users
- books
- borrowings
- reservations

Note : les fichiers de tests ont ete generes via `nest g service <module> --spec` suite a une erreur avec la commande `nest g spec`.

## Configuration a finaliser
- TypeORM SQLite
- Sessions
- Validation globale
- Serialization des reponses (exclusion du mot de passe)
- Documentation des endpoints et exemples de requetes
