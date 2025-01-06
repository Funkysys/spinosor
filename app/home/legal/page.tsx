"use client";

import Link from "next/link";
import React from "react";

const LegalMentions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-perso-white-two bg-perso-bg">
      <h1 className="text-3xl font-bold text-perso-yellow-one mb-6">
        Mentions Légales
      </h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Informations générales</h2>
        <p>
          {`Ce site est édité par <strong>Spinosor Records</strong>, un label de
          musique indépendant qui permet de découvrir des artistes, de se
          connecter via Google grâce à <strong>NextAuth</strong> et de profiter
          d'une boutique en ligne.`}
        </p>
        <p className="mt-4">
          Siège social : <br />
          123, Rue de la Musique <br />
          75001 Paris, France
        </p>
        <p className="mt-4">
          Adresse email :{" "}
          <a
            href="mailto:contact@spinosor-records.com"
            className="text-perso-yellow-one underline"
          >
            contact@spinosor-records.com
          </a>
        </p>
        <p className="mt-4">
          Directeur de la publication : <br />
          John Doe, fondateur de Spinosor Records.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
        <p>
          Ce site est hébergé par <strong>Vercel</strong>.
        </p>
        <p className="mt-4">
          Adresse : <br />
          Vercel Inc. <br />
          340 S Lemon Ave #4133 <br />
          Walnut, CA 91789, États-Unis
        </p>
        <p>
          {`Pour plus d'informations, consultez le site de`}{" "}
          <Link
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-perso-yellow-one underline"
          >
            Vercel
          </Link>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Propriété intellectuelle
        </h2>
        <p>
          Tous les contenus présents sur ce site (textes, images, logos, vidéos,
          etc.) sont protégés par les lois en vigueur sur la propriété
          intellectuelle et sont la propriété exclusive de Spinosor Records,
          sauf mention contraire.
        </p>
        <p className="mt-4">
          {`Toute reproduction, représentation, modification, publication ou
          adaptation de tout ou partie des éléments de ce site, quel que soit
          le moyen ou le procédé utilisé, est interdite sans l'autorisation
          préalable écrite de Spinosor Records.`}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Responsabilité</h2>
        <p>
          {`Spinosor Records met tout en œuvre pour fournir des informations
          précises et à jour. Cependant, nous ne pouvons garantir l'exactitude,
          l'exhaustivité ou l'actualité des contenus diffusés sur ce site.`}
        </p>
        <p className="mt-4">
          Spinosor Records ne peut être tenu responsable des erreurs ou
          omissions présentes sur le site, ni des dommages directs ou indirects
          pouvant résulter de son utilisation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Données personnelles</h2>
        <p>
          Ce site utilise <strong>NextAuth</strong> pour permettre aux
          utilisateurs de se connecter en toute sécurité, notamment via leur
          compte Google. Les informations personnelles collectées sont utilisées
          uniquement pour assurer le bon fonctionnement du site et respecter les
          obligations légales.
        </p>
        <p className="mt-4">
          Pour en savoir plus sur la gestion de vos données personnelles,
          veuillez consulter notre{" "}
          <Link
            href="/privacy-policy"
            className="text-perso-yellow-one underline"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Boutique en ligne</h2>
        <p>
          {`Le site dispose d'une boutique en ligne où les visiteurs peuvent
          acheter des produits liés aux artistes et aux événements de Spinosor
          Records.`}
        </p>
        <p className="mt-4">
          Les prix affichés sur le site sont en euros (€) et incluent toutes
          taxes comprises (TTC). Les frais de livraison sont ajoutés lors du
          processus de commande.
        </p>
        <p className="mt-4">
          Pour toute question ou problème lié à une commande, contactez-nous à{" "}
          <Link
            href="mailto:support@spinosor-records.com"
            className="text-perso-yellow-one underline"
          >
            support@spinosor-records.com
          </Link>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p>
          Pour toute question relative aux mentions légales, vous pouvez nous
          contacter par email à{" "}
          <Link
            href="mailto:legal@spinosor-records.com"
            className="text-perso-yellow-one underline"
          >
            legal@spinosor-records.com
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default LegalMentions;
