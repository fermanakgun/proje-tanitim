# Proje Tanıtım — Claude kuralları

Bu depo (`fermanakgun/proje-tanitim`) Ferman Akgün'ün tüm projelerinin herkese açık tanıtım / basın kiti sitesidir: https://fermanakgun.github.io/proje-tanitim/ (GitHub Pages, `main` dalı, kök `/`). Ayrıntılı nasıl-yapılır: `BASIN-KITI-REHBERI.md`.

## Genel
- Kullanıcıya her zaman Türkçe yaz; karar gerektiren soruları çoktan seçmeli sor.
- Bu depoya birden çok projenin Claude oturumu yazar: işe başlamadan `git pull`, yalnız kendi proje klasörüne dokun; kök `index.html` ve ortak dosyalarda başkasının satırını silme / değiştirme.
- Site herkese açıktır: gizli değer, anahtar, iç belge, e-posta dışında kişisel bilgi koyma.

## ZORUNLU: Yeni proje = profilde de görünür
Siteye eklenen **her yeni proje aynı iş içinde GitHub profil sayfasına da eklenir**. Biri olmadan diğeri bitmiş sayılmaz.

1. Projeyi `<proje-adi>/` klasörüne ekle (TR `index.html` + EN `en.html` + `assets/`), ikonunu `assets/<proje-adi>.png` olarak koy.
2. Kök `index.html` listesine kart ekle (ikon, ad, kısa tanıtım TR · EN, Türkçe/English bağlantıları).
   - **Ortak site özellikleri (zorunlu):** `assets/projects.js` listesine projeyi ekle (tüm sayfalarda "Tüm projeler" menüsü, altbilgi şeridi ve kök kartlar buradan gelir; sıra kök `index.html` ve profil README'siyle aynı olsun). Galeri görsel kümelerini `data-lightbox` ile işaretle (örn. `<div class="shots" data-lightbox>`); büyük kaynak için görsele `data-full`. Sayfaya `../assets/site.css`, `../assets/projects.js` ve `../assets/site.js` (defer) ekle; TR/EN düğmesi (`.ps-lang`), "Tüm projeler" (`.ps-menu`) ve altbilgi şeridi (`data-ps-footer`) işaretlemesini mevcut sayfalardan kopyala. EN karşılığı (`en.html`) zorunlu.
3. **Profil README'si:** `fermanakgun/fermanakgun` deposundaki `README.md` → "Projelerim" tablosuna (`<table>` … `<!-- /Projelerim -->` arası) aynı projeyi **kök `index.html` ile aynı sırada** bir `<tr>` satırı olarak ekle:
   - ikon: `https://fermanakgun.github.io/proje-tanitim/assets/<proje-adi>.png` (width 96), tanıtım sayfasına bağlı
   - **ad** (tanıtım sayfası bağlantılı) · *İngilizce adı* — platform
   - bir satır tanıtım
   - bağlantılar: App Store (yayındaysa, ülke kodlu `/tr/app/...`) · Tanıtım sayfası · English
   - Mevcut satır biçimini kopyala; özgeçmiş bölümlerine (Deneyim, Eğitim, Yetenekler) dokunma.
4. Bir proje siteden kaldırılır, adı/sırası değişirse profil tablosu da aynı şekilde güncellenir.
5. Commit + push (iki depo), sonra doğrula:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://fermanakgun.github.io/proje-tanitim/<proje-adi>/
   gh api repos/fermanakgun/proje-tanitim/pages/builds/latest --jq .status
   gh api repos/fermanakgun/fermanakgun/contents/README.md --jq .content | base64 -d | grep "<proje-adi>"
   ```
6. Projenin kendi README'sine "Basın kiti" bağlantısı ekle.

## İçerik kuralları
- **Videolar tam çözünürlükte, orijinal dosya** olarak eklenir; yeniden sıkıştırma / küçültme yok (tek dosya < 100 MB).
- **EN sayfadaki görsel ve klipler İngilizce oyun arayüzünden** olmalı (simülatörde `-AppleLanguages "(en)" -AppleLocale en_US`); kareleri kontrol et. Yoksa sayfaya not düş.
- App Store bağlantısı ülke kodlu: `https://apps.apple.com/tr/app/<ad>/id<id>`. Yayında değilse "Yakında App Store'da".
- "Ücretsiz, reklamsız, satın alma yok" gibi iddialar yalnız doğruysa; yayında olmayan sürüm bilgisi yazılmaz. Çocuklara yönelik projelerde yaş/yaş aralığı yazılmaz.
- Dosya adları küçük harf, Türkçe karakter ve boşluk yok.
