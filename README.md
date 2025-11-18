# Skolekantina – fordypningsprosjekt

Responsiv webapplikasjon for kantinen ved Vågen videregående skole. Løsningen viser ukemenyen med bilder, priser og beskrivelser, og inkluderer et administrasjonspanel slik at kantinepersonalet kan oppdatere menyen uten å redigere kildekoden.

## Funksjoner
- Forside bygget med ren HTML, modulær SCSS og vanilla JavaScript.
- Ukemeny hentet fra `menu.json`, gruppert per ukedag.
- Admin-grensesnitt (`/admin`) for å legge til, endre og fjerne retter, inkludert bildeopplasting.
- Lettvekts Flask-API (`app.py`) som lagrer menydata og filer lokalt under `src/assets/uploads`.
- Parcel-bundler med GitHub Actions som bygger og deployer til GitHub Pages.

## Teknologi
- **Parcel 2** – bundling, hot reload og produksjonsbygg.
- **Sass (SCSS)** – komponentbasert styling med egne block- og utility-filer.
- **Vanilla JS** – interaktivitet og admin-logikk uten rammeverk.
- **Flask** – enkel API-server for lokal lagring av meny og bilder.
- **GitHub Actions + GitHub Pages** – CI/CD som publiserer `dist/`.

## Kom i gang
### Forutsetninger
- Node.js 20+ og npm
- Python 3.10+ (kun nødvendig dersom du vil bruke admin-API-et)
- Git

### Installer avhengigheter
```bash
npm install
```
Hvis du trenger API-et:
```bash
pip install flask
```

### Lokal utvikling
1. Start Parcel (hot reload på port 8000 som standard):
   ```bash
   npm run dev        # eller npm run start for port 3000
   ```
2. (Valgfritt) start Flask-API-et i en ny terminal. Det kreves for at `/admin` skal kunne lagre menyen og laste opp bilder.
   ```bash
   python app.py
   ```
   API-et server filer fra `src/` og eksponerer `GET/POST /api/menu` samt `POST /api/upload`.

### Bygg for produksjon
```bash
npm run build
```
Parcel produserer en optimalisert versjon i `dist/`. Det er denne mappen som distribueres til GitHub Pages eller annen hosting.

## NPM-scripts
| Script | Beskrivelse |
| --- | --- |
| `npm run dev` | Parcel dev-server på port 8000 med hot reload. |
| `npm run start` | Parcel dev-server på port 3000. |
| `npm run build` | Produksjonsbygg til `dist/` (med `--public-url ./`). |
| `npm run lint` | ESLint over hele prosjektet. |
| `npm run lint:fix` | ESLint med automatisk fiks. |
| `npm run sass:watch` | Kompilerer `src/index.scss` og `src/styles/admin.scss` til `src/css/` i watch-modus. |
| `npm run sass:build` | Engangskompilering av SCSS til `src/css/`. |
| `npm run clean` | Sletter `dist/` og `.parcel-cache/`. |

## Deploy til GitHub Pages
1. Push endringer til `main`. Workflowen `.github/workflows/deploy.yml` kjører automatisk.
2. GitHub Actions kjører `npm ci` og `npm run build`, laster opp `dist/` og publiserer den via Pages.
3. Nettstedet blir tilgjengelig på `https://liena-grytsyna.github.io/fordypningsprosjekt-1-liena-grytsyna/`.
4. Du kan når som helst trigge workflowen manuelt via **Actions → Deploy to GitHub Pages → Run workflow**.

> GitHub Pages støtter bare statiske filer. Flask-API-et (`app.py`) brukes derfor kun lokalt for å vedlikeholde `menu.json` og opplastede bilder. Husk å committe oppdatert `menu.json`/`src/assets/uploads` før deploy.

## Prosjektstruktur (kortversjon)
```
├── src/
│   ├── index.html            # offentlig side
│   ├── admin.html            # admin-grensesnitt
│   ├── scripts/
│   │   ├── main.js           # logikk for forsiden
│   │   └── admin.js          # admin- og API-funksjoner
│   ├── styles/               # SCSS-moduler
│   ├── css/                  # genererte CSS-filer
│   └── assets/               # bilder, ikoner og uploads
├── menu.json                 # data som mates inn i menyen
├── app.py                    # Flask-server for lokal administrasjon
└── .github/workflows/        # GitHub Actions for deploy
```

## Lisens
Prosjektet bruker ISC-lisensen (se `package.json`). Gjenbruk gjerne komponenter eller ideer i egne prosjekter.
