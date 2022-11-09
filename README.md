# Pour lancer l'application du réseau social
-Il faut d'abord lancer la base de données MySQL et le backend https://github.com/jpmazel/p7-backend (voir le readme sur le backend)

-Pour installer les packages : `npm install`

-Après dans le terminal :  `npm start`

-compte de connexion pour les tests :
utilisateur ADMIN/MODERATEUR : test@test.com    password: azertAZERT75 
utilisateur                  : test01@test.com  password: azertAZERT75
utilisateur                  : test02@test.com  password: azertAZERT75

Ce projet est le projet final de la __formation de développeur web__ d'OC.   
J'ai passé la soutenance le 10 juin 2022 que j'ai réussie.  
Obtention du diplome de niveau 5 (bac+2) de __développeur web__ le 29-06-2022

__Profil linkedin__ : https://www.linkedin.com/in/jeanpierremazel/

Depuis la soutenance du projet , j'ai ajouté différente amélioration du code , comme passer l'application de REACT17 à REACT18 ce qui m'a fait buggé l'application et j'ai corrigé tous les problèmes.
Le passage de l'API Context à l'utilisation de REDUX TOOL KIT et des actions asynchrones pour l'authentification et pour gérer les commentaires des posts du feed ainsi que la fiche utilisateur.

Il reste juste la gestion des posts du feed avec le custom hook http que j'ai fait, pour l'exemple.

NOTE sur le projet qui me sert à me former:  
__Utlisation de React avec les hooks:__
  * useState
  * useEffect
  * useContext
  * useRef
  * useCallback
  * useMemo
  * useReducer (dans le composant AuthForm.js dans la version du programme où je ne suis pas passé à React18 et l'utilisation de REDUX TOOLKIT)
    
  * custom hook http: useHttp (utilisé pour gérer les posts)

__React Router DOM V6:__ 
  * useParams
  * useNavigate
  * Navigate 
  * NavLink

  __Utlisation de Redux Toolkit:__
  * sur la partie gestion des commentaires des posts, l'authentification, la fiche utilisateur
  * création du store, des slices, des reducers, des actions async, des requêtes HTTP, et du chaînage de promise (requête PUT qui après exécution enchaîne sur une requête GET lors de la modification de la photo de la fiche utilisateur pour bien mettre à jour le store avec la nouvelle url de la photo pour éviter une erreur de requête GET dans la console du navigateur)
  * Suppression de certains "props drilling" et de "lifting state up"
  * Gestion des CRUD (authentification, les posts du feed, la fiche utilisateur)

  __Passage de React17 à React18__

Actuellement au 2022-11-09 il y a 0 warning (ESLint)