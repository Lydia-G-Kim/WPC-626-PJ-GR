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