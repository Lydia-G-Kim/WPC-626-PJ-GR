// 메인 JS 영역

//////////// 공통영역 ////////////

// 마우스 커서 (GPU transform + rAF)
(() => {
  const cursor = document.querySelector(".custom-cursor");

  // 이미지 팁(화살표 끝)과 실제 포인터를 맞추는 보정값
  // 필요에 따라 -4, -6 등으로 미세 조정해봐
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

  document.querySelectorAll(".btn").forEach((el) => {
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

// ===== PHANTOM 로고 스크롤→정착→부유 =====
// 클래스on 주기

(() => {
  document
    .querySelector("#phantomLogo")
    .addEventListener("mouseenter", function () {
      this.classList.add("on");
    });
})();

// ===== cat-part 이미지: hover 시 한번만 시작 후 계속 깜빡임 =====
(() => {
  const catImg = document.querySelector(".cat-part img");
  if (!catImg) return;

  let activated = false;

  document.querySelector(".cat-part").addEventListener("mouseenter", () => {
    // 처음 hover 시에만 발동
    if (activated) return;
    activated = true;

    // 0.6초간 서서히 등장
    catImg.style.transition = "opacity 0.6s ease-out";
    catImg.style.opacity = "1";

    // 등장 후 flicker 클래스 부여
    setTimeout(() => {
      catImg.classList.add("flickering");
    }, 600);
  });
})();

// glitch-box : hover 시 나타나고 유지


// === glitch-box: 첫 hover 때 나타나고, 이후 계속 글리치 유지 ===
$(() => {
  const $zone = $(".pcat-part");
  const $glitch = $(".glitch-box");
  let inited = false;   // mgGlitch 초기화 1회만
  let shown  = false;   // show 클래스 1회만

  $zone.on("mouseenter", () => {
    // 1) 처음 hover 되면 보이기 (영구 유지)
    if (!shown) {
      $glitch.addClass("show");
      shown = true;
    }
    // 2) 글리치 효과 처음 한 번만 초기화 → 이후 계속 동작
    if (!inited) {
      $glitch.mgGlitch({
        destroy: false,       // true면 멈춤
        glitch: true,         // 글리치 on
        scale: true,          // 스케일 튕김 on
        blend: true,          // 블렌드 on
        blendModeType: "screen", // 블렌드 모드
        glitch1TimeMin: 300,  // 글리치1 최소 주기
        glitch1TimeMax: 600,  // 글리치1 최대 주기
        glitch2TimeMin: 10,   // 글리치2 최소 주기
        glitch2TimeMax: 115,  // 글리치2 최대 주기
      });
      inited = true;
    }
  });

  // 마우스가 떠나도 유지 → mouseleave 핸들러 없음
});


//수정 전
// 노이즈효과 : 글리치
// $(() => {
//   $(".glitch-box").mgGlitch({
//     destroy: false, // set 'true' to stop the plugin
//     glitch: true, // set 'false' to stop glitching
//     scale: true, // set 'false' to stop scaling
//     blend: true, // set 'false' to stop glitch blending
//     // CSS blend-mode property
//     // normal
//     // multiply
//     // screen
//     // overlay
//     // darken
//     // lighten
//     // color-dodge
//     // color-burn
//     // difference
//     // exclusion
//     // hue
//     // saturation
//     // color
//     // luminosity

//     blendModeType: "screen", // select blend mode type
//     glitch1TimeMin: 300, // set min time for glitch 1 elem
//     glitch1TimeMax: 600, // set max time for glitch 1 elem
//     glitch2TimeMin: 10, // set min time for glitch 2 elem
//     glitch2TimeMax: 115, // set max time for glitch 2 elem
//   });
// });


// intro 영역 스크롤 내리면 사라짐
// 한번만 실행변수
let once = 0;

$(window).on("scroll", () => {
  console.log(window.scrollY);
  if (window.scrollY > 600 ){
    if(once) return;
    once = 1;
    // 인트로 영역 사라짐
    $("#intro-area").animate(
      { height: "0" },
      1200,
      "easeInOutCubic",
      function () {
        // 애니메이션 완료 후 삭제
        $(this).remove();
      }
    );
    $("html, body").animate({ scrollTop: 0 }, 1200, () => {
      $(window).off("scroll");
    });
  } /// if //////
}); //// over /////