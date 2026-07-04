# Quiz Master

React + TypeScript + Vite tabanlı, OpenTDB API’sinden gelen sorularla oynanan bir "Kim 1 Milyon İster" tarzı quiz oyunudur.

## Özellikler

- 15 soruluk quiz akışı
- Türkçe / İngilizce dil seçimi
- 50-50 ve seyirci jokerleri
- Ödül tablosu ve zamanlayıcı
- Tam ekran modu
- OpenTDB API entegrasyonu

## Teknolojiler

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest

## Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
3. Tarayıcıda şu adresi açın:
   ```text
   http://localhost:5173
   ```

## Build

Production build oluşturmak için:

```bash
npm run build
```

## Testler

Testleri çalıştırmak için:

```bash
npx vitest run
```

## Proje Yapısı

```text
src/
  components/   # UI bileşenleri
  hooks/        # Oyun mantığı hook'ları
  lang/         # Dil dosyaları ve çeviriler
  lib/          # Yardımcı fonksiyonlar
  enums/        # Enum tanımları
  types/        # TypeScript tipleri
```
