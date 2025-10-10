// 메인 JS 영역

//////////// 공통영역 ////////////

// 마우스 커서 (GPU transform + rAF)
(() => {
  const cursor = document.querySelector('.custom-cursor');

  // 이미지 팁(화살표 끝)과 실제 포인터를 맞추는 보정값
  // 필요에 따라 -4, -6 등으로 미세 조정해봐
  const HOT_X = 0;
  const HOT_Y = 0;

  let x = 0, y = 0, needsUpdate = false;

  // pointermove가 mousemove보다 입력을 넓게 커버
  window.addEventListener('pointermove', (e) => {
    x = e.clientX + HOT_X;
    y = e.clientY + HOT_Y;
    needsUpdate = true;
  }, { passive: true });

  // requestAnimationFrame으로 동기 렌더 → OS 커서와 체감 동일
  function loop(){
    if(needsUpdate){
      // 레이아웃 영향 없는 GPU 이동
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      needsUpdate = false;
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

//////////// 0. 인트로 영역 ////////////
//////////// 0. 최상단 영역 ////////////

//////////// 1. 상단영역 ////////////

//////////// 2. 메인영역 ////////////

// ===== PHANTOM 로고 스크롤→정착→부유 =====
(() => {
  const logo = document.getElementById('phantomLogo');
  if (!logo) return;

  let TARGET_Y;  
  let SCROLL_RANGE; 
  let reached = false;

  // ✅ [A] 추가: hover 활성화 상태 플래그
  let activated = false;    

  let rafId = null;

  const setY = (y) => {
    logo.style.transform = `translate3d(-50%, ${y}px, 0)`;
  };

  const recalc = () => {
    const vh = window.innerHeight;
    TARGET_Y    = vh * 0.28;  
    SCROLL_RANGE= vh * 0.35;  
    if (!reached) setY(0);
  };

  const onScroll = () => {
    if (reached) return;
    const s = window.scrollY;
    const t = Math.min(1, s / SCROLL_RANGE);
    const y = t * TARGET_Y;
    setY(y);

    // 도달 시 hover 상태에 따라 부유 시작
    if (t >= 1) {
      reached = true;
      if (activated) startFloat(); 
    }
  };

const startFloat = () => {
  if (reached && rafId) return;
  reached = true;

  const h = logo.getBoundingClientRect().height;

  // 움직임 진행 방향
  // 위쪽(음수 방향) 더 많이
  const AMP_UP   = h * 0.80;  
  // 아래쪽(양수 방향) 덜 움직임
  const AMP_DOWN = h * 0.20;  
  const BASE  = TARGET_Y;
  const SPEED = 0.8;

  // 전환 부드러움(0.1~0.4 사이 추천). 작을수록 날카로운 전환, 클수록 부드러움
  const EPS   = 0.40; 

  let t0 = performance.now();
  const loop = (t) => {
    const dt = (t - t0) / 1000;
    const s  = Math.sin(dt * Math.PI * SPEED);  // -1..1

    // s<0(위쪽)일수록 w≈1, s>0(아래쪽)일수록 w≈0 — 매끈한 전환
    // 0..1 (C^∞ 연속)
    const w  = 0.5 * (1 - Math.tanh(s / EPS));  

    // 위/아래를 서로 다른 진폭으로 '부드럽게' 보간
    // s 부호에 따라 자연 전환
    const amp = AMP_DOWN * (1 - w) + AMP_UP * w; 
    const y   = BASE + s * amp;

    setY(y);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
};

  window.addEventListener('resize', () => {
    cancelAnimationFrame(rafId);
    reached = false;
    recalc();
    onScroll();
  });

  recalc();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 최초 hover 감지 후, 그 뒤로는 계속 부유
  logo.addEventListener('mouseenter', () => {
    // hover 한 번이면 영구 활성화
    activated = true;  
    // 이미 도달해 있으면 바로 부유 시작    
    if (reached) startFloat();  
  });

  logo.addEventListener('mouseleave', () => {
    // 떠나도 중단하지 않음
  });
})();

// ===== cat-part 이미지: hover 시 한번만 시작 후 계속 깜빡임 =====
(() => {
  const catImg = document.querySelector('.cat-part img');
  if (!catImg) return;

  let activated = false;

  document.querySelector('.cat-part').addEventListener('mouseenter', () => {
    // 처음 hover 시에만 발동
    if (activated) return;
    activated = true;

    // 0.6초간 서서히 등장
    catImg.style.transition = 'opacity 0.6s ease-out';
    catImg.style.opacity = '1';

    // 등장 후 flicker 클래스 부여
    setTimeout(() => {
      catImg.classList.add('flickering');
    }, 600);
  });
})();