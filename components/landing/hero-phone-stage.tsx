import { HeroTaskPopup } from "@/components/landing/hero-task-popup";

export function HeroPhoneStage() {
  return (
    <div className="hero-phone-wrap relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center lg:h-[450px] lg:max-w-none">
      <div className="hero-phone-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/phone-screen.png?v=9"
          alt="NearTask app on iPhone"
          className="hero-phone-img hero-phone-enter"
        />
        <div className="hero-display-anchor">
          <HeroTaskPopup />
        </div>
      </div>
    </div>
  );
}
