// script.js
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const playBtn = document.getElementById('play-btn');
  const sweepBtn = document.getElementById('sweep-btn');
  const photos = Array.from(document.querySelectorAll('.photo-neon'));
  const photoItems = Array.from(document.querySelectorAll('.photo-item'));

  // Try to autoplay; if blocked, show play button (user can click)
  function tryPlayAudio() {
    audio.volume = 0.9;
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        playBtn.style.display = 'none';
      }).catch(() => {
        playBtn.style.display = 'inline-block';
      });
    }
  }
  tryPlayAudio();

  // Play button click (fallback for browsers that block autoplay)
  playBtn.addEventListener('click', () => {
    audio.play().then(() => {
      playBtn.style.display = 'none';
    }).catch(err => {
      console.warn('Автовоспроизведение запрещено:', err);
    });
  });

  // Progressive neon entrance for photos when page loads: each photo enters from left one-by-one
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

  // Sweep all photos from left to right (final effect). Triggered by button or auto after some time.
  function sweepPhotos() {
    // ensure photos are visible first
    photoItems.forEach((item) => {
      item.classList.remove('photo-sweep-enter');
      item.classList.add('photo-sweep-in');
    });

    // then after short delay push them out to the right one-by-one
    photoItems.forEach((item, idx) => {
      setTimeout(() => {
        item.classList.remove('photo-sweep-in');
        item.classList.add('photo-sweep-out');
      }, 1400 + idx * 220);
    });

    // Optional: after sweep, bring them back from left for a looped effect
    setTimeout(() => {
      photoItems.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.remove('photo-sweep-out');
          item.classList.add('photo-sweep-enter');
          // then re-enter
          setTimeout(() => {
            item.classList.add('photo-sweep-in');
            item.classList.remove('photo-sweep-enter');
          }, 200 + idx * 150);
        }, idx * 100);
      });
    }, 4200);
  }

  // Button to manually trigger sweep
  sweepBtn.addEventListener('click', sweepPhotos);

  // Auto-trigger sweep once after a while so visitor sees effect (non-blocking)
  setTimeout(() => {
    sweepPhotos();
  }, 8000);

  // Small interactive photo hover glow
  photos.forEach(photo => {
    photo.addEventListener('mousemove', (e) => {
      const rect = photo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      photo.style.transform = `translate3d(0,0,0) rotateZ(${(x-rect.width/2)/60}deg) scale(1.01)`;
      photo.style.filter = `drop-shadow(0 20px 50px rgba(0,0,0,0.8)) saturate(1.1)`;
    });
    photo.addEventListener('mouseleave', () => {
      photo.style.transform = '';
      photo.style.filter = '';
    });
  });

  // Extra: if user interaction occurs, ensure audio plays (to satisfy autoplay policies)
  ['touchstart','click','keydown'].forEach(evt => {
    window.addEventListener(evt, () => {
      if (audio.paused) {
        audio.play().catch(()=>{});
      }
    }, {once:true});
  });
});
