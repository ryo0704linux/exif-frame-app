const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const exif = await exifr.parse(file);
    const cam = exif?.Make && exif?.Model ? `${exif.Make} ${exif.Model}` : '';
    const lens = exif?.LensModel || '';
    const expo = exif?.ExposureTime && exif?.FNumber
      ? `1/${Math.round(1 / exif.ExposureTime)}s  f/${exif.FNumber}`
      : '';

    const lines = [cam, lens, expo].filter(x => x);

    const fontSize = 48;
    const margin = 80;
    const lineHeight = 60;
    const extraHeight = lines.length * lineHeight + margin;

    canvas.width = img.width + margin * 2;
    canvas.height = img.height + extraHeight + margin;

    // 背景（白枠）
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 画像
    ctx.drawImage(img, margin, margin, img.width, img.height);

    // テキスト
    ctx.fillStyle = "#000";
    ctx.font = `${fontSize}px sans-serif";
    ctx.textAlign = "center";

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2,
        img.height + margin + (i + 1) * lineHeight);
    });

    downloadBtn.disabled = false;
  };
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'framed-image.jpg';
  link.href = canvas.toDataURL('image/jpeg', 1.0);
  link.click();
});