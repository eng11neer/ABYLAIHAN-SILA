// script.js
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const playBtn = document.getElementById('play-btn');
  const sweepBtn = document.getElementById('sweep-btn');
  const photos = Array.from(document.querySelectorAll('.photo-neon'));
  const photoItems = Array.from(document.querySelectorAll('.photo-item'));

  // === АВТОМАТИЧЕСКИЙ АВТОЗАПУСК ===
  function autoPlayFix() {
    audio.volume = 0.9;

    // Попытка запустить звук сразу (будет играть, но сначала muted)
    audio.play().then(() => {
      if (playBtn) playBtn.style.display = "none";
    }).catch(() => {
      if (playBtn) playBtn.style.display = "inline-block";
    });

    // После первого клика/нажатия звук станет слышимым
    function unmute() {
      audio.muted = false;
      audio.play().catch(()=>{});
      if (playBtn) playBtn.style.display = "none";

      window.removeEventListener("click", unmute);
      window.removeEventListener("touchstart", unmute);
      window.removeEventListener("keydown", unmute);
    }

    window.addEventListener("click", unmute);
    window.addEventListener("touchstart", unmute);
    window.addEventListener("keydown", unmute);
  }

  autoPlayFix();

  // Кнопка как резервный вариант (оставляем)
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      audio.muted = false;
      audio.play().then(() => {
        playBtn.style.display = 'none';
      }).catch(() => {});
    });
  }

  // === АНИМАЦИИ ОСТАВИЛ ТЕ ЖЕ КАК У ТЕБЯ ===

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

  sweepBtn.addEventListener('click', sweepPhotos);

  setTimeout(() => {
    sweepPhotos();
  }, 8000);

  photos.forEach(photo => {
    photo.addEventListener('mousemove', (e) => {
      const rect = photo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      photo.style.transform = `rotateZ(${(x-rect.width/2)/60}deg) scale(1.01)`;
      photo.style.filter = `drop-shadow(0 20px 50px rgba(0,0,0,0.8)) saturate(1.1)`;
    });
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = '';
      photo.style.filter = '';
    });
  });

  ['touchstart','click','keydown'].forEach(evt => {
    window.addEventListener(evt, () => {
      if (audio.paused) {
        audio.muted = false;
        audio.play().catch(()=>{});
      }
    }, {once:true});
  });
});
