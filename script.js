// 页面加载后执行基础交互功能
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const backToTopButton = document.getElementById("back-to-top");
  const revealItems = document.querySelectorAll(".reveal");
  const form = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const yearElement = document.getElementById("year");

  // 自动更新页脚年份，后续无需手动改年份
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 手机端导航开关
  const closeMenu = () => {
    if (!navToggle || !siteNav) {
      return;
    }

    navToggle.classList.remove("is-open");
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // 返回顶部按钮：滚动一定距离后显示
  const toggleBackToTop = () => {
    if (!backToTopButton) {
      return;
    }

    if (window.scrollY > 360) {
      backToTopButton.classList.add("is-visible");
    } else {
      backToTopButton.classList.remove("is-visible");
    }
  };

  if (backToTopButton) {
    toggleBackToTop();

    window.addEventListener("scroll", toggleBackToTop);

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 页面滚动显现动画
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // 公司风貌轮播：升级为标题联动、缩略按钮和进度条动画
  const showcaseSlider = document.querySelector(".showcase-slider");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const thumbButtons = document.querySelectorAll(".slider-thumb");
  const prevButton = document.querySelector(".slider-btn-prev");
  const nextButton = document.querySelector(".slider-btn-next");
  const sliderTitle = document.getElementById("slider-title");
  const sliderDescription = document.getElementById("slider-description");
  const sliderProgressBar = document.getElementById("slider-progress-bar");
  const sliderDuration = 4800;
  let currentSlideIndex = 0;
  let sliderTimer = null;

  const resetProgressAnimation = () => {
    if (!sliderProgressBar) {
      return;
    }

    sliderProgressBar.classList.remove("is-animating");
    sliderProgressBar.style.animationDuration = `${sliderDuration}ms`;

    // 强制浏览器重新计算样式，让动画能够从头开始播放
    void sliderProgressBar.offsetWidth;

    sliderProgressBar.classList.add("is-animating");
  };

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    currentSlideIndex = (index + slides.length) % slides.length;
    const activeSlide = slides[currentSlideIndex];

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentSlideIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlideIndex);
    });

    thumbButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === currentSlideIndex);
    });

    if (sliderTitle) {
      sliderTitle.textContent = activeSlide.dataset.title || "公司风貌展示";
    }

    if (sliderDescription) {
      sliderDescription.textContent = activeSlide.dataset.desc || "图片说明待补充";
    }

    resetProgressAnimation();
  };

  const stopSlider = () => {
    if (sliderTimer) {
      window.clearInterval(sliderTimer);
      sliderTimer = null;
    }

    sliderProgressBar?.classList.remove("is-animating");
  };

  const startSlider = () => {
    if (slides.length <= 1) {
      return;
    }

    stopSlider();
    resetProgressAnimation();

    sliderTimer = window.setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, sliderDuration);
  };

  const restartSlider = () => {
    startSlider();
  };

  if (slides.length) {
    showSlide(0);
    startSlider();

    prevButton?.addEventListener("click", () => {
      showSlide(currentSlideIndex - 1);
      restartSlider();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentSlideIndex + 1);
      restartSlider();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        restartSlider();
      });
    });

    thumbButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        showSlide(index);
        restartSlider();
      });
    });

    // 鼠标移入时暂停自动轮播，移出后继续，提升高级感和可控性
    showcaseSlider?.addEventListener("mouseenter", stopSlider);
    showcaseSlider?.addEventListener("mouseleave", startSlider);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopSlider();
      } else {
        startSlider();
      }
    });
  }

  // 演示表单：只在前端提示成功，不向服务器发送数据
  if (form && formFeedback) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();

      if (!name || !phone) {
        formFeedback.textContent = "请先填写姓名和电话，方便后续联系。";
        return;
      }

      formFeedback.textContent = "留言演示成功：当前页面未接入服务器，后续可按需要继续升级。";
      form.reset();
    });
  }
});
