# SOBER — Minimal Streetwear E‑Commerce

Live: https://chimerical-hotteok-c9f4d4.netlify.app
Repo: https://github.com/NotSober4444/Sober

## Struttura
- index.html — Home + modale collezione + modale dettaglio prodotto
- gallery.html — Esposizione foto con lightbox
- about.html, contact.html — Pagine informative
- checkout.html, thank-you.html — Pagamento PayPal e conferma
- style.css — Stili globali
- script.js — Carosello, carrello, modali, lightbox
- assets/ — Immagini (es. graffiti.jpg, foto gallery)

## Deploy (Git → Netlify)
1. Modifica i file
2. Salva e commit:
   ```powershell
   git add .
   git commit -m "Update"
   git push
   ```
3. Netlify effettua l’auto-deploy (Builds → Published)

Note: Sito statico, nessun build command; publish directory è la root.

## Aggiungere prodotti/foto
- Prodotti: array `products` in `script.js` (usa `images: [url1, url2...]`) 
- Carosello: mostra una sola immagine per capo (prima di `images`)
- Dettaglio prodotto: navigazione tra immagini, badge "k / n" in alto a destra

### Esempio oggetto prodotto
```js
{
   id: 10,
   name: 'T-Shirt Logo - SOBER',
   category: 'maglieria',
   price: 39.99,
   sizes: ['S','M','L'],
   images: [
      'https://picsum.photos/400/300?random=10',
      'https://picsum.photos/400/300?random=110'
   ]
}
```
Note:
- `images[0]` è usata nel carosello; nel modal si può navigare tra tutte.
- `sizes` è opzionale; se presente, appare la select nel dettaglio.

## Interazioni chiave
- Zoom: click sull’immagine + rotella; niente pulsante
- Pan: drag quando zoomato
- Carrello: aggiunta solo da modale collezione/dettaglio
- Gallery: lightbox attivo (non per il carosello)

## Checkout PayPal
- Bottone in `checkout.html` con SDK PayPal (EUR)
- Funding "mybank" disabilitato
- Dopo il pagamento: redirect a `thank-you.html`

## Sviluppo locale
```powershell
python -m http.server 8000
# apri http://localhost:8000
```
Oppure usa l’estensione VS Code "Live Server".

## Manutenzione
- Background graffiti solo in homepage (`.home-page::before`)
- Nessun testo con contorni; font Space Mono
- Badge foto trasparente con text-shadow per leggibilità

## Problemi comuni
- Git non riconosciuto: reinstalla Git e riavvia (PATH)
- Netlify non pubblica: imposta publish directory alla root (.)
- Immagini non visibili: controlla percorsi in `assets/` e nomi file
