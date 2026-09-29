# Git et le « Merge Hell »

## Guide de collaboration pour les équipes Scrum

Dans un projet réalisé en équipe, plusieurs développeurs travaillent simultanément sur différentes stories. Git permet à chacun de travailler sur sa propre branche, mais cette liberté vient avec un risque : **les conflits lors des merges**.

L'objectif n'est pas seulement d'apprendre à **résoudre les conflits**, mais surtout d'apprendre à **les prévenir**.

> **Les conflits Git se préviennent beaucoup plus qu'ils ne se résolvent.**

---

# 1. D'où viennent les conflits Git ?

Un conflit apparaît généralement lorsque deux branches modifient la même partie du même fichier.

Par exemple :

```text
main
 │
 ├── Story A ── modifie UserController.java
 │
 └── Story B ── modifie UserController.java
```

Même si les deux stories sont différentes du point de vue fonctionnel, elles peuvent modifier les mêmes fichiers.

### À retenir

> **Story différente ≠ code différent**

Avant de commencer une story, demandez-vous :

* Quels fichiers vais-je modifier ?
* Est-ce qu'un autre membre de l'équipe travaille sur ces fichiers ?
* Est-ce que ma story dépend d'une autre story en cours ?

Une courte discussion avant de commencer peut éviter beaucoup de problèmes plus tard.

---

# 2. Une branche par story

Chaque story devrait avoir sa propre branche.

Par exemple :

```text
main
 │
 ├── feature/S01-company-registration
 │
 ├── feature/S02-student-registration
 │
 └── feature/S03-login
```

Cela permet à chaque développeur de travailler indépendamment.

Cependant, une branche ne devrait pas rester isolée trop longtemps.

---

# 3. Garder les branches courtes

Plus une branche reste longtemps séparée de `main`, plus elle risque de diverger.

### Situation problématique

```text
main ──●──●──●──●──●──●──●──●

       └── Story A
            └──●──●──●──●──●
```

Après plusieurs jours, `main` et la branche de la story peuvent être très différentes.

Le merge risque alors de produire plusieurs conflits.

### Meilleure approche

Synchroniser régulièrement sa branche avec `main`.

---

# 4. Synchroniser sa branche avec `main`

Avant de commencer à travailler sur une story :

```bash
git switch main
git pull

git switch feature/S01-company-registration
git merge main
```

Puis vous pouvez commencer votre travail.

## Avant de faire votre Pull Request

Faites à nouveau :

```bash
git switch main
git pull

git switch feature/S01-company-registration
git merge main
```

S'il y a des conflits, **vous les résolvez sur votre branche**.

Ensuite :

```bash
# résoudre les conflits

# tester l'application

git add .
git commit
git push
```

Vous pouvez ensuite créer votre Pull Request / Merge Request.

### Pourquoi ?

Parce que la personne qui développe la story est généralement celle qui comprend le mieux les changements.

> **Celui qui crée le conflit doit idéalement le résoudre.**

---

# 5. Bien découper les stories

Le découpage des stories a un impact direct sur les conflits Git.

Supposons que l'équipe ait :

* `S01 - Inscription entreprise`
* `S02 - Inscription étudiant`
* `S03 - Connexion`

Une mauvaise organisation pourrait donner :

```text
S01 → UserController.java
S02 → UserController.java
S03 → UserController.java
```

Trois personnes vont modifier le même fichier.

Une meilleure organisation pourrait être :

```text
S01 → CompanyController
      CompanyService
      CompanyRepository
      CompanyDTO

S02 → StudentController
      StudentService
      StudentRepository
      StudentDTO

S03 → AuthenticationController
      AuthenticationService
      ...
```

Les stories sont alors davantage isolées techniquement.

---

# 6. Identifier les « Hotspot Files »

Certains fichiers sont naturellement plus susceptibles de provoquer des conflits.

Par exemple :

```text
App.jsx
routes.jsx
SecurityConfig.java
application.properties
pom.xml
package.json
schema.sql
```

Si cinq personnes modifient constamment :

```text
App.jsx
```

les conflits deviennent presque inévitables.

### 🔥 Hotspot

```text
                  ┌── Étudiant A
                  │
                  ├── Étudiant B
                  │
App.jsx ──────────┼── Étudiant C
                  │
                  ├── Étudiant D
                  │
                  └── Étudiant E
```

Lorsqu'un fichier devient un hotspot, demandez-vous :

> Peut-on modifier l'architecture pour réduire le nombre de personnes qui doivent toucher à ce fichier ?

---

# 7. L'architecture peut réduire les conflits Git

Une bonne architecture ne sert pas seulement à rendre le code plus propre.

Elle permet également à plusieurs développeurs de travailler simultanément.

Par exemple, plutôt qu'un énorme `App.jsx` :

```text
App.jsx
```

on peut avoir :

```text
App.jsx

components/
    CompanyRegistration.jsx
    StudentRegistration.jsx
    Login.jsx

pages/
    CompanyPage.jsx
    StudentPage.jsx
    AdminPage.jsx
```

Même principe côté Spring Boot :

```text
backend/

company/
    CompanyController
    CompanyService
    CompanyRepository

student/
    StudentController
    StudentService
    StudentRepository

authentication/
    AuthenticationController
    AuthenticationService
```

### Principe

> **Plus les responsabilités sont bien séparées, moins les développeurs ont besoin de modifier le même code.**

---

# 8. Faire de petits commits

Évitez les commits comme :

```text
"changes"
"fix"
"stuff"
"final"
"final final"
```

Un commit devrait représenter un changement logique.

Par exemple :

```text
feat: add company entity

feat: add company repository

feat: add company registration endpoint

test: add company registration tests

feat: add company registration form
```

Cela facilite :

* la compréhension de l'historique ;
* les Code Reviews ;
* la recherche de bugs ;
* les `revert` ;
* la résolution des conflits.

---

# 9. Éviter les « commits poubelle »

Évitez autant que possible :

```bash
git add .
git commit -m "changes"
```

lorsque votre répertoire contient plusieurs modifications sans rapport.

Imaginez un commit contenant :

```text
CompanyController.java
StudentController.java
App.jsx
README.md
application.properties
package-lock.json
```

Il devient difficile de comprendre ce que le commit accomplit réellement.

Préférez des commits ciblés et logiques.

---

# 10. Attention au formatage automatique

Un des problèmes les plus fréquents est la modification accidentelle d'un fichier entier.

Par exemple, un étudiant modifie réellement 5 lignes, mais son IDE reformate automatiquement 300 lignes.

Pour Git :

```text
300 lignes modifiées
```

Pour l'étudiant :

> « Je n'ai changé que 5 lignes ! »

Cela augmente énormément les risques de conflits.

### Évitez dans une story :

* reformatter tout le projet ;
* réorganiser tous les imports ;
* changer toutes les quotes ;
* appliquer Prettier à tous les fichiers ;
* modifier l'indentation de fichiers non concernés ;
* renommer massivement des classes ou variables ;
* faire du « nettoyage » qui n'est pas lié à la story.

> **Ne mélangez pas une modification fonctionnelle avec un gros changement de formatage.**

---

# 11. Communiquer lorsqu'une zone est partagée

Supposons :

```text
Story A → Login
Story B → Registration
```

et que les deux stories doivent modifier :

```text
SecurityConfig.java
```

Ne découvrez pas le problème au moment du merge.

### Mauvaise approche

```text
Étudiant A :
« Ma story est terminée. »

Étudiant B :
« La mienne aussi. »

Git :
💥💥💥
```

### Bonne approche

Dès que le problème est identifié :

```text
⚠️ S03 et S04 vont modifier SecurityConfig.java.
On doit se coordonner.
```

L'équipe peut alors décider :

* qui modifie le fichier en premier ;
* comment diviser le travail ;
* si une story doit être développée avant l'autre ;
* s'il faut modifier l'architecture.

> **La coordination technique fait partie du travail d'équipe.**

---

# 12. Merge ou Rebase ?

Git offre plusieurs façons de synchroniser une branche avec `main`.

## Merge

```bash
git switch feature/my-story
git merge main
```

Le résultat ressemble à :

```text
A ──●──●────────●
     \          /
      ●──●──●──●
```

Le merge conserve les différentes branches dans l'historique.

## Rebase

```bash
git switch feature/my-story
git rebase main
```

Le résultat ressemble davantage à :

```text
A ──●──●──●──●
```

Les commits de la branche sont replacés au-dessus de la version actuelle de `main`.

### Pour notre projet

Nous utiliserons principalement :

```bash
git merge main
```

Le `rebase` est une technique intéressante à connaître, mais il faut comprendre qu'il **réécrit l'historique des commits** et qu'il faut donc l'utiliser avec prudence sur des branches partagées.

---

# 13. Une Pull Request ne devrait pas être la première fois qu'on découvre les conflits

Avant de demander le merge de votre story :

```text
☑ Code terminé

☑ Tests passent

☑ Code Review effectuée

☑ main récupéré

☑ Conflits résolus

☑ Tests repassés après la résolution des conflits

☑ Branche poussée sur le serveur

☑ Pull Request / Merge Request créée
```

Le point le plus important est :

> **Après avoir résolu un conflit, il faut tester l'application.**

Pourquoi ?

Parce que Git vérifie seulement que les fichiers peuvent être fusionnés.

Git ne sait pas si votre application fonctionne encore correctement.

---

# 14. Un conflit Git n'est pas nécessairement un problème

Lorsqu'un conflit apparaît, ne paniquez pas.

Git vous montre essentiellement :

> « Je ne sais pas quelle version vous voulez conserver. »

Par exemple :

```text
<<<<<<< HEAD

return companyService.findAll();

=======

return studentService.findAll();

>>>>>>> feature/S02
```

Git vous demande de décider quelle version doit rester.

La bonne réponse n'est pas nécessairement :

```text
prendre HEAD
```

ou :

```text
prendre Incoming
```

Il faut comprendre **ce que les deux développeurs essayaient de faire**.

Parfois la bonne solution est même de conserver une combinaison des deux changements.

---

# 15. La procédure de résolution d'un conflit

Lorsqu'un conflit apparaît :

### 1. Identifier les fichiers en conflit

```bash
git status
```

### 2. Ouvrir les fichiers concernés

Chercher :

```text
<<<<<<<
=======
>>>>>>>
```

### 3. Comprendre les deux changements

Demandez-vous :

* Que voulait faire ma branche ?
* Que voulait faire `main` ?
* Les deux changements sont-ils compatibles ?
* Dois-je conserver un changement, l'autre ou les deux ?

### 4. Corriger le fichier

Supprimer les marqueurs Git :

```text
<<<<<<<
=======
>>>>>>>
```

### 5. Ajouter le fichier

```bash
git add fichier.java
```

### 6. Finaliser le merge

```bash
git commit
```

### 7. Tester

```bash
mvn test
```

et/ou :

```bash
npm test
```

ou lancer l'application et effectuer les tests fonctionnels nécessaires.

---

# 16. La règle la plus importante

Il existe deux façons de gérer les conflits :

### Approche A — Réactive

```text
Coder
   ↓
Coder
   ↓
Coder
   ↓
Coder
   ↓
Pull Request
   ↓
💥 MERGE HELL
   ↓
Essayer de comprendre ce qui s'est passé
```

### Approche B — Préventive

```text
Analyser la story
       ↓
Identifier les fichiers touchés
       ↓
Communiquer avec l'équipe
       ↓
Créer la branche
       ↓
Synchroniser avec main
       ↓
Coder
       ↓
Petits commits
       ↓
Synchroniser régulièrement
       ↓
Résoudre les conflits tôt
       ↓
Tester
       ↓
Pull Request
       ↓
Merge
```

La deuxième approche est celle que nous voulons développer.

---

# 17. Les 5 commandements anti-Merge Hell

## 1. Tu garderas tes branches courtes.

Une branche qui reste longtemps séparée de `main` accumule les différences.

## 2. Tu synchroniseras régulièrement ta branche avec `main`.

Ne laissez pas les conflits s'accumuler pendant plusieurs jours.

## 3. Tu éviteras de modifier les mêmes fichiers que tes coéquipiers.

Si c'est nécessaire, communiquez et coordonnez-vous.

## 4. Tu feras de petits commits logiques.

Un commit doit représenter une unité cohérente de travail.

## 5. Tu résoudras et testeras tes conflits avant de demander le merge.

Un conflit résolu n'est pas nécessairement un problème résolu.

---

# 18. La règle d'or

> ## **Git ne crée pas les conflits. Notre façon de travailler les crée.**

Les conflits font partie du développement logiciel en équipe.

L'objectif n'est donc pas :

> **« Ne jamais avoir de conflit. »**

L'objectif est :

> **« Avoir des conflits petits, fréquents et faciles à comprendre plutôt qu'un énorme conflit à la fin du sprint. »**

Une bonne équipe développe simultanément **du code et une stratégie de collaboration**.
