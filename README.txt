se placer dans le dossier frontend et lancer npm start
se placer dans le dossier racine et lanceer npm run dev
lancer la bdd comme vu dans le cours, 

la bdd doit avoir 2 tables : 
pokemons
trainers

et doit avoir des entrées selon les modèles, je vous conseilles de faire une inscription et de modifier le role en ADMIN depuis le client mongodb.

ensuite je vous conseilles d'ajouter un Pokemon via le front du site.
sinon, les entitées de cette table sont sous cette forme : 

{
  "_id": {
    "$oid": "67b85a746fb10fdcdbffe027"
  },
  "name": "Evan",
  "imagePath": "/uploads/1740135028308-876496595.png",
  "description": "Le Evan est petit, discret, mais facilement identifiable grâce à la musique Linkin Park qui l'accompagne. On peut l'apercevoir jusqu'à 18h30, heure à laquelle il s'endort",
  "types": [
    "DARK",
    "NORMAL"
  ],
  "regions": [
    "Rhône-Alpes"
  ],
  "capacities": [
    "Repos",
    "Lilliput",
    "Blabla-dodo",
    "Tranche-Nuit"
  ],
  "stats": {
    "HP": 80,
    "ATK": 65,
    "ATKSPE": 40,
    "DEF": 70,
    "DEFSPE": 58,
    "VIT": 55
  },
  "__v": 0
}

Je conseille un npm install pour avoir les bons modules du package.json

Ensuite connectez vous, vous pourrez voir les pokemons, les dresseurs, etc...  construire vos équipes via la modification de votre dresseur etc....
