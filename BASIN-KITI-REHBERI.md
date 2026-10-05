# Proje tanıtım / basın kiti rehberi

Bu depo (`fermanakgun/proje-tanitim`) tüm projelerin tanıtım ve basın kiti sayfalarını **tek yerde** yayınlar (GitHub Pages).
Her proje kendi klasöründe durur; kökte proje listesi vardır. Bu belge hem sitenin yapısını hem de tanıtımın (görsel, video, sayfa) nasıl hazırlandığını anlatır.

Adres: https://fermanakgun.github.io/proje-tanitim/

## 1. Depo yapısı

```
index.html                 proje listesi (kök sayfa)
BASIN-KITI-REHBERI.md      bu belge
.nojekyll
<proje-adi>/
  index.html               Türkçe basın kiti sayfası
  en.html                  İngilizce sayfa
  assets/
    poster.jpg             klibin bir karesi
    tanitim_tr.mp4, tanitim_en.mp4   tanıtım klibi (tam çözünürlük, yeniden sıkıştırılmamış orijinal)
    <proje>-magaza-gorselleri.zip    tam boy mağaza görselleri (JPEG q90)
    presskit/              ikon 1024, OG banner 1200×630 (tr/en), kare promo 1080×1080
    shots/{tr,en}/         galeri görselleri (900 px genişlik JPEG)
```

- Pages kaynağı: `main` dalı, yol `/`. Depo herkese açık olduğundan **içine yalnız yayınlanacak dosyalar** konur: iç not, gizli değer, kişisel yol, kimlik bilgisi koyma.
- Projelerin kaynak kodu başka (özel) depolardadır. Her projenin kendi deposunda `docs/press/` altında sayfanın kaynağı (`build.py`) durur; üretilen dosyalar buraya kopyalanır.
- Proje adresi: `https://fermanakgun.github.io/proje-tanitim/<proje-adi>/` (EN: `/en.html`).

## 2. Yeni proje eklemek

1. Projenin deposunda `docs/press/build.py` ile TR + EN sayfayı üret (şablon: mevcut bir projeden kopyala; metinler ve bağlantılar `L` sözlüğündedir, JavaScript yok, CSS satır içi).
2. Varlıkları hazırla (bölüm 3), toplam klasör boyutu 60 MB altında kalsın.
3. `BASE` adresini `https://fermanakgun.github.io/proje-tanitim/<proje-adi>/` yap (canonical, og:url, hreflang, JSON-LD buna göre).
4. Çıktıyı (`index.html`, `en.html`, `assets/`) bu depoda `<proje-adi>/` klasörüne kopyala.
5. Kökteki `index.html` listesine projeyi ekle (kart: ikon, ad, iki satır tanıtım, TR/EN bağlantıları).
6. `git add -A && git commit && git push`; Pages birkaç dakikada yenilenir. Doğrula:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://fermanakgun.github.io/proje-tanitim/<proje-adi>/   # 200
   gh api repos/fermanakgun/proje-tanitim/pages/builds/latest --jq .status                              # built
   ```

## 3. Varlıklar nasıl hazırlanır

- **Mağaza ekran görüntüleri:** uygulamanın UI testi (tanıtım verisiyle) iPhone 6.9" (1290×2796 / 1320×2868) ve iPad 13" (2064×2752) için ekran görüntüsü alır; siteye galeri için `sips --resampleWidth 900` ile JPEG yapılır (PNG'ler 34 MB tuttuğu için siteye konmaz), ZIP'e tam boy JPEG q90 girer.
- **İkon:** `AppIcon.png` 1024 kopyası.
- **Banner / kare görsel:** CoreGraphics ile küçük bir Swift betiği: proje renk paleti, kalın yuvarlak başlık, çerçeveli telefon kırpmaları. OG banner 1200×630 (TR/EN), kare 1080×1080.
- **Tanıtım klibi (App Preview):** ~25 sn, dikey, H.264 30 fps, stereo AAC. Akış:
  1. Simülatörde uygulama tanıtım verisiyle açılır; UI testi sahneleri insan hızında gezer, `simctl io recordVideo` ile eşzamanlı kayıt alınır, test sahne/olay zamanlarını `timeline.json`'a yazar.
  2. Testin düğme arama bekleyişleri (ölü anlar) `cuts` listesiyle işaretlenir ve kurguda çıkarılır.
  3. Kurgu AVFoundation + CoreAnimation ile (ffmpeg gerekmez): oyun tam ekran, üstüne sahne başına bir büyük konturlu pop kelime, kapanışta ikon + ad kartı.
  4. Ses: ElevenLabs `eleven_v3` ile enerjik anlatım (TR ve EN için ayrı erkek ses; stability 0.3, style 0.6, similarity 0.75, speaker boost; `[excited]` / `[enthusiastic]` etiketleri), oyunun müziği anlatım varken kısılır, geçişlerde swoosh, kapanışta pop.
  5. Siteye **tam çözünürlükte, yeniden sıkıştırılmadan orijinal mp4** konur (kullanıcı kuralı); küçültülmüş kopya yapılmaz.
  - **İngilizce klip / görsel için oyunun arayüzü de İngilizce olmalı** (`-AppleLanguages "(en)" -AppleLocale en_US`); her kayıttan kare çıkarıp arayüz dilini doğrula.
- **Poster:** klibin bir karesi (`poster.jpg`).
- Dosya adları küçük harf, Türkçe karakter ve boşluk yok.

## 4. Sayfa içeriği (her proje sayfasında)

Üst çubuk (ikon, ad, bölüm menüsü, dil düğmesi, "Tüm projeler" bağlantısı) → hero (ikon, ad, slogan, indirme düğmesi, basın kiti düğmesi) → tanıtım klibi (`<video controls poster>` + "Klibi indir") → bilgi formu (geliştirici, platform, fiyat, diller, çıkış, tür, çevrimdışı, iletişim) → hakkında + öne çıkanlar → ekran görüntüleri (iPhone ve iPad, tıklayınca büyür) → indirilebilir materyaller + bağlantılar (mağaza, gizlilik, destek) → altbilgi. Baş etiketleri: `<title>`, açıklama, Open Graph + Twitter kartı, `hreflang`, JSON-LD (`SoftwareApplication`).

## 5. Dikkat edilecekler

- **Mağaza bağlantısı ülke kodlu olmalı:** `https://apps.apple.com/tr/app/<ad>/id<uygulama-id>`. Ülkesiz bağlantı masaüstünde ABD mağazasına yönlenip hata verebilir. Uygulama yayında değilken düğme yerine "Yakında App Store'da" yaz; yayın sonrası bağlantıyı ekle.
- İçerik doğruluğu: "ücretsiz, reklamsız, satın alma yok" gibi ifadeler yalnız gerçekse. Yayında olmayan sürüm bilgisi yazma.
- Çocuklara yönelik projelerde yaş/yaş aralığı yazma (proje kararı); gizlilik ve destek bağlantıları projenin kendi herkese açık sayfalarına gitsin.
- EN sayfadaki görsel ve klip İngilizce arayüzden olmalı; yoksa sayfaya not düş.
- Site herkese açıktır: e-posta dışında kişisel bilgi, iç belge, kimlik/anahtar koyma.
- Büyük dosyalar: tek dosya 100 MB sınırının altında, klasör toplamı 60 MB altında tut; video orijinal kalır (küçültme), gerekirse diğer görselleri hafiflet.

## 5b. Ortak gezinme, dil düğmesi ve lightbox

Tüm sayfalar `assets/` altındaki ortak dosyaları kullanır (sayfa içinde JavaScript yazılmaz):
- `assets/projects.js`: proje listesi (`window.PROJECTS`: id, tr/en ad, ikon, klasör, kısa metin). Yeni proje buraya eklenir; "Tüm projeler" menüsü, altbilgi şeridi ve kök sayfa kartları bu listeden üretilir. TR sayfa `<klasör>`, EN sayfa `<klasör>en.html`.
- `assets/site.js` + `assets/site.css`: açılır menü (klavye, Esc, dış tık), TR | EN düğmesi (tercih `localStorage`'a yazılır, zorla yönlendirme yok) ve lightbox (kapatma, ok tuşları, kaydırma, sayaç, odak tuzağı).
- Sayfa işaretlemesi: üst çubukta `<div class="ps-menu"><a href="../">Tüm projeler</a></div>` ve `<span class="ps-lang">…TR/EN…</span>`; altbilgide `<div class="ps-foot" data-ps-footer>`; galeri kümesinde `data-lightbox` (JS yokken bağlantılar çalışır). Yollar alt klasörde `../assets/…`, kökte `assets/…`.
- Her sayfanın EN karşılığı (`en.html`) ve `hreflang`/`canonical` zorunludur; kökte de `index.html` ↔ `en.html`.

## 6. Diğer yerler

- Her projenin kendi README'sine "Basın kiti" bağlantısı (bu sitedeki proje adresi) eklenir.
- **Zorunlu:** her yeni proje GitHub profil README'sindeki (`fermanakgun/fermanakgun`) "Projelerim" tablosuna, kök `index.html` ile aynı sırada eklenir. Ayrıntı: `CLAUDE.md`.
