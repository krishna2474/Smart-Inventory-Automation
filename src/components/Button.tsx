import { useState } from "react";

export const Button = (
  props: React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }>
) => {

  const handleClick = async () => {
    if (props.onClick) {
      await props.onClick();
    }
  };

  return (
    <button
      disabled={props.disabled}
      onClick={handleClick}
      className={`relative py-2 px-3 rounded-lg font-medium text-sm text-white 
                  bg-gradient-to-b from-[#190d2e] to-[#4a208a] 
                  shadow-[0px_0px_12px_#8c45ff] transition-all duration-200 ease-in-out
                  hover:shadow-[0px_0px_18px_#b364ff] hover:scale-105
                  active:scale-95 ${props.className ?? ""}`}
    >
      {/* Glow & Border Effects */}
      <div className="absolute inset-0">
        <div className="rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div className="rounded-lg border absolute inset-0 border-white/40 [mask-image:linear-gradient(to_top, black,transparent)]"></div>
        <div className="absolute inset-0 shadow-[0_0_10px_rgb(140,69,255,.7)_inset] rounded-lg"></div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-full left-0 w-full h-full bg-white/20 blur-md opacity-0
                      animate-[shimmer_1.5s_infinite]"
        ></div>
      </div>

      
        <span>{props.children}</span>
    
    </button>
  );
};
