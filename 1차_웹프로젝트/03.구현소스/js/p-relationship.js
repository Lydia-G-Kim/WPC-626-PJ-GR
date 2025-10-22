// 서브 JS 영역

//////////// 공통영역 ////////////

// 마우스 커서 (GPU transform + rAF)
(() => {
  const cursor = document.querySelector(".custom-cursor");

  // 이미지 팁(화살표 끝)과 실제 포인터를 맞추는 보정값
  // 필요에 따라 -4, -6 등으로 미세 조정
  const HOT_X = 0;
  const HOT_Y = 0;

  let x = 0,
    y = 0,
    needsUpdate = false;

  // pointermove가 mousemove보다 입력을 넓게 커버
  window.addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX + HOT_X;
      y = e.clientY + HOT_Y;
      needsUpdate = true;
    },
    { passive: true }
  );

  // requestAnimationFrame으로 동기 렌더 → OS 커서와 체감 동일
  function loop() {
    if (needsUpdate) {
      // 레이아웃 영향 없는 GPU 이동
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      needsUpdate = false;
    }
    requestAnimationFrame(loop);
  }
  loop();

  const hoverTargets = document.querySelectorAll(
    ".btn, .btn-reserve, .history-btn, .btn-top"
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.display = "none";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.display = "block";
    });
  });
})();

//////////// 0. 인트로 영역 ////////////
//////////// 0. 최상단 영역 ////////////

//////////// 1. 상단영역 ////////////

//////////// 2. 메인영역 ////////////

// ===== 히스토리 버튼 클릭 시 포스터 교체 =====
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".history-btn");
  const posters = document.querySelectorAll(".poster-box ul li");

  if (!buttons.length || !posters.length) return;

  // 모든 포스터 숨기기 (초기화)
  posters.forEach((li) => li.classList.remove("active"));
  buttons.forEach((b) => b.classList.remove("active"));

  // 1. 페이지 로드 시, 자동으로 2025 포스터 보이기
  const defaultPoster = document.querySelector(
    '.poster-box ul li[data-year="2025"]'
  );
  const defaultBtn = document.querySelector('.history-btn[data-target="2025"]');
  if (defaultPoster) defaultPoster.classList.add("active");
  if (defaultBtn) defaultBtn.classList.add("active");

  // 2. 버튼 클릭 이벤트
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const year = btn.dataset.target;

      // MAIN 버튼 클릭 시 메인 페이지로 이동
      if (year === "main") {
        window.location.href = "./mainpage.html";
        return;
      }

      // 모든 포스터 숨기기
      posters.forEach((li) => li.classList.remove("active"));
      buttons.forEach((b) => b.classList.remove("active"));

      // 클릭된 연도의 포스터만 표시
      const targetPoster = document.querySelector(
        `.poster-box ul li[data-year="${year}"]`
      );
      if (targetPoster) targetPoster.classList.add("active");
      btn.classList.add("active");
    });
  });
});

$(".btn-top").click(function () {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    2000,
    "easeInQuint"
  );
  return false;
});
