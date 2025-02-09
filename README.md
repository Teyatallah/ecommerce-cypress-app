# Documentation des Tests

## Table des matières
1. [I. Introduction](#i-introduction)
2. [II. Analyse des exigences](#ii-analyse-des-exigences)
3. [III. Planification des tests](#iii-planification-des-tests)
4. [IV. Suivi et contrôle](#iv-suivi-et-contrôle)
5. [V. Analyse des tests](#v-analyse-des-tests)
6. [VI. Conception des tests](#vi-conception-des-tests)
7. [VII. Implémentation des tests](#vii-implémentation-des-tests)
8. [VIII. Exécution des tests](#viii-exécution-des-tests)
9. [IX. Clôture des tests](#ix-clôture-des-tests)

---

## <a name="i-introduction"></a> I. Introduction
# Documentation du Projet

## 1. Introduction
Dans le cadre de ma formation en tests logiciels, j'ai développé un projet visant à appliquer les théories et les bonnes pratiques apprises en cours. Ce projet consiste à tester un site de e-commerce en combinant des tests manuels et automatisés à l'aide de l'outil Cypress. Les principales fonctionnalités testées incluent l'authentification (connexion), la gestion du panier, ainsi que l'affichage et le tri des produits. L'objectif est de valider le bon fonctionnement de ces fonctionnalités et de détecter d'éventuels bugs ou anomalies. Ce projet m'a permis de consolider mes compétences en tests logiciels tout en explorant les avantages de l'automatisation des tests.

---

## 2. Configuration du Projet
Pour configurer et exécuter ce projet sur votre machine locale, suivez les étapes suivantes :

1. **Cloner le projet** : Commencez par cloner le dépôt Git sur votre machine.
   ```bash
   git clone git@github.com:Teyatallah/ecommerce-cypress-app.git
   ```

2. **Mettre à jour la branche develop** : Assurez-vous d'être sur la branche develop et de récupérer les dernières mises à jour.
   ```bash
  git checkout develop
  git pull origin develop
  ```

3. **Installer les dépendances** :Utilisez npm pour installer toutes les dépendances nécessaires.
   ```bash
  npm install
  ```

4. **Démarrer les services avec Docker** :Utilisez Docker Compose pour lancer les services nécessaires.
   ```bash
  docker-compose up
  ```

5. **Lancer l'application** :Enfin, Démarrez l'application.
   ```bash
  npm run dev
  ```

---

## <a name="ii-analyse-des-exigences"></a> II. Analyse des exigences
# Spécifications du Projet

## 1. Spécifications Fonctionnelles

### a) Gestion des utilisateurs
- **Connexion/Authentification** : Fonctionnalité permettant aux utilisateurs de se connecter à leur compte.
- **Gestion du profil utilisateur** :
  - Historique des commandes.
  - Informations du profil (mise à jour des données personnelles).

### b) Navigation et recherche
- **Tri des produits** : Possibilité de trier les produits par prix ou par nom.
- **Catégorisation des produits** : Affichage des produits par catégories.
- **Page produit détaillée** :
  - Titre, description et images du produit (avec fonction de zoom).

### c) Panier
- **Ajouter/retirer des produits** : Fonctionnalité permettant d'ajouter ou de retirer des produits du panier.
- **Modifier les quantités** : Possibilité de modifier les quantités des produits directement dans le panier.
- **Enregistrement automatique du panier** : Le panier est sauvegardé même après la déconnexion de l'utilisateur.

### d) Commande et paiement
- **Processus de validation de commande** : Un processus simple et rapide pour valider les commandes.
- **Méthodes de paiement multiples** : Prise en charge de plusieurs méthodes de paiement, telles que :
  - Carte bancaire.
  - PayPal.
  - Paiement cash à la livraison.


---

## <a name="iii-planification-des-tests"></a> III. Planification des tests

### a) Objectifs des Tests
Les principaux objectifs des tests pour ce projet sont :

- **Validation fonctionnelle** : Vérifier que toutes les fonctionnalités du site répondent aux exigences spécifiées (authentification, navigation, panier, paiement, etc.).
- **Détection des anomalies** : Identifier et documenter les bugs ou dysfonctionnements avant la mise en production.

### b) Approche des Tests
- Identifier les exigences clés à tester.
- Prioriser les tests critiques.
- Utiliser une combinaison de tests manuels et automatisés.
- Assurer la traçabilité des tests grâce à des outils de gestion (Jira, Xray).

### c) Types de Tests
- **Tests fonctionnels** : Connexion, navigation, panier, paiement.
- **Tests non fonctionnels** : Performance.
- **Tests exploratoires** : Identification de bugs non prévus.

### d) Outils et Ressources
- **Jira/Xray** : Gestion des cas de test et des bugs.
- **Postman** : Tests API.
- **Cypress** : Automatisation des tests UI.
- **GitHub** :  gestion des versions


---

## <a name="iv-suivi-et-contrôle"></a> IV. Suivi et contrôle
### Critères de Sortie des Tests
- Tous les cas de test critiques doivent être passés avec succès.
- Les anomalies bloquantes et majeures doivent être corrigées.

## <a name="v-analyse-des-tests"></a> V. Analyse des tests
### a) Tests Fonctionnels
- **Authentification** : Connexion.
- **Navigation** : Vérification des menus, des catégories et de la recherche.
- **Panier** : Ajouter/retirer des articles, mettre à jour les quantités.
- **Commande** : Validation et gestion des erreurs.
- **Paiement** : Modes de paiement.

### b) Tests API (avec Postman)
- Vérification des points de terminaison comme la recherche, le panier et le paiement.
- Test des scénarios avec des données valides et invalides.

### c) Tests UI (avec Cypress)
- Vérification de l'affichage des éléments sur différentes résolutions.
- Création de tests pour les actions courantes (connexion, ajout au panier, etc.).
---

## <a name="vi-conception-des-tests"></a> VI. Conception des tests
## 1. Documentation Complète des Cas de Test : connexion🔑 
| ID    | Description | Étapes | Résultat Attendu | Outil Utilisé | Résultat Obtenu | Priorité |
|-------|------------|--------|------------------|---------------|----------------|----------|
| **CT101** | Valider que l'utilisateur peut se connecter avec email et mot de passe corrects. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Email : `test@example.com`, Mot de passe : `password123` <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Saisir un email valide. <br> 3. Saisir un mot de passe valide. <br> 4. Cliquer sur 'Se connecter'. | L'utilisateur est redirigé vers la page d'accueil avec un message **"Bienvenue"**. | Cypress | ✅ OK | 🔴 Haute |
| **CT102** | Tester le comportement avec un email et un mot de passe incorrects. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Email : `wrong@example.com`, Mot de passe : `wrongpassword` <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Saisir un email invalide. <br> 3. Saisir un mot de passe invalide. <br> 4. Cliquer sur 'Se connecter'. | Un message d'erreur **"Invalid credentials"** est affiché. | Cypress | ✅ OK | 🔴 Haute |
| **CT103** | Tester le comportement avec un email incorrect et un mot de passe correct. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Email : `wrong@example.com`, Mot de passe : `password123` <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Saisir un email invalide. <br> 3. Saisir un mot de passe valide. <br> 4. Cliquer sur 'Se connecter'. | Un message d'erreur **"Invalid credentials"** est affiché. | Cypress | ✅ OK | 🟡 Moyenne |
| **CT104** | Tester le comportement avec un email correct et un mot de passe incorrect. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Email : `test@example.com`, Mot de passe : `wrongpassword` <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Saisir un email valide. <br> 3. Saisir un mot de passe invalide. <br> 4. Cliquer sur 'Se connecter'. | Un message d'erreur **"Invalid credentials"** est affiché. | Cypress | ✅ OK | 🔴 Haute |
| **CT105** | Vérifier le comportement avec un format d'email non valide. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Email : `testemail.com` <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Saisir un email invalide. <br> 3. Saisir un mot de passe valide. <br> 4. Cliquer sur 'Se connecter'. | Un message d'erreur **"Please include an '@' in the email address. 'testemail.com' is missing an '@'"** est affiché. | Test manuel | ✅ OK | 🔴 Haute |
| **CT106** | Vérifier que la connexion échoue avec des identifiants inexistants. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Aucun compte existant avec ces identifiants. <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Saisir un email valide. <br> 3. Saisir un mot de passe valide. <br> 4. Cliquer sur 'Se connecter'. | Un message d'erreur **"Invalid credentials"** est affiché. | Test manuel | ✅ OK | 🔴 Haute |
| **CT107** | Connexion sans remplir les champs : Vérifier la validation des champs obligatoires. | **Préconditions** : [Lien connexion](http://localhost:3000/login) <br> **JDD** : Aucun <br> **Étapes** : <br> 1. Ouvrir la page de connexion. <br> 2. Ne rien saisir dans les champs. <br> 3. Cliquer sur 'Se connecter'. | Les champs requis sont mis en surbrillance avec un message **"Please fill out this field"**. | Test manuel | ✅ OK | 🟡 Moyenne |

---



## 2. Documentation Complète des Cas de Test : Panier🛒 


| ID    | Description | Étapes | Résultat Attendu | Outil Utilisé | Résultat Obtenu | Priorité |
|-------|------------|--------|------------------|---------------|----------------|----------|
| **CT201** | Valider qu’un article peut être ajouté au panier avec succès. | **Préconditions** : [Lien produit](http://localhost:3000/products) <br> **JDD** : Produit A <br> **Étapes** : <br> 1. Naviguer à la page produit. <br> 2. Cliquer sur "Ajouter au panier". | L’article est ajouté au panier et le total est mis à jour. | Cypress | ✅ OK | 🔴 Haute |
| **CT202** | Vérifier que l’utilisateur peut retirer un article du panier. | **Préconditions** : [Lien panier](http://localhost:3000/cart) <br> **JDD** : Produit A <br> **Étapes** : <br> 1. Aller à la page panier. <br> 2. Cliquer sur "Retirer" à côté de l’article. | L’article est retiré du panier et le total est mis à jour. | Cypress | ✅ OK | 🔴 Haute |
| **CT203** | Tester la mise à jour (augmentation et diminution) de la quantité d’un produit. | **Préconditions** : [Lien panier](http://localhost:3000/cart) <br> **JDD** : Produit A <br> **Étapes** : <br> 1. Aller à la page panier. <br> 2. Modifier la quantité d’un article à 2. <br> 3. Cliquer sur "Mettre à jour". | La quantité est mise à jour et le total est recalculé. | Cypress | ✅ OK | 🔴 Haute |
| **CT204** | Valider que plusieurs articles peuvent être ajoutés / supprimés du panier. | **Préconditions** : [Lien produits](http://localhost:3000/products) <br> **JDD** : Produit A, Produit B <br> **Étapes** : <br> 1. Naviguer à la page des produits. <br> 2. Ajouter le produit A au panier. <br> 3. Ajouter le produit B au panier. <br> 4. Supprimer le produit A du panier. | Tous les articles sont ajoutés. <br> Le produit A est supprimé du panier et les totaux sont corrects. | Cypress | ✅ OK | 🔴 Haute |
| **CT205** | Vérifier que le panier est vide après suppression de tous les articles. | **Préconditions** : [Lien panier](http://localhost:3000/cart) <br> **JDD** : Produit A, Produit B <br> **Étapes** : <br> 1. Aller à la page panier. <br> 2. Cliquer sur "Vider le panier". | Le panier est vide et un message "Votre panier est vide" s’affiche. | Cypress | ✅ OK | 🟡 Moyenne |
| **CT206** | Tester la persistance du panier après une déconnexion/reconnexion. | **Préconditions** : [Lien panier](http://localhost:3000/cart) <br> **JDD** : Produit A <br> **Étapes** : <br> 1. Ajouter un article au panier. <br> 2. Se déconnecter. <br> 3. Se reconnecter. <br> 4. Accéder au panier. | Les articles sont toujours présents après la reconnexion. | Cypress | ✅ OK | 🔴 Haute |
| **CT207** | Valider que le total est calculé correctement pour plusieurs articles. | **Préconditions** : [Lien panier](http://localhost:3000/cart) <br> **JDD** : Produit A (99.99€), Produit B (149.99€) <br> **Étapes** : <br> 1. Ajouter plusieurs articles au panier. <br> 2. Vérifier le total affiché. | Le total affiché correspond à la somme des prix des articles. | Cypress | ✅ OK | 🔴 Haute |

---
## 3. Documentation Complète des Cas de Test : Navigation (Vérifiez les menus, les catégories,tri)


| ID    | Description | Étapes | Résultat Attendu | Outil Utilisé | Résultat Obtenu | Priorité |
|-------|------------|--------|------------------|---------------|----------------|----------|
| **CT301** | Valider que tous les liens du menu principal redirigent vers les bonnes pages. | **Préconditions** : [Lien site](http://localhost:3000) <br> **Menu principal visible** <br> **Étapes** : <br> 1. Cliquer sur chaque lien du menu principal. | Chaque lien redirige vers la page correcte. | Test manuel | ✅ OK | 🔴 Haute |
| **CT302** | Tester l’accès à une catégorie à partir du menu. | **Préconditions** : [Lien site](http://localhost:3000) <br> **Catégorie : "Stud Earrings"** <br> **Étapes** : <br> 1. Naviguer au menu principal. <br> 2. Sélectionner la catégorie "Stud Earrings". | Seulement les produits de la catégorie sélectionnée sont affichés. | Test manuel | ❌ KO (Des produits de différentes catégories apparaissent dans la liste.) | 🟡 Moyenne |
| **CT303** | Tester le tri des produits par prix. | **Préconditions** : [Lien produits](http://localhost:3000/products) <br> **Produits affichés, Tri : Prix** <br> **Étapes** : <br> 1. Appliquer le tri par prix croissant. <br> 2. Appliquer le tri par prix décroissant. | Les produits sont triés selon le prix avec ordre croissant et décroissant. | Cypress | ✅ OK | 🟡 Moyenne |
| **CT304** | Tester le tri des produits par nom. | **Préconditions** : [Lien produits](http://localhost:3000/products) <br> **Produits affichés, Tri : Nom** <br> **Étapes** : <br> 1. Appliquer le tri par nom croissant. <br> 2. Appliquer le tri par nom décroissant. | Les produits sont triés selon le nom avec ordre croissant et décroissant. | Cypress | ✅ OK | 🟡 Moyenne |
| **CT305** | Vérifier que chaque produit affiché permet d’accéder à sa page de détails. | **Préconditions** : [Lien produits](http://localhost:3000/products) <br> **Produits listés dans une catégorie** <br> **Étapes** : <br> 1. Cliquer sur un produit affiché. | La page de détails du produit sélectionné s’ouvre correctement. | Cypress | ✅ OK | 🔴 Haute |

---


## <a name="vii-implémentation-des-tests"></a> VII. Implémentation des tests
# 🛠 Environnement de Test  

## 📌 Technologies Utilisées  

- **Langage :** JavaScript  
- **Framework de test :** Cypress (tests end-to-end)  
- **API Testing :** Postman  
- **Gestion des tests :** Jira avec Xray  
- **Contrôle de version :** GitHub  
- **Base de données :** PostgreSQL  

---

# 📂 Structure des Tests  

### 🔹 Tests End-to-End (E2E)  

Les tests end-to-end vérifient le bon fonctionnement des principales fonctionnalités du site e-commerce.  

✅ **Scénarios testés :**  
- 🔹 Connexion des utilisateurs  
- 🔹 Affichage des produits et tri par nom et par prix  
- 🔹 Ajout et suppression d'articles dans le panier  
- 🔹 Validation et passage de commande  
- 🔹 Gestion du profil utilisateur (historique des commandes / informations du profil)  

📝 **Exemple de test en Cypress:** 

```javascript
it("should show error message with incorrect credentials", () => {
  cy.intercept("POST", "/api/auth/login", {
    statusCode: 401,
    body: { error: "Invalid credentials" },
  }).as("loginRequest");

  cy.visit("/login");

  cy.get('input[type="email"]').type("wrong@example.com");
  cy.get('input[type="password"]').type("wrongpassword");
  cy.get('button[type="submit"]').click();

  cy.wait("@loginRequest");
  cy.contains("Invalid credentials").should("be.visible");
});
```

---
 
### Tests API
Les tests API sont réalisés avec Postman pour vérifier les réponses des endpoints REST.

✅ Endpoints testés :
- **Authentification :** (/api/login) 
- **Gestion des produits :** (/api/products)


## <a name="viii-exécution-des-tests"></a> VIII. Exécution des tests
# 🐞 Rapport d'Anomalie

| ID               | BUG-2025-001 |
|-----------------|--------------|
| **Titre**       | Le tri des produits par catégorie ne fonctionne pas correctement |
| **Environnement** | Ubuntu 24, Chrome 121.0, DB PostgreSQL 15  |

## 📌 Description  
Lorsqu’un utilisateur sélectionne une catégorie dans le menu, les produits affichés ne correspondent pas à la catégorie choisie. Ils apparaissent mélangés avec d’autres produits d’autres catégories.

## 🔄 Étapes pour reproduire  
1. Ouvrir le site e-commerce.  
2. Cliquer sur une catégorie dans le menu (ex: "Stud Earrings").  
3. Observer la liste des produits affichés.  
4. Certains produits ne correspondent pas à la catégorie sélectionnée.  

## ✅ Résultat attendu  
Seuls les produits appartenant à la catégorie sélectionnée doivent être affichés.

## ❌ Résultat obtenu  
Des produits de différentes catégories apparaissent dans la liste, rendant la navigation confuse.

## 📎 Pièces jointes  
![Capture d'écran montrant le bug du tri des catégories](./public/sort-category-issue.png)

| Priorité | Sévérité | Statut | Date de détection |
|----------|---------|--------|-------------------|
| 🟡 Moyenne (Impact sur l’expérience utilisateur mais pas bloquant) | ⛔ Majeure (La fonctionnalité de tri par catégorie ne fonctionne pas) | 🟢 Ouvert | 03/02/2025 |

---

## <a name="ix-clôture-des-tests"></a> IX. Clôture des tests
## ✅ Résumé des Tests  
Les tests ont été réalisés avec succès sur les différentes fonctionnalités du site e-commerce :  
- **Authentification** : ✅ Tous les tests sont validés.  
- **Panier** : ✅ Tous les tests sont validés.  
- **Navigation** : ❌ Tous les tests sont validés sauf **"Tester l'accès à une catégorie à partir du menu"**, qui a rencontré une anomalie.  

---
## 📊 Résultats des Tests  

| 📌 Nombre total de tests | ✅ Nombre de tests OK | ❌ Nombre de tests KO | ⏳ Nombre de tests bloqués | 📈 Couverture (%) | 🚀 Avancement |
|----------------------|------------------|------------------|--------------------|--------------|------------|
| 19                   | 18               | 1                | 0                  | 94.73%       | 100%       |

---
## 🟢 Points Positifs  
✔️ **La majorité des fonctionnalités critiques sont validées avec succès.**  
✔️ **Aucun test bloquant détecté.**  
✔️ **Bonne couverture des fonctionnalités principales.**  

---
## 🔧 Actions d’Amélioration  
- 🚀 **Correction de l’anomalie sur l’accès aux catégories via le menu.**  
- 📊 **Ajout des tests de performance** pour simuler un grand volume de trafic.  
- 🌐 **Ajout des tests de compatibilité** pour vérifier le rendu et le bon fonctionnement du site sur plusieurs navigateurs (*Chrome, Firefox, Safari, Edge*).  

---