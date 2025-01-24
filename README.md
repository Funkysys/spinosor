# Spinosor

## Description
Spinosor est une application web moderne construite avec Next.js qui permet de gérer et présenter des albums, des artistes et des événements musicaux.

## Technologies Utilisées
- Next.js 14
- TypeScript
- Prisma
- NextAuth.js
- TailwindCSS
- GSAP & Framer Motion
- Jest & Testing Library

## Prérequis
- Node.js (v18 ou supérieur)
- Yarn
- Une base de données PostgreSQL

## Installation

1. Cloner le repository
```bash
git clone [votre-repo-url]
cd spinosor
```

2. Installer les dépendances
```bash
yarn install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```
Remplir les variables dans .env.local avec vos propres valeurs.

4. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
```

## Développement

Lancer le serveur de développement :
```bash
yarn dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Tests

Lancer les tests :
```bash
yarn test
```

Lancer les tests en mode watch :
```bash
yarn test:watch
```

## Structure du Projet

```
spinosor/
├── app/                    # Pages et routes Next.js
├── components/            # Composants React réutilisables
├── context/              # Contextes React
├── lib/                  # Utilitaires et configurations
├── prisma/               # Schéma et migrations Prisma
├── public/               # Assets statiques
└── types/                # Types TypeScript
```

## Fonctionnalités Principales
- Authentification utilisateur
- Gestion des albums
- Gestion des artistes
- Calendrier d'événements
- Interface administrateur
- Upload d'images
- Carrousel dynamique

## Déploiement

L'application est configurée pour être déployée sur Vercel :

```bash
vercel
```

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
