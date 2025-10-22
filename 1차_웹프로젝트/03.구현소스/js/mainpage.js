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

  const hoverTargets = document.querySelectorAll(
    ".btn, .btn-reserve, .history-btn, .btn-top, .logo"
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
/******************************* 스티키 확인필요 *******************************/
window.addEventListener("load", () => {
  // 변경대상 : 상단영역 .header
  const header = document.querySelector("#menu-box");

  // 스크롤 방향 알아내는 원리:
  // (1) 아래로 스크롤
  // 이전 스크롤 위치 값 < 현재 스크롤 위치 값
  // (2) 위로 스크롤
  // 이전 스크롤 위치 값 > 현재 스크롤 위치 값

  // 이전 스크롤 위치 값 저장변수
  let prevScroll = 0;

  // 화면높이값 계산
  let winH = window.innerHeight;

  // 스크롤 이벤트 설정하기
  window.addEventListener("scroll", () => {
    // 스크롤 위치 값 구하기
    let curScroll = window.scrollY;
    // console.log('스크롤이벤트', curScroll);

    // (1) 아래로 스크롤
    // 이전 스크롤 위치 값 < 현재 스크롤 위치 값
    if (curScroll > winH &&prevScroll < curScroll) {
      console.log("스크롤 내려간다");
      // 스크롤 내려가면 메뉴 숨기기
      header.classList.add("hide");
    } //// if ////

    // (2) 위로 스크롤
    // 이전 스크롤 위치 값 > 현재 스크롤 위치 값
    else {
      console.log("스크롤 올라간다");
      // 스크롤 올라가면 메뉴 보이기
      header.classList.remove("hide");
    } //// else ////

    // 중요!!! 마지막에 이전 스크롤 위치를 저장!
    prevScroll = curScroll;
  }); //// scroll ////
}); /// 로딩구역 ///////////////////////

// 갑자기 서브페이지 상단 부분이 올라가는 문제 생김!!!!
/******************************* 스티키 확인필요 *******************************/

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

// ===== 캐스팅 액자: 떨어지고 달랑달랑 =====
(() => {
  const box = document.querySelector(".cas-box");
  if (!box) return;

  // 1) 이미지 들어있는 첫번째 li에 .frame 클래스 부여 (HTML 수정 없이)
  box.querySelectorAll("div > ul > li:first-child").forEach((li) => {
    li.classList.add("frame");
  });

  const frames = Array.from(box.querySelectorAll(".frame"));
  if (!frames.length) return;

  // 2) 뷰포트에 들어오면 낙하 시작 (한 번만)
  let started = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!started && en.isIntersecting) {
          started = true;
          // 낙하 시작 클래스
          box.classList.add("is-dropping");

          // 드랍 지연(스태거) 부여 – 왼쪽부터 0ms, 140ms, 280ms…
          frames.forEach((el, idx) => {
            el.style.setProperty("--delay", `${idx * 140}ms`);
          });

          // 마지막 프레임 드랍이 끝나면 흔들림 시작
          const last = frames[frames.length - 1];
          last.addEventListener(
            "animationend",
            () => {
              box.classList.add("hang"); // img에 swing 애니메이션 적용
            },
            { once: true }
          );

          io.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  io.observe(box);
})();

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

// === glitch-box: 첫 hover 때 나타나고, 이후 계속 글리치 유지 ===
$(() => {
  const $zone = $(".pcat-part");
  const $glitch = $(".glitch-box");
  let inited = false; // mgGlitch 초기화 1회만
  let shown = false; // show 클래스 1회만

  $zone.on("mouseenter", () => {
    // 1) 처음 hover 되면 보이기 (영구 유지)
    if (!shown) {
      $glitch.addClass("show");
      shown = true;
    }
    // 2) 글리치 효과 처음 한 번만 초기화 → 이후 계속 동작
    if (!inited) {
      $glitch.mgGlitch({
        destroy: false, // true면 멈춤
        glitch: true, // 글리치 on
        scale: true, // 스케일 튕김 on
        blend: true, // 블렌드 on
        blendModeType: "screen", // 블렌드 모드
        glitch1TimeMin: 300, // 글리치1 최소 주기
        glitch1TimeMax: 600, // 글리치1 최대 주기
        glitch2TimeMin: 10, // 글리치2 최소 주기
        glitch2TimeMax: 115, // 글리치2 최대 주기
      });
      inited = true;
    }
  });

  // 마우스가 떠나도 유지 → mouseleave 핸들러 없음
});

// 노이즈효과 : 글리치
$(() => {
  $(".glitch-box2").mgGlitch({
    destroy: false, // set 'true' to stop the plugin
    glitch: true, // set 'false' to stop glitching
    scale: true, // set 'false' to stop scaling
    blend: true, // set 'false' to stop glitch blending
    // CSS blend-mode property
    // normal
    // multiply
    // screen
    // overlay
    // darken
    // lighten
    // color-dodge
    // color-burn
    // difference
    // exclusion
    // hue
    // saturation
    // color
    // luminosity

    blendModeType: "overlay", // select blend mode type
    glitch1TimeMin: 300, // set min time for glitch 1 elem
    glitch1TimeMax: 600, // set max time for glitch 1 elem
    glitch2TimeMin: 10, // set min time for glitch 2 elem
    glitch2TimeMax: 115, // set max time for glitch 2 elem
  });
});

// intro 영역 스크롤 내리면 사라짐
// 한번만 실행변수
let once = 1;

const scrollFn = () => {
  $(window).on("scroll", () => {
    console.log(window.scrollY);
    if (window.scrollY > 600) {
      if (once) return;
      once = 1;

      // 인트로 영역 사라짐
      $("#intro-area").animate(
        { height: "0" },
        2000,
        "easeOutBack",
        function () {
          // 애니메이션 완료 후 삭제
          $(this).remove();
        }
      );

      $("html, body").animate({ scrollTop: 0 }, 2000, () => {
        $(window).off("scroll");
      });
    } /// if //////
  }); //// over /////
}; ///////// scrollFn //////////

$(window).off("scroll");
setTimeout(() => {
  window.scrollTo(0, 0);

  setTimeout(() => {
    once = 0;
    scrollFn();
  }, 500);
}, 400);


$(".btn-top").click(function () {
  $("html, body").animate(
    {
      scrollTop: window.innerHeight+'px',
    },
    2000,
    "easeInQuint"
  );
  return false;
});



/////// 팬텀 로고에 마우스 엔터시 클래스 on 한번 넣기
$('.phantom-logo').on('mouseenter', function () {
  $(this).addClass('on');
}); //////////// mouseenter ///////////////