# rssproxy

Einfacher RSS-Feed-Proxy. Der Dienst holt einen Feed von einer Ziel-URL und gibt ihn unverändert als XML zurück – nützlich, wenn ein Client (z. B. ein RSS-Reader) den Feed nicht direkt abrufen kann.

Es gibt zwei Implementierungen:

- **`index.js`** – Node.js-Server (empfohlen für Docker/Produktion)
- **`index.php`** – ursprüngliche PHP-Variante für klassisches Webhosting

## Verwendung

```
GET /?feed=<URL-des-RSS-Feeds>
```

**Beispiel:**

```
http://localhost:3000/?feed=https://www.example.com/rss.xml
```

Die Antwort wird mit `Content-Type: text/xml;charset=UTF-8` zurückgegeben. Fehlt der Parameter `feed`, antwortet der Server mit HTTP 400.

## Lokal starten (Node.js)

Voraussetzung: Node.js ≥ 18

```bash
npm start
```

Der Server lauscht standardmäßig auf Port **3000**. Port ändern:

```bash
PORT=8080 npm start
```

## Docker

Image lokal bauen und starten:

```bash
docker build -t rssproxy .
docker run -p 3000:3000 rssproxy
```

Mit eigenem Port:

```bash
docker run -p 8080:8080 -e PORT=8080 rssproxy
```

## GitHub Container Registry (GHCR)

Bei Push auf `main`, bei Tags im Format `v*.*.*` oder manuell über **Actions → Publish Docker image to GHCR** wird das Image automatisch nach GHCR gepusht:

```
ghcr.io/<owner>/rssproxy:latest
```

Image pullen und starten:

```bash
docker pull ghcr.io/<owner>/rssproxy:latest
docker run -p 3000:3000 ghcr.io/<owner>/rssproxy:latest
```

Das Image unterstützt `linux/amd64` und `linux/arm64`.

## PHP-Variante

Die Datei `index.php` bietet dieselbe Funktionalität für Apache/nginx mit PHP. Die Ziel-URL wird ebenfalls über den Query-Parameter `feed` übergeben.

## Hinweise

- Die SSL-Zertifikatsprüfung ist deaktiviert (`rejectUnauthorized: false` bzw. `CURLOPT_SSL_VERIFYPEER => false`), damit auch Feeds mit ungültigen Zertifikaten abrufbar sind.
- Der Proxy leitet Anfragen ohne weitere Validierung weiter. Setze ihn nur in vertrauenswürdigen Umgebungen ein oder schränke den Zugriff per Reverse-Proxy ein.
