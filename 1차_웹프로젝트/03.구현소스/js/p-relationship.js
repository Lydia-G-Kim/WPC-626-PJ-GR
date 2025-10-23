// 서브 JS 영역

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

//////////// 2. 메인영역 ////////////

// ===== 히스토리 버튼 클릭 시 포스터 교체 =====
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".history-btn");
  const posters = document.querySelectorAll(".poster-box ul li");
  const $historyBtnBox = $(".history-btn-box ul");
  // 스티키박스의 위치값구하기
  let historyBtnBoxTop = $historyBtnBox.offset().top;
  console.log('스티키박스의 위치값',historyBtnBoxTop);

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

      buttons.forEach((b) => b.classList.remove("active"));

      // 포스터가 서서히 사라짐
      $('.poster-box').fadeTo(500,0,()=>{
        // 모든 포스터 숨기기
        posters.forEach((li) => li.classList.remove("active"));
        
              // 클릭된 연도의 포스터만 표시
              const targetPoster = document.querySelector(
                `.poster-box ul li[data-year="${year}"]`
              );
              if (targetPoster) targetPoster.classList.add("active");
              btn.classList.add("active");
        
              // 클릭시 스티키메뉴 상단위치로 스크롤이동하기
              $('html, body').animate({
                scrollTop: historyBtnBoxTop+'px'
              }, 500, 'easeInQuint');


      }).delay(500).fadeTo(500,1);
    }); ///////// click ////////////////
  }); /////////// forEach //////////////

  // 상단이동버튼 클릭함수 //////////
  $(".btn-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: historyBtnBoxTop+'px',
      },
      2000,
      "easeInQuint"
    );

    return false;
  });
}); //////////// load구역 //////////////


//////////// 1. 상단영역 ////////////
window.addEventListener("load", () => {
  // 변경대상 : 상단영역 .header
  const header = document.querySelector("#top-area");
  const stkMenu = document.querySelector(".history-btn-box");
  const $btnTop = $(".btn-top");

  // 스크롤 방향 알아내는 원리:
  // (1) 아래로 스크롤
  // 이전 스크롤 위치 값 < 현재 스크롤 위치 값
  // (2) 위로 스크롤
  // 이전 스크롤 위치 값 > 현재 스크롤 위치 값

  // 이전 스크롤 위치 값 저장변수
  let prevScroll = 0;

  // 상단이동버튼이 나타나고 사라지는 기준위치 설정하기
  // 스티키박스위치 + 보이는 화면높이만큼
  const $historyBtnBox = $(".history-btn-box ul");
  // 기준위치값
  let topBtnShowPosition = $historyBtnBox.offset().top + window.innerHeight;


  // 스크롤 이벤트 설정하기
  window.addEventListener("scroll", () => {
    // 스크롤 위치 값 구하기
    let curScroll = window.scrollY;
    // console.log('스크롤이벤트', curScroll);

    // (1) 아래로 스크롤
    // 이전 스크롤 위치 값 < 현재 스크롤 위치 값
    if (prevScroll < curScroll) {
      console.log("스크롤 내려간다");
      // 스크롤 내려가면 메뉴 숨기기
      header.classList.add("hide");
      stkMenu.classList.remove("move");
    } //// if ////

    // (2) 위로 스크롤
    // 이전 스크롤 위치 값 > 현재 스크롤 위치 값
    else {
      console.log("스크롤 올라간다");
      // 스크롤 올라가면 메뉴 보이기
      header.classList.remove("hide");
      stkMenu.classList.add("move");
    } //// else ////

    // 중요!!! 마지막에 이전 스크롤 위치를 저장!
    prevScroll = curScroll;


    // 스크롤위치값이 기준위치값 보다 크면 나타나고 작은면 사라짐
    if(curScroll > topBtnShowPosition){
      $btnTop.fadeIn(300);
    } else {
      $btnTop.fadeOut(300);
    }

  }); //// scroll ////
}); /// 로딩구역 ///////////////////////
