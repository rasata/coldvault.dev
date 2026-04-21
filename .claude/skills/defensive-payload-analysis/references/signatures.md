# Signatures connues — familles de malware dans du code source

Ce document récapitule les signatures statiques détectables sans exécution
pour quelques familles actives (état 2025-2026). À enrichir au fil des analyses.

## BeaverTail / Contagious Interview (DPRK, Lazarus / Famous Chollima / UNC4899)

Attribution publique : Unit 42 (Palo Alto), Microsoft (Sapphire Sleet), Mandiant.
Cible : développeurs blockchain / Web3 via faux entretiens techniques.

### Vecteur

Charge JavaScript obfusquée **appendée** à un fichier de config de build, sur
**la même ligne** que l'accolade de fermeture `};` du vrai `module.exports` —
invisible sans word-wrap actif.

### Cibles typiques

- `tailwind.config.js` (le plus fréquent — chargé par react-scripts / postcss au build)
- `postcss.config.js`, `vite.config.js`, `webpack.config.js`
- `next.config.js`, `babel.config.js`
- Scripts `postinstall`/`preinstall` dans `package.json`

### Signatures statiques

- Ligne unique de 5 000 – 15 000 caractères en fin de fichier
- Tableaux `[0x.., 0x.., ...]` de 2 à 20 bytes (entrées XOR)
- **Clé XOR** : `[0x70, 0xa0, 0x89, 0x48]` (4 bytes, très stable entre variantes)
- Tableau de chaînes base64 de 20+ entrées (`'rYXJn', 'ywnisNy', 'Tcm1T', ...`)
- Fragments base64 concaténés : `'rYXJn'+'dg'`, `'Tcm1T'+'eW5j'`, `'zdA'`, `'recu'+'rsiv'`
- `Buffer.from(str, 'base64').toString('utf8')` pour résoudre `os`, `fs`, `child_process`, `request`, `path`, `process`
- `setInterval(..., 0x96640)` = **600 000 ms (10 min)**
- Variable compteur `< 0x3` (max 3 itérations puis `clearInterval` — anti-sandbox)
- Port hardcodé : **1244** (reconstitué de `':124' + '4'`)
- Magic bytes de réponse C2 : chaîne `ZT3` (3 premiers octets)
- Dossier cible : `os.tmpdir() + os.hostname() + '/.vscode/'` (légitimité visuelle + trigger VS Code)
- Fichiers droppés : `f.js`, `test.js`, `package.json`, `.npl`
- Paths HTTP : `/s/<12-char-hex>` (beacon), `/p`, `/j/`, `/f/`, `/keys` (exfil)

### Campaign IDs observés

Format : 12 chars hex, préfixe stable `90284f...`, suffixe variant par opérateur.
- `90284f3928b3`
- `90284f08cc01`

### Exfil

```
POST /keys HTTP/1.1
Content-Type: application/x-www-form-urlencoded

ts=<ms>&type=<tag>&hid=<host>+<user>+<platform>&ss=<arg0>&cc=<arg1>
```

### Persistence

```js
spawn(process.execPath, ['<path>/f.js'], {
  cwd: '<path>', detached: true,
  stdio: ['ignore', fd('/dev/null','a'), fd('/dev/null','a')],
  windowsHide: true
}).unref()
```

### Stage 2 typique : InvisibleFerret (Python RAT)

- Vol wallets navigateur : MetaMask (`nkbihfbeogaeaoehlefnkodbefgpgknn`), Phantom, Coinbase extension
- Vol Keychain macOS / Credential Manager Windows
- Vol SSH keys, `.gitconfig`, cookies navigateur
- Shell inverse, keylogger, harvest de fichiers

### IoCs réseau observés historiquement (exemples — à vérifier)

```
38.92.47.157:1244
147.124.202.225:1244
78.142.218.26:1244
66.235.168.17:1244
```

## npm typosquat / supply-chain (générique)

### Signatures

- Package récent (< 6 mois) avec download count très bas
- `scripts.postinstall` / `scripts.preinstall` non triviaux
- `install.js` qui fait `require('child_process').exec(...)`
- Dépendance vers un package qui diffère d'une lettre d'un populaire (`lodahs`, `reqeust`)
- `package.json` dont le champ `repository` pointe vers un repo vide/404
- Mainteneur avec un seul package, créé juste avant la publication malveillante

### Recherche

```bash
# Dans node_modules ou tarball npm :
grep -r "child_process" node_modules/<suspect>/
grep -rn "Buffer.from" node_modules/<suspect>/ | grep -i "base64"
grep -rn "postinstall\|preinstall" node_modules/<suspect>/package.json
```

## PyPI typosquat / dropper

### Signatures

- `setup.py` qui exécute du code réseau au `install` (pattern `urllib.request.urlopen` ou `requests.get` dans `setup.py`)
- `__init__.py` qui fait `exec(base64.b64decode(...))`
- Wheel dont le `RECORD` ne correspond pas au contenu réel
- Package qui shadowe un nom stdlib (`colorama` → `colorrama`, `requests` → `requets`)

## SocGholish / fake update droppers (web)

Hors scope repo source typique — se trouve surtout dans des JS servis dynamiquement.
Signatures à rechercher si du code JS client est fourni dans le scope :

- Fonctions nommées type `ad8`, `d2`, `b3` avec arithmétique sur `String.fromCharCode`
- Chaînes `%2F`, `%3A` concaténées (URLs URL-encoded à l'exécution)
- Usage de `document.createElement('script')` avec `src` construit dynamiquement

## Heuristiques génériques (toutes familles)

Indices forts de payload caché — à investiguer même sans correspondance famille connue :

1. **Disproportion** : un fichier config de 50 lignes où une ligne fait 3000+ chars
2. **Concaténation fragmentée** : `'ab' + 'cd' + 'ef'` sans raison fonctionnelle
3. **Résolution dynamique de modules** : `require(atob(...))`, `__import__(base64.b64decode(...))`
4. **Boucles d'obfuscation de noms** : réécriture de `var _0x1a2b` via `function(a,b){return _0xCCCC[a-0x123]}`
5. **Constantes hexa inhabituelles** dans du code "métier" : `0x96640` (10min), `0xea60` (1min), `0x1b7740` (30min) — timers de beacon
6. **Hash arithmétique en entrée** : `function check(){ var s=0; for(...) s+=...; return s==0x38a54 }` — protection anti-reordering
7. **Détection de sandbox** : `process.env.USER == 'sandbox'`, tests de résolution DNS spécifiques, `os.cpus().length < 2`
8. **Persistence cross-platform** : branches sur `process.platform` pour chemins Windows/Unix différenciés
