// script.js
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const playBtn = document.getElementById('play-btn');
  const sweepBtn = document.getElementById('sweep-btn');
  const photos = Array.from(document.querySelectorAll('.photo-neon'));
  const photoItems = Array.from(document.querySelectorAll('.photo-item'));

  // --- АВТОЗАПУСК МУЗЫКИ ---
  audio.volume = 0.9;

  // Первая попытка автозапуска
  audio.play().then(() => {
    if (playBtn) playBtn.style.display = 'none';
  }).catch(() => {
    if (playBtn) playBtn.style.display = 'inline-block';
  });

  // При ПЕРВОМ действии пользователя размутить и включить звук
  function unmute() {
    audio.muted = false;
    audio.play().catch(() => {});
    if (playBtn) playBtn.style.display = 'none';

    window.removeEventListener('click', unmute);
    window.removeEventListener('touchstart', unmute);
    window.removeEventListener('keydown', unmute);
  }

  window.addEventListener('click', unmute, { once: true });
  window.addEventListener('touchstart', unmute, { once: true });
  window.addEventListener('keydown', unmute, { once: true });

  // --- КНОПКА (если нужна) ---
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      audio.muted = false;
      audio.play().then(() => {
        playBtn.style.display = 'none';
      });
    });
  }

  // --- НЕОН ВХОД ФОТО ---
  function sequentialEntrance() {
    photoItems.forEach((item, idx) => {
      item.classList.add('photo-sweep-enter');
      setTimeout(() => {
        item.classList.add('photo-sweep-in');
        item.classList.remove('photo-sweep-enter');
      }, 600 + idx * 450);
    });
  }
  sequentialEntrance();

  // --- ВЫХОД ФОТО ---
  function sweepPhotos() {
    photoItems.forEach((item) => {
      item.classList.remove('photo-sweep-enter');
      item.classList.add('photo-sweep-in');
    });

    photoItems.forEach((item, idx) => {
      setTimeout(() => {
        item.classList.remove('photo-sweep-in');
        item.classList.add('photo-sweep-out');
      }, 1400 + idx * 220);
    });

    setTimeout(() => {
      photoItems.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.remove('photo-sweep-out');
          item.classList.add('photo-sweep-enter');
          setTimeout(() => {
            item.classList.add('photo-sweep-in');
            item.classList.remove('photo-sweep-enter');
          }, 200 + idx * 150);
        }, idx * 100);
      });
    }, 4200);
  }

  if (sweepBtn) sweepBtn.addEventListener('click', sweepPhotos);

  setTimeout(() => {
    sweepPhotos();
  }, 8000);

  // --- НЕОН ХОВЕР ---
  photos.forEach(photo => {
    photo.addEventListener('mousemove', (e) => {
      const rect = photo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      photo.style.transform = `translate3d(0,0,0) rotateZ(${(x - rect.width / 2) / 60}deg) scale(1.01)`;
      photo.style.filter = `drop-shadow(0 20px 50px rgba(0,0,0,0.8)) saturate(1.1)`;
    });
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = '';
      photo.style.filter = '';
    });
  });
});
